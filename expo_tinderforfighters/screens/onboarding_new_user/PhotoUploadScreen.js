import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, Button, TouchableOpacity, Alert, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/authContext'
import { useOnboarding } from '../../context/onboardingContext';
import { Ionicons } from '@expo/vector-icons';

const API_BASE_URL = 'https://tinderforfighters.servebeer.com';

export default function PhotoUploadScreen({ navigation }) {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Permission to access media library is required!');
            }
        })();
    }, []);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images',
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets?.length > 0) {
            const asset = result.assets[0];
            setImage(asset.uri);
            uploadToS3(asset);
        }
    };

    const uploadToS3 = async (asset) => {
        try {
            setUploading(true);

            // Request presigned url from django
            const presignRes = await fetch(`${API_BASE_URL}/api/upload/profile-pic/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    file_name: asset.fileName || 'profile.jpg',
                    file_type: asset.mimeType || 'image/jpeg',
                }),
            });

            const { url, fields, s3_url } = await presignRes.json();

            // Build form data
            const formData = new FormData();
            Object.entries(fields).forEach(([key, value]) => {
                formData.append(key, value);
            });

            formData.append('file', {
                uri: asset.uri,
                name: asset.fileName || 'profile.jpg',
                type: asset.mimeType || 'image/jpeg',
            });

            // upload to s3
            const uploadRes = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            if (uploadRes.ok) {
                console.log('Image uploaded successfully');
            } else {
                throw new Error('Upload to s3 failed');
            }
        } catch (error) {
            console.error(error);
            alert('Upload Error', error.message || 'something went wrong');
        } finally {
            setUploading(false);
        }
    };
    return (
        <LinearGradient
            colors={['#0052FF', '#4F8FFF', '#E5EDFF']}
            style={styles.container}>
            <Text style={styles.titleText}>Last Step -- Upload a profile pic</Text>
            <View>
                {image && (
                    <Image
                        source={{ uri: image }}
                        style={{ width: 150, height: 150, borderRadius: 75, marginBottom: 10 }}
                    />
                )}
                {uploading ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <Button title="Pick a Profile Photo" onPress={pickImage} color='black' />
                )}
            </View>
            <View>
                <TouchableOpacity
                    style={styles.primaryButton}
                >
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
        </LinearGradient>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        backgroundColor: '#011082',

    },
    inputView: {
        alignSelf: 'center',
        width: '80%',
        backgroundColor: '#F5F8FA',
        borderRadius: 25,
        height: 50,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'white',
        textAlign: 'center',
    },
    textInput: {
        height: 50,
        flex: 1,
        padding: 10,
        paddingLeft: 20,
        textAlignVertical: 'center',
        color: '#14171A',
    },
    primaryButton: {
        width: '80%',
        backgroundColor: 'black',
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    titleText: {
        marginTop: 50,
        marginBottom: 50,
        marginHorizontal: 20,
        textAlign: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: 24
    },
    label: {
        marginTop: 10,
        marginBottom: 12,
        fontSize: 18,
        marginHorizontal: 20,
        textAlign: 'center',
        alignSelf: 'center',
        color: 'black',
    },
    backButton: {
        position: 'absolute',
        top: 50,         // adjust for iOS notch or Android status bar
        left: 20,
        zIndex: 10,
        padding: 8,
    },
});
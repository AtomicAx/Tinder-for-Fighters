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
    const { updateOnboarding, onboarding } = useOnboarding();

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
            setImage(asset);
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
                    content_type: asset.mimeType || 'image/jpeg',

                }),
            });

            

            const { upload_url, s3_key } = await presignRes.json();
            console.log('upload url', upload_url, 's3key', s3_key);
            if (!presignRes.ok) {
                throw new Error('Failed to get presigned upload URL');
            }

            // upload to s3
            const uploadRes = await fetch(upload_url, {
                method: 'PUT',
                headers: {
                    'Content-Type': asset.mimeType || 'image/jpeg'
                },
                body: await (await fetch(asset.uri)).blob()
            });

            if (uploadRes.ok) {
                console.log('Image uploaded successfully');
                return s3_key;
            } else {
                throw new Error('Upload to s3 failed');
            }
        } catch (error) {
            console.error(error);
            alert('Upload Error', error.message || 'something went wrong');
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handlePhotoUpload = async () => {
        if (!image) {
            Alert.alert('No Image Selected', 'Please choose an image or press the skip button');
            return;
        }

        const s3_key = await uploadToS3(image);

        if (s3_key) {
            updateOnboarding({
                profile_picture_url: s3_key
            })

            submitOnboarding();
        }
    };

    const handleSkipPhoto = async () => {
        submitOnboarding();
    };

    const submitOnboarding = async () => {
        const res = await fetch(`${API_BASE_URL}/api/user-info/complete-onboarding/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify(onboarding),
        });

        const data = await res.json();
        if (res.ok) {
            navigation.replace('Home');
        } else {
            alert('Onboarding Failed', data.error || 'Something went wrong');
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
                        source={{ uri: image.uri }}
                        style={styles.image}
                    />
                )}
                {uploading ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <Button title="Pick a Profile Photo" onPress={pickImage} disabled={uploading} color='black' />
                )}
            </View>

            <View>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handlePhotoUpload}
                    disabled={uploading}
                >
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
            <View>
                <Button title="Skip" onPress={handleSkipPhoto} color='white' />
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
    image: {
        width: 150,
        height: 150,
        borderRadius: 25,
        marginBottom: 10,
        alignSelf: 'center',
    },
});
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useOnboarding } from '../../context/onboardingContext';
import { Ionicons } from '@expo/vector-icons';

export default function NicknameSelectionScreen({ navigation }) {
    const { updateOnboarding } = useOnboarding();
    const [nickname, setNickname] = useState('');

    const handleNickname = () => {
        updateOnboarding({
            nickname,
        })

        navigation.navigate("Home") // update with correct landing page
    };

    return (
        <LinearGradient
            colors={['#0052FF', '#4F8FFF', '#E5EDFF']}
            style={styles.container}>
            <Text style={styles.titleText}>What is your fighting nickname or alias?</Text>
            <Text style={styles.label}>Dont have one?{"\n"}You can create one now or just hit next!</Text>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Nickname/Alias"
                    placeholderTextColor="#657786"
                    value={nickname}
                    onChangeText={setNickname}
                />
            </View>
            <View>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleNickname}
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
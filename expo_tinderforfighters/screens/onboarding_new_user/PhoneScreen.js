import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PhoneNumberInput from '../../components/PhoneNumberInput';
import { useOnboarding } from '../../context/onboardingContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';


export default function PhoneScreen({ navigation }) {
    const handleValidPhone = (phoneNumber) => {
        console.log('Valid phone:', phoneNumber);
    };

    const [phone, setPhone] = useState(null);
    const { updateOnboarding } = useOnboarding();
    const handleSubmit = () => {
        if (phone) {
            console.log('Phone to submit:', phone);
            updateOnboarding({ phone });
            navigation.navigate('Home') // change to the correct next page
        }
    };
    return (
        <LinearGradient
            colors={['#0052FF', '#4F8FFF', '#E5EDFF']}
            style={styles.container}
        >
            <View>
                <Text style={styles.titleText}>Can we get your number?</Text>
                <PhoneNumberInput onValidChange={setPhone} />
                <Text style={styles.infoText}>
                    Once we have your digits, you will be able to login with your phone number rather than email and password!!
                </Text>
                <TouchableOpacity
                    style={[styles.primaryButton, !phone && styles.disabled]}
                    onPress={handleSubmit}
                    disabled={!phone}
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
}
const styles = StyleSheet.create({
    container: {
        paddingTop: 100,
        flex: 1,
        backgroundColor: '#fff',
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
    primaryButton: {
        width: '80%',
        backgroundColor: 'black',
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 150,
        marginBottom: 10,
    },
    disabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    backButton: {
        position: 'absolute',
        top: 50,         // adjust for iOS notch or Android status bar
        left: 20,
        zIndex: 10,
        padding: 8,
    },
    infoText: {
        alignSelf: 'center',
        color: 'white',
        fontSize: 12,
        width: '80%',
    }
});
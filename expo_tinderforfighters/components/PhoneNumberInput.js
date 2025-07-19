import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';
import { MaterialIcons } from '@expo/vector-icons';

export default function PhoneNumberInput({ onValidChange }) {
    const [countryCode, setCountryCode] = useState('US');
    const [callingCode, setCallingCode] = useState('1');
    const [phone, setPhone] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [modalVisable, setModalVisable] = useState(false);

    const handlePhoneChange = (text) => {
        const formatter = new AsYouType(countryCode);
        const formatted = formatter.input(text);
        setPhone(formatted);

        const parsed = parsePhoneNumberFromString(`+${callingCode}${formatted.replace(/\D/g, '')}`);
        const valid = parsed?.isValid() || false;
        setIsValid(valid);

        if (onValidChange) {
            onValidChange(valid ? parsed.number : null);
        }
    };

    const handleCountrySelect = (country) => {
        setCountryCode(country.cca2);
        setCallingCode(country.callingCode[0]);
        setModalVisable(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.phoneRow}>
                <TouchableOpacity
                    style={styles.countrySelector}
                    onPress={() => setModalVisable(true)}
                    activeOpacity={0.8}
                >
                    <CountryPicker
                        countryCode={countryCode}
                        withFlag
                        withCallingCode
                        withEmoji
                        onSelect={handleCountrySelect}
                        visible={modalVisable}
                        onClose={() => setModalVisable(false)}
                    />

                    <Text style={styles.code}>+{callingCode}</Text>
                    <MaterialIcons name="keyboard-arrow-down" size={20} color="666" paddingLeft={10} />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={handlePhoneChange}
                    keyboardType="phone-pad"
                    selectionColor="black"
                    cursorColor="black"

                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        width: '80%',
    },
    phoneRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingBottom: 8,
        marginBottom: 24,
    },
    code: {
        fontSize: 18,
    },
    countrySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: 'black',
        borderWidth: 0,
        paddingBottom: Platform.select({
            ios: 2,
            android: 8,
        }),
    },
    input: {
        flex: 1,
        fontSize: 18,
        borderBottomWidth: 1,
        borderColor: 'black',
        borderWidth: 0,
        backgroundColor: 'transparent',
        paddingBottom: 10,
        marginBottom: Platform.select({
            ios: -7,
            android: 8,
        }),
    },
});
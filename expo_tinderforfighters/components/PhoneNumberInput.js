import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Platform, Text } from 'react-native';
import CustomModalSelector from '../components/CustomModalSelector';
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';

import countries from '../utils/countries.json'; // each item: { key: 'US', label: '🇺🇸 United States', value: '1' }

export default function PhoneNumberInput({ onValidChange }) {
    const [country, setCountry] = useState({ key: '🇺🇸 +1 ', label: 'United States', value: '1' });
    const [phone, setPhone] = useState('');
    const [isValid, setIsValid] = useState(false);

    const handlePhoneChange = (text) => {
        const digitsOnly = text.replace(/\D/g, '').slice(0, 10); // keep only 0-9 and max 10 digits
        setPhone(digitsOnly);

        const parsed = parsePhoneNumberFromString(`+${country.value}${digitsOnly}`);
        const valid = parsed?.isValid() || false;
        setIsValid(valid);

        if (onValidChange) {
            onValidChange(valid ? parsed.number : null);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.combinedRow}>
                <View style={styles.selectorContainer}>
                    <CustomModalSelector
                        data={countries}
                        value={country.key}
                        onChange={setCountry}
                        width={'100%'}
                        placeholder='Country'
                        returnValue='option'
                    />

                </View>
                <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={handlePhoneChange}
                    keyboardType='phone-pad'
                    selectionColor='black'
                    cursorColor='black'
                    placeholder='Phone number'
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
    combinedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'black',
        backgroundColor: '#F5F8FA',
        borderRadius: 25,
        marginBottom: 24,
        height: 50,
    },
    selectorContainer: {
        width: 100,
        marginRight: 8,

    },
    input: {
        flex: 1,
        fontSize: 18,

    },
});

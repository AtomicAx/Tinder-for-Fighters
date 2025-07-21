import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, TextInput } from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import { Ionicons } from '@expo/vector-icons';

export default function CustomModalSelector({
    data,
    value,
    onChange,
    placeholder = 'Select...',
    width = 100,
}) {
    return (
        <ModalSelector
            data={data}
            cancelText='Cancel'
            onChange={(option) => {
                onChange(option.value);
            }}
        >
            <View style={[styles.selectBox, { width }]}>
                <Text
                    style={[
                        styles.selectText,
                        !value && styles.placeholderText,
                    ]}
                >
                    {value || placeholder}
                </Text>
                <Ionicons name='chevron-down' size={16} color='#657786' />
            </View>
        </ModalSelector>
    );
}
const styles = StyleSheet.create({
    selectBox: {
        height: 50,
        backgroundColor: '#F5F8FA',
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingRight: 30,
        borderWidth: 1,
        borderColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 5,
    },
    selectText: {
        fontSize: 16,
        color: '#14171A',
    },
    placeholderText: {
        color: '#657786',
    },
});
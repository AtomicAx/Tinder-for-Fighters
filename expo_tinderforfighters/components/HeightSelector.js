import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import CustomModalSelector from "./CustomModalSelector";

const feet = Array.from({ length: 9 }, (_, i) => ({
    key: i,
    label: (i + 1).toString(),
    value: i + 1,
}));

const inches = Array.from({ length: 11 }, (_, i) => ({
    key: i,
    label: (i).toString(),
    value: i,
}));

export default function HeightSelector({
    label = 'How tall are you?',
    initialHeight = '',
    onChange,
}) {
    const [heightFeet, setHeightFeet] = useState(initialHeight);
    const [heightInches, setHeightInches] = useState(initialHeight);

    const handleHeightChange = (heightFeet, heightInches) => {
        if (!heightFeet) {
            alert("Height in feet is required");
            return;
        } else {
            const heightInInches = heightFeet.value * 12 + heightInches.value;
            onChange?.(heightInInches);
        }
    }
    return (
        <View style={styles.wrapper}>
            <View>
                <Text style={styles.headerLabel}>{label}</Text>
            </View>
            <View style={styles.row}>
                <View style={styles.selectorBox}>

                    <CustomModalSelector
                        data={feet}
                        value={heightFeet}
                        onChange={(val) => {
                            setHeightFeet(val);
                            handleHeightChange(val, heightInches);
                        }}
                        placeholder="ft"
                        width={85}
                    />
                    <Text style={styles.label}>Feet</Text>
                </View>
                <View style={styles.selectorBox}>

                    <CustomModalSelector
                        data={inches}
                        value={heightInches}
                        onChange={(val) => {
                            setHeightInches(val);
                            handleHeightChange(heightFeet, val);
                        }}
                        placeholder="in"
                        width={85}
                    />
                    <Text style={styles.label}>Inches</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginVertical: 12,
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        color: 'black',
        marginLeft: 5,
    },
    headerLabel: {
        fontSize: 18,
        color: 'black',
        marginBottom: 12,
        alignSelf: 'center',

    },
    row: {
        flexDirection: 'row',
        gap: 20,
        paddingRight: 10,
    },
    selectorBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
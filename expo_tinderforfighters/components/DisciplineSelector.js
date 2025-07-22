import React, { useState } from 'react';
import { View, Alert, StyleSheet} from 'react-native';
import { disciplineOptions } from "../utils/disciplines";
import CustomModalSelector from "./CustomModalSelector";

export default function DisciplineSelector({
    label = 'Select Discipline',
    initialState = null,
    onChange,
    includeNone = false,

}) {
    const [selectedDiscipline, setSelectedDiscipline] = useState(initialState)

    const options = includeNone
        ? [{ key: 'none', label: 'None', value: '' }, ...disciplineOptions]
        : disciplineOptions;

    const handleDisciplineChange = (newDiscipline) => {
        setSelectedDiscipline(newDiscipline);
        if (onChange) {
            onChange(newDiscipline.value);
            console.log('discipline value:', newDiscipline.value);
        }

    };

    return (
        <View style={styles.wrapper}>
            <CustomModalSelector
                data={options}
                value={selectedDiscipline}
                onChange={handleDisciplineChange}
                placeholder={label}
                width={'88%'}

            />
        </View>

    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginVertical: 15,
        alignItems: 'center',
    },
});

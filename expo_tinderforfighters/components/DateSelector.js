import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import CustomModalSelector from '../components/CustomModalSelector';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';


const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => ({
    key: i,
    label: (currentYear - i).toString(),
    value: currentYear - i,
}));
const months = Array.from({ length: 12 }, (_, i) => ({
    key: i,
    label: (i + 1).toString().padStart(2, '0'),
    value: i + 1,
}));
const getDayOptions = (month) => {
    
    const daysInMonth = {
        1: 31,
        2: 29,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31,
    };

    const max = daysInMonth[month?.value] || 31;
    return Array.from({ length: max }, (_, i) => ({
        key: i,
        label: (i + 1).toString().padStart(2, '0'),
        value: i + 1,
    }));
};


export default function DateSelector({
    label = 'Select Date',
    initialDate = null,
    onChange,
}) {

    const [year, setYear] = useState(null);
    const [month, setMonth] = useState(null);
    const [day, setDay] = useState(null);


    const [lastInvalid, setLastInvalid] = useState(null);

    const handleDateChange = (newYear, newMonth, newDay) => {
        getDayOptions(newMonth);
        const isInvalidFeb29 =
            newMonth?.value === 2 &&
            newDay?.value >= 29 &&
            !((newYear?.value % 4 === 0 && newYear?.value % 100 !== 0) || newYear?.value % 400 === 0);

        const currentKey = `${newYear}-${newMonth}-${newDay}`;

        if (isInvalidFeb29) {
            if (lastInvalid !== currentKey) {
                setLastInvalid(currentKey);
                Alert.alert(
                    'Invalid Date',
                    `${newYear?.value} is not a leap year. February only has 28 days.`
                );
            }
            setDay({ label: '28', value: 28 });
            return;
        }

        setLastInvalid(null); // reset tracker when valid
        if (newYear && newMonth && newDay) {
            const formatted = `${newMonth.value.toString().padStart(2, '0')}/${newDay.value
                .toString()
                .padStart(2, '0')}/${newYear.value}`;
            onChange?.(formatted);
            console.log('DOB:', formatted);
        }
    };



    useEffect(() => {
        if (year && month && day) {
            handleDateChange(year, month, day);
        }
    }, [year, month, day]);

    return (
        <View style={styles.wrapper}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.row}>
                <CustomModalSelector
                    data={months}
                    value={month}
                    onChange={(val) => {
                        setMonth(val);
                        const validDayCount = getDayOptions(val).length;
                        if(day?.value > validDayCount) {
                            setDay(null);
                        }
                        handleDateChange(year, val, day?.value <= validDayCount ? day : null);
                    }}
                    placeholder="MM"
                    width={90}
                />

                <CustomModalSelector
                    data={getDayOptions(month)}
                    value={day}
                    onChange={(val) => {
                        setDay(val);
                        handleDateChange(year, month, val);
                    }}
                    placeholder="DD"
                    width={90}
                />

                <CustomModalSelector
                    data={years}
                    value={year}
                    onChange={(val) => {
                        setYear(val);
                        handleDateChange(val, month, day);
                    }}
                    placeholder="YYYY"
                    width={100}
                />

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginVertical: 20,
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 3,
    },
});
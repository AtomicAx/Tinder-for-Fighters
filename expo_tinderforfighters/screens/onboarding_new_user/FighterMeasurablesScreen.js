import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useOnboarding } from '../../context/onboardingContext';
import { Ionicons } from '@expo/vector-icons';
import { getWeightClass, weightClasses } from '../../utils/weightClasses';
import HeightSelector from '../../components/HeightSelector';

export default function FighterMeasurablesScreen({ navigation }) {
    const { updateOnboarding, onboardingData } = useOnboarding()
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [reach, setReach] = useState('');

    const handleFighterMeasurables = () => {
        if (!weight) {
            alert("Weight is required");
            return;
        } else if (weight < 85 || weight > 400) {
            alert("Please enter a valid weight between 85 and 400 lbs");
            return;
        } else if (!height) {
            alert("Height is required");
            return;
        } else if (!reach) {
            alert("Reach is required");
            return;
        } else if (reach < 40 || reach > 99) {
            alert("Please enter a valid reach between 40 and 99 inches");
            return;
        } else {
            console.log('this is onboarding data:', onboardingData.primaryDiscipline);
            const parsedWeight = parseInt(weight);

            const weightClass = getWeightClass(onboardingData.primaryDiscipline, parsedWeight);
            updateOnboarding({
                weight: parsedWeight,
                weightClass,
                height,
                reach: parseInt(reach),
            })

            navigation.navigate('Nickname');


        }
    }

    return (
        <LinearGradient
            colors={['#0052FF', '#4F8FFF', '#E5EDFF']}
            style={styles.container}>
            <Text style={styles.titleText}>Lets get your measurables</Text>
            <View>
                <HeightSelector

                    onChange={setHeight}
                />
            </View>
            <Text style={styles.label}>What is your fighting weight?</Text>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Weight (lbs)"
                    placeholderTextColor="#657786"
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                    maxLength={3}
                />
            </View>
            <Text style={styles.label}>What is your reach?</Text>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Reach (inches)"
                    placeholderTextColor="#657786"
                    value={reach}
                    onChangeText={setReach}
                    keyboardType="numeric"
                    maxLength={2}
                />
            </View>
            <View>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleFighterMeasurables}
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


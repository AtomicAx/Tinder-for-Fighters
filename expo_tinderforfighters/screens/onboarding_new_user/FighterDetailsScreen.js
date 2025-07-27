import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useOnboarding } from '../../context/onboardingContext';
import { Ionicons } from '@expo/vector-icons';
import DisciplineSelector from '../../components/DisciplineSelector';


export default function FighterDetailsScreen({ navigation }) {

    const [primaryDiscipline, setPrimaryDiscipline] = useState('');
    const [secondaryDiscipline, setSecondaryDiscipline] = useState('');
    const { updateOnboarding } = useOnboarding();

    // Gets the details of the user for their profile
    const handleFighterDetails = async () => {
        if (!primaryDiscipline) {
            alert("Primary discipline is required");
            return;
        } else {

            updateOnboarding({
                primaryDiscipline,
                secondaryDiscipline: secondaryDiscipline || null,
            });

            navigation.navigate('Fighter Measurables');
        }

    };
    return (
        <LinearGradient
            colors={['#0052FF', '#4F8FFF', '#E5EDFF']}
            style={styles.container}>
            <Text style={styles.titleText}>Choose your preferred fighting styles</Text>

            <View>
                <Text style={styles.label}>Primary Discipline</Text>
                <DisciplineSelector
                    value={primaryDiscipline}
                    onChange={setPrimaryDiscipline}
                />
            </View>
            <View>
                <Text style={styles.label}>Secondary Discipline (Optional)</Text>
                <DisciplineSelector
                    value={secondaryDiscipline}
                    onChange={setSecondaryDiscipline}
                    includeNone
                />
            </View>
            <View>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleFighterDetails}
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
        alignSelf: 'center',
        marginTop: 12,
        fontSize: 18
    },
    backButton: {
        position: 'absolute',
        top: 50,         // adjust for iOS notch or Android status bar
        left: 20,
        zIndex: 10,
        padding: 8,
    },
});


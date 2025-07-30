import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useOnboarding } from '../../context/onboardingContext';
import StateSelector from '../../components/StateSelector';
import { Ionicons } from '@expo/vector-icons';

export default function LocationDetailsScreen({ navigation }) {

    const [state, setState] = useState(null);
    const [city, setCity] = useState('');
    const [zipcode, setZipcode] = useState('');

    const { updateOnboarding } = useOnboarding();
    const handleLocationDetails = () => {
        if (!state) {
            alert('State is required');
            return;
        } else if (!city) {
            alert('City is required');
            return;
        } else if (!zipcode) {
            alert('Zipcode is required');
            return
        }
        
        updateOnboarding({
            state,
            city,
            zipcode,
        });

        navigation.navigate('Fighter Details');
    }


    return (
        <LinearGradient
          colors={['#0052FF', '#4F8FFF', '#E5EDFF']}
          style={styles.container}>
          <Text style={styles.titleText}>Where you livin at?</Text>
    
          <View>
            <StateSelector
                onChange={(val) => setState(val)} />
          </View>
          
          <View style={styles.inputView}>
            <TextInput
              style={styles.textInput}
              placeholder="City"
              placeholderTextColor="#657786"
              value={city}
              onChangeText={setCity}
            >
            </TextInput>
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.textInput}
              placeholder="Zip"
              placeholderTextColor="#657786"
              value={zipcode}
              onChangeText={setZipcode}
              maxLength={5}
              keyboardType="numeric"
            >
            </TextInput>
          </View>
          
    
          <View>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleLocationDetails}
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
        fontSize: 18,
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
      backButton: {
        position: 'absolute',
        top: 50,         // adjust for iOS notch or Android status bar
        left: 20,
        zIndex: 10,
        padding: 8,
    },
      placeholderText: {
        color: '#657786',
      },
    });
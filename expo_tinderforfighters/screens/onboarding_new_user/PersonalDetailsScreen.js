import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useOnboarding } from '../../context/onboardingContext';
import { useAuth } from '../../context/authContext';
import CustomModalSelector from '../../components/CustomModalSelector';
import DateSelector from '../../components/DateSelector';

export default function PersonalDetailsScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState(null);
  const [gender, setGender] = useState(null);

  const { updateOnboarding } = useOnboarding();
  const { user } = useAuth();

  const genderOptions = [
    { key: 0, label: 'Male', value: 'Male' },
    { key: 1, label: 'Female', value: 'Female' },
  ];

  // Gets the details of the user for their profile
  const handlePersonalDetails = async () => {
    if (!firstName) {
      alert("First Name is required");
      return;
    } else if (!lastName) {
      alert("Last Name is required");
      return;
    } else if (!birthday) { //Logic to ensure user is 18+ goes here too?
      alert("Birthday is required");
      return;
    } else if (!gender) {
      alert("Gender is required");
      return;
    } else {

      updateOnboarding({
        firstName,
        lastName,
        dob: birthday,
        gender,
      });

      navigation.navigate('Phone')
    }

  };
  return (
    <LinearGradient
      colors={['#0052FF', '#4F8FFF', '#E5EDFF']}
      style={styles.container}>
      <Text style={styles.titleText}>Welcome {user?.username || 'fighter'}</Text>
      <Text style={styles.titleText}>Lets get started</Text>

      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder="First Name"
          placeholderTextColor="#657786"
          value={firstName}
          onChangeText={setFirstName}
        >
        </TextInput>
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder="Last Name"
          placeholderTextColor="#657786"
          value={lastName}
          onChangeText={setLastName}
        >
        </TextInput>
      </View>
      <View>

      </View>
      <CustomModalSelector
        data={genderOptions}
        value={gender}
        onChange={(val) => setGender(val.value)}
        placeholder='Select Gender'
        width={'80%'}
      />

      <DateSelector
        label='Date of Birth'
        onChange={(date) => setBirthday(date)}
      />

      <View>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handlePersonalDetails}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
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
  label: { marginTop: 50, fontSize: 16 },
  picker: { height: 50, width: '80%', alignSelf: 'center' },
  dropdownBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: '100%',
  },
  dropdownText: {
    color: '#14171A',
    fontSize: 16,
  },
  placeholderText: {
    color: '#657786',
  },
});


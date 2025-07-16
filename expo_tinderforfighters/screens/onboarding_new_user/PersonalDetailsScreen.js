import React, {useState} from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../context/authContext';

export default function PersonalDetailsScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');

  const { user, logout} = useAuth();

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
    }
    
  };
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Welcome {username}</Text>
      <Text>Lets get started!!</Text>
    </View>
  );
}
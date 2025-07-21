// This is a barebones screen component. Build out design, logic, and state as needed.
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../context/authContext';

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  console.log(user);
  const username = user?.username;
  const handleLogout = async () => {
    await logout();
    navigation.navigate('Login');
  };
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Welcome {username}</Text>
      <Button title="Go to Profile" onPress={() => navigation.navigate('Profile')} />

      <Button title="Log Out" onPress={handleLogout}></Button>
    </View>
  );
}


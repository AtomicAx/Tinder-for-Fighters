// This is a barebones screen component. Build out design, logic, and state as needed.
import React from 'react';
import { View, Text, Button, Image, StyleSheet} from 'react-native';
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
        marginHorizontal: 20,
        textAlign: 'center',
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
    image: {
        width: 150,
        height: 150,
        borderRadius: 25,
        marginBottom: 10,
        alignSelf: 'center',
    },
});
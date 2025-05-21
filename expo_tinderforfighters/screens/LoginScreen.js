// This is a barebones screen component. Build out design, logic, and state as needed.
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { signInWithApple } from '../services/appleAuth';

export default function LoginScreen({ navigation }) {
  // This function calls the Apple Sign-In service and navigates on success
  const handleAppleLogin = async () => {
    const result = await signInWithApple();

    if (result.success) {
      // Successfully signed in with Apple
      console.log('Apple login success:', result.credential);

      // SHITTODO: Send identityToken or authorizationCode to Django backend here

      // Navigate to the Home screen (or wherever post-login should go)
      navigation.navigate('Home');

    } else if (result.cancelled) {
      // User cancelled the Apple login flow
      console.log('Apple login cancelled');
    } else {
      // Unexpected error occurred during Apple sign-in
      console.error('Apple login error:', result.error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Login Screen</Text>

      {/* Temporary button to navigate manually */}
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />

      {/* Apple Sign-In Button (only works on iOS devices) */}
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={styles.button}
        onPress={handleAppleLogin}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 200,
    height: 44,
    marginTop: 12,
  },
});


// This is a barebones screen component. Build out design, logic, and state as needed.
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { signInWithApple } from '../services/appleAuth';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '487602687272-blld28qfn85evoe950dj57gcadvi6744.apps.googleusercontent.com',
  //scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  offlineAccess: true,
  forceCodeForRefreshToken: true,
  iosClientId: '487602687272-c5m2fajd0qe5tshf7ufln52mo77c4k57.apps.googleusercontent.com',
  
});


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

  const handleGoogleLogin = async () => {
    const result = await signInWithGoogle();

    if (result.success) {
      console.log('Google login success:', result.data);
      
      // SHITTODO: Send identityToken or authorizationCode to Django backend here
      
      // Navigate to the Home screen (or wherever post-login should go)
      navigation.navigate('Home');

    } else if (result.cancelled) {
      console.log('Google login cancelled');
    } else if (result.inProgress) {
      console.log('Google login is not responding');
    } else {
      console.log(result.error);
    }
  }

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
      {/* Google Sign-In Button */}
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        style={{ width: 228, height: 44, borderRadius: 15, marginTop: 12 }}
        onPress={handleGoogleLogin}
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
    width: 220,
    height: 44,
    marginTop: 12,
  },
});


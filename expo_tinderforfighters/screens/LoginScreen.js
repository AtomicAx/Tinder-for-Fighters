// This is a barebones screen component. Build out design, logic, and state as needed.
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ActivityIndicator, Button, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useAuth } from '../context/authContext';
import { LinearGradient } from 'expo-linear-gradient';
import EmailVerificationScreen from './onboarding_new_user/EmailVerificationScreen';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const { login, validate, register, signInWithGoogle, signInWithApple, resetPassword, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password1, setPassword] = useState('');
  const [password2, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [appleAvailable, setAppleAvailable] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      AppleAuthentication.isAvailableAsync().then(setAppleAvailable);
    }
  }, []);

  // Google auth config
  const config = {
    webClientId: '487602687272-blld28qfn85evoe950dj57gcadvi6744.apps.googleusercontent.com',
    iosClientId: '487602687272-c5m2fajd0qe5tshf7ufln52mo77c4k57.apps.googleusercontent.com',
    androidClientId: '487602687272-jt2c8jp7f92phkh8444kd9d61uhme246.apps.googleusercontent.com'
  };
  const [request, response, promptAsync] = Google.useAuthRequest(config);

  useEffect(() => {
    if (response?.type === "success") {
      handleGoogleAuth(response.authentication.accessToken);
    }
  }, [response]);

  // This function handles google sign in
  const handleGoogleAuth = async (accessToken) => {
    try {
      // Get user info from Google
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!userInfoResponse.ok) {
        throw new Error('Failed to get user info from Google');
      }

      const userInfo = await userInfoResponse.json();

      // Create or sign in the user
      const userData = {
        id: userInfo.id,
        first_name: userInfo.given_name,
        last_name: userInfo.family_name,
        email: userInfo.email,
        auth_type: "google",
        googleId: userInfo.id,
        picture: userInfo.picture
      };

      const result = await signInWithGoogle(userData);

      if (result.success) {
      } else {
        throw new Error("Google login/register failed");
      }

    } catch (error) {
      console.error("Google sign in error:", error);
    }
  };

  // This function calls the Apple Sign-In service and navigates on success
  const handleAppleLogin = async () => {
    const result = await signInWithApple();

    if (result.success) {
      // Successfully signed in with Apple
      console.log('Apple login success:', result.credential);

      // SHITTODO: Send identityToken or authorizationCode to Django backend here

    } else if (result.cancelled) {
      // User cancelled the Apple login flow
      console.log('Apple login cancelled');
    } else {
      // Unexpected error occurred during Apple sign-in
      console.error('Apple login error:', result.error);
    }
  };

  // This function is for standard email/password login
  const handleEmailLogin = async () => {
    console.log('login button pressed');
    if (!email || !password1) {
      alert("Please enter both email and password");
      return;
    }
    const result = await login(email, password1);

    if (result.success) {
      console.log('Email login success');
      setEmail('');
      setPassword('');
      navigation.navigate('Home');

    } else {
      alert("Incorrect email or password!");
    }
  }

  // This function is for sign up with email/password
  const handleSignUp = async () => {
    if (!username || !email || !password1 || !password2) {
      alert("Please fill in all fields");
      return;
    }

    if (password1 !== password2) {
      alert("Passwords do not match");
      return;
    }

    //const validationMessage = validatePassword(username, email, password1)
    //if (validationMessage != null) {
    //  alert(validationMessage);
    //  return;
    //}

    //const validateInfoMessage = await validateUsernameEmail(username, email);
    //if (validateInfoMessage != null) {
    //  alert(JSON.stringify(validateInfoMessage));
    //  return;
    //}
    const userData = {
      email,
      password1,
      password2,
      username
    };
    navigation.navigate('EmailVerification', { userData });
    //const result = await register(userData);

    //if (result.success) {
    //setUsername('');
    //setEmail('');
    //setPassword('');
    //setConfirmPassword('');
    //setIsSignUp(false);

    // }
  };

  // toggle between login and sign up
  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (

    <LinearGradient
      colors={['#0052FF', '#4F8FFF', '#E5EDFF']}
      style={styles.container}>

      <Text style={styles.titleText}>
        {isSignUp ? "Create your account" : "Log in to TFF"}
      </Text>

      {isSignUp && (
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="username"
            placeholderTextColor="#657786"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>
      )}
      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          placeholderTextColor="#657786"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          placeholderTextColor="#657786"
          value={password1}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
      </View>

      {isSignUp && (
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="Confirm Password"
            placeholderTextColor="#657786"
            value={password2}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
          />
        </View>
      )}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={isSignUp ? handleSignUp : handleEmailLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>
            {isSignUp ? "Sign up" : "Login"}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={toggleAuthMode}
      >
        <Text style={styles.secondaryButtonText}>
          {isSignUp
            ? "Already have an account? Login"
            : "Don't have an account? Sign up"}
        </Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.divider} />
      </View>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={() => promptAsync()}
      >
        <Image
          source={require("../assets/google_icon.png")}
          style={styles.googleIcon}
        />
        <Text style={styles.googleButtonText}>
          Continue with Google
        </Text>
      </TouchableOpacity>
      {/* Apple Sign-In Button (only works on iOS devices) */}
      {Platform.OS === 'ios' && appleAvailable && (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={25}
          style={styles.primaryButton}
          onPress={handleAppleLogin}
        />
      )}

      {/* Temporary button to navigate manually */}
      <TouchableOpacity style={styles.forceHomeButton} onPress={() => navigation.navigate('Phone')}>
        <Text>Home</Text>
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
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  titleText: {
    alignSelf: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: 'white',
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
  toggleContainer: {
    flexDirection: 'row',
    marginTop: 20,
    paddingLeft: 10,
  },
  toggleText: {
    marginLeft: 10,
    color: '#657786',
    fontSize: 14,
  },
  forgotPasswordText: {
    color: '#1DA1F2',
    fontSize: 14,
    marginBottom: 20,
    alignSelf: 'flex-start',
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
  secondaryButton: {
    width: '80%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 14,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E1E8ED',
  },
  orText: {
    color: '#657786',
    paddingHorizontal: 10,
    fontSize: 14,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 25,
    width: '80%',
    height: 50,
    paddingHorizontal: 10,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 600,
  },
  forceHomeButton: {
    width: '40%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    backgroundColor: 'green',
    marginTop: 50,
  }
});

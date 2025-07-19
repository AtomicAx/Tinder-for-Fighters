import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EmailVerificationScreen from '../screens/onboarding_new_user/EmailVerificationScreen';
import PersonalDetailsScreen from '../screens/onboarding_new_user/PersonalDetailsScreen';
import PhoneScreen from '../screens/onboarding_new_user/PhoneScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Email Verification" component={EmailVerificationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Personal Details" component={PersonalDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Phone" component={PhoneScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

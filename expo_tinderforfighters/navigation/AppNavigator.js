import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EmailVerificationScreen from '../screens/onboarding_new_user/EmailVerificationScreen';
import PersonalDetailsScreen from '../screens/onboarding_new_user/PersonalDetailsScreen';
import PhoneScreen from '../screens/onboarding_new_user/PhoneScreen';
import LocationDetailsScreen from '../screens/onboarding_new_user/LocationDetailsScreen';
import FighterDetailsScreen from '../screens/onboarding_new_user/FighterDetailsScreen';
import FighterMeasurablesScreen from '../screens/onboarding_new_user/FighterMeasurablesScreen';
import NicknameSelectionScreen from '../screens/onboarding_new_user/NicknameSelectionScreen';
import PhotoUploadScreen from '../screens/onboarding_new_user/PhotoUploadScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Email Verification" component={EmailVerificationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Personal Details" component={PersonalDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Location Details" component={LocationDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Phone" component={PhoneScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Fighter Details" component={FighterDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Fighter Measurables" component={FighterMeasurablesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Nickname" component={NicknameSelectionScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Photo Upload" component={PhotoUploadScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

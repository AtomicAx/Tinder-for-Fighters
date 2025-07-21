import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './context/authContext';
import { OnboardingProvider } from './context/onboardingContext';

export default function App() {
  return (
   <AuthProvider>
      <OnboardingProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </OnboardingProvider>
    </AuthProvider>
  );
}


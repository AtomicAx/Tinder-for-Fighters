import React, { useState, useEffect }from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/authContext';
import { verifyEmailCode } from '../../authApi';

export default function EmailVerificationScreen() {
  const {register, isLoading } = useAuth();
  const route = useRoute();
  const navigation = useNavigation();
  const { userData } = route.params;

  const [code, setCode] = useState('');

  useEffect(() => {
    const sendCode = async () => {
        const result = await register(userData);
        if (!result.success) {
            Alert.alert('Error sending verification code', result.error || 'Unknown error');
            //navigation.goBack();
        } 
    };
    sendCode();
  }, []);  
 
  const handleVerifyCode = async (code) => {
    const result = await verifyEmailCode(code); // calls your API

    if (result.success) {
      navigation.replace('Home'); // change to next step of account creation
    } else {
      Alert.alert('Verification Failed', result.error || 'Incorrect Code');
    }
  };

  const handleResendCode = async () => {
    const result = await register(userData);
    if (!result.success) {
        Alert.alert('Error resending code', result.error || 'Try again later');
    }
  };

  return (
    <View>
      <Text>Enter the 6-digit verification code sent to your email</Text>
      <TextInput
        value={code}
        onChangeText={setCode}
        placeholder="123456"
        keyboardType="numeric"
        maxLength={6}
      />
      <Button title="Verify" onPress={handleVerifyCode} disabled={isLoading} />
      <Button title="Resend Code" onPress={handleResendCode} />
    </View>
  );
};

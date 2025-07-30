import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/authContext';
import { sendEmailCode, verifyEmailCode } from '../../verificationApi';
import { LinearGradient } from 'expo-linear-gradient';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

export default function EmailVerificationScreen() {
  const { register, isLoading } = useAuth();
  const route = useRoute();
  const navigation = useNavigation();
  const { userData } = route.params;

  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let interval;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);



  useEffect(() => {
    const sendCode = async () => {
      const result = await sendEmailCode(userData.email);
      if (!result.success) {
        Alert.alert('Error sending verification code', result.error || 'Unknown error');
        navigation.goBack();
      }
    };
    sendCode();
  }, []);

  const handleVerifyCode = async () => {

    const result = await verifyEmailCode(userData.email, code); // calls your API

    if (verifying) return;
    setVerifying(true);

    if (result.success) {
      const registerResult = await register(userData);
      if (registerResult.success) {
        navigation.replace('Personal Details');
      } else {
        Alert.alert('Registration Failed', registerResult.error);
      }

    } else {
      Alert.alert('Verification Failed', result.error || 'Incorrect Code');
    }

    setVerifying(false);
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    const result = await sendEmailCode(userData.email);
    if (!result.success) {
      Alert.alert('Error resending code', result.error || 'Try again later');

    } else {
      Alert.alert('Verification code resent', 'Check your inbox.');
      setResendCooldown(30);
    }
  };

  // Underline confirmation code input
  const CELL_COUNT = 6;
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    setCode(value);
  }, [value]);


  return (
    <LinearGradient
      colors={['#0052FF', '#4F8FFF', '#E5EDFF']}
      style={styles.container}>
      <Text style={styles.titleText}>Enter the 6-digit verification code sent to your email</Text>
      <View>
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFiledRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <View
              // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
              onLayout={getCellOnLayoutHandler(index)}
              key={index}
              style={[styles.cellRoot, isFocused && styles.focusCell]}>
              <Text style={styles.cellText}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
          )}
        />
      </View>
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleVerifyCode}
        disabled={verifying}
      >
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.primaryButton, resendCooldown > 0 && { opacity: 0.5 }]}
        onPress={handleResendCode}
        disabled={resendCooldown > 0}
      >
        <Text style={styles.buttonText}>
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
        </Text>
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
  inputView: {
    alignSelf: 'center',
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
  root: {
    alignSelf: 'center',
    padding: 20,
    minHeight: 300
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
  codeFiledRoot: Platform.select({
    ios: {
      marginTop: 20,
      marginHorizontal: 10,
      width: 225,
    },

    android: {
      marginTop: 20,
      marginHorizontal: 20,
      width: 225,
    }
  }),
  cellRoot: {
    width: 50,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginHorizontal: 6,
    borderBottomColor: '#ccc',
    borderBottomWidth: 2,
    marginBottom: 50,
  },
  cellText: {
    color: '#ffffff',
    fontSize: 32,
    textAlign: 'center',
  },
  focusCell: {
    borderBottomColor: '#007AFF',
    borderBottomWidth: 2,
  },
});


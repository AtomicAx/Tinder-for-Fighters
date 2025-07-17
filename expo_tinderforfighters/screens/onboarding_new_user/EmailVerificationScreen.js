import React, { useState, useEffect }from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/authContext';
import { verifyEmailCode } from '../../authApi';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field'; 

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
 
  const handleVerifyCode = async (email, code) => {
    const result = await verifyEmailCode(email, code); // calls your API

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

  // Underline confirmation code input
  const CELL_COUNT = 6;
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  
  return (
    <View style={styles.container}>
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
            renderCell={({index, symbol, isFocused}) => (
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
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity> 
    
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleResendCode}
      >
        <Text style={styles.buttonText}>Resend Code</Text>
      </TouchableOpacity>
    </View>
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
    borderStyle: 'dashed',
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
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: 24
  },
  codeFiledRoot: {
    marginTop: 20,
    paddingLeft: 10,
    width: 225,
    alignContent: 'center',
  },
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


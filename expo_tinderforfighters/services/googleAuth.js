import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleSignin, GoogleSigninButton, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    console.log(userInfo);
    return {success: true, data: userInfo};
  } catch (error) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          console.log("Something went wrong");
          return {success: false, cancelled: true};
          break;
        case statusCodes.IN_PROGRESS:
          console.log("Something went wrong");
          return {success: false, inProgress: true};
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          console.log("Something went wrong");
          return {success: false, playServices: true};
          break;
        default:
          console.log(error);
          return {success: false, error};
      }
    } else {
      console.log("An error that is unrelated to google occurred");
    }
  }
};
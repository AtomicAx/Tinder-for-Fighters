import * as AppleAuthentication from 'expo-apple-authentication';

// This function wraps the Apple Sign-In flow so it can be reused anywhere in the app
export async function signInWithApple() {
  try {
    // Prompt the user to sign in with Apple
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    // Extract useful pieces of data from the credential
    const { identityToken, authorizationCode, email, user } = credential;

    // Return everything the app might need for user creation or auth
    return {
      success: true,
      credential,
      token: identityToken,
      appleUserId: user,
      email,
    };
  } catch (error) {
    // Handle if the user cancelled the login prompt
    if (error.code === 'ERR_REQUEST_CANCELED') {
      return { success: false, cancelled: true };
    } else {
      // Handle any unexpected Apple auth errors
      return { success: false, error };
    }
  }
}


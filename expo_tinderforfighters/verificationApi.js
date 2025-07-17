const API_BASE_URL = 'https://tinderforfighters.servebeer.com';

export const sendEmailCode = async (email) => {
    try {   
    // send verification code
        const codeResult = await fetch(`${API_BASE_URL}/api/auth/send-code/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email }),
        });

        const codeData = await codeResult.json();
        console.log('Code Result', codeData);

        if (!codeResult.ok || codeData.success === false) {
            return {success: false, error: codeData.detail || 'Code send failed'};
        }

        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Something went wrong sending the code'};
    }
}
export const verifyEmailCode = async (email, code) => {
    try {
        // email verification
        const verifyResult = await fetch(`${API_BASE_URL}/api/auth/email-verification/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, code }),
        });

        const verifyData = await verifyResult.json();
        console.log('Verify Result', verifyData);

        if (!verifyResult.ok || verifyData.success === false) {
            return {success: 'false', error: verifyData.detail || 'Email verification failed'};
        }
        
        return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Something went wrong verifying the email'};
}
} 
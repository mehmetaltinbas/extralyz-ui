import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Navigate } from 'react-router-dom';
import { AuthService } from 'src/features/auth/services/auth.service';
import { consumeAuthRedirectUrl } from 'src/shared/utils/auth-redirect/consume-auth-redirect-url.util';

export function GoogleSignInButton() {
    const [isSignedIn, setIsSignedIn] = React.useState(false);

    async function handleGoogleSuccess(credentialResponse: { credential?: string }) {
        if (!credentialResponse.credential) {
            alert('Google sign in failed: no credential received');
            return;
        }

        const response = await AuthService.googleSignIn({
            credential: credentialResponse.credential,
        });

        if (!response.isSuccess) {
            alert(response.message);
            return;
        }

        setIsSignedIn(true);
    }

    if (isSignedIn) {
        return <Navigate to={consumeAuthRedirectUrl() || '/workspace'} />;
    }

    return (
        <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => alert('Google sign in failed')}
            size="large"
            width="192"
            text="continue_with"
        />
    );
}

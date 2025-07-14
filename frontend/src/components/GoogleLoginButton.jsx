import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const GoogleLoginButton = () => {
    const responseGoogle = (credentialResponse) => {
        console.log(credentialResponse);
        // Handle the response from Google here (e.g., send to backend for authentication)
    };

    return (
        <div>
            <GoogleLogin
                onSuccess={responseGoogle}
                onError={() => {
                    console.log('Login Failed');
                }}
            />
        </div>
    );
};

export default GoogleLoginButton;
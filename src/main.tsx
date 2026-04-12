import React from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from 'src/App';
import store from 'src/store/store';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                <App />
            </GoogleOAuthProvider>
        </Provider>
    </React.StrictMode>
);

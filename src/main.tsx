import React from 'react';
import { createRoot } from 'react-dom/client';
import App from 'src/App';
import store from 'src/store/store';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);

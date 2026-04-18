import React from 'react';
import { AuthContext } from 'src/shared/contexts/auth.context';

export function useAuth() {
    const context = React.useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}

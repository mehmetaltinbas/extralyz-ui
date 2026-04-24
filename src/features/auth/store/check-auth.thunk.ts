import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthService } from 'src/features/auth/services/auth.service';

export const checkAuth = createAsyncThunk('auth/check', async () => {
    const response = await AuthService.authorize();

    return response.isSuccess;
});

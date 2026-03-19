import { createAsyncThunk } from '@reduxjs/toolkit';
import { UserService } from 'src/features/user/services/user.service';

export const fetchUserData = createAsyncThunk('user/fetch-data', async () => {
    const response = await UserService.readByToken();

    return response.user;
});

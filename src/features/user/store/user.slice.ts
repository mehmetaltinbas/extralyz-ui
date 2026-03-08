import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { userService } from 'src/features/user/services/user.service';
import type { User } from 'src/features/user/types/user.interface';

const fetchData = createAsyncThunk('user/fetch-data', async () => {
    const response = await userService.readByToken();

    return response.user;
});

const initialState: User | null = null;

const userSlice = createSlice({
    name: 'user',
    initialState: initialState as User | null,
    reducers: {
        clear() {
            return null;
        },
    },
    extraReducers(builder) {
        builder.addCase(fetchData.fulfilled, (_state, action) => {
            return action.payload ?? null;
        });
    },
});

export const userActions = {
    ...userSlice.actions,
    fetchData,
};

export const userReducer = userSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { fetchUserData } from 'src/features/user/store/fetch-user-data.thunk';
import type { User } from 'src/features/user/types/user.interface';

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
        builder.addCase(fetchUserData.fulfilled, (_state, action) => {
            return action.payload ?? null;
        });
    },
});

export const userActions = {
    ...userSlice.actions,
    fetchData: fetchUserData,
};

export const userReducer = userSlice.reducer;

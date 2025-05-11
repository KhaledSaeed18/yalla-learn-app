import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UpdateProfileRequest } from '@/types/service/user.types';

// Define the user state
interface UserState {
    currentUser: User | null;
    isLoading: boolean;
    error: string | null;
}

// Initial state
const initialState: UserState = {
    currentUser: null,
    isLoading: false,
    error: null,
};


// User slice
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUserError: (state) => {
            state.error = null;
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.currentUser = action.payload;
        },
        clearUser: (state) => {
            state.currentUser = null;
        },
    },
});

export const { clearUserError, setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;

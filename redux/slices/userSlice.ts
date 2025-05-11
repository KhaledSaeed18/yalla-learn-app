import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ApiError } from '@/api/base';
import { getCurrentUserProfile, updateProfile } from '@/services/user.service';
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

// Async thunks
export const fetchCurrentUser = createAsyncThunk<
    User,
    void,
    { rejectValue: string }
>('user/fetchCurrentUser', async (_, { rejectWithValue }) => {
    try {
        const user = await getCurrentUserProfile();
        return user;
    } catch (error) {
        const apiError = error as ApiError;
        return rejectWithValue(apiError.message);
    }
});

export const updateUserProfile = createAsyncThunk<
    User,
    Partial<User>,
    { rejectValue: string }
>('user/updateProfile', async (userData, { rejectWithValue }) => {
    try {
        const updatedUser = await updateProfile(userData);
        return updatedUser;
    } catch (error) {
        const apiError = error as ApiError;
        return rejectWithValue(apiError.message);
    }
});

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
    extraReducers: (builder) => {
        // Fetch current user
        builder.addCase(fetchCurrentUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.currentUser = action.payload;
        });
        builder.addCase(fetchCurrentUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || 'Failed to fetch user';
        });

        // Update user profile
        builder.addCase(updateUserProfile.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(updateUserProfile.fulfilled, (state, action) => {
            state.isLoading = false;
            state.currentUser = action.payload;
        });
        builder.addCase(updateUserProfile.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || 'Failed to update profile';
        });
    },
});

export const { clearUserError, setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;

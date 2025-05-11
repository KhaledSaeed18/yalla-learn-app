import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api, ApiError } from '@/api/base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SignInRequest, SignInResponse } from '@/types/auth/signin.types';

// Types
interface AuthState {
    isAuthenticated: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    error: string | null;
}

// Initial state
const initialState: AuthState = {
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    isLoading: false,
    error: null,
};

export const refreshTokenAction = createAsyncThunk<
    { accessToken: string },
    void,
    { rejectValue: string }
>('auth/refreshToken', async (_, { getState, rejectWithValue }) => {
    try {
        // Get the refresh token from AsyncStorage
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        if (!refreshToken) {
            return rejectWithValue('No refresh token available');
        }

        const response = await api.post<{ status: string; data: { accessToken: string } }>('/auth/refresh-token', { refreshToken });

        // Extract the accessToken from the nested structure
        return { accessToken: response.data.accessToken };
    } catch (error) {
        const apiError = error as ApiError;
        return rejectWithValue(apiError.message);
    }
});

// Auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setCredentials: (state, action: PayloadAction<{ accessToken: string, refreshToken: string }>) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = true;
        },
        clearCredentials: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
        }
    },
    extraReducers: (builder) => {
        // Refresh token
        builder.addCase(refreshTokenAction.fulfilled, (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;
        });
        builder.addCase(refreshTokenAction.rejected, (state, action) => {
            state.isAuthenticated = false;
            state.accessToken = null;
            state.refreshToken = null;
        });
    },
});

export const { clearError, setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;

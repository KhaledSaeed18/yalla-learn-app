import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api, ApiError } from '@/api/base';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
interface AuthState {
    isAuthenticated: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    error: string | null;
}

interface LoginCredentials {
    email: string;
    password: string;
}

interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: any; // You may want to define a proper User type
}

// Initial state
const initialState: AuthState = {
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    isLoading: false,
    error: null,
};

// Async thunks
export const loginUser = createAsyncThunk<
    AuthResponse,
    LoginCredentials,
    { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const response = await api.post<AuthResponse>('/auth/login', credentials);

        // Store refresh token in AsyncStorage for persistence
        await AsyncStorage.setItem('refreshToken', response.refreshToken);

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        return rejectWithValue(apiError.message);
    }
});

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

        const response = await api.post<{ accessToken: string }>('/auth/refresh', { refreshToken });
        return response;
    } catch (error) {
        const apiError = error as ApiError;
        return rejectWithValue(apiError.message);
    }
});

export const logoutUser = createAsyncThunk<
    void,
    void,
    { rejectValue: string }
>('auth/logout', async (_, { getState, rejectWithValue }) => {
    try {
        const state = getState() as { auth: AuthState };
        const refreshToken = state.auth.refreshToken;

        // Call logout API
        await api.post('/auth/logout', { refreshToken });

        // Clear refresh token from AsyncStorage
        await AsyncStorage.removeItem('refreshToken');
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
        // Login user
        builder.addCase(loginUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || 'Failed to login';
        });

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

        // Logout user
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.isAuthenticated = false;
            state.accessToken = null;
            state.refreshToken = null;
        });
    },
});

export const { clearError, setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;

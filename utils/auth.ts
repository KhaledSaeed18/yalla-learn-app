import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const logout = async (sessionExpired = false): Promise<void> => {
    try {
        // Import here to avoid circular dependency
        const { store } = require('../redux/store');
        const { clearCredentials } = require('../redux/slices/authSlice');
        const { clearUser } = require('../redux/slices/userSlice');

        store.dispatch(clearCredentials());
        store.dispatch(clearUser());

        await AsyncStorage.removeItem('refreshToken');

        if (sessionExpired) {
            Alert.alert(
                'Session Expired',
                'Your session has expired. Please log in again.',
                [{ text: 'OK' }]
            );
        }
    } catch (error) {
        console.error('Error during logout:', error);
    }
};

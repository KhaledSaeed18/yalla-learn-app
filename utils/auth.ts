import { store } from '@/redux/store';
import { clearCredentials } from '@/redux/slices/authSlice';
import { clearUser } from '@/redux/slices/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const logout = async (sessionExpired = false): Promise<void> => {
    try {
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

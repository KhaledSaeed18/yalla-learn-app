import axios, { AxiosResponse, Method } from 'axios';
import { Store } from '@reduxjs/toolkit';

let storeReference: Store | null = null;
let isRefreshing = false;
let failedQueue: Array<{ resolve: Function; reject: Function }> = [];

export const setStoreReference = (store: Store): void => {
    storeReference = store;
};

const API_BASE_URL: string = 'http://localhost:5005/api/v1';
const API_TIMEOUT: number = 30000;

export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: API_TIMEOUT,
});

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(request => {
        if (error) {
            request.reject(error);
        } else {
            request.resolve(token);
        }
    });

    failedQueue = [];
};

const handleTokenExpiration = () => {
    if (storeReference) {
        const { clearCredentials } = require('../redux/slices/authSlice');
        const { clearUser } = require('../redux/slices/userSlice');
        storeReference.dispatch(clearCredentials());
        storeReference.dispatch(clearUser());

        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        AsyncStorage.removeItem('refreshToken');
    }
};

axiosInstance.interceptors.request.use(
    (config) => {
        if (storeReference?.getState()?.auth?.isAuthenticated) {
            const token = storeReference.getState().auth.accessToken;
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response &&
            error.response.status === 401 &&
            error.response.data?.message === "Unauthorized: Token has expired" &&
            !originalRequest._retry &&
            storeReference
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axios(originalRequest);
                    })
                    .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { refreshTokenAction } = require('../redux/slices/authSlice');
                const result = await storeReference.dispatch(refreshTokenAction());

                if (result.meta.requestStatus === 'fulfilled') {
                    const newToken = result.payload.accessToken;
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    processQueue(null, newToken);
                    return axios(originalRequest);
                } else {
                    if (result.payload === 'Refresh token expired') {
                        console.log('Refresh token expired, logging out user');
                    }
                    handleTokenExpiration();
                    processQueue(new Error('Failed to refresh token'));
                    return Promise.reject(error);
                }
            } catch (refreshError: any) {
                if (refreshError.message && refreshError.message.includes('Refresh token expired')) {
                    console.log('Refresh token expired, logging out user');
                }
                handleTokenExpiration();
                processQueue(refreshError);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

interface ApiErrorResponse {
    message: string;
    errors?: any;
}

export class ApiError extends Error {
    status: number;
    errors?: any;

    constructor(message: string, status: number, errors?: any) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.errors = errors;
    }
}

export const api = {
    get: <T>(url: string, params?: any) => makeRequest<T>('GET', url, undefined, params),
    post: <T>(url: string, data?: any, params?: any) => makeRequest<T>('POST', url, data, params),
    put: <T>(url: string, data?: any, params?: any) => makeRequest<T>('PUT', url, data, params),
    patch: <T>(url: string, data?: any, params?: any) => makeRequest<T>('PATCH', url, data, params),
    delete: <T>(url: string, params?: any) => makeRequest<T>('DELETE', url, undefined, params),
};

async function makeRequest<T>(
    method: Method,
    url: string,
    data?: any,
    params?: any
): Promise<T> {
    try {
        const response = await axiosInstance.request<T>({
            method,
            url,
            data,
            params,
        });

        return response.data;
    } catch (error: any) {
        if (error.response) {
            const { data, status } = error.response;
            const errorData = data as ApiErrorResponse;
            throw new ApiError(
                errorData.message || 'An error occurred',
                status,
                errorData.errors
            );
        } else if (error.request) {
            throw new ApiError('No response received from server', 0);
        } else {
            throw new ApiError(error.message || 'Request setup error', 0);
        }
    }
}

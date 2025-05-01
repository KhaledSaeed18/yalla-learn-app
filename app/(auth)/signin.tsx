import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Entypo } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { authServices } from '@/services/auth/signin.service';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { FormControl, FormControlError, FormControlErrorText, FormControlLabel } from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { HStack } from '@/components/ui/hstack';
import { Button } from '@/components/ui/button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from '@/redux/hooks';
import { setCredentials } from '@/redux/slices/authSlice';
import { setUser } from '@/redux/slices/userSlice';

// Form validation schema
const signInSchema = yup.object({
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});

type SignInFormData = {
    email: string;
    password: string;
};

export default function SignIn() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useAppDispatch();

    const { control, handleSubmit, formState: { errors } } = useForm<SignInFormData>({
        resolver: yupResolver(signInSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit = async (data: SignInFormData) => {
        setIsLoading(true);
        try {
            const response = await authServices.signIn(data);

            // Validate response before storing tokens
            if (!response || !response.accessToken || !response.refreshToken) {
                throw new Error('Invalid response from server');
            }

            // Store tokens and user data
            await AsyncStorage.setItem('refreshToken', response.refreshToken);

            // Update Redux state
            dispatch(setCredentials({
                accessToken: response.accessToken,
                refreshToken: response.refreshToken
            }));

            // Only dispatch setUser if user data exists
            if (response.user) {
                // Transform user data to match User type with firstName and lastName
                const nameParts = response.user.name.split(' ');
                const firstName = nameParts[0] || '';
                const lastName = nameParts.slice(1).join(' ') || '';
                
                dispatch(setUser({
                    ...response.user,
                    firstName,
                    lastName
                }));
            }

            // Navigate to main app
            router.replace('/');
        } catch (error: any) {
            console.error('Login error:', error);
            Alert.alert(
                'Login Failed',
                error.message || 'An error occurred during login. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-background-50 p-6 justify-center">
            <Box className="mb-8 items-center">
                {/* <Image
                    source={require('@/assets/images/logo.png')}
                    className="w-24 h-24 mb-4"
                    resizeMode="contain"
                /> */}
                <Heading size="2xl" className="text-typography-900">Welcome Back</Heading>
                <Text className="text-typography-600 text-center mt-2">
                    Sign in to your account to continue
                </Text>
            </Box>

            <VStack space="md" className="mb-6">
                <FormControl isInvalid={!!errors.email}>
                    <FormControlLabel>
                        <Text className="text-typography-700 font-medium">Email</Text>
                    </FormControlLabel>
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, value } }) => (
                            <Input>
                                <InputField
                                    placeholder="Enter your email"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={value}
                                    onChangeText={onChange}
                                    className="bg-background-0 border-background-200"
                                />
                            </Input>
                        )}
                    />
                    {errors.email && (
                        <FormControlError>
                            <FormControlErrorText>{errors.email.message}</FormControlErrorText>
                        </FormControlError>
                    )}
                </FormControl>

                <FormControl isInvalid={!!errors.password} className="mt-2">
                    <FormControlLabel>
                        <Text className="text-typography-700 font-medium">Password</Text>
                    </FormControlLabel>
                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, value } }) => (
                            <Input>
                                <InputField
                                    placeholder="Enter your password"
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    value={value}
                                    onChangeText={onChange}
                                    className="bg-background-0 border-background-200"
                                />
                                <TouchableOpacity
                                    className="absolute right-3 top-3.5"
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <Entypo name={showPassword ? "eye" : "eye-with-line"} size={20} color="#666" />
                                </TouchableOpacity>
                            </Input>
                        )}
                    />
                    {errors.password && (
                        <FormControlError>
                            <FormControlErrorText>{errors.password.message}</FormControlErrorText>
                        </FormControlError>
                    )}
                </FormControl>
            </VStack>

            <Button
                className="bg-primary-500 mt-2"
                size="lg"
                onPress={handleSubmit(onSubmit)}
                isDisabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white font-bold">Sign In</Text>
                )}
            </Button>

            <HStack className="mt-6 justify-center">
                <Text className="text-typography-600">Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/signup')}>
                    <Text className="text-primary-500 font-semibold">Sign Up</Text>
                </TouchableOpacity>
            </HStack>
        </View>
    );
}

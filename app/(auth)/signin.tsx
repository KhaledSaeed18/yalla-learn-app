import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
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
import { BrainCircuit } from 'lucide-react-native';

const signinSchema = yup.object({
    email: yup.string().email('Please enter a valid email').required('Email is required'),
    password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});

type SignInFormData = yup.InferType<typeof signinSchema>;

export default function SignIn() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useAppDispatch();

    const { control, handleSubmit, formState: { errors } } = useForm<SignInFormData>({
        resolver: yupResolver(signinSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit = async (data: SignInFormData) => {
        setIsLoading(true);
        try {
            const response = await authServices.signIn(data);

            if (!response || !response.accessToken || !response.refreshToken) {
                throw new Error('Invalid response from server');
            }

            await AsyncStorage.setItem('refreshToken', response.refreshToken);

            dispatch(setCredentials({
                accessToken: response.accessToken,
                refreshToken: response.refreshToken
            }));

            if (response.user) {
                const nameParts = response.user.name.split(' ');
                const firstName = nameParts[0] || '';
                const lastName = nameParts.slice(1).join(' ') || '';

                dispatch(setUser({
                    ...response.user,
                    firstName,
                    lastName
                }));
            }

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
        <View className="flex-1 bg-white p-6 justify-center">
            <Box className="mb-8 items-center">
                <BrainCircuit size={80} color="#3B82F6" className="mr-2" />
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
                                    className="absolute right-3 top-2"
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

                <TouchableOpacity 
                    className="self-end mb-2" 
                    onPress={() => router.push('/forgot-password')}
                >
                    <Text className="text-primary-500 font-medium">Forgot Password?</Text>
                </TouchableOpacity>
            </VStack>

            <Button
                className="bg-[#3B82F6] mt-2"
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

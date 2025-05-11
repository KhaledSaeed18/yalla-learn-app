import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Entypo } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { signupServices } from '@/services/auth/signup.service';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
import { FormControl, FormControlError, FormControlErrorText, FormControlLabel } from '@/components/ui/form-control';
import { Button } from '@/components/ui/button';
import { BrainCircuit } from 'lucide-react-native';

const signUpSchema = yup.object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup
        .string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .max(64, 'Password cannot exceed 64 characters')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: yup.string()
        .required('Confirm password is required')
        .oneOf([yup.ref('password')], 'Passwords must match'),
});

type SignUpFormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export default function SignUp() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
        resolver: yupResolver(signUpSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
        }
    });

    const onSubmit = async (data: SignUpFormData) => {
        setIsLoading(true);
        try {
            await signupServices.signUp({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
            });

            router.push({
                pathname: '/verify-email',
                params: { email: data.email }
            });
        } catch (error: any) {
            console.error('Registration error:', error);
            Alert.alert(
                'Registration Failed',
                error.message || 'An error occurred during registration. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-background-50 p-6 justify-center">
            <Box className="mb-6 items-center">
                <BrainCircuit size={80} color="#3B82F6" className="mr-2" />
                <Heading size="xl" className="text-typography-900">Create Account</Heading>
                <Text className="text-typography-600 text-center mt-1">
                    Sign up to start your journey with us
                </Text>
            </Box>

            <VStack space="sm" className="mb-4">
                <HStack space="sm" className="w-full">
                    <FormControl isInvalid={!!errors.firstName} className="flex-1">
                        <FormControlLabel>
                            <Text className="text-typography-700 font-medium">First Name</Text>
                        </FormControlLabel>
                        <Controller
                            control={control}
                            name="firstName"
                            render={({ field: { onChange, value } }) => (
                                <Input>
                                    <InputField
                                        placeholder="Enter your first name"
                                        value={value}
                                        onChangeText={onChange}
                                        className="bg-background-0 border-background-200"
                                    />
                                </Input>
                            )}
                        />
                        {errors.firstName && (
                            <FormControlError>
                                <FormControlErrorText>{errors.firstName.message}</FormControlErrorText>
                            </FormControlError>
                        )}
                    </FormControl>

                    <FormControl isInvalid={!!errors.lastName} className="flex-1">
                        <FormControlLabel>
                            <Text className="text-typography-700 font-medium">Last Name</Text>
                        </FormControlLabel>
                        <Controller
                            control={control}
                            name="lastName"
                            render={({ field: { onChange, value } }) => (
                                <Input>
                                    <InputField
                                        placeholder="Enter your last name"
                                        value={value}
                                        onChangeText={onChange}
                                        className="bg-background-0 border-background-200"
                                    />
                                </Input>
                            )}
                        />
                        {errors.lastName && (
                            <FormControlError>
                                <FormControlErrorText>{errors.lastName.message}</FormControlErrorText>
                            </FormControlError>
                        )}
                    </FormControl>
                </HStack>

                <FormControl isInvalid={!!errors.email} className="mt-2">
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
                                    placeholder="Create a password"
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

                <FormControl isInvalid={!!errors.confirmPassword} className="mt-2">
                    <FormControlLabel>
                        <Text className="text-typography-700 font-medium">Confirm Password</Text>
                    </FormControlLabel>
                    <Controller
                        control={control}
                        name="confirmPassword"
                        render={({ field: { onChange, value } }) => (
                            <Input>
                                <InputField
                                    placeholder="Confirm your password"
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    value={value}
                                    onChangeText={onChange}
                                    className="bg-background-0 border-background-200"
                                />
                            </Input>
                        )}
                    />
                    {errors.confirmPassword && (
                        <FormControlError>
                            <FormControlErrorText>{errors.confirmPassword.message}</FormControlErrorText>
                        </FormControlError>
                    )}
                </FormControl>
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
                    <Text className="text-white font-bold">Create Account</Text>
                )}
            </Button>

            <HStack className="mt-6 justify-center">
                <Text className="text-typography-600">Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/signin')}>
                    <Text className="text-primary-500 font-semibold">Sign In</Text>
                </TouchableOpacity>
            </HStack>
        </View>
    );
}

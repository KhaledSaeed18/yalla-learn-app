import React, { useState } from 'react';
import { View, Alert, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'expo-router';
import { BrainCircuit } from 'lucide-react-native';
import { forgotPasswordServices } from '@/services/auth/forgotPassword.service';
import { Box } from '@/components/ui/box';
import { FormControl, FormControlLabel, FormControlError, FormControlErrorText } from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';

const forgotPasswordSchema = yup.object({
    email: yup.string().email('Enter a valid email').required('Email is required'),
});

type ForgotPasswordFormData = {
    email: string;
};

export default function ForgotPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
        resolver: yupResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        }
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);
        try {
            await forgotPasswordServices.forgotPassword({
                email: data.email,
            });

            router.push({
                pathname: '/reset-password',
                params: { email: data.email }
            });
        } catch (error: any) {
            console.error('Forgot password error:', error);
            Alert.alert(
                'Request Failed',
                error.message || 'An error occurred. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-background-50 p-6 justify-center">
            <Box className="mb-6 items-center">
                <BrainCircuit size={80} color="#3B82F6" className="mr-2" />
                <Heading size="xl" className="text-typography-900">Forgot Password</Heading>
                <Text className="text-typography-600 text-center mt-1">
                    Enter your email to receive a password reset code
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
                    <Text className="text-white font-medium">Send Reset Code</Text>
                )}
            </Button>

            <TouchableOpacity
                className="mt-6 items-center"
                onPress={() => router.back()}
            >
                <Text className="text-typography-600">Back to Sign In</Text>
            </TouchableOpacity>
        </View>
    );
}
import React, { useState } from 'react';
import { View, Alert, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { router } from 'expo-router';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { changePassword } from '@/services/auth/change-password.service';
import { Box } from '@/components/ui/box';
import { FormControl, FormControlLabel, FormControlError, FormControlErrorText } from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';

const changePasswordSchema = yup.object({
    oldPassword: yup.string()
        .required('Current password is required')
        .min(6, 'Password must be at least 6 characters'),
    newPassword: yup
        .string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .max(64, 'Password cannot exceed 64 characters')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
        .notOneOf([yup.ref('oldPassword')], 'New password must be different from current password'),
    confirmPassword: yup.string()
        .required('Confirm password is required')
        .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});

type ChangePasswordFormData = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};

export default function ChangePassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { control, handleSubmit, formState: { errors }, reset } = useForm<ChangePasswordFormData>({
        resolver: yupResolver(changePasswordSchema),
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        }
    });

    const onSubmit = async (data: ChangePasswordFormData) => {
        setIsLoading(true);
        try {
            await changePassword({
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
            });

            Alert.alert(
                'Success',
                'Your password has been changed successfully.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            reset();
                            router.back();
                        }
                    }
                ]
            );
        } catch (error: any) {
            console.error('Change password error:', error);
            Alert.alert(
                'Change Failed',
                error.message || 'An error occurred. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background-50">
            <View className="flex-1 p-6">
                {/* Header */}
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="mr-4"
                    >
                        <FontAwesome name="arrow-left" size={25} color="rgb(var(--color-primary-500))" />
                    </TouchableOpacity>
                    <Heading size="xl" className="text-typography-900">
                        <Text>Password & Security</Text>
                    </Heading>
                </View>

                <Box className="mb-6">
                    <Text className="text-typography-600 mb-4">
                        Update your password to keep your account secure. Use a strong password that you don't use for other websites.
                    </Text>
                </Box>

                <VStack space="md" className="mb-6">
                    <FormControl isInvalid={!!errors.oldPassword}>
                        <FormControlLabel>
                            <Text className="text-typography-700 font-medium">Current Password</Text>
                        </FormControlLabel>
                        <Controller
                            control={control}
                            name="oldPassword"
                            render={({ field: { onChange, value } }) => (
                                <Input>
                                    <InputField
                                        placeholder="Enter your current password"
                                        value={value}
                                        onChangeText={onChange}
                                        secureTextEntry={!showOldPassword}
                                        className="bg-background-0 border-background-200"
                                    />
                                    <TouchableOpacity
                                        className="absolute right-3 top-2"
                                        onPress={() => setShowOldPassword(!showOldPassword)}
                                    >
                                        <Entypo name={showOldPassword ? "eye" : "eye-with-line"} size={20} color="#666" />
                                    </TouchableOpacity>
                                </Input>
                            )}
                        />
                        {errors.oldPassword && (
                            <FormControlError>
                                <FormControlErrorText>{errors.oldPassword.message}</FormControlErrorText>
                            </FormControlError>
                        )}
                    </FormControl>

                    <FormControl isInvalid={!!errors.newPassword}>
                        <FormControlLabel>
                            <Text className="text-typography-700 font-medium">New Password</Text>
                        </FormControlLabel>
                        <Controller
                            control={control}
                            name="newPassword"
                            render={({ field: { onChange, value } }) => (
                                <Input>
                                    <InputField
                                        placeholder="Enter your new password"
                                        value={value}
                                        onChangeText={onChange}
                                        secureTextEntry={!showNewPassword}
                                        className="bg-background-0 border-background-200"
                                    />
                                    <TouchableOpacity
                                        className="absolute right-3 top-2"
                                        onPress={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        <Entypo name={showNewPassword ? "eye" : "eye-with-line"} size={20} color="#666" />
                                    </TouchableOpacity>
                                </Input>
                            )}
                        />
                        {errors.newPassword && (
                            <FormControlError>
                                <FormControlErrorText>{errors.newPassword.message}</FormControlErrorText>
                            </FormControlError>
                        )}
                    </FormControl>

                    <FormControl isInvalid={!!errors.confirmPassword}>
                        <FormControlLabel>
                            <Text className="text-typography-700 font-medium">Confirm New Password</Text>
                        </FormControlLabel>
                        <Controller
                            control={control}
                            name="confirmPassword"
                            render={({ field: { onChange, value } }) => (
                                <Input>
                                    <InputField
                                        placeholder="Confirm your new password"
                                        value={value}
                                        onChangeText={onChange}
                                        secureTextEntry={!showConfirmPassword}
                                        className="bg-background-0 border-background-200"
                                    />
                                    <TouchableOpacity
                                        className="absolute right-3 top-2"
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        <Entypo name={showConfirmPassword ? "eye" : "eye-with-line"} size={20} color="#666" />
                                    </TouchableOpacity>
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
                    className="bg-[#3B82F6] mt-4"
                    size="lg"
                    onPress={handleSubmit(onSubmit)}
                    isDisabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-medium">Update Password</Text>
                    )}
                </Button>
            </View>
        </SafeAreaView>
    );
}

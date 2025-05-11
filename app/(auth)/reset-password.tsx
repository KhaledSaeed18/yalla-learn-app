import React, { useState, useRef, useEffect } from 'react';
import { View, Alert, TouchableOpacity, ActivityIndicator, TextInput, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BrainCircuit } from 'lucide-react-native';
import { Entypo } from '@expo/vector-icons';
import { resetPasswordServices } from '@/services/auth/resetPassword.service';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { FormControl, FormControlLabel, FormControlError, FormControlErrorText } from '@/components/ui/form-control';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
import { Button } from '@/components/ui/button';

const resetPasswordSchema = yup.object({
    email: yup.string().email('Enter a valid email').required('Email is required'),
    code: yup.string()
        .required('Verification code is required')
        .length(6, 'Verification code must be 6 digits')
        .matches(/^\d+$/, 'Verification code must contain only numbers'),
    newPassword: yup.string()
        .required('New password is required')
        .min(6, 'Password must be at least 6 characters'),
    confirmPassword: yup.string()
        .required('Confirm password is required')
        .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});

type ResetPasswordFormData = {
    email: string;
    code: string;
    newPassword: string;
    confirmPassword: string;
};

export default function ResetPassword() {
    const { email } = useLocalSearchParams<{ email: string }>();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
    const [validationError, setValidationError] = useState<string | null>(null);
    const inputRefs = useRef<Array<any>>([]);
    const router = useRouter();

    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, 6);
    }, []);

    const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<ResetPasswordFormData>({
        resolver: yupResolver(resetPasswordSchema),
        defaultValues: {
            email: email || '',
            code: '',
            newPassword: '',
            confirmPassword: '',
        }
    });

    const handleCodeChange = (text: string, index: number) => {
        if (text.length > 1) {
            text = text[0];
        }

        const newCode = [...verificationCode];
        newCode[index] = text;
        setVerificationCode(newCode);

        if (validationError) {
            setValidationError(null);
        }

        if (text && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Update the code field in the form
        setValue('code', newCode.join(''), { shouldValidate: true });
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !verificationCode[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const onSubmit = async (data: ResetPasswordFormData) => {
        setIsLoading(true);
        try {
            await resetPasswordServices.resetPassword({
                email: data.email,
                code: data.code,
                newPassword: data.newPassword,
            });

            Alert.alert(
                'Success',
                'Your password has been reset successfully.',
                [
                    {
                        text: 'Sign In',
                        onPress: () => router.replace('/signin')
                    }
                ]
            );
        } catch (error: any) {
            console.error('Reset password error:', error);
            Alert.alert(
                'Reset Failed',
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
                <Heading size="xl" className="text-typography-900">Reset Password</Heading>
                <Text className="text-typography-600 text-center mt-1">
                    Enter the verification code and your new password
                </Text>
            </Box>

            {validationError && (
                <Text className="text-red-500 text-center mb-4">{validationError}</Text>
            )}

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
                                    editable={!email} // Make it non-editable if email is passed as param
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

                <FormControl isInvalid={!!errors.code}>
                    <FormControlLabel>
                        <Text className="text-typography-700 font-medium">Verification Code</Text>
                    </FormControlLabel>
                    <HStack space="xs" className="justify-between my-2">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                            <Input key={index} className="w-14">
                                <InputField
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    maxLength={1}
                                    keyboardType="number-pad"
                                    value={verificationCode[index]}
                                    onChangeText={(text) => handleCodeChange(text, index)}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                    className="w-12 h-14 border border-background-300 rounded-md text-center text-2xl bg-background-0"
                                />
                            </Input>
                        ))}
                    </HStack>
                    {errors.code && (
                        <FormControlError>
                            <FormControlErrorText>{errors.code.message}</FormControlErrorText>
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
                                    placeholder="Enter new password"
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
                    {errors.newPassword && (
                        <FormControlError>
                            <FormControlErrorText>{errors.newPassword.message}</FormControlErrorText>
                        </FormControlError>
                    )}
                </FormControl>

                <FormControl isInvalid={!!errors.confirmPassword}>
                    <FormControlLabel>
                        <Text className="text-typography-700 font-medium">Confirm Password</Text>
                    </FormControlLabel>
                    <Controller
                        control={control}
                        name="confirmPassword"
                        render={({ field: { onChange, value } }) => (
                            <Input>
                                <InputField
                                    placeholder="Confirm new password"
                                    secureTextEntry={!showConfirmPassword}
                                    autoCapitalize="none"
                                    value={value}
                                    onChangeText={onChange}
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
                className="bg-[#3B82F6] mt-2"
                size="lg"
                onPress={handleSubmit(onSubmit)}
                isDisabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white font-medium">Reset Password</Text>
                )}
            </Button>

            <TouchableOpacity
                className="mt-6 items-center"
                onPress={() => router.back()}
            >
                <Text className="text-typography-600">Back to Previous Screen</Text>
            </TouchableOpacity>
        </View>
    );
}
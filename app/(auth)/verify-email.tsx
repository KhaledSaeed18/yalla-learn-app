import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { verifyEmailServices } from '@/services/auth/verifyEmail.service';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Button } from '@/components/ui/button';

export default function VerifyEmail() {
    const { email } = useLocalSearchParams<{ email: string }>();
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<Array<TextInput | null>>([]);

    // Setup input refs
    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, 6);
    }, []);

    // Handle text change in code inputs
    const handleCodeChange = (text: string, index: number) => {
        if (text.length > 1) {
            text = text[0]; // Only take the first character if multiple are pasted
        }

        const newCode = [...verificationCode];
        newCode[index] = text;
        setVerificationCode(newCode);

        // Auto move to next input
        if (text && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handle backspace key
    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !verificationCode[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Verify email with code
    const verifyEmail = async () => {
        const code = verificationCode.join('');
        if (code.length !== 6) {
            Alert.alert('Invalid Code', 'Please enter the complete 6-digit verification code.');
            return;
        }

        setIsLoading(true);
        try {
            await verifyEmailServices.verifyEmail({
                email: email || '',
                code: code
            });

            Alert.alert(
                'Success',
                'Your email has been verified successfully.',
                [
                    {
                        text: 'Sign In',
                        onPress: () => router.replace('/signin')
                    }
                ]
            );
        } catch (error: any) {
            console.error('Verification error:', error);
            Alert.alert(
                'Verification Failed',
                error.message || 'An error occurred during verification. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Resend verification code
    const resendCode = async () => {
        if (!email) {
            Alert.alert('Error', 'Email address is missing. Please go back and try again.');
            return;
        }

        setIsResending(true);
        try {
            await verifyEmailServices.resendVerification({ email });
            Alert.alert('Success', 'A new verification code has been sent to your email.');
        } catch (error: any) {
            console.error('Resend error:', error);
            Alert.alert(
                'Failed to Resend',
                error.message || 'An error occurred. Please try again.'
            );
        } finally {
            setIsResending(false);
        }
    };

    return (
        <View className="flex-1 bg-background-50 p-6 justify-center">
            <Box className="mb-8 items-center">
                {/* <Image
                    source={require('@/assets/images/logo.png')}
                    className="w-20 h-20 mb-4"
                    resizeMode="contain"
                /> */}
                <Heading size="xl" className="text-typography-900">Verify Your Email</Heading>
                <Text className="text-typography-600 text-center mt-2 px-4">
                    We've sent a 6-digit verification code to{' '}
                    <Text className="font-semibold">{email || 'your email'}</Text>
                </Text>
            </Box>

            <VStack space="md" className="mb-6">
                <HStack className="justify-between mb-4 px-1">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => inputRefs.current[index] = ref}
                            className="w-12 h-14 border border-background-300 rounded-md text-center text-2xl bg-background-0"
                            maxLength={1}
                            keyboardType="number-pad"
                            value={verificationCode[index]}
                            onChangeText={(text) => handleCodeChange(text, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                        />
                    ))}
                </HStack>

                <Button
                    className="bg-primary-500 mt-4"
                    size="lg"
                    onPress={verifyEmail}
                    isDisabled={isLoading || verificationCode.join('').length !== 6}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold">Verify Email</Text>
                    )}
                </Button>
            </VStack>

            <HStack className="mt-2 justify-center">
                <Text className="text-typography-600">Didn't receive the code? </Text>
                <TouchableOpacity onPress={resendCode} disabled={isResending}>
                    <Text className="text-primary-500 font-semibold">
                        {isResending ? 'Sending...' : 'Resend'}
                    </Text>
                </TouchableOpacity>
            </HStack>

            <TouchableOpacity
                className="mt-6 items-center"
                onPress={() => router.back()}
            >
                <Text className="text-typography-700">Go Back</Text>
            </TouchableOpacity>
        </View>
    );
}

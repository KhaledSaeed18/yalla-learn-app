import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { User } from '@/types/service/user.types';
import { updateProfile, getCurrentUserProfile } from '@/services/user.service';
import { Button } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { FormControl, FormControlLabel, FormControlHelperText } from '@/components/ui/form-control';

export default function EditProfileScreen() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<Partial<User>>({
        firstName: '',
        lastName: '',
        email: '',
        bio: '',
        location: '',
        phoneNumber: '',
    });

    useEffect(() => {
        // Fetch user profile when component mounts
        const fetchUserProfile = async () => {
            setIsLoading(true);
            try {
                const userData = await getCurrentUserProfile();
                setCurrentUser(userData);
                setFormData({
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    email: userData.email || '',
                    bio: userData.bio || '',
                    location: userData.location || '',
                    phoneNumber: userData.phoneNumber || '',
                });
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load profile');
                console.error('Error fetching user profile:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Update the profile directly using the API service
            const updatedUser = await updateProfile(formData);

            // Update local state with the response from API
            setCurrentUser(updatedUser);

            Alert.alert('Success', 'Profile updated successfully');
            router.back();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
            setError(errorMessage);
            Alert.alert('Error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !currentUser) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-background-0">
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    if (!currentUser) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-background-0">
                <Text>User not found. Please login first.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background-0">
            <ScrollView className="flex-1 px-4">
                <View className="flex-row items-center my-4">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4">
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Heading size="xl" className="text-typography-900">Edit Profile</Heading>
                </View>

                <VStack space="md" className="mt-4">
                    <FormControl>
                        <FormControlLabel>
                            <Text className="text-typography-600">First Name</Text>
                        </FormControlLabel>
                        <Input>
                            <InputField
                                placeholder="Enter first name"
                                value={formData.firstName}
                                onChangeText={(text) => handleChange('firstName', text)}
                                className="bg-background-0 border-background-200"
                            />
                        </Input>
                    </FormControl>

                    <FormControl>
                        <FormControlLabel>
                            <Text className="text-typography-600">Last Name</Text>
                        </FormControlLabel>
                        <Input>
                            <InputField
                                placeholder="Enter last name"
                                value={formData.lastName}
                                onChangeText={(text) => handleChange('lastName', text)}
                                className="bg-background-0 border-background-200"
                            />
                        </Input>
                    </FormControl>

                    <FormControl>
                        <FormControlLabel>
                            <Text className="text-typography-600">Email</Text>
                        </FormControlLabel>
                        <Input>
                            <InputField
                                placeholder="Enter email"
                                value={formData.email}
                                onChangeText={(text) => handleChange('email', text)}
                                editable={false}
                                className="bg-background-100 border-background-200"
                            />
                        </Input>
                        <FormControlHelperText>
                            <Text className="text-typography-500">Email cannot be changed</Text>
                        </FormControlHelperText>
                    </FormControl>

                    <FormControl>
                        <FormControlLabel>
                            <Text className="text-typography-600">Phone Number</Text>
                        </FormControlLabel>
                        <Input>
                            <InputField
                                placeholder="Enter phone number"
                                value={formData.phoneNumber || ''}
                                onChangeText={(text) => handleChange('phoneNumber', text)}
                                className="bg-background-0 border-background-200"
                            />
                        </Input>
                    </FormControl>

                    <FormControl>
                        <FormControlLabel>
                            <Text className="text-typography-600">Bio</Text>
                        </FormControlLabel>
                        <Input>
                            <InputField
                                placeholder="Tell us about yourself"
                                value={formData.bio || ''}
                                onChangeText={(text) => handleChange('bio', text)}
                                multiline
                                numberOfLines={4}
                                className="bg-background-0 border-background-200 pt-2"
                                textAlignVertical="top"
                            />
                        </Input>
                    </FormControl>

                    <FormControl>
                        <FormControlLabel>
                            <Text className="text-typography-600">Location</Text>
                        </FormControlLabel>
                        <Input>
                            <InputField
                                placeholder="Enter your location"
                                value={formData.location || ''}
                                onChangeText={(text) => handleChange('location', text)}
                                className="bg-background-0 border-background-200"
                            />
                        </Input>
                    </FormControl>

                    <View className="my-6">
                        <Button
                            onPress={handleSubmit}
                            disabled={isLoading}
                            className="bg-primary-600 py-3"
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white font-semibold">Update Profile</Text>
                            )}
                        </Button>
                    </View>

                    {error && (
                        <Text className="text-red-500 mt-2">{error}</Text>
                    )}
                </VStack>
            </ScrollView>
        </SafeAreaView>
    );
}

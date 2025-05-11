import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateUserProfile } from '@/redux/slices/userSlice';
import { User } from '@/types/service/user.types';
import { Button } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { FormControl, FormControlLabel, FormControlHelperText } from '@/components/ui/form-control';

export default function EditProfileScreen() {
    const dispatch = useAppDispatch();
    const { currentUser, isLoading, error } = useAppSelector(state => state.user);

    const [formData, setFormData] = useState<Partial<User>>({
        firstName: '',
        lastName: '',
        email: '',
        bio: '',
        location: '',
        phoneNumber: '',
    });

    useEffect(() => {
        if (currentUser) {
            setFormData({
                firstName: currentUser.firstName || '',
                lastName: currentUser.lastName || '',
                email: currentUser.email || '',
                bio: currentUser.bio || '',
                location: currentUser.location || '',
                phoneNumber: currentUser.phoneNumber || '',
            });
        }
    }, [currentUser]);

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        try {
            await dispatch(updateUserProfile(formData)).unwrap();
            Alert.alert('Success', 'Profile updated successfully');
            router.back();
        } catch (error) {
            Alert.alert('Error', error as string);
        }
    };

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
                            <Text className="text-typography-400">Email cannot be changed</Text>
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
                            <Text className="text-typography-600">Location</Text>
                        </FormControlLabel>
                        <Input>
                            <InputField
                                placeholder="Enter location"
                                value={formData.location || ''}
                                onChangeText={(text) => handleChange('location', text)}
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
                                textAlignVertical="top"
                                className="h-24 pt-2 bg-background-0 border-background-200"
                            />
                        </Input>
                    </FormControl>

                    <Button
                        className="mt-6 bg-primary-500"
                        onPress={handleSubmit}
                        isDisabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text className="text-white font-medium">Save Changes</Text>
                        )}
                    </Button>
                </VStack>
            </ScrollView>
        </SafeAreaView>
    );
}

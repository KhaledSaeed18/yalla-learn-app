import React, { useEffect, useState, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { User } from '@/types/service/user.types';
import { updateProfile, getCurrentUserProfile, uploadAvatar } from '@/services/user.service';
import { Button } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { useAppDispatch } from '@/redux/hooks';
import { setUser } from '@/redux/slices/userSlice';
import { FormControl, FormControlLabel, FormControlHelperText } from '@/components/ui/form-control';
import * as ImagePicker from 'expo-image-picker';
import { Actionsheet, ActionsheetContent, ActionsheetItem, ActionsheetItemText, ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper, ActionsheetBackdrop } from "@/components/ui/actionsheet";

export default function EditProfileScreen() {
    const dispatch = useAppDispatch();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [originalData, setOriginalData] = useState<Partial<User>>({});
    const [imagePickerOpen, setImagePickerOpen] = useState(false);

    const [formData, setFormData] = useState<Partial<User>>({
        firstName: '',
        lastName: '',
        email: '',
        bio: '',
        location: '',
        phoneNumber: '',
        avatar: '',
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            setIsLoading(true);
            try {
                const userData = await getCurrentUserProfile();
                setCurrentUser(userData);
                const initialFormData = {
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    email: userData.email || '',
                    bio: userData.bio || '',
                    location: userData.location || '',
                    phoneNumber: userData.phoneNumber || '',
                    avatar: userData.avatar || '',
                };
                setFormData(initialFormData);
                setOriginalData(initialFormData);
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

    const requestCameraPermission = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Camera permission is required to take photos.');
            return false;
        }
        return true;
    };

    const requestMediaLibraryPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Media library permission is required to select photos.');
            return false;
        }
        return true;
    };

    const takePhoto = async () => {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) return;

        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const newImage = result.assets[0];
                handleChange('avatar', newImage.uri);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert('Error', 'Failed to take photo');
        }
    };

    const pickImage = async () => {
        const hasPermission = await requestMediaLibraryPermission();
        if (!hasPermission) return;

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const newImage = result.assets[0];
                handleChange('avatar', newImage.uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const handleAddImage = () => {
        setImagePickerOpen(true);
    };

    const removeAvatar = () => {
        handleChange('avatar', '');
    };

    const hasChanges = useMemo(() => {
        if (!originalData) return false;

        return (
            formData.firstName !== originalData.firstName ||
            formData.lastName !== originalData.lastName ||
            formData.bio !== originalData.bio ||
            formData.location !== originalData.location ||
            formData.phoneNumber !== originalData.phoneNumber ||
            formData.avatar !== originalData.avatar
        );
    }, [formData, originalData]);

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);
        try {
            let updatedData = { ...formData };

            // Upload avatar if it has changed and is not empty
            if (formData.avatar && formData.avatar !== originalData.avatar) {
                setIsUploading(true);
                const avatarUrl = await uploadAvatar(formData.avatar);
                setIsUploading(false);
                updatedData.avatar = avatarUrl;
            }

            const updatedUser = await updateProfile(updatedData);

            setCurrentUser(updatedUser);
            setOriginalData({
                firstName: updatedUser.firstName || '',
                lastName: updatedUser.lastName || '',
                email: updatedUser.email || '',
                bio: updatedUser.bio || '',
                location: updatedUser.location || '',
                phoneNumber: updatedUser.phoneNumber || '',
                avatar: updatedUser.avatar || '',
            });

            dispatch(setUser(updatedUser));

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
                        <FontAwesome name="arrow-left" size={25} color="rgb(var(--color-primary-500))" />
                    </TouchableOpacity>
                    <Heading size="xl" className="text-typography-900">Edit Profile</Heading>
                </View>

                <VStack space="md" className="mt-4">
                    {/* Avatar Upload Section */}
                    <View className="items-center mb-4">
                        <FormControlLabel>
                            <Text className="text-typography-600 mb-2">Profile Picture</Text>
                        </FormControlLabel>

                        <TouchableOpacity onPress={handleAddImage}>
                            {formData.avatar ? (
                                <View className="relative">
                                    <Image
                                        source={{ uri: formData.avatar }}
                                        className="w-28 h-28 rounded-full"
                                        resizeMode="cover"
                                    />
                                    <TouchableOpacity
                                        className="absolute top-0 right-0 bg-black bg-opacity-70 rounded-full p-1.5"
                                        onPress={removeAvatar}
                                    >
                                        <FontAwesome name="times" size={16} color="white" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        className="absolute bottom-0 right-0 bg-primary-500 rounded-full p-2"
                                        onPress={handleAddImage}
                                    >
                                        <FontAwesome name="camera" size={14} color="white" />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View className="w-28 h-28 rounded-full bg-background-100 border-2 border-dashed border-primary-500 items-center justify-center">
                                    <FontAwesome name="user" size={40} color="rgb(var(--color-primary-400))" />
                                    <Text className="text-primary-500 text-center text-xs mt-2">Add Profile Picture</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

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
                            disabled={isLoading || !hasChanges}
                            className={`py-3 ${hasChanges ? 'bg-primary-600' : 'bg-primary-400'}`}
                        >
                            {isLoading ? (
                                <View className="flex-row items-center">
                                    <ActivityIndicator color="white" size="small" />
                                    <Text className="text-white font-semibold ml-2">
                                        {isUploading ? 'Uploading Image...' : 'Updating Profile...'}
                                    </Text>
                                </View>
                            ) : (
                                <Text className="text-white font-semibold">Update Profile</Text>
                            )}
                        </Button>
                        {!hasChanges && (
                            <Text className="text-typography-500 text-center mt-2">No changes to update</Text>
                        )}
                    </View>

                    {error && (
                        <Text className="text-red-500 mt-2">{error}</Text>
                    )}
                </VStack>
            </ScrollView>

            {/* Image picker action sheet */}
            <Actionsheet isOpen={imagePickerOpen} onClose={() => setImagePickerOpen(false)}>
                <ActionsheetBackdrop />
                <ActionsheetContent>
                    <ActionsheetDragIndicatorWrapper>
                        <ActionsheetDragIndicator />
                    </ActionsheetDragIndicatorWrapper>
                    <ActionsheetItem
                        onPress={() => {
                            setImagePickerOpen(false);
                            setTimeout(takePhoto, 500);
                        }}
                    >
                        <View className="flex-row items-center">
                            <FontAwesome name="camera" size={24} color="rgb(var(--color-primary-500))" />
                            <ActionsheetItemText className="ml-4">Take a photo</ActionsheetItemText>
                        </View>
                    </ActionsheetItem>

                    <ActionsheetItem
                        onPress={() => {
                            setImagePickerOpen(false);
                            setTimeout(pickImage, 500);
                        }}
                    >
                        <View className="flex-row items-center">
                            <FontAwesome name="image" size={24} color="rgb(var(--color-primary-500))" />
                            <ActionsheetItemText className="ml-4">Choose from gallery</ActionsheetItemText>
                        </View>
                    </ActionsheetItem>

                    <ActionsheetItem onPress={() => setImagePickerOpen(false)}>
                        <ActionsheetItemText className="text-center">Cancel</ActionsheetItemText>
                    </ActionsheetItem>
                </ActionsheetContent>
            </Actionsheet>
        </SafeAreaView>
    );
}

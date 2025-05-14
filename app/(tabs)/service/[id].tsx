import React, { useState, useCallback } from 'react';
import { View, ScrollView, ActivityIndicator, Pressable, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { serviceService } from '@/services/service.service';
import { ServiceResponse } from '@/types/service/service.types';
import { ServiceDirection } from '@/types/enums';
import { Box } from '@/components/ui/box';
import { Calendar, User, Tag } from 'lucide-react-native';
import { formatCurrency } from '@/lib/utils';
import { FontAwesome } from '@expo/vector-icons';
import { useAppSelector } from '@/redux/hooks';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';

const ServiceDetailScreen = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [service, setService] = useState<ServiceResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isOwner, setIsOwner] = useState(false);

    const currentUser = useAppSelector(state => state.user.currentUser);

    const fetchServiceDetails = useCallback(async () => {
        if (!id) {
            setError('Service ID is missing');
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await serviceService.getServiceById(id) as any;
            setService(response.data.service);

            if (currentUser && response.data.service.user && response.data.service.user.id === currentUser.id) {
                setIsOwner(true);
            } else {
                setIsOwner(false);
            }

            setError(null);
        } catch (err) {
            console.error('Error fetching service details:', err);
            setError('Failed to load service details');
        } finally {
            setLoading(false);
        }
    }, [id, currentUser]);

    useFocusEffect(
        useCallback(() => {
            console.log('Service screen focused, fetching data...');
            fetchServiceDetails();

            return () => {
                console.log('Service screen blurred');
            };
        }, [fetchServiceDetails])
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="mt-3 text-gray-500">Loading service details...</Text>
            </View>
        );
    }

    if (error || !service) {
        return (
            <View className="flex-1 justify-center items-center bg-white p-4">
                <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
                    <Text className="text-red-500 text-2xl">!</Text>
                </View>
                <Text className="text-gray-800 font-medium text-lg text-center">
                    {error || 'Service not found'}
                </Text>
                <Pressable
                    className="mt-6 py-3 px-6 bg-blue-500 rounded-lg"
                    onPress={() => router.back()}
                >
                    <Text className="text-white font-medium">Go Back</Text>
                </Pressable>
            </View>
        );
    }

    const isOffering = service.direction === ServiceDirection.OFFERING;
    const formatCategory = (category: string): string => {
        return category
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-white">
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <ScrollView className="flex-1">
                {/* Header with back button */}
                <View className={`w-full h-2 ${isOffering ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <View className="p-4 flex-row items-center">
                    <Pressable onPress={() => router.back()} className="p-2 mr-2">
                        <FontAwesome name="arrow-left" size={25} color="rgb(var(--color-primary-500))" />
                    </Pressable>
                    <Heading size="lg">Service Details</Heading>
                </View>

                {/* Main content */}
                <View className="px-5 pb-24">
                    {/* Title and Service Type */}
                    <View className="mb-4">
                        <View className="flex-row justify-between items-start mb-2">
                            <View className="flex-1 pr-2">
                                <Heading size="xl" className="mb-2">{service.title}</Heading>
                                <View className={`px-3 py-1.5 rounded-full self-start ${isOffering ? 'bg-emerald-100' : 'bg-amber-100'
                                    }`}>
                                    <Text className={`font-medium ${isOffering ? 'text-emerald-700' : 'text-amber-700'
                                        }`}>
                                        {isOffering ? 'Offering' : 'Requesting'}
                                    </Text>
                                </View>
                            </View>

                            {service.price !== null && (
                                <View className="bg-blue-50 px-4 py-3 rounded-xl">
                                    <Text className="text-blue-600 font-bold text-xl">
                                        {formatCurrency(service.price || 0)}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Service Information Card */}
                    <Box className="rounded-xl mb-6">
                        {/* Category */}
                        <View className="flex-row items-center p-4 border-b border-gray-100">
                            <Tag size={20} color="#6B7280" />
                            <View className="ml-3">
                                <Text className="text-gray-500 text-sm">Category</Text>
                                <Text className="text-gray-800 font-medium">
                                    {formatCategory(service.category)}
                                </Text>
                            </View>
                        </View>

                        {/* Created Date */}
                        <View className="flex-row items-center p-4 border-b border-gray-100">
                            <Calendar size={20} color="#6B7280" />
                            <View className="ml-3">
                                <Text className="text-gray-500 text-sm">Posted On</Text>
                                <Text className="text-gray-800 font-medium">
                                    {formatDate(service.createdAt)}
                                </Text>
                            </View>
                        </View>

                        {/* Direction */}
                        <View className="flex-row items-center p-4">
                            <User size={20} color="#6B7280" />
                            <View className="ml-3">
                                <Text className="text-gray-500 text-sm">Type</Text>
                                <Text className="text-gray-800 font-medium">
                                    {isOffering ? 'Service Offering' : 'Service Request'}
                                </Text>
                            </View>
                        </View>
                    </Box>

                    {/* Description */}
                    <View className="mb-6">
                        <Heading size="md" className="mb-3">Description</Heading>
                        <Box className="p-4 rounded-xl">
                            <Text className="text-gray-700 leading-6">
                                {service.description}
                            </Text>
                        </Box>
                    </View>

                    {/* Provider/Requester Information */}
                    {service.user && (
                        <View className="mb-6">
                            <Heading size="md" className="mb-2">
                                {isOffering ? 'Provider Information' : 'Requester Information'}
                            </Heading>
                            <Box className="p-4 bg-gray-50 rounded-lg">
                                <View className="flex-row items-center mb-3">
                                    {service.user.avatar ? (
                                        <Image
                                            source={{ uri: service.user.avatar }}
                                            className="w-12 h-12 rounded-full mr-4"
                                            alt="User avatar"
                                        />
                                    ) : (
                                        <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
                                            <Text className="text-blue-500 font-bold">
                                                {service.user.firstName?.charAt(0)}{service.user.lastName?.charAt(0)}
                                            </Text>
                                        </View>
                                    )}
                                    <View>
                                        <Text className="font-medium text-base">
                                            {service.user.firstName} {service.user.lastName}
                                        </Text>
                                        <Text className="text-gray-600 text-sm">
                                            {service.user.email}
                                        </Text>
                                    </View>
                                </View>
                                <View className="mt-2">
                                    {service.user.location && (
                                        <View className="flex-row items-center mt-2">
                                            <FontAwesome name="map-marker" size={16} color="#6B7280" className="mr-2" />
                                            <Text className="text-gray-700 ml-2">
                                                {service.user.location}
                                            </Text>
                                        </View>
                                    )}
                                    {service.user.phoneNumber && (
                                        <View className="flex-row items-center mt-2">
                                            <FontAwesome name="phone" size={16} color="#6B7280" className="mr-2" />
                                            <Text className="text-gray-700 ml-2">
                                                {service.user.phoneNumber}
                                            </Text>
                                        </View>
                                    )}
                                    <Text className="text-gray-700 mt-2">
                                        Posted: {formatDate(service.createdAt)}
                                    </Text>
                                    <Text className="text-gray-700 mt-1">
                                        Last Updated: {formatDate(service.updatedAt)}
                                    </Text>
                                </View>
                            </Box>
                        </View>
                    )}

                    {/* Contact buttons - only shown if user is not the owner and user info exists */}
                    {!isOwner && service.user && (
                        <View className="flex-row justify-between space-x-2 mb-6">
                            {/* Call button - only shown if user has phone number */}
                            {service.user?.phoneNumber && (
                                <Button
                                    className="flex-1 bg-green-500 rounded-lg flex-row items-center justify-center"
                                    onPress={() => {
                                        if (service.user?.phoneNumber) {
                                            Linking.openURL(`tel:${service.user.phoneNumber}`);
                                        }
                                    }}
                                >
                                    <FontAwesome name="phone" size={16} color="#fff" />
                                    <Text className="text-white font-medium ml-2">Call</Text>
                                </Button>
                            )}

                            {/* Email button */}
                            <Button
                                className="flex-1 bg-orange-500 rounded-lg flex-row items-center justify-center mx-2"
                                onPress={() => {
                                    if (service.user?.email) {
                                        const firstName = service.user?.firstName || 'there';
                                        Linking.openURL(`mailto:${service.user.email}?subject=Regarding your ${isOffering ? 'service' : 'request'}: ${service.title}&body=Hello ${firstName},\n\nI'm interested in your ${isOffering ? 'service' : 'service request'} "${service.title}"${service.price ? ` priced at ${formatCurrency(service.price)}` : ''}.\n\nPlease let me know if you're still ${isOffering ? 'providing this service' : 'looking for help'}.\n\nThanks!`);
                                    }
                                }}
                            >
                                <FontAwesome name="envelope" size={16} color="#fff" />
                                <Text className="text-white font-medium ml-2">Email</Text>
                            </Button>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ServiceDetailScreen;

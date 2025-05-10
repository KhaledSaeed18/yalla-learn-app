import React, { useState, useCallback } from 'react';
import { View, ScrollView, ActivityIndicator, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { serviceService } from '@/services/service.service';
import { ServiceResponse } from '@/types/service/service.types';
import { ServiceDirection } from '@/types/enums';
import { Box } from '@/components/ui/box';
import { ArrowLeft, Clock, Calendar, User, Tag } from 'lucide-react-native';
import { formatCurrency } from '@/lib/utils';

const ServiceDetailScreen = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [service, setService] = useState<ServiceResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
            setError(null);
        } catch (err) {
            console.error('Error fetching service details:', err);
            setError('Failed to load service details');
        } finally {
            setLoading(false);
        }
    }, [id]);

    // Use useFocusEffect to refetch data every time the screen comes into focus
    useFocusEffect(
        useCallback(() => {
            console.log('Service screen focused, fetching data...');
            fetchServiceDetails();

            // Return a cleanup function (optional)
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
                        <ArrowLeft size={24} color="#333" />
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

                        {/* Posted By */}
                        <View className="flex-row items-center p-4 border-b border-gray-100">
                            <User size={20} color="#6B7280" />
                            <View className="ml-3">
                                <Text className="text-gray-500 text-sm">Posted By</Text>
                                <Text className="text-gray-800 font-medium">
                                    {service.user?.firstName} {service.user?.lastName}
                                </Text>
                            </View>
                        </View>

                        {/* Posted Date */}
                        <View className="flex-row items-center p-4 border-b border-gray-100">
                            <Calendar size={20} color="#6B7280" />
                            <View className="ml-3">
                                <Text className="text-gray-500 text-sm">Posted On</Text>
                                <Text className="text-gray-800 font-medium">
                                    {formatDate(service.createdAt)}
                                </Text>
                            </View>
                        </View>

                        {/* Last Updated */}
                        <View className="flex-row items-center p-4">
                            <Clock size={20} color="#6B7280" />
                            <View className="ml-3">
                                <Text className="text-gray-500 text-sm">Last Updated</Text>
                                <Text className="text-gray-800 font-medium">
                                    {formatDate(service.updatedAt)}
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

                    {/* Contact Button */}
                    <Pressable
                        className={`py-4 px-6 rounded-xl flex-row justify-center items-center ${isOffering ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                        onPress={() => {
                            // This will be implemented in the future for contacting the service provider
                            // For now, we'll just show an alert
                            Alert.alert(
                                isOffering ? 'Contact Provider' : 'Offer Help',
                                `You're attempting to ${isOffering ? 'contact the provider' : 'offer help'} for this service.`,
                                [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
                            );
                        }}
                    >
                        <Text className="text-white font-semibold text-lg mr-2">
                            {isOffering ? 'Contact Provider' : 'Offer Help'}
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ServiceDetailScreen;

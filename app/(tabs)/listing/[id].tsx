import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, ActivityIndicator, Pressable, Text, Linking } from 'react-native';
import { Stack, useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { Heading } from '@/components/ui/heading';
import { Box } from '@/components/ui/box';
import { productService } from '@/services/product.service';
import { ListingResponse } from '@/types/service/product.types';
import { Image } from '@/components/ui/image';
import { formatCurrency } from '@/lib/utils';
import { FontAwesome } from '@expo/vector-icons';
import { useAppSelector } from '@/redux/hooks';
import { Button } from '@/components/ui/button';

const ListingDetailScreen = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [listing, setListing] = useState<ListingResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isOwner, setIsOwner] = useState(false);

    const currentUser = useAppSelector(state => state.user.currentUser);

    const fetchListingDetails = useCallback(async () => {
        if (!id) {
            setError('Listing ID is missing');
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await productService.getListingById(id);
            setListing(response.data.listing);

            if (currentUser && response.data.listing.user.id === currentUser.id) {
                setIsOwner(true);
            } else {
                setIsOwner(false);
            }

            setError(null);
        } catch (err) {
            console.error('Error fetching listing details:', err);
            setError('Failed to load listing details');
        } finally {
            setLoading(false);
        }
    }, [id, currentUser]);

    useFocusEffect(
        useCallback(() => {
            fetchListingDetails();
        }, [fetchListingDetails])
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCategory = (category: string): string => {
        return category
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const handlePrevImage = () => {
        if (listing && listing.images.length > 0) {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === 0 ? listing.images.length - 1 : prevIndex - 1
            );
        }
    };

    const handleNextImage = () => {
        if (listing && listing.images.length > 0) {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === listing.images.length - 1 ? 0 : prevIndex + 1
            );
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="mt-3 text-gray-500">Loading listing details...</Text>
            </View>
        );
    }

    if (error || !listing) {
        return (
            <View className="flex-1 justify-center items-center bg-white p-4">
                <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
                    <Text className="text-red-500 text-2xl">!</Text>
                </View>
                <Text className="text-gray-800 font-medium text-lg text-center">
                    {error || 'Listing not found'}
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

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-white">
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header with back button */}
                <View className="w-full h-2 bg-blue-500" />
                <View className="p-4 flex-row items-center justify-between">
                    <Pressable onPress={() => router.back()} className="p-2">
                        <FontAwesome name="arrow-left" size={25} color="rgb(var(--color-primary-500))" />
                    </Pressable>
                    <Heading size="lg">Listing Details</Heading>
                    <View className="w-10"></View>
                </View>

                {/* Image carousel */}
                <View className="relative">
                    <Image
                        source={{ uri: listing.images[currentImageIndex] }}
                        className="w-full h-72"
                        alt={listing.title}
                        resizeMode="cover"
                    />
                    {listing.images.length > 1 && (
                        <>
                            <Pressable
                                onPress={handlePrevImage}
                                className="absolute left-2 top-1/2 bg-black/30 rounded-full p-2"
                            >
                                <Text>
                                    <ArrowLeft size={24} color="#fff" />
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={handleNextImage}
                                className="absolute right-2 top-1/2 bg-black/30 rounded-full p-2"
                            >
                                <Text>
                                    <ArrowLeft size={24} color="#fff" style={{ transform: [{ rotate: '180deg' }] }} />
                                </Text>
                            </Pressable>
                        </>
                    )}
                    {listing.isRentable && (
                        <View className="absolute top-4 right-4 bg-blue-500 px-3 py-1 rounded-full">
                            <Text className="text-white font-medium text-xs">FOR RENT</Text>
                        </View>
                    )}
                    {listing.images.length > 1 && (
                        <View className="absolute bottom-4 left-0 right-0 flex-row justify-center">
                            {listing.images.map((_, index) => (
                                <View
                                    key={index}
                                    className={`w-2 h-2 rounded-full mx-1 ${index === currentImageIndex ? 'bg-blue-500' : 'bg-white/70'
                                        }`}
                                />
                            ))}
                        </View>
                    )}
                </View>

                {/* Main content */}
                <View className="px-5 pb-24">
                    {/* Title and price */}
                    <View className="mt-4 mb-3">
                        <View className="flex-row justify-between items-start">
                            <Heading size="xl" className="flex-1 mr-2">{listing.title}</Heading>
                            <View>
                                <Text className="text-blue-500 text-2xl font-bold text-right">
                                    {formatCurrency(listing.price)}
                                </Text>
                                {listing.isRentable && listing.rentalPeriod && (
                                    <Text className="text-gray-500 text-xs text-right">
                                        for {listing.rentalPeriod} {listing.rentalPeriod === 1 ? 'day' : 'days'}
                                    </Text>
                                )}
                            </View>
                        </View>
                    </View>

                    {/* Details boxes */}
                    <View className="flex-row mb-4">
                        <Box className="flex-1 mr-2 p-3 items-center justify-center bg-gray-50">
                            <Text className="text-gray-500 text-xs mb-1">CATEGORY</Text>
                            <Text className="font-medium">{formatCategory(listing.category)}</Text>
                        </Box>
                        <Box className="flex-1 ml-2 p-3 items-center justify-center bg-gray-50">
                            <Text className="text-gray-500 text-xs mb-1">CONDITION</Text>
                            <Text className="font-medium">{formatCategory(listing.condition)}</Text>
                        </Box>
                    </View>

                    {/* Description */}
                    <View className="mb-6">
                        <Heading size="md" className="mb-2">Description</Heading>
                        <Text className="text-gray-700 leading-relaxed">
                            {listing.description}
                        </Text>
                    </View>

                    {/* Seller Information */}
                    <View className="mb-6">
                        <Heading size="md" className="mb-2">Seller Information</Heading>
                        <Box className="p-4 bg-gray-50 rounded-lg">
                            <View className="flex-row items-center mb-3">
                                {listing.user.avatar ? (
                                    <Image
                                        source={{ uri: listing.user.avatar }}
                                        className="w-12 h-12 rounded-full mr-4"
                                        alt="User avatar"
                                    />
                                ) : (
                                    <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
                                        <Text className="text-blue-500 font-bold">
                                            {listing.user.firstName.charAt(0)}{listing.user.lastName.charAt(0)}
                                        </Text>
                                    </View>
                                )}
                                <View>
                                    <Text className="font-medium text-base">
                                        {listing.user.firstName} {listing.user.lastName}
                                    </Text>
                                    <Text className="text-gray-600 text-sm">
                                        {listing.user.email}
                                    </Text>
                                </View>
                            </View>
                            <View className="mt-2">
                                {listing.user.location && (
                                    <View className="flex-row items-center mt-2">
                                        <FontAwesome name="map-marker" size={16} color="#6B7280" className="mr-2" />
                                        <Text className="text-gray-700 ml-2">
                                            {listing.user.location}
                                        </Text>
                                    </View>
                                )}
                                {listing.user.phoneNumber && (
                                    <View className="flex-row items-center mt-2">
                                        <FontAwesome name="phone" size={16} color="#6B7280" className="mr-2" />
                                        <Text className="text-gray-700 ml-2">
                                            {listing.user.phoneNumber}
                                        </Text>
                                    </View>
                                )}
                                <Text className="text-gray-700 mt-2">
                                    Listing Created: {formatDate(listing.createdAt)}
                                </Text>
                                <Text className="text-gray-700 mt-1">
                                    Last Updated: {formatDate(listing.updatedAt)}
                                </Text>
                            </View>
                        </Box>
                    </View>

                    {/* Contact buttons - only shown if user is not the owner */}
                    {!isOwner && (
                        <View className="flex-row justify-between space-x-2">
                            {/* Call button - only shown if seller has phone number */}
                            {listing.user.phoneNumber && (
                                <Button
                                    className="flex-1 bg-green-500 py-3 rounded-lg flex-row items-center justify-center"
                                    onPress={() => {
                                        Linking.openURL(`tel:${listing.user.phoneNumber}`);
                                    }}
                                >
                                    <FontAwesome name="phone" size={16} color="#fff" />
                                    <Text className="text-white font-medium ml-2">Call</Text>
                                </Button>
                            )}

                            {/* Email button */}
                            <Button
                                className="flex-1 bg-orange-500 py-3 rounded-lg flex-row items-center justify-center mx-2"
                                onPress={() => {
                                    Linking.openURL(`mailto:${listing.user.email}?subject=Regarding your listing: ${listing.title}&body=Hello ${listing.user.firstName},\n\nI'm interested in your listing "${listing.title}" priced at ${formatCurrency(listing.price)}.\n\nPlease let me know if it's still available.\n\nThanks!`);
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

export default ListingDetailScreen;
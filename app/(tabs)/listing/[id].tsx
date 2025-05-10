import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, ActivityIndicator, Pressable, Text } from 'react-native';
import { Stack, useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Heart } from 'lucide-react-native';
import { Heading } from '@/components/ui/heading';
import { Box } from '@/components/ui/box';
import { productService } from '@/services/product.service';
import { ListingResponse } from '@/types/service/product.types';
import { Image } from '@/components/ui/image';
import { formatCurrency } from '@/lib/utils';

const ListingDetailScreen = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [listing, setListing] = useState<ListingResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
            setError(null);
        } catch (err) {
            console.error('Error fetching listing details:', err);
            setError('Failed to load listing details');
        } finally {
            setLoading(false);
        }
    }, [id]);

    // Use useFocusEffect to refetch data every time the screen comes into focus
    useFocusEffect(
        useCallback(() => {
            console.log('Listing screen focused, fetching data...');
            fetchListingDetails();

            // Return a cleanup function (optional)
            return () => {
                console.log('Listing screen blurred');
            };
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
            <ScrollView className="flex-1">
                {/* Header with back button */}
                <View className="w-full h-2 bg-blue-500" />
                <View className="p-4 flex-row items-center justify-between">
                    <Pressable onPress={() => router.back()} className="p-2">
                        <View>
                            <ArrowLeft size={24} color="#333" />
                        </View>
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
                        <View className="flex-row mt-2">
                            <Text className="text-gray-500 text-sm">
                                Posted {formatDate(listing.createdAt)} by {listing.user.firstName} {listing.user.lastName}
                            </Text>
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

                    {/* Contact seller button */}
                    <Pressable className="bg-blue-500 py-3 rounded-lg items-center">
                        <Text className="text-white font-medium">Contact Seller</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ListingDetailScreen;
import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, Alert, RefreshControl, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { productService } from '@/services/product.service';
import { ListingResponse } from '@/types/service/product.types';
import { ListingCard } from '@/components/ui/listing-card';

const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30;
    const year = day * 365;

    if (diffInSeconds < minute) {
        return 'just now';
    } else if (diffInSeconds < hour) {
        const minutes = Math.floor(diffInSeconds / minute);
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < day) {
        const hours = Math.floor(diffInSeconds / hour);
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInSeconds < week) {
        const days = Math.floor(diffInSeconds / day);
        return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else if (diffInSeconds < month) {
        const weeks = Math.floor(diffInSeconds / week);
        return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else if (diffInSeconds < year) {
        const months = Math.floor(diffInSeconds / month);
        return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else {
        const years = Math.floor(diffInSeconds / year);
        return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    }
};

const formatCategory = (category: string): string => {
    return category
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

export default function MyListingsScreen() {
    const router = useRouter();
    const [listings, setListings] = useState<ListingResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [totalListings, setTotalListings] = useState(0);

    const fetchListings = useCallback(async (refresh: boolean = false) => {
        try {
            if (refresh) {
                setRefreshing(true);
                setCurrentPage(1);
            } else {
                setLoading(true);
            }

            const response = await productService.getUserListings(
                refresh ? 1 : currentPage,
                10,
                'createdAt',
                'desc'
            );

            if (response && response.data) {
                const newListings = response.data.listings.map(listing => ({
                    ...listing,
                    user: {
                        id: listing.userId,
                        firstName: "Me",
                        lastName: "(You)"
                    }
                }));
                const pagination = response.data.pagination;

                if (refresh) {
                    setListings(newListings);
                } else {
                    setListings(prev => [...prev, ...newListings]);
                }

                setHasNextPage(pagination.hasNextPage);
                setTotalListings(pagination.totalListings);

                if (refresh) {
                    setCurrentPage(1);
                } else {
                    setCurrentPage(prev => prev + 1);
                }
            }
        } catch (error) {
            console.error('Failed to fetch user listings:', error);
            Alert.alert('Error', 'Failed to load your listings. Please try again.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [currentPage]);

    useEffect(() => {
        fetchListings();
    }, []);

    const handleRefresh = () => {
        fetchListings(true);
    };

    const handleLoadMore = () => {
        if (hasNextPage && !loading && !refreshing) {
            fetchListings();
        }
    };

    const handleEditListing = (listingId: string) => {
        // Navigation to edit listing page (to be implemented)
        // router.push(`/edit-listing/${listingId}`);
        Alert.alert('Edit Listing', 'Edit functionality will be implemented soon.');
    };

    const handleDeleteListing = (listingId: string) => {
        Alert.alert(
            'Delete Listing',
            'Are you sure you want to delete this listing? This action cannot be undone.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // API call to delete listing to be implemented
                            // await productService.deleteListing(listingId);
                            // If successful, update the UI
                            setListings(prevListings =>
                                prevListings.filter(listing => listing.id !== listingId)
                            );
                            Alert.alert('Success', 'Listing has been deleted successfully.');
                        } catch (error) {
                            console.error('Failed to delete listing:', error);
                            Alert.alert('Error', 'Failed to delete the listing. Please try again.');
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const handleListingPress = (id: string) => {
        router.push({
            pathname: "/listing/[id]",
            params: { id }
        });
    };

    const renderListingItem = ({ item }: { item: ListingResponse }) => {
        return (
            <View className="px-4">
                <ListingCard
                    listing={item}
                    onPress={handleListingPress}
                />
                <View className="flex-row justify-end space-x-2 mt-2 mb-6">
                    <View className="flex-row justify-end space-x-2">
                        <TouchableOpacity
                            onPress={() => handleEditListing(item.id)}
                            className="bg-blue-500 px-4 py-2 rounded-lg"
                        >
                            <Text className="text-white font-medium">Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleDeleteListing(item.id)}
                            className="bg-red-500 px-4 py-2 rounded-lg"
                        >
                            <Text className="text-white font-medium">Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    const renderEmptyList = () => {
        if (loading) return (
            <View className="flex-1 justify-center items-center p-12 mt-8">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="mt-4 text-gray-600 text-center">Loading your listings...</Text>
            </View>
        );

        return (
            <View className="flex-1 justify-center items-center p-12 mt-8 bg-white rounded-xl shadow-sm">
                <Text className="text-xl font-bold text-gray-700 mb-2">No Listings Yet</Text>
                <Text className="text-gray-500 text-center mb-6">
                    You haven't created any listings yet. Start selling or renting items by adding your first listing.
                </Text>
                <TouchableOpacity
                    onPress={() => router.push('/add-product')}
                    className="bg-blue-500 px-6 py-3 rounded-lg"
                >
                    <Text className="text-white font-medium">Create Listing</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderFooter = () => {
        if (!hasNextPage || !loading) return null;

        return (
            <View className="py-6 items-center">
                <ActivityIndicator size="small" color="#3B82F6" />
                <Text className="mt-2 text-gray-500 text-xs">Loading more...</Text>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-background-50">
            <View className="px-4 py-3">
                <Heading size='xl' className='text-gray-800'>
                    My Listings
                </Heading>
                <Text className="text-gray-500 mt-1">
                    {totalListings} {totalListings === 1 ? 'listing' : 'listings'} in total
                </Text>
            </View>

            <FlatList
                data={listings}
                renderItem={renderListingItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16, paddingTop: 8 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={['#3b82f6']}
                    />
                }
                ListEmptyComponent={renderEmptyList}
                ListFooterComponent={renderFooter}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
            />
        </SafeAreaView>
    );
}

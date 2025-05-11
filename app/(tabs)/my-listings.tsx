import { useState, useEffect, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, Alert, RefreshControl, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { productService } from '@/services/product.service';
import { ListingResponse } from '@/types/service/product.types';
import { MyListingCard } from '@/components/ui/my-listing-card';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

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
                            setLoading(true);
                            // Call the API to delete the listing
                            await productService.deleteListing(listingId);
                            // If successful, update the UI
                            setListings(prevListings =>
                                prevListings.filter(listing => listing.id !== listingId)
                            );
                            // Update total listings count
                            setTotalListings(prev => prev - 1);
                            Alert.alert('Success', 'Listing has been deleted successfully.');
                        } catch (error) {
                            console.error('Failed to delete listing:', error);
                            Alert.alert('Error', 'Failed to delete the listing. Please try again.');
                        } finally {
                            setLoading(false);
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
            <View className="mb-5">
                <View className='rounded-xl overflow-hidden border border-gray-300'>
                    <MyListingCard
                        listing={item}
                        onPress={handleListingPress}
                    />
                    <View className="flex-row justify-end px-4 py-3 border-t border-gray-200">
                        <TouchableOpacity
                            onPress={() => handleEditListing(item.id)}
                            className="bg-[#3B82F6] px-3 py-2 rounded-md mr-3 flex-row items-center"
                        >
                            <Ionicons name="pencil-outline" size={16} color="#fff" style={{ marginRight: 4 }} />
                            <Text className="text-white font-semibold">Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleDeleteListing(item.id)}
                            className="bg-error-50 px-3 py-2 rounded-md flex-row items-center"
                        >
                            <Ionicons name="trash-outline" size={16} color="#ef4444" style={{ marginRight: 4 }} />
                            <Text className="text-error-600 font-semibold">Delete</Text>
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
            <View className="flex-1 items-center justify-center py-10">
                <Ionicons name="list-outline" size={48} color="#cbd5e1" />
                <Text className="mt-4 text-typography-500 text-center text-base">
                    You haven't created any listings yet
                </Text>
                <TouchableOpacity
                    onPress={() => router.push('/add-product')}
                    className="mt-4 bg-[#3B82F6] px-6 py-3 rounded-lg"
                >
                    <Text className="text-white font-semibold">Create Listing</Text>
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
            <View className="px-4 py-3 bg-background-50 z-10 border-b border-outline-200 flex-row items-center">
                <TouchableOpacity onPress={() => router.push('/menu')} className="pr-4">
                    <FontAwesome name="arrow-left" size={25} color="rgb(var(--color-primary-500))" />
                </TouchableOpacity>
                <Heading size="xl" className="flex-1 text-center pr-8">
                    My Listings
                </Heading>
            </View>
            <Text className="px-4 text-typography-500 my-3">
                {totalListings} {totalListings === 1 ? 'listing' : 'listings'} created by you
            </Text>

            <FlatList
                data={listings}
                renderItem={renderListingItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
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

            <TouchableOpacity
                onPress={() => router.push('/add-product')}
                className="absolute bottom-6 right-6 bg-[#3B82F6] w-14 h-14 rounded-full items-center justify-center shadow-md"
            >
                <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

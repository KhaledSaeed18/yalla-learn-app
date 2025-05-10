import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { ActivityIndicator, FlatList, RefreshControl, View, StatusBar } from 'react-native';
import { productService } from '@/services/product.service';
import { ListingCard } from '@/components/ui/listing-card';
import { Heading } from '@/components/ui/heading';
import { ListingResponse, PaginationInfo } from '@/types/service/product.types';
import { ListingsFilter, FilterOptions } from '@/components/listings/listings-filter';
import { useRouter, useLocalSearchParams } from 'expo-router';

const Listings = () => {
    const router = useRouter();
    const { refresh } = useLocalSearchParams();
    const [listings, setListings] = useState<ListingResponse[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [filters, setFilters] = useState<FilterOptions>({});

    const fetchListings = async (pageNum: number = 1, refresh: boolean = false, currentFilters: FilterOptions = filters) => {
        try {
            if (refresh) setRefreshing(true);
            else if (pageNum === 1) setLoading(true);
            else setLoadingMore(true);

            const response = await productService.getListings(pageNum, 10, currentFilters);

            if (response && response.data) {
                const newListings = response.data.listings;
                setPagination(response.data.pagination);

                if (refresh || pageNum === 1) {
                    setListings(newListings);
                } else {
                    setListings(prev => [...prev, ...newListings]);
                }
            }
        } catch (error) {
            console.error('Error fetching listings:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
            setLoadingMore(false);
        }
    };

    const handleRefresh = () => {
        setPage(1);
        fetchListings(1, true);
    };

    const handleLoadMore = () => {
        if (pagination?.hasNextPage && !loadingMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchListings(nextPage);
        }
    };

    const handleListingPress = (id: string) => {
        // router.push(`/listing/${id}`);
    };

    const handleFilterChange = (newFilters: FilterOptions) => {
        setFilters(newFilters);
        setPage(1);
        fetchListings(1, false, newFilters);
    };

    useEffect(() => {
        fetchListings();
    }, []);

    useEffect(() => {
        if (refresh === 'true') {
            handleRefresh();
        }
    }, [refresh]);

    return (
        <SafeAreaView edges={['top']} className='flex-1 bg-white'>
            <View className="px-4 py-3">
                <Heading size='xl' className='text-center text-gray-800'>
                    Discover Listings
                </Heading>
            </View>

            <View className="px-4 py-3">
                <ListingsFilter onFilterChange={handleFilterChange} />
            </View>

            {loading ? (
                <View className="flex-1 justify-center items-center bg-white">
                    <ActivityIndicator size="large" color="#3B82F6" />
                    <Text className="mt-3 text-gray-500">Loading listings...</Text>
                </View>
            ) : (
                <FlatList
                    data={listings}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View className="px-4">
                            <ListingCard
                                listing={item}
                                onPress={handleListingPress}
                            />
                        </View>
                    )}
                    numColumns={1}
                    contentContainerStyle={{ paddingVertical: 12 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            colors={['#3B82F6']}
                            tintColor="#3B82F6"
                        />
                    }
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={
                        loadingMore ? (
                            <View className="py-6 items-center">
                                <ActivityIndicator size="small" color="#3B82F6" />
                                <Text className="mt-2 text-gray-500 text-xs">Loading more...</Text>
                            </View>
                        ) : pagination?.hasNextPage ? (
                            <View className="py-6 items-center">
                                <Text className="text-gray-400 text-xs">Pull up to load more</Text>
                            </View>
                        ) : null
                    }
                    ListEmptyComponent={
                        <View className="flex-1 justify-center items-center p-12 mt-8 bg-white rounded-xl mx-4 shadow-sm">
                            <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
                                <Text className="text-gray-400 text-2xl">📦</Text>
                            </View>
                            <Text className="text-gray-800 font-medium text-lg text-center">
                                No listings found
                            </Text>
                            <Text className="text-gray-500 text-center mt-2">
                                Try adjusting your filters or check back later for new listings.
                            </Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};

export default Listings;
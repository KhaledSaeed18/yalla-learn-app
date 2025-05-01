import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import { productService, ListingResponse, PaginationInfo } from '@/services/product.service';
import { ListingCard } from '@/components/ui/listing-card';
import { Heading } from '@/components/ui/heading';

const Listings = () => {
    const [listings, setListings] = useState<ListingResponse[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    const fetchListings = async (pageNum: number = 1, refresh: boolean = false) => {
        try {
            if (refresh) setRefreshing(true);
            else if (pageNum === 1) setLoading(true);
            else setLoadingMore(true);

            const response = await productService.getListings(pageNum);

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
    };

    useEffect(() => {
        fetchListings();
    }, []);

    return (
        <SafeAreaView edges={['top']} className='bg-background-0 flex-1 px-4'>
            <View className="pt-4 pb-2">
                <Heading size='2xl' className='text-center'>
                    Listings
                </Heading>
            </View>

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : (
                <FlatList
                    data={listings}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ListingCard
                            listing={item}
                            onPress={handleListingPress}
                        />
                    )}
                    numColumns={1}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                        />
                    }
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        loadingMore ? (
                            <View className="py-4">
                                <ActivityIndicator size="small" color="#0000ff" />
                            </View>
                        ) : null
                    }
                    ListEmptyComponent={
                        <View className="flex-1 justify-center items-center p-8">
                            <Text className="text-muted-foreground text-center">
                                No listings found. Check back later!
                            </Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};

export default Listings;
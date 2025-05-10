import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import { serviceService } from '@/services/service.service';
import { ServiceCard } from '@/components/ui/service-card';
import { Heading } from '@/components/ui/heading';
import { ServiceFilters, ServicePagination, ServiceResponse } from '@/types/service/service.types';
import { ServiceFilter, ServiceFilterOptions } from '@/components/listings/service-filter';
import { GigCategory, ServiceDirection } from '@/types/enums';

const Services = () => {
    const [services, setServices] = useState<ServiceResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [pagination, setPagination] = useState<ServicePagination | null>(null);
    const [filters, setFilters] = useState<ServiceFilterOptions>({
        category: undefined,
        direction: undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const fetchServices = async (refresh: boolean = false, currentFilters: ServiceFilterOptions = filters, page: number = currentPage) => {
        try {
            if (refresh) {
                setRefreshing(true);
                page = 1; // Reset to first page on refresh
            } else {
                setLoading(true);
            }

            const serviceFilters: ServiceFilters = {
                page,
                limit: ITEMS_PER_PAGE,
                category: currentFilters.category as GigCategory,
                direction: currentFilters.direction as ServiceDirection,
                sortBy: currentFilters.sortBy,
                sortOrder: currentFilters.sortOrder as 'asc' | 'desc'
            };

            const response = await serviceService.getServices(serviceFilters);

            if (response && response.data && response.data.services) {
                if (page > 1 && !refresh) {
                    // Append new services for pagination
                    setServices(prev => [...prev, ...response.data.services]);
                } else {
                    // Replace services on refresh or initial load
                    setServices(response.data.services);
                }
                setPagination(response.data.pagination);
                setCurrentPage(page);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const loadMoreServices = () => {
        if (pagination?.hasNextPage && !loading && !refreshing) {
            fetchServices(false, filters, currentPage + 1);
        }
    };

    const handleRefresh = () => {
        // Reset to page 1 and refresh
        setCurrentPage(1);
        fetchServices(true, filters, 1);
    };

    const handleServicePress = (id: string) => {
        // router.push(`/service/${id}`);
    };

    const handleFilterChange = (newFilters: ServiceFilterOptions) => {
        setCurrentPage(1); // Reset to page 1 when filters change
        setFilters(newFilters);
        fetchServices(false, newFilters, 1);
    };

    useEffect(() => {
        fetchServices();
    }, []);

    return (
        <SafeAreaView edges={['top']} className='flex-1 bg-white'>
            <View className="px-4 py-3">
                <Heading size='xl' className='text-center text-gray-800'>
                    Discover Services
                </Heading>
            </View>

            <View className="px-4 py-3">
                <ServiceFilter onFilterChange={handleFilterChange} initialFilters={filters} />
            </View>

            {loading ? (
                <View className="flex-1 justify-center items-center bg-white">
                    <ActivityIndicator size="large" color="#3B82F6" />
                    <Text className="mt-3 text-gray-500">Loading services...</Text>
                </View>
            ) : (
                <FlatList
                    data={services}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View className="px-4">
                            <ServiceCard
                                service={item}
                                onPress={handleServicePress}
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
                    onEndReached={loadMoreServices}
                    onEndReachedThreshold={0.5}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={pagination?.hasNextPage && !loading && !refreshing ? (
                        <View className="py-4 items-center">
                            <ActivityIndicator size="small" color="#3B82F6" />
                            <Text className="text-gray-500 text-sm mt-2">Loading more...</Text>
                        </View>
                    ) : null}
                    ListEmptyComponent={
                        <View className="flex-1 justify-center items-center p-12 mt-8 bg-white rounded-xl mx-4 shadow-sm">
                            <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
                                <Text className="text-gray-400 text-2xl">🔧</Text>
                            </View>
                            <Text className="text-gray-800 font-medium text-lg text-center">
                                No services found
                            </Text>
                            <Text className="text-gray-500 text-center mt-2">
                                Try adjusting your filters or check back later for new services.
                            </Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};

export default Services;
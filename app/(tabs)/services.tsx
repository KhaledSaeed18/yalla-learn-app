import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import { serviceService } from '@/services/service.service';
import { ServiceCard } from '@/components/ui/service-card';
import { Heading } from '@/components/ui/heading';
import { ServicePagination, ServiceResponse } from '@/types/service/service.types';
import { ListingsFilter, FilterOptions } from '@/components/listings/listings-filter';

const Services = () => {
    const [services, setServices] = useState<ServiceResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [pagination, setPagination] = useState<ServicePagination | null>(null);
    const [filters, setFilters] = useState<FilterOptions>({
        category: undefined
    });

    const fetchServices = async (refresh: boolean = false, currentFilters: FilterOptions = filters) => {
        try {
            if (refresh) setRefreshing(true);
            else setLoading(true);

            let response;

            if (currentFilters.category) {
                response = await serviceService.getServicesByCategory(currentFilters.category);
            }
            else {
                response = await serviceService.getServices();
            }

            if (response && response.data && response.data.services) {
                setServices(response.data.services);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        fetchServices(true);
    };

    const handleServicePress = (id: string) => {
        // router.push(`/service/${id}`);
    };

    const handleFilterChange = (newFilters: FilterOptions) => {
        setFilters(newFilters);
        fetchServices(false, newFilters);
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
                <ListingsFilter onFilterChange={handleFilterChange} />
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
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
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
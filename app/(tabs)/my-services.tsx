import { useEffect, useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { serviceService } from '@/services/service.service';
import { ServiceResponse } from '@/types/service/service.types';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '@/lib/utils';
import { GigCategory, ServiceDirection } from '@/types/enums';
import { router } from 'expo-router';
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectContent, SelectItem } from '@/components/ui/select';
import { ScrollView } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ServiceFormData, serviceSchema } from '@/lib/validations/service.validation';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';

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

export default function MyServicesScreen() {
    const [services, setServices] = useState<ServiceResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [totalServices, setTotalServices] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<ServiceResponse | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Form setup for editing
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
        setValue
    } = useForm<ServiceFormData>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            title: '',
            description: '',
            price: '',
            category: GigCategory.OTHER,
            direction: ServiceDirection.OFFERING
        }
    });

    const direction = watch('direction');

    // Helper function to format enum values for display
    const formatEnumValue = (value: string) => {
        return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    const fetchServices = useCallback(async (refresh: boolean = false) => {
        try {
            if (refresh) {
                setRefreshing(true);
                setCurrentPage(1);
            } else {
                setLoading(true);
            }

            const response = await serviceService.getUserServices({
                page: refresh ? 1 : currentPage,
                limit: 10,
                sortBy: 'createdAt',
                sortOrder: 'desc'
            });

            if (response && response.data) {
                if (refresh) {
                    setServices(response.data.services);
                } else {
                    setServices(prev => [...prev, ...response.data.services]);
                }
                setHasNextPage(response.data.pagination.hasNextPage);
                setTotalServices(response.data.pagination.totalServices);

                if (!refresh) {
                    setCurrentPage(prev => prev + 1);
                }
            }
        } catch (error) {
            console.error('Failed to fetch user services:', error);
            Alert.alert('Error', 'Failed to load your services. Please try again.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [currentPage]);

    useEffect(() => {
        fetchServices();
    }, []);

    const handleRefresh = () => {
        fetchServices(true);
    };

    const handleLoadMore = () => {
        if (hasNextPage && !loading && !refreshing) {
            fetchServices();
        }
    };

    const handleEditService = (serviceId: string) => {
        // Find the service to edit
        const serviceToEdit = services.find(service => service.id === serviceId);
        if (serviceToEdit) {
            setSelectedService(serviceToEdit);
            // Set form values
            setValue('title', serviceToEdit.title);
            setValue('description', serviceToEdit.description);
            setValue('price', serviceToEdit.price ? serviceToEdit.price.toString() : '');
            setValue('category', serviceToEdit.category);
            setValue('direction', serviceToEdit.direction);
            setIsModalOpen(true);
        }
    };

    const handleUpdateService = async (data: ServiceFormData) => {
        if (!selectedService) return;

        setIsUpdating(true);
        try {
            await serviceService.updateService(selectedService.id, data);

            // Close modal and refresh data
            setIsModalOpen(false);
            setSelectedService(null);
            fetchServices(true);

            Alert.alert(
                "Success",
                "Your service has been successfully updated!",
                [{ text: "OK" }]
            );
        } catch (error) {
            let errorMessage = "Failed to update service. Please try again.";

            Alert.alert("Error", errorMessage);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleServicePress = (serviceId: string) => {
        router.push({
            pathname: "/service/[id]",
            params: { id: serviceId }
        });
    };

    const handleDeleteService = (serviceId: string) => {
        Alert.alert(
            'Delete Service',
            'Are you sure you want to delete this service? This action cannot be undone.',
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
                            await serviceService.deleteService(serviceId);
                            // Refresh the list after deletion
                            fetchServices(true);
                            Alert.alert('Success', 'Service deleted successfully');
                        } catch (error) {
                            console.error('Failed to delete service:', error);
                            Alert.alert('Error', 'Failed to delete service. Please try again.');
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const renderServiceItem = ({ item }: { item: ServiceResponse }) => {
        const isOffering = item.direction === ServiceDirection.OFFERING;

        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleServicePress(item.id)}
                className='bg-white rounded-xl overflow-hidden mb-5 border border-gray-300'
            >
                <View className={`h-2 w-full ${isOffering ? 'bg-emerald-500' : 'bg-amber-500'}`} />

                <View className='p-4'>
                    <View className='flex-row justify-between items-start'>
                        <View className='flex-1 pr-2'>
                            <Text numberOfLines={1} className="font-bold text-lg">
                                {item.title}
                            </Text>
                            <View className='flex-row items-center mt-1'>
                                <View className={`px-2 py-1 rounded-md ${isOffering ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                                    <Text className={`text-xs ${isOffering ? 'text-emerald-700' : 'text-amber-700'}`}>
                                        {isOffering ? 'Offering' : 'Requesting'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        {item.price !== null && (
                            <Text className="text-[#3B82F6] text-lg font-bold">
                                {formatCurrency(item.price || 0)}
                            </Text>
                        )}
                    </View>

                    <Text numberOfLines={2} className="mt-2 text-gray-700">
                        {item.description}
                    </Text>

                    <View className='flex-row justify-between mt-3 pt-3 border-t border-gray-100'>
                        <View className='flex-row items-center space-x-1'>
                            <View className='bg-gray-100 px-2 py-1 rounded-md'>
                                <Text className="text-gray-700 text-xs">
                                    {formatCategory(item.category)}
                                </Text>
                            </View>
                        </View>
                        <Text numberOfLines={1} className="text-gray-500 text-xs">
                            {formatRelativeTime(item.createdAt)}
                        </Text>
                    </View>

                    {/* Action buttons */}
                    <View className="flex-row justify-end mt-3 pt-3 border-t border-gray-100">
                        <TouchableOpacity
                            onPress={() => handleEditService(item.id)}
                            className="bg-[#3B82F6] px-3 py-2 rounded-md mr-3 flex-row items-center"
                        >
                            <Ionicons name="pencil-outline" size={16} color="#fff" style={{ marginRight: 4 }} />
                            <Text className="text-white font-semibold">Edit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => handleDeleteService(item.id)}
                            className="bg-error-50 px-3 py-2 rounded-md flex-row items-center"
                        >
                            <Ionicons name="trash-outline" size={16} color="#ef4444" style={{ marginRight: 4 }} />
                            <Text className="text-error-600 font-semibold">Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmptyList = () => {
        if (loading) return null;

        return (
            <View className="flex-1 items-center justify-center py-10">
                <Ionicons name="list-outline" size={48} color="#cbd5e1" />
                <Text className="mt-4 text-typography-500 text-center text-base">
                    You haven't created any services yet
                </Text>
                <TouchableOpacity
                    onPress={() => router.push('/add-product')}
                    className="mt-4 bg-[#3B82F6] px-6 py-3 rounded-lg"
                >
                    <Text className="text-white font-semibold">Create a Service</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderFooter = () => {
        if (!hasNextPage || !loading) return null;

        return (
            <View className="py-4 flex items-center justify-center">
                <ActivityIndicator size="small" color="#3b82f6" />
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-background-50">
            <View className="px-4 py-3 bg-background-50 z-10 border-b border-outline-200 flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="pr-4">
                    <FontAwesome name="arrow-left" size={25} color="rgb(var(--color-primary-500))" />
                </TouchableOpacity>
                <Heading size="xl" className="flex-1 text-center pr-8">
                    My Services
                </Heading>
            </View>
            <Text className="px-4 text-typography-500 my-3">
                {totalServices} {totalServices === 1 ? 'service' : 'services'} created by you
            </Text>

            {loading && services.length === 0 ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#3b82f6" />
                    <Text className="mt-4 text-typography-500">Loading your services...</Text>
                </View>
            ) : (
                <FlatList
                    data={services}
                    renderItem={renderServiceItem}
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
            )}

            <TouchableOpacity
                onPress={() => router.push('/add-service')}
                className="absolute bottom-6 right-6 bg-[#3B82F6] w-14 h-14 rounded-full items-center justify-center shadow-md"
            >
                <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>

            {/* Edit Service Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader>
                        <Heading size="lg">Edit Service</Heading>
                        <ModalCloseButton>
                            <Ionicons name="close" size={24} color="black" />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <VStack space="md" className="py-2">
                                <Box>
                                    <Text className="mb-2 text-typography-700">Service Type</Text>
                                    <Controller
                                        control={control}
                                        name="direction"
                                        render={({ field: { onChange, value } }) => (
                                            <View className="flex-row">
                                                <TouchableOpacity
                                                    onPress={() => onChange(ServiceDirection.OFFERING)}
                                                    className={`flex-1 py-3 rounded-l-md ${value === ServiceDirection.OFFERING ? 'bg-emerald-500' : 'bg-gray-200'}`}
                                                >
                                                    <Text className={`text-center font-medium ${value === ServiceDirection.OFFERING ? 'text-white' : 'text-gray-700'}`}>
                                                        I'm Offering
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => onChange(ServiceDirection.REQUESTING)}
                                                    className={`flex-1 py-3 rounded-r-md ${value === ServiceDirection.REQUESTING ? 'bg-amber-500' : 'bg-gray-200'}`}
                                                >
                                                    <Text className={`text-center font-medium ${value === ServiceDirection.REQUESTING ? 'text-white' : 'text-gray-700'}`}>
                                                        I'm Requesting
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    />
                                    {errors.direction && (
                                        <Text className="text-error-600 text-xs mt-1">{errors.direction.message}</Text>
                                    )}
                                </Box>

                                <Box>
                                    <Text className="mb-2 text-typography-700">Service Title</Text>
                                    <Controller
                                        control={control}
                                        name="title"
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <Input variant="outline" size="md">
                                                <InputField
                                                    placeholder="Enter service title"
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                />
                                            </Input>
                                        )}
                                    />
                                    {errors.title && (
                                        <Text className="text-error-600 text-xs mt-1">{errors.title.message}</Text>
                                    )}
                                </Box>

                                {direction === ServiceDirection.OFFERING && (
                                    <Box>
                                        <Text className="mb-2 text-typography-700">Price</Text>
                                        <Controller
                                            control={control}
                                            name="price"
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <Input variant="outline" size="md">
                                                    <InputField
                                                        placeholder="Enter price"
                                                        value={value}
                                                        onChangeText={onChange}
                                                        onBlur={onBlur}
                                                        keyboardType="decimal-pad"
                                                    />
                                                </Input>
                                            )}
                                        />
                                        {errors.price && (
                                            <Text className="text-error-600 text-xs mt-1">{errors.price.message}</Text>
                                        )}
                                    </Box>
                                )}

                                <Box>
                                    <Text className="mb-2 text-typography-700">Category</Text>
                                    <Controller
                                        control={control}
                                        name="category"
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                onValueChange={onChange}
                                                defaultValue={value}
                                            >
                                                <SelectTrigger variant="outline" size="md">
                                                    <SelectInput placeholder="Select a category" />
                                                    <SelectIcon>
                                                        <Ionicons name="chevron-down" size={16} color="gray" />
                                                    </SelectIcon>
                                                </SelectTrigger>
                                                <SelectPortal>
                                                    <SelectContent>
                                                        {Object.values(GigCategory).map((category) => (
                                                            <SelectItem
                                                                key={category}
                                                                label={formatEnumValue(category)}
                                                                value={category}
                                                            />
                                                        ))}
                                                    </SelectContent>
                                                </SelectPortal>
                                            </Select>
                                        )}
                                    />
                                    {errors.category && (
                                        <Text className="text-error-600 text-xs mt-1">{errors.category.message}</Text>
                                    )}
                                </Box>

                                <Box>
                                    <Text className="mb-2 text-typography-700">Description</Text>
                                    <Controller
                                        control={control}
                                        name="description"
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <Input
                                                variant="outline"
                                                size="md"
                                                className="h-32"
                                            >
                                                <InputField
                                                    placeholder="Describe your service"
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    numberOfLines={4}
                                                    multiline={true}
                                                />
                                            </Input>
                                        )}
                                    />
                                    {errors.description && (
                                        <Text className="text-error-600 text-xs mt-1">{errors.description.message}</Text>
                                    )}
                                </Box>
                            </VStack>
                        </ScrollView>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="outline"
                            size="sm"
                            action="secondary"
                            onPress={() => setIsModalOpen(false)}
                            disabled={isUpdating}
                        >
                            <Text>Cancel</Text>
                        </Button>
                        <Button
                            size="sm"
                            action="primary"
                            onPress={handleSubmit(handleUpdateService)}
                            isDisabled={isUpdating}
                        >
                            <Text>{isUpdating ? 'Updating...' : 'Update Service'}</Text>
                            {isUpdating && <ActivityIndicator size="small" color="white" />}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </SafeAreaView>
    );
}

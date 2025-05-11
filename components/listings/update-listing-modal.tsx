import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Switch } from 'react-native';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { productSchema, ProductFormData } from '@/lib/validations/product.validation';
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton } from '@/components/ui/modal';
import { Condition, ListingCategory } from '@/types/enums';
import { productService } from '@/services/product.service';
import { ListingResponse } from '@/types/service/product.types';

interface UpdateListingModalProps {
    isOpen: boolean;
    onClose: () => void;
    listing?: ListingResponse;
    onSuccess: () => void;
}

export const UpdateListingModal = ({ isOpen, onClose, listing, onSuccess }: UpdateListingModalProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
        setValue,
        reset
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            title: '',
            description: '',
            price: '',
            condition: Condition.NEW,
            category: ListingCategory.OTHER,
            isRentable: false,
            rentalPeriod: '',
            images: []
        }
    });

    const isRentable = watch('isRentable');

    useEffect(() => {
        if (listing) {
            setValue('title', listing.title);
            setValue('description', listing.description);
            setValue('price', listing.price.toString());
            setValue('condition', listing.condition as Condition);
            setValue('category', listing.category as ListingCategory);
            setValue('isRentable', listing.isRentable);
            setValue('rentalPeriod', listing.rentalPeriod ? listing.rentalPeriod.toString() : '');
            setValue('images', listing.images);
        }
    }, [listing, setValue]);

    const formatEnumValue = (value: string) => {
        return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    const onSubmit = async (data: ProductFormData) => {
        if (!listing) {
            return;
        }

        try {
            setIsSubmitting(true);
            await productService.updateListing(listing.id, data);
            Alert.alert('Success', 'Listing updated successfully');
            onSuccess();
            onClose();
            reset();
        } catch (error) {
            console.error('Error updating listing:', error);
            Alert.alert('Error', 'Failed to update listing. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalBackdrop />
            <ModalContent>
                <ModalHeader>
                    <Heading size="lg">Update Listing</Heading>
                    <ModalCloseButton>
                        <Ionicons name="close" size={24} color="#666" />
                    </ModalCloseButton>
                </ModalHeader>
                <ModalBody>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View className="space-y-4">
                            <View>
                                <Text className="text-typography-500 mb-1">Title</Text>
                                <Controller
                                    control={control}
                                    name="title"
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            value={value}
                                            onChangeText={onChange}
                                            placeholder="Enter listing title"
                                            className="border border-outline-300 rounded-md p-3 bg-background-0"
                                        />
                                    )}
                                />
                                {errors.title && (
                                    <Text className="text-error-600 text-xs mt-1">{errors.title.message}</Text>
                                )}
                            </View>

                            <View>
                                <Text className="text-typography-500 mb-1">Description</Text>
                                <Controller
                                    control={control}
                                    name="description"
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            value={value}
                                            onChangeText={onChange}
                                            placeholder="Enter listing description"
                                            multiline
                                            numberOfLines={4}
                                            textAlignVertical="top"
                                            className="border border-outline-300 rounded-md p-3 bg-background-0 min-h-[100px]"
                                        />
                                    )}
                                />
                                {errors.description && (
                                    <Text className="text-error-600 text-xs mt-1">{errors.description.message}</Text>
                                )}
                            </View>

                            <View>
                                <Text className="text-typography-500 mb-1">Price ($)</Text>
                                <Controller
                                    control={control}
                                    name="price"
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            value={value}
                                            onChangeText={onChange}
                                            placeholder="Enter price"
                                            keyboardType="decimal-pad"
                                            className="border border-outline-300 rounded-md p-3 bg-background-0"
                                        />
                                    )}
                                />
                                {errors.price && (
                                    <Text className="text-error-600 text-xs mt-1">{errors.price.message}</Text>
                                )}
                            </View>

                            <View>
                                <Text className="text-typography-500 mb-1">Condition</Text>
                                <Controller
                                    control={control}
                                    name="condition"
                                    render={({ field: { value, onChange } }) => (
                                        <View className="border border-outline-300 rounded-md p-3 bg-background-0">
                                            <View className="flex-row flex-wrap">
                                                {Object.values(Condition).map((condition) => (
                                                    <TouchableOpacity
                                                        key={condition}
                                                        onPress={() => onChange(condition)}
                                                        className={`mr-2 mb-2 px-3 py-2 rounded-full ${value === condition
                                                                ? 'bg-primary-500'
                                                                : 'bg-background-100'
                                                            }`}
                                                    >
                                                        <Text
                                                            className={`${value === condition
                                                                    ? 'text-white'
                                                                    : 'text-typography-500'
                                                                } font-medium text-sm`}
                                                        >
                                                            {formatEnumValue(condition)}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </View>
                                    )}
                                />
                                {errors.condition && (
                                    <Text className="text-error-600 text-xs mt-1">
                                        {errors.condition.message}
                                    </Text>
                                )}
                            </View>

                            <View>
                                <Text className="text-typography-500 mb-1">Category</Text>
                                <Controller
                                    control={control}
                                    name="category"
                                    render={({ field: { value, onChange } }) => (
                                        <View className="border border-outline-300 rounded-md p-3 bg-background-0">
                                            <View className="flex-row flex-wrap">
                                                {Object.values(ListingCategory).map((category) => (
                                                    <TouchableOpacity
                                                        key={category}
                                                        onPress={() => onChange(category)}
                                                        className={`mr-2 mb-2 px-3 py-2 rounded-full ${value === category
                                                                ? 'bg-primary-500'
                                                                : 'bg-background-100'
                                                            }`}
                                                    >
                                                        <Text
                                                            className={`${value === category
                                                                    ? 'text-white'
                                                                    : 'text-typography-500'
                                                                } font-medium text-sm`}
                                                        >
                                                            {formatEnumValue(category)}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </View>
                                    )}
                                />
                                {errors.category && (
                                    <Text className="text-error-600 text-xs mt-1">
                                        {errors.category.message}
                                    </Text>
                                )}
                            </View>

                            <View>
                                <View className="flex-row items-center justify-between">
                                    <Text className="text-typography-500">Available for Rent</Text>
                                    <Controller
                                        control={control}
                                        name="isRentable"
                                        render={({ field: { value, onChange } }) => (
                                            <Switch
                                                value={value}
                                                onValueChange={onChange}
                                                trackColor={{ false: '#d1d5db', true: '#3B82F6' }}
                                            />
                                        )}
                                    />
                                </View>
                                {isRentable && (
                                    <View className="mt-3">
                                        <Text className="text-typography-500 mb-1">
                                            Rental Period (days)
                                        </Text>
                                        <Controller
                                            control={control}
                                            name="rentalPeriod"
                                            render={({ field: { onChange, value } }) => (
                                                <TextInput
                                                    value={value || ''}
                                                    onChangeText={onChange}
                                                    placeholder="Enter rental period in days"
                                                    keyboardType="number-pad"
                                                    className="border border-outline-300 rounded-md p-3 bg-background-0"
                                                />
                                            )}
                                        />
                                        {errors.rentalPeriod && (
                                            <Text className="text-error-600 text-xs mt-1">
                                                {errors.rentalPeriod.message}
                                            </Text>
                                        )}
                                    </View>
                                )}
                            </View>

                            {/* Note: Image editing is not included in this basic version */}
                            <View>
                                <Text className="text-typography-500 mb-1">Images</Text>
                                <Text className="text-typography-400 text-xs italic">
                                    Images cannot be modified in this version
                                </Text>
                                <View className="flex-row flex-wrap mt-2">
                                    {watch('images')?.map((image, index) => (
                                        <View
                                            key={index}
                                            className="w-20 h-20 mr-2 mb-2 rounded-md overflow-hidden border border-outline-300"
                                        >
                                            <View className="w-full h-full bg-background-100 items-center justify-center">
                                                <Text className="text-xs text-typography-400">Image {index + 1}</Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </ModalBody>
                <ModalFooter>
                    <TouchableOpacity
                        onPress={onClose}
                        className="bg-background-100 rounded-md px-4 py-2 mr-2"
                    >
                        <Text className="text-typography-600">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className={`bg-primary-500 rounded-md px-4 py-2 flex-row items-center ${isSubmitting ? 'opacity-70' : ''}`}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />
                        ) : null}
                        <Text className="text-white font-medium">Update Listing</Text>
                    </TouchableOpacity>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

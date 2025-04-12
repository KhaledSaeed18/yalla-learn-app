import React, { useState } from 'react'
import { View, ScrollView, TouchableOpacity, Switch, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '@/components/ui/text'
import { Heading } from '@/components/ui/heading'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Input, InputField } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectItem } from '@/components/ui/select'
import { ChevronDownIcon } from '@/components/ui/icon'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productSchema, ProductFormData } from '@/lib/validations/product.validation'
import { Condition, ListingCategory } from '@/types/enums'

export default function AddProduct() {
    const [isLoading, setIsLoading] = useState(false);

    // Format enum values for display
    const formatEnumValue = (value: string) => {
        return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    // Initialize react-hook-form with zod resolver
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
        setValue
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

    // Watch the isRentable field to conditionally render rental period input
    const isRentable = watch('isRentable');
    const images = watch('images') || [];

    // Handle image selection (placeholder)
    const handleAddImage = () => {
        // In a real app, this would open image picker and add to images
        const newImages = [...images, `image-${images.length + 1}`];
        setValue('images', newImages);
    };

    // Submit the listing
    const onSubmit = (data: ProductFormData) => {
        setIsLoading(true);
        console.log("Submitting validated product", data);

        // Add API call to save the listing
        setTimeout(() => {
            setIsLoading(false);
            // Show success message or navigate away
            router.push('/');
        }, 1500);
    };

    return (
        <SafeAreaView edges={["top", "right", "left"]} className='bg-background-0 flex-1'>
            <View className="px-4 py-3 bg-background-0 z-10 border-b border-outline-200 flex-row items-center">
                <TouchableOpacity onPress={() => router.push('/add')} className="pr-4">
                    <FontAwesome name="arrow-left" size={25} color="rgb(var(--color-primary-500))" />
                </TouchableOpacity>
                <Heading size="xl" className="flex-1 text-center pr-8">
                    Add a Product
                </Heading>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                className="flex-1"
            >
                <View className='p-4 flex flex-col gap-4'>
                    <View>
                        <Text className="mb-2 text-typography-700">Product Title</Text>
                        <Controller
                            control={control}
                            name="title"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input variant="outline" size="md">
                                    <InputField
                                        placeholder="Enter product title"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                    />
                                </Input>
                            )}
                        />
                        {errors.title && <Text className="text-error-600 text-xs mt-1">{errors.title.message}</Text>}
                    </View>

                    <View>
                        <Text className="mb-2 text-typography-700">Price ($)</Text>
                        <Controller
                            control={control}
                            name="price"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input variant="outline" size="md">
                                    <InputField
                                        placeholder="Enter price"
                                        keyboardType="numeric"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                    />
                                </Input>
                            )}
                        />
                        {errors.price && <Text className="text-error-600 text-xs mt-1">{errors.price.message}</Text>}
                    </View>

                    <View>
                        <Text className="mb-2 text-typography-700">Category</Text>
                        <Controller
                            control={control}
                            name="category"
                            render={({ field: { onChange, value } }) => (
                                <Select onValueChange={onChange} defaultValue={value}>
                                    <SelectTrigger variant="outline" size="md">
                                        <SelectInput
                                            placeholder="Select category"
                                            value={formatEnumValue(value)}
                                        />
                                        <SelectIcon className="mr-3" as={ChevronDownIcon} />
                                    </SelectTrigger>
                                    <SelectPortal>
                                        <SelectBackdrop />
                                        <SelectContent>
                                            <SelectDragIndicatorWrapper>
                                                <SelectDragIndicator />
                                            </SelectDragIndicatorWrapper>
                                            {Object.values(ListingCategory).map(cat => (
                                                <SelectItem
                                                    key={cat}
                                                    label={formatEnumValue(cat)}
                                                    value={cat}
                                                />
                                            ))}
                                        </SelectContent>
                                    </SelectPortal>
                                </Select>
                            )}
                        />
                        {errors.category && <Text className="text-error-600 text-xs mt-1">{errors.category.message}</Text>}
                    </View>

                    <View>
                        <Text className="mb-2 text-typography-700">Condition</Text>
                        <Controller
                            control={control}
                            name="condition"
                            render={({ field: { onChange, value } }) => (
                                <Select onValueChange={onChange} defaultValue={value}>
                                    <SelectTrigger variant="outline" size="md">
                                        <SelectInput
                                            placeholder="Select condition"
                                            value={formatEnumValue(value)}
                                        />
                                        <SelectIcon className="mr-3" as={ChevronDownIcon} />
                                    </SelectTrigger>
                                    <SelectPortal>
                                        <SelectBackdrop />
                                        <SelectContent>
                                            <SelectDragIndicatorWrapper>
                                                <SelectDragIndicator />
                                            </SelectDragIndicatorWrapper>
                                            {Object.values(Condition).map(cond => (
                                                <SelectItem
                                                    key={cond}
                                                    label={formatEnumValue(cond)}
                                                    value={cond}
                                                />
                                            ))}
                                        </SelectContent>
                                    </SelectPortal>
                                </Select>
                            )}
                        />
                        {errors.condition && <Text className="text-error-600 text-xs mt-1">{errors.condition.message}</Text>}
                    </View>

                    <View>
                        <Text className="mb-2 text-typography-700">Description</Text>
                        <Controller
                            control={control}
                            name="description"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input variant="outline" size="md" className="h-24">
                                    <InputField
                                        placeholder="Describe your product"
                                        multiline
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                        className="pt-2"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                    />
                                </Input>
                            )}
                        />
                        {errors.description && <Text className="text-error-600 text-xs mt-1">{errors.description.message}</Text>}
                    </View>

                    <View className="flex-row items-center justify-between">
                        <Text className="text-typography-700">Available for Rent</Text>
                        <Controller
                            control={control}
                            name="isRentable"
                            render={({ field: { onChange, value } }) => (
                                <Switch
                                    value={value}
                                    onValueChange={onChange}
                                    trackColor={{ false: '#767577', true: 'rgb(var(--color-primary-500))' }}
                                />
                            )}
                        />
                    </View>

                    {isRentable && (
                        <View>
                            <Text className="mb-2 text-typography-700">Rental Period (days)</Text>
                            <Controller
                                control={control}
                                name="rentalPeriod"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input variant="outline" size="md">
                                        <InputField
                                            placeholder="Number of days"
                                            keyboardType="numeric"
                                            value={value ?? ''}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                        />
                                    </Input>
                                )}
                            />
                            {errors.rentalPeriod && <Text className="text-error-600 text-xs mt-1">{errors.rentalPeriod.message}</Text>}
                        </View>
                    )}

                    <View>
                        <Text className="mb-2 text-typography-700">Upload Photos</Text>
                        <TouchableOpacity
                            className="border-2 border-dashed border-primary-500 h-32 rounded-md items-center justify-center"
                            onPress={handleAddImage}
                        >
                            <FontAwesome name="camera" size={32} color="rgb(var(--color-primary-500))" />
                            <Text className="mt-2 text-primary-500">Tap to add photos</Text>
                        </TouchableOpacity>

                        {images.length > 0 && (
                            <View className="flex-row flex-wrap mt-2">
                                {images.map((img, index) => (
                                    <View key={index} className="w-20 h-20 bg-gray-200 rounded-md m-1 items-center justify-center">
                                        <Text>Image {index + 1}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                        {errors.images && <Text className="text-error-600 text-xs mt-1">{errors.images.message}</Text>}
                    </View>

                    <View className="mt-4">
                        <Button
                            size="lg"
                            className="bg-primary-500"
                            onPress={handleSubmit(onSubmit)}
                            isDisabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white font-bold">Submit Listing</Text>
                            )}
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

import React, { useState } from 'react'
import { View, ScrollView, TouchableOpacity, Switch, ActivityIndicator, Image, Alert } from 'react-native'
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
import * as ImagePicker from 'expo-image-picker'
import { Actionsheet, ActionsheetContent, ActionsheetItem, ActionsheetItemText, ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper, ActionsheetBackdrop } from "@/components/ui/actionsheet"
import { productService } from '@/services/product.service'
import { ApiError } from '@/api/base'

export default function AddProduct() {
    const [isLoading, setIsLoading] = useState(false);
    const [imagePickerOpen, setImagePickerOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const formatEnumValue = (value: string) => {
        return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

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
    const images = watch('images') || [];

    const requestCameraPermission = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Camera permission is required to take photos.');
            return false;
        }
        return true;
    };

    const requestMediaLibraryPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Media library permission is required to select photos.');
            return false;
        }
        return true;
    };

    const takePhoto = async () => {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) return;

        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const newImage = result.assets[0];
                setValue('images', [...images, newImage.uri]);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert('Error', 'Failed to take photo');
        }
    };

    const pickImages = async () => {
        const hasPermission = await requestMediaLibraryPermission();
        if (!hasPermission) return;

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                selectionLimit: 5 - images.length,
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const newImages = result.assets.map(asset => asset.uri);
                setValue('images', [...images, ...newImages]);
            }
        } catch (error) {
            console.error('Error picking images:', error);
            Alert.alert('Error', 'Failed to pick images');
        }
    };

    const handleAddImage = () => {
        setImagePickerOpen(true);
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setValue('images', newImages);
    };

    const onSubmit = async (data: ProductFormData) => {
        try {
            setIsLoading(true);

            setIsUploading(true);
            const uploadedImageUrls = await productService.uploadProductImages(data.images);
            setIsUploading(false);

            const productData = {
                ...data,
                images: uploadedImageUrls
            };

            await productService.createProduct(productData);

            Alert.alert(
                "Success",
                "Your product has been successfully listed!",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            reset({
                                title: '',
                                description: '',
                                price: '',
                                condition: Condition.NEW,
                                category: ListingCategory.OTHER,
                                isRentable: false,
                                rentalPeriod: '',
                                images: []
                            });
                            router.push('/listings');
                        }
                    }
                ]
            );

        } catch (error) {
            let errorMessage = "Failed to create product listing. Please try again.";

            if (error instanceof ApiError) {
                errorMessage = error.message;
            }

            Alert.alert("Error", errorMessage);
        } finally {
            setIsLoading(false);
        }
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

                    <View>
                        <Text className="mb-2 text-typography-700">Upload Photos</Text>
                        <TouchableOpacity
                            className="border-2 border-dashed border-primary-500 h-32 rounded-md items-center justify-center"
                            onPress={handleAddImage}
                        >
                            <FontAwesome name="camera" size={32} color="rgb(var(--color-primary-500))" />
                            <Text className="mt-2 text-primary-500">Tap to add photos</Text>
                            {images.length > 0 && (
                                <Text className="text-typography-500 text-xs mt-1">
                                    {images.length} {images.length === 1 ? 'photo' : 'photos'} selected
                                </Text>
                            )}
                        </TouchableOpacity>

                        {images.length > 0 && (
                            <View className="flex-row flex-wrap mt-2">
                                {images.map((img, index) => (
                                    <View key={index} className="w-24 h-24 m-1 relative">
                                        <Image
                                            source={{ uri: img }}
                                            className="w-full h-full rounded-md"
                                            resizeMode="cover"
                                        />
                                        <TouchableOpacity
                                            className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1"
                                            onPress={() => removeImage(index)}
                                        >
                                            <FontAwesome name="times" size={14} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                                {images.length < 5 && (
                                    <TouchableOpacity
                                        className="w-24 h-24 bg-background-100 border border-outline-300 rounded-md m-1 items-center justify-center"
                                        onPress={handleAddImage}
                                    >
                                        <FontAwesome name="plus" size={20} color="rgb(var(--color-primary-500))" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                        {errors.images && <Text className="text-error-600 text-xs mt-1">{errors.images.message}</Text>}
                    </View>

                    <View className="mt-4">
                        <Button
                            size="lg"
                            className="bg-primary-500"
                            onPress={handleSubmit(onSubmit)}
                            isDisabled={isLoading || isUploading}
                        >
                            {isLoading || isUploading ? (
                                <View className="flex-row items-center">
                                    <ActivityIndicator color="white" size="small" />
                                    <Text className="text-white font-bold ml-2">
                                        {isUploading ? 'Uploading Images...' : 'Creating Listing...'}
                                    </Text>
                                </View>
                            ) : (
                                <Text className="text-white font-bold">Submit Listing</Text>
                            )}
                        </Button>
                    </View>
                </View>
            </ScrollView>

            {/* Image picker action sheet */}
            <Actionsheet isOpen={imagePickerOpen} onClose={() => setImagePickerOpen(false)}>
                <ActionsheetBackdrop />
                <ActionsheetContent>
                    <ActionsheetDragIndicatorWrapper>
                        <ActionsheetDragIndicator />
                    </ActionsheetDragIndicatorWrapper>
                    <ActionsheetItem
                        onPress={() => {
                            setImagePickerOpen(false);
                            setTimeout(takePhoto, 500);
                        }}
                    >
                        <View className="flex-row items-center">
                            <FontAwesome name="camera" size={24} color="rgb(var(--color-primary-500))" />
                            <ActionsheetItemText className="ml-4">Take a photo</ActionsheetItemText>
                        </View>
                    </ActionsheetItem>

                    <ActionsheetItem
                        onPress={() => {
                            setImagePickerOpen(false);
                            setTimeout(pickImages, 500);
                        }}
                    >
                        <View className="flex-row items-center">
                            <FontAwesome name="image" size={24} color="rgb(var(--color-primary-500))" />
                            <ActionsheetItemText className="ml-4">Choose from gallery</ActionsheetItemText>
                        </View>
                    </ActionsheetItem>

                    <ActionsheetItem onPress={() => setImagePickerOpen(false)}>
                        <ActionsheetItemText className="text-center">Cancel</ActionsheetItemText>
                    </ActionsheetItem>
                </ActionsheetContent>
            </Actionsheet>
        </SafeAreaView>
    )
}

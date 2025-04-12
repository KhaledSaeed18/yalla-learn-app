import React, { useState } from 'react'
import { View, ScrollView, TouchableOpacity, Switch } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '@/components/ui/text'
import { Heading } from '@/components/ui/heading'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Input, InputField } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectItem } from '@/components/ui/select'
import { ChevronDownIcon } from '@/components/ui/icon'

// Enums from the model
enum Condition {
    NEW = "NEW",
    LIKE_NEW = "LIKE_NEW",
    GOOD = "GOOD",
    FAIR = "FAIR",
    POOR = "POOR"
}

enum ListingCategory {
    ELECTRONICS = "ELECTRONICS",
    CLOTHING = "CLOTHING",
    BOOKS = "BOOKS",
    COURSE_MATERIALS = "COURSE_MATERIALS",
    MUSICAL_INSTRUMENTS = "MUSICAL_INSTRUMENTS",
    SPORTS_EQUIPMENT = "SPORTS_EQUIPMENT",
    TOOLS = "TOOLS",
    OTHER = "OTHER"
}

export default function AddProduct() {
    // State to track form values
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        condition: Condition.NEW,
        category: ListingCategory.OTHER,
        isRentable: false,
        rentalPeriod: '',
        images: [] as string[]
    });

    // Format enum values for display
    const formatEnumValue = (value: string) => {
        return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    // Helper for updating form values
    const updateFormField = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    // Handle image selection (placeholder)
    const handleAddImage = () => {
        // In a real app, this would open image picker and add to formData.images
        console.log("Adding image");
    };

    // Submit the listing
    const submitListing = () => {
        console.log("Submitting product", formData);
        // Add API call to save the listing
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
                        <Input variant="outline" size="md">
                            <InputField
                                placeholder="Enter product title"
                                value={formData.title}
                                onChangeText={(text) => updateFormField('title', text)}
                            />
                        </Input>
                    </View>

                    <View>
                        <Text className="mb-2 text-typography-700">Price ($)</Text>
                        <Input variant="outline" size="md">
                            <InputField
                                placeholder="Enter price"
                                keyboardType="numeric"
                                value={formData.price}
                                onChangeText={(text) => updateFormField('price', text)}
                            />
                        </Input>
                    </View>

                    <View>
                        <Text className="mb-2 text-typography-700">Category</Text>
                        <Select onValueChange={(value) => updateFormField('category', value)}>
                            <SelectTrigger variant="outline" size="md">
                                <SelectInput
                                    placeholder="Select category"
                                    value={formatEnumValue(formData.category)}
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
                    </View>

                    <View>
                        <Text className="mb-2 text-typography-700">Condition</Text>
                        <Select onValueChange={(value) => updateFormField('condition', value)}>
                            <SelectTrigger variant="outline" size="md">
                                <SelectInput
                                    placeholder="Select condition"
                                    value={formatEnumValue(formData.condition)}
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
                    </View>

                    <View>
                        <Text className="mb-2 text-typography-700">Description</Text>
                        <Input variant="outline" size="md" className="h-24">
                            <InputField
                                placeholder="Describe your product"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                className="pt-2"
                                value={formData.description}
                                onChangeText={(text) => updateFormField('description', text)}
                            />
                        </Input>
                    </View>

                    <View className="flex-row items-center justify-between">
                        <Text className="text-typography-700">Available for Rent</Text>
                        <Switch
                            value={formData.isRentable}
                            onValueChange={(value) => updateFormField('isRentable', value)}
                            trackColor={{ false: '#767577', true: 'rgb(var(--color-primary-500))' }}
                        />
                    </View>

                    {formData.isRentable && (
                        <View>
                            <Text className="mb-2 text-typography-700">Rental Period (days)</Text>
                            <Input variant="outline" size="md">
                                <InputField
                                    placeholder="Number of days"
                                    keyboardType="numeric"
                                    value={formData.rentalPeriod}
                                    onChangeText={(text) => updateFormField('rentalPeriod', text)}
                                />
                            </Input>
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

                        {formData.images.length > 0 && (
                            <View className="flex-row flex-wrap mt-2">
                                {formData.images.map((img, index) => (
                                    <View key={index} className="w-20 h-20 bg-gray-200 rounded-md m-1">
                                        {/* Image preview would go here */}
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>

                    <View className="mt-4">
                        <Button
                            size="lg"
                            className="bg-primary-500"
                            onPress={submitListing}
                        >
                            <Text className="text-white font-bold">Submit Listing</Text>
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

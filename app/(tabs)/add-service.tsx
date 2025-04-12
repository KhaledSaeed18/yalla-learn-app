import React, { useState } from 'react'
import { View, ScrollView, TouchableOpacity } from 'react-native'
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
enum ServiceDirection {
    OFFERING = "OFFERING",
    REQUESTING = "REQUESTING"
}

enum GigCategory {
    TUTORING = "TUTORING",
    NOTES_SHARING = "NOTES_SHARING",
    ACADEMIC_WRITING = "ACADEMIC_WRITING",
    DESIGN_SERVICES = "DESIGN_SERVICES",
    CODING_HELP = "CODING_HELP",
    LANGUAGE_TRANSLATION = "LANGUAGE_TRANSLATION",
    EVENT_PLANNING = "EVENT_PLANNING",
    PHOTOGRAPHY = "PHOTOGRAPHY",
    MUSIC_LESSONS = "MUSIC_LESSONS",
    RESEARCH_ASSISTANCE = "RESEARCH_ASSISTANCE",
    EXAM_PREP = "EXAM_PREP",
    RESUME_WRITING = "RESUME_WRITING",
    CAMPUS_DELIVERY = "CAMPUS_DELIVERY",
    TECHNICAL_REPAIR = "TECHNICAL_REPAIR",
    OTHER = "OTHER"
}

export default function AddService() {
    const [serviceDirection, setServiceDirection] = useState<ServiceDirection>(ServiceDirection.OFFERING)
    const [isLoading, setIsLoading] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: GigCategory.OTHER,
    });

    // Helper for updating form values
    const updateFormField = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    // Reset form to initial values
    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            price: '',
            category: GigCategory.OTHER,
        });
    };

    // Format enum values for display
    const formatEnumValue = (value: string) => {
        return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    // Submit form handler
    const submitService = () => {
        setIsLoading(true);
        console.log("Service submitted", {
            ...formData,
            direction: serviceDirection,
            price: formData.price ? parseFloat(formData.price) : null
        });

        // Simulate API call with timeout
        setTimeout(() => {
            // Add actual API call here to save the service
            setIsLoading(false);
            resetForm(); // Clear form fields after successful submission
            // Optionally show success message or navigate away
        }, 1500); // 1.5 second delay
    };

    return (
        <SafeAreaView edges={["top", "right", "left"]} className='bg-background-0 flex-1'>
            <View className="px-4 py-3 bg-background-0 z-10 border-b border-outline-200 flex-row items-center">
                <TouchableOpacity onPress={() => router.push('/add')} className="pr-4">
                    <FontAwesome name="arrow-left" size={25} color="rgb(var(--color-primary-500))" />
                </TouchableOpacity>
                <Heading size="xl" className="flex-1 text-center pr-8">
                    Add a Service
                </Heading>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                className="flex-1"
            >
                <View className='p-4 flex flex-col gap-4'>
                    <View>
                        <Text className="mb-2 text-typography-700">Service Type</Text>
                        <View className="flex-row">
                            <TouchableOpacity
                                onPress={() => setServiceDirection(ServiceDirection.OFFERING)}
                                className={`flex-1 py-2 rounded-l-md items-center ${serviceDirection === ServiceDirection.OFFERING ? 'bg-primary-500' : 'bg-background-100 border border-outline-200'}`}
                            >
                                <Text className={serviceDirection === ServiceDirection.OFFERING ? 'text-white' : 'text-typography-700'}>I'm Offering</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setServiceDirection(ServiceDirection.REQUESTING)}
                                className={`flex-1 py-2 rounded-r-md items-center ${serviceDirection === ServiceDirection.REQUESTING ? 'bg-primary-500' : 'bg-background-100 border border-outline-200'}`}
                            >
                                <Text className={serviceDirection === ServiceDirection.REQUESTING ? 'text-white' : 'text-typography-700'}>I'm Requesting</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View>
                        <Text className="mb-2 text-typography-700">Service Title</Text>
                        <Input variant="outline" size="md">
                            <InputField
                                placeholder="Enter service title"
                                value={formData.title}
                                onChangeText={(text) => updateFormField('title', text)}
                            />
                        </Input>
                    </View>

                    {serviceDirection === ServiceDirection.OFFERING && (
                        <View>
                            <Text className="mb-2 text-typography-700">Your Rate</Text>
                            <Input variant="outline" size="md">
                                <InputField
                                    placeholder="$25/hour (optional)"
                                    keyboardType="numeric"
                                    value={formData.price}
                                    onChangeText={(text) => updateFormField('price', text)}
                                />
                            </Input>
                        </View>
                    )}

                    <View>
                        <Text className="mb-2 text-typography-700">Category</Text>
                        <Select
                            onValueChange={(value) => updateFormField('category', value)}
                            defaultValue={formData.category}
                        >
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
                                    {Object.values(GigCategory).map(cat => (
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
                        <Text className="mb-2 text-typography-700">Description</Text>
                        <Input variant="outline" size="md" className="h-24">
                            <InputField
                                placeholder={serviceDirection === ServiceDirection.OFFERING ? "Describe the service you're offering" : "Describe the service you're looking for"}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                className="pt-2"
                                value={formData.description}
                                onChangeText={(text) => updateFormField('description', text)}
                            />
                        </Input>
                    </View>

                    <View className="mt-4">
                        <Button
                            size="lg"
                            className="bg-primary-500"
                            onPress={submitService}
                            isDisabled={isLoading}
                        >
                            <Text className="text-white font-bold">
                                {isLoading
                                    ? (serviceDirection === ServiceDirection.OFFERING ? "Listing..." : "Posting...")
                                    : (serviceDirection === ServiceDirection.OFFERING ? "List My Service" : "Post My Request")
                                }
                            </Text>
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

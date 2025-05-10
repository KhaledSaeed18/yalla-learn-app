import React, { useState } from 'react'
import { View, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
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
import { serviceSchema, ServiceFormData } from '@/lib/validations/service.validation'
import { ServiceDirection, GigCategory } from '@/types/enums'
import { serviceService } from '@/services/service.service'
import { ApiError } from '@/api/base'

export default function AddService() {
    const [isLoading, setIsLoading] = useState(false)

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
        reset
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

    const formatEnumValue = (value: string) => {
        return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    const onSubmit = async (data: ServiceFormData) => {
        setIsLoading(true);
        try {
            await serviceService.createService(data);

            Alert.alert(
                "Success",
                `Your service ${direction === ServiceDirection.OFFERING ? 'offer' : 'request'} has been successfully posted!`,
                [
                    {
                        text: "OK",
                        onPress: () => {
                            reset({
                                title: '',
                                description: '',
                                price: '',
                                category: GigCategory.OTHER,
                                direction: ServiceDirection.OFFERING
                            });
                            // Navigate to services page with refresh parameter
                            router.push('/services?refresh=true');
                        }
                    }
                ]
            );
        } catch (error) {
            let errorMessage = "Failed to create service listing. Please try again.";

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
                        <Controller
                            control={control}
                            name="direction"
                            render={({ field: { onChange, value } }) => (
                                <View className="flex-row">
                                    <TouchableOpacity
                                        onPress={() => onChange(ServiceDirection.OFFERING)}
                                        className={`flex-1 py-2 rounded-l-md items-center ${value === ServiceDirection.OFFERING ? 'bg-primary-500' : 'bg-background-100 border border-outline-200'}`}
                                    >
                                        <Text className={value === ServiceDirection.OFFERING ? 'text-white' : 'text-typography-700'}>I'm Offering</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => onChange(ServiceDirection.REQUESTING)}
                                        className={`flex-1 py-2 rounded-r-md items-center ${value === ServiceDirection.REQUESTING ? 'bg-primary-500' : 'bg-background-100 border border-outline-200'}`}
                                    >
                                        <Text className={value === ServiceDirection.REQUESTING ? 'text-white' : 'text-typography-700'}>I'm Requesting</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                        {errors.direction && <Text className="text-error-600 text-xs mt-1">{errors.direction.message}</Text>}
                    </View>

                    <View>
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
                        {errors.title && <Text className="text-error-600 text-xs mt-1">{errors.title.message}</Text>}
                    </View>

                    {direction === ServiceDirection.OFFERING && (
                        <View>
                            <Text className="mb-2 text-typography-700">Your Rate</Text>
                            <Controller
                                control={control}
                                name="price"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input variant="outline" size="md">
                                        <InputField
                                            placeholder="$25/hour (optional)"
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
                    )}

                    <View>
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
                            )}
                        />
                        {errors.category && <Text className="text-error-600 text-xs mt-1">{errors.category.message}</Text>}
                    </View>

                    <View>
                        <Text className="mb-2 text-typography-700">Description</Text>
                        <Controller
                            control={control}
                            name="description"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input variant="outline" size="md" className="h-24">
                                    <InputField
                                        placeholder={direction === ServiceDirection.OFFERING ? "Describe the service you're offering" : "Describe the service you're looking for"}
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
                                <Text className="text-white font-bold">
                                    {direction === ServiceDirection.OFFERING ? "List My Service" : "Post My Request"}
                                </Text>
                            )}
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

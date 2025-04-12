import React from 'react'
import { View, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '@/components/ui/text'
import { Heading } from '@/components/ui/heading'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Input, InputField } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function AddProduct() {
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
                            <InputField placeholder="Enter product title" />
                        </Input>
                    </View>

                    <View>
                        <Text className="mb-2 text-typography-700">Price ($)</Text>
                        <Input variant="outline" size="md">
                            <InputField
                                placeholder="Enter price"
                                keyboardType="numeric"
                            />
                        </Input>
                    </View>

                    <View>
                        <Text className="mb-2 text-typography-700">Category</Text>
                        <Input variant="outline" size="md">
                            <InputField placeholder="Select category" />
                        </Input>
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
                            />
                        </Input>
                    </View>

                    <View>
                        <Text className="mb-2 text-typography-700">Upload Photos</Text>
                        <TouchableOpacity className="border-2 border-dashed border-primary-500 h-32 rounded-md items-center justify-center">
                            <FontAwesome name="camera" size={32} color="rgb(var(--color-primary-500))" />
                            <Text className="mt-2 text-primary-500">Tap to add photos</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="mt-4">
                        <Button
                            size="lg"
                            className="bg-primary-500"
                            onPress={() => console.log("Product submitted")}
                        >
                            <Text className="text-white font-bold">Submit Listing</Text>
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

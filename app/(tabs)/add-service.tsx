import React, { useState } from 'react'
import { View, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '@/components/ui/text'
import { Heading } from '@/components/ui/heading'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Input, InputField } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function AddService() {
    const [serviceType, setServiceType] = useState('offer')

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
                                onPress={() => setServiceType('offer')}
                                className={`flex-1 py-2 rounded-l-md items-center ${serviceType === 'offer' ? 'bg-primary-500' : 'bg-background-100 border border-outline-200'}`}
                            >
                                <Text className={serviceType === 'offer' ? 'text-white' : 'text-typography-700'}>I'm Offering</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setServiceType('request')}
                                className={`flex-1 py-2 rounded-r-md items-center ${serviceType === 'request' ? 'bg-primary-500' : 'bg-background-100 border border-outline-200'}`}
                            >
                                <Text className={serviceType === 'request' ? 'text-white' : 'text-typography-700'}>I'm Requesting</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View>
                        <Text className="mb-2 text-typography-700">Service Title</Text>
                        <Input variant="outline" size="md">
                            <InputField placeholder="Enter service title" />
                        </Input>
                    </View>

                    {serviceType === 'offer' && (
                        <View>
                            <Text className="mb-2 text-typography-700">Your Rate</Text>
                            <Input variant="outline" size="md">
                                <InputField placeholder="$25/hour (optional)" />
                            </Input>
                        </View>
                    )}

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
                                placeholder={serviceType === 'offer' ? "Describe the service you're offering" : "Describe the service you're looking for"}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                className="pt-2"
                            />
                        </Input>
                    </View>

                    <View>
                        <Text className="mb-2 text-typography-700">Availability</Text>
                        <Input variant="outline" size="md">
                            <InputField placeholder="When are you available?" />
                        </Input>
                    </View>

                    <View className="mt-4">
                        <Button
                            size="lg"
                            className="bg-primary-500"
                            onPress={() => console.log("Service submitted")}
                        >
                            <Text className="text-white font-bold">
                                {serviceType === 'offer' ? "List My Service" : "Post My Request"}
                            </Text>
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

import React from 'react'
import { View, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { Image } from "@/components/ui/image"
import { FontAwesome } from '@expo/vector-icons'

const add = () => {
    const handleAddProductClick = () => {
        console.log("Add Product card clicked")
    }

    const handleAddServiceClick = () => {
        console.log("Add Service card clicked")
    }

    return (
        <SafeAreaView edges={["top", "right", "left"]} className='bg-background-0 flex-1'>
            <View className="px-4 py-3 bg-background-0 z-10 border-b border-[#3b83f664]">
                <Heading size="xl" className="text-center">
                    What would you like to add?
                </Heading>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                className="flex-1"
            >
                <View className='p-4 flex flex-col'>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleAddProductClick}
                        className="mb-4"
                    >
                        <Card size="lg" variant="outline" className="border-[#3b82f6]">
                            <Image
                                source={{
                                    uri: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=1000",
                                }}
                                className="mb-2 h-[200px] w-full rounded-md"
                                alt="Student marketplace products"
                            />
                            <View className="flex-row justify-between items-center gap-0.5">
                                <View className="flex-1">
                                    <Heading size="xl" className="mb-1">
                                        Sell a Product
                                    </Heading>
                                    <Text size="lg">List textbooks, electronics, furniture or other items you want to sell to fellow students</Text>
                                </View>
                                <FontAwesome name="chevron-right" size={20} color="#3b82f6" />
                            </View>
                        </Card>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleAddServiceClick}
                    >
                        <Card size="lg" variant="outline" className="border-[#3b82f6]">
                            <Image
                                source={{
                                    uri: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000",
                                }}
                                className="mb-2 h-[200px] w-full rounded-md"
                                alt="Student services"
                            />
                            <View className="flex-row justify-between items-center gap-0.5">
                                <View className="flex-1">
                                    <Heading size="xl" className="mb-1">
                                        Offer or Request a Service
                                    </Heading>
                                    <Text size="lg">Offer or find tutoring, design work, event help and other services within the campus community</Text>
                                </View>
                                <FontAwesome name="chevron-right" size={20} color="#3b82f6" />
                            </View>
                        </Card>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default add
import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { Image } from "@/components/ui/image"

const add = () => {
    const handleAddProductClick = () => {
        console.log("Add Product card clicked")
    }

    const handleAddServiceClick = () => {
        console.log("Add Service card clicked")
    }

    return (
        <SafeAreaView className='bg-background-0 flex-1'>
            <View className='px-3 flex flex-col gap-3 pt-4'>
                <Heading size="xl" className="mb-3 text-center">
                    What would you like to add?
                </Heading>

                <TouchableOpacity activeOpacity={0.7} onPress={handleAddProductClick}>
                    <Card size="lg" variant="outline">
                        <Image
                            source={{
                                uri: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=1000",
                            }}
                            className="mb-2 h-[200px] w-full rounded-md"
                            alt="Student marketplace products"
                        />
                        <Heading size="md" className="mb-1">
                            Sell a Product
                        </Heading>
                        <Text size="sm">List textbooks, electronics, furniture or other items you want to sell to fellow students</Text>
                    </Card>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.7} onPress={handleAddServiceClick}>
                    <Card size="lg" variant="outline">
                        <Image
                            source={{
                                uri: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000",
                            }}
                            className="mb-2 h-[200px] w-full rounded-md"
                            alt="Student services"
                        />
                        <Heading size="md" className="mb-1">
                            Offer a Service
                        </Heading>
                        <Text size="sm">Provide tutoring, design work, event help or other services to the campus community</Text>
                    </Card>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default add
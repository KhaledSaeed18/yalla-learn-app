import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { Image } from "@/components/ui/image"

const add = () => {
    const handleCard1Click = () => {
        console.log("Card 1 was clicked - Quick Start")
    }

    const handleCard2Click = () => {
        console.log("Card 2 was clicked - Quick Start")
    }

    return (
        <SafeAreaView className='bg-background-0 flex-1'>
            <View className='px-3 flex flex-col gap-3'>
                <TouchableOpacity activeOpacity={0.7} onPress={handleCard1Click}>
                    <Card size="lg" variant="outline">
                        <Image
                            source={{
                                uri: "https://gluestack.github.io/public-blog-video-assets/yoga.png",
                            }}
                            className="mb-2 h-[240px] w-full rounded-md"
                            alt="image"
                        />
                        <Heading size="md" className="mb-1">
                            Quick Start
                        </Heading>
                        <Text size="sm">Start building your next project in minutes</Text>
                    </Card>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.7} onPress={handleCard2Click}>
                    <Card size="lg" variant="outline">
                        <Image
                            source={{
                                uri: "https://gluestack.github.io/public-blog-video-assets/yoga.png",
                            }}
                            className="mb-2 h-[240px] w-full rounded-md"
                            alt="image"
                        />
                        <Heading size="md" className="mb-1">
                            Quick Start
                        </Heading>
                        <Text size="sm">Start building your next project in minutes</Text>
                    </Card>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default add
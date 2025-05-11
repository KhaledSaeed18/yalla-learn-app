import { Image, Text, Linking } from "react-native";
import { Box } from "./box";
import { Button } from "./button";
import { Heading } from "./heading";
import { FontAwesome } from "@expo/vector-icons";

function WebsiteCTA() {
    return (
        <Box className="mb-4">
            {/* Text and CTA */}
            <Box className="flex-row items-center justify-between mb-2">
                <Heading size="lg">
                    Explore More on Our Website!
                </Heading>
                <Button
                    size="md"
                    variant="solid"
                    className="bg-[#3B82F6] text-white"
                    onPress={() => {
                        Linking.openURL('https://www.yalla-learn.com').catch(err =>
                            console.error('An error occurred opening the URL:', err)
                        );
                    }}
                >
                    <FontAwesome name="external-link" size={14} color="#fff" className="mr-1" />
                    <Text className="text-white font-semibold">
                        Visit Now
                    </Text>
                </Button>
            </Box>
            <Box className="rounded-2xl shadow-lg overflow-hidden">
                {/* Browser top bar */}
                <Box className="flex-row items-center px-3 py-2 bg-gray-200">
                    {/* Circles */}
                    <Box className="flex-row items-center mr-4">
                        <Box className="w-3 h-3 bg-red-500 rounded-full mr-1" />
                        <Box className="w-3 h-3 bg-yellow-500 rounded-full mr-1" />
                        <Box className="w-3 h-3 bg-green-500 rounded-full" />
                    </Box>

                    {/* Mock address bar */}
                    <Box className="flex-1 px-3 py-1 bg-white rounded-full">
                        <Text className="text-md text-center">www.yalla-learn.com</Text>
                    </Box>
                </Box>

                {/* Website preview image */}
                <Image
                    source={{
                        uri: "https://plus.unsplash.com/premium_photo-1683121710572-7723bd2e235d?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    }}
                    className="w-full h-48"
                    resizeMode="cover"
                />
            </Box>
        </Box>
    );
}

export default WebsiteCTA;
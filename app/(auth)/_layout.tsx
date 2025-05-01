import { Stack } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function AuthLayout() {
    return (
        <SafeAreaProvider>
            <GluestackUIProvider mode="light">
                <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
                    <Stack.Screen name="signin" />
                    <Stack.Screen name="signup" />
                    <Stack.Screen name="verify-email" />
                </Stack>
            </GluestackUIProvider>
        </SafeAreaProvider>
    );
}

import "@/global.css";
import { Stack } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="light">
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </GluestackUIProvider>
  )
}

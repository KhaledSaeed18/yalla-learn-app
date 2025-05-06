import "@/global.css";
import { Stack, router, SplashScreen, useSegments, useRootNavigationState } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/redux/store';
import { View, ActivityIndicator } from 'react-native';
import { useEffect } from "react";
import { RootState } from "@/redux/store";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!navigationState?.key) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (isAuthenticated && inAuthGroup) {
      router.replace('/');
    } else if (!isAuthenticated && !inAuthGroup) {
      router.replace('/signin');
    }

    SplashScreen.hideAsync();
  }, [isAuthenticated, segments, navigationState?.key]);

  return (
    <GluestackUIProvider mode="light">
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </GluestackUIProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
          </View>
        }
        persistor={persistor}
      >
        <RootLayoutNav />
      </PersistGate>
    </Provider>
  )
}

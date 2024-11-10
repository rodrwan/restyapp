import "react-native-reanimated";
import "react-native-url-polyfill/auto";
import "expo-dev-client";

import { useEffect } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { NativeWindStyleSheet } from "nativewind";

import Header from "@/components/Header";

NativeWindStyleSheet.setOutput({
  default: "native",
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ header: () => <Header /> }} />
      <Stack.Screen name="home" options={{ header: () => <Header /> }} />
      <Stack.Screen name="(cart)" options={{ headerShown: false }} />
      <Stack.Screen name="(events)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
      <Stack.Screen name="menu" />

      <Stack.Screen
        name="(modal)/payments"
        options={{
          title: "Medios de pago",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}

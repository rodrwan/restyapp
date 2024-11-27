import "react-native-reanimated";
import "react-native-url-polyfill/auto";
import "expo-dev-client";

import { useEffect } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { NativeWindStyleSheet } from "nativewind";

import Header from "@/components/Header";
import { SessionProvider } from "@/context/AuthProvider";
import { LinearGradient } from "expo-linear-gradient";

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
    return <Slot />;
  }

  return (
    <SessionProvider>
      <RootLayoutNav />
    </SessionProvider>
  );
}

function RootLayoutNav() {
  return (
    <LinearGradient colors={["#04121A", "#092838"]} className="flex-1">
      <Stack>
        <Stack.Screen name="(home)" options={{ header: () => <Header /> }} />
        <Stack.Screen
          name="(auth)"
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen name="(events)" options={{ headerShown: false }} />
        <Stack.Screen name="(cart)" options={{ headerShown: false }} />
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
    </LinearGradient>
  );
}

import "react-native-reanimated";
import "react-native-url-polyfill/auto";
import "expo-dev-client";

import { useEffect } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Slot, Stack, useNavigationContainerRef } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { NativeWindStyleSheet } from "nativewind";

import Header from "@/components/Header";
import { SessionProvider } from "@/context/AuthProvider";
import { LinearGradient } from "expo-linear-gradient";
import * as Sentry from "@sentry/react-native";
import { isRunningInExpoGo } from "expo";

// Construct a new integration instance. This is needed to communicate between the integration and React
const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

Sentry.init({
  dsn: "https://e2842dcad510cf6a4ef20f5ef120a887@o4508393889464320.ingest.us.sentry.io/4508438730702848",
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  tracesSampleRate: 1.0, // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing. Adjusting this value in production.
  integrations: [
    // Pass integration
    navigationIntegration,
  ],
  enableNativeFramesTracking: !isRunningInExpoGo(), // Tracks slow and frozen frames in the application
});

NativeWindStyleSheet.setOutput({
  default: "native",
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayout() {
  // Capture the NavigationContainer ref and register it with the integration.
  const ref = useNavigationContainerRef();

  useEffect(() => {
    if (ref?.current) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

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

export default Sentry.wrap(RootLayout);

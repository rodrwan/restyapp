import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import useAuth from "@/hooks/useAuth";
import React from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Colors from "@/constants/Colors";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "index",
};

export default function HomeLayoutNav() {
  const { hasCheckedAuth, loadingUserData, checkAuth } = useAuth();

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loadingUserData || !hasCheckedAuth) {
    return <LoadingScreen />;
  }

  return (
    <View className="flex-1">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
      <StatusBar backgroundColor={Colors.white} style="dark" />
    </View>
  );
}

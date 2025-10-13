import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import useAuth from "@/hooks/useAuth";
import React from "react";
import LoadingScreen from "@/components/LoadingScreen";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "index",
};

export default function RestLayoutNav() {
  const { hasCheckedAuth, loadingUserData, checkAuth } = useAuth();

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loadingUserData || !hasCheckedAuth) {
    return <LoadingScreen />;
  }

  return (
    <View className="flex-1">
      <Stack>
        <Stack.Screen name="[restId]" />
      </Stack>
      <StatusBar backgroundColor="#041e2b" style="light" />
    </View>
  );
}

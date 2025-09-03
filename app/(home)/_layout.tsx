import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "index",
};

export default function HomeLayoutNav() {
  return (
    <View className="flex-1">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
      <StatusBar backgroundColor="#041e2b" style="light" />
    </View>
  );
}

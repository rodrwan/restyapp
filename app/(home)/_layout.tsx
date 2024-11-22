import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/Colors";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "index",
};

export default function HomeLayoutNav() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
      <StatusBar backgroundColor={Colors.secondary[500]} style="light" />
    </>
  );
}

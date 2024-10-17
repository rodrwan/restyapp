import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/Colors";

export default function RootLayoutNav() {
  return (
    <>
      <Stack>
        <Stack.Screen name="[eventId]" />
      </Stack>
      <StatusBar backgroundColor={Colors.secondary[500]} style="light" />
    </>
  );
}

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export default function EventsLayoutNav() {
  return (
    <View className="flex-1">
      <Stack>
        <Stack.Screen name="[eventId]" />
      </Stack>
      <StatusBar backgroundColor="#04121A" style="light" />
    </View>
  );
}

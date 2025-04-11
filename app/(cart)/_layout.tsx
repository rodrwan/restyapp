import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export default function CartLayoutNav() {
  return (
    <View className="flex-1">
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="checkout" />
        <Stack.Screen name="success" />
        <Stack.Screen name="failure" />
        <Stack.Screen
          name="payment"
          options={{
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="inscription"
          options={{
            title: "Registra tu tarjeta",
            presentation: "modal",
          }}
        />
      </Stack>
      <StatusBar backgroundColor="#04121A" style="light" />
    </View>
  );
}

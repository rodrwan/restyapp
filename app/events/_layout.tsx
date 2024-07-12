import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/Colors";

export default function RootLayoutNav() {
  return (
    <>
      <Stack>
        <Stack.Screen name="[eventId]" />
        <Stack.Screen name="cart" />
        <Stack.Screen name="checkout" />
        <Stack.Screen name="success" />
        <Stack.Screen name="failure" />
        <Stack.Screen
          name="payment"
          options={{
            presentation: "modal",
          }}
        />
      </Stack>
      <StatusBar backgroundColor={Colors.secondary[500]} style="light" />
    </>
  );
}

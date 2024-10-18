import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/Colors";

export default function RootLayoutNav() {
  return (
    <>
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
        <Stack.Screen
          name="(modal)/payments"
          options={{
            title: "Medios de pago",
            presentation: "modal",
          }}
        />
      </Stack>
      <StatusBar backgroundColor={Colors.secondary[500]} style="light" />
    </>
  );
}

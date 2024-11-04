import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Header from "@/components/Header";
import CheckAuth from "@/components/CheckAuth";

const AuthLayout = () => {
  return (
    <CheckAuth redirectTo="/(dashboard)">
      <Stack>
        <Stack.Screen name="index" options={{ header: () => <Header /> }} />
        <Stack.Screen name="tickets" />
        <Stack.Screen name="drinks" />
      </Stack>
      <StatusBar backgroundColor="#16162" style="light" />
    </CheckAuth>
  );
};

export default AuthLayout;

import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
      </Stack>

      <StatusBar backgroundColor="#16162" style="light" />
    </>
  );
};

export default AuthLayout;

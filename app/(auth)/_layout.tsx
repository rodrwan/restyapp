import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export const unstable_settings = {
  initialRouteName: "sign-in",
};

const AuthLayoutNav = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="reset-password" />
      </Stack>

      <StatusBar backgroundColor="#16162" style="light" />
    </>
  );
};

export default AuthLayoutNav;

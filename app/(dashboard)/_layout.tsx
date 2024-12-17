import React from "react";
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Header from "@/components/Header";
// import CheckAuth from "@/components/CheckAuth";
import { useSession } from "@/context/AuthProvider";
import { Text } from "react-native";

const DashboardLayoutNav = () => {
  const { session, isLoading } = useSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/(auth)/sign-in" />;
  }
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ header: () => <Header /> }} />
        <Stack.Screen name="tickets" />
        <Stack.Screen name="drinks" />
        <Stack.Screen name="profile" options={{ header: () => <Header /> }} />
      </Stack>
      <StatusBar backgroundColor="#16162" style="light" />
    </>
  );
};

export default DashboardLayoutNav;

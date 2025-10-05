import React from "react";
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Header from "@/components/Header";
import useAuth from "@/hooks/useAuth";
import LoadingScreen from "@/components/LoadingScreen";

const DashboardLayoutNav = () => {
  const { isAuthenticated, hasCheckedAuth, loadingUserData, checkAuth } =
    useAuth();

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loadingUserData || !hasCheckedAuth) {
    return <LoadingScreen />;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!isAuthenticated) {
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
        <Stack.Screen
          name="events/[eventId]/courtesy"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar backgroundColor="#041e2b" style="light" />
    </>
  );
};

export default DashboardLayoutNav;

import React, { useEffect } from "react";

import { router, useSegments } from "expo-router";
import useAuthStore from "@/stores/useAuth";

import AsyncStorage from "@react-native-async-storage/async-storage";
import HTTPClient from "@/lib/api";

const client = HTTPClient.getInstance();

const CheckAuth = ({ redirectTo, children }: any) => {
  const { auth, login } = useAuthStore();
  const segment = useSegments();

  const getAccessTokenFromStorage = async () => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    console.log("accessToken", accessToken);
    if (accessToken) {
      client.setAccessToken(accessToken);
      return accessToken;
    }

    return null;
  };

  useEffect(() => {
    console.log("CheckAuth", !auth.isLogged);
    if (auth.isLogged) {
      return;
    }

    getAccessTokenFromStorage().then((accessToken) => {
      if (accessToken) {
        login();
        return router.replace(redirectTo);
      }

      if (!auth.isLogged) {
        return router.replace(`/(auth)/sign-in?redirectTo=${redirectTo}`);
      }
    });
  }, [auth, segment]);

  return children;
};

export default CheckAuth;

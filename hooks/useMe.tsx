import HTTPClient from "@/lib/api";
import useUserStore from "@/stores/useUser";
import React from "react";
import { router } from "expo-router";

const client = HTTPClient.getInstance();

const useMe = () => {
  const [loadingUserData, setLoadingUserData] = React.useState(false);
  const { setUser } = useUserStore();

  const me = async () => {
    setLoadingUserData(true);
    try {
      const response = await client.me();
      if (!response.data?.me?.user) {
        return router.replace("/(auth)/sign-in?redirectTo=(dashboard)");
      }
      setUser(response.data?.me?.user);
      setLoadingUserData(false);
      return response.data?.me?.user;
    } catch (err: any) {
      if (err?.response?.errors[0]?.message === "session has expired") {
        throw new Error("expired session");
      } else {
        return null;
      }
    }
  };

  return { loadingUserData, me };
};

export default useMe;

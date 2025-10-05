import { Alert } from "react-native";
import { router } from "expo-router";

import HTTPClient from "@/lib/api";
import useUserStore from "@/stores/useUser";
import React from "react";

const client = HTTPClient.getInstance();

const useGetUserTodayEvent = () => {
  const [loadingTodayEvent, setLoadingTodayEvent] = React.useState(false);
  const { setTodayEvent } = useUserStore();

  const getUserFirstTodayEvent = async () => {
    setLoadingTodayEvent(true);
    try {
      const result = await client.getUserFirstTodayEvent();
      setTodayEvent(result.data?.getUserFirstTodayEvent);
      setLoadingTodayEvent(false);
      return result;
    } catch (err: any) {
      console.log(">>> getUserFirstTodayEvent error", err);
      setLoadingTodayEvent(false);
      throw err;
    }
  };

  return { loadingTodayEvent, getUserFirstTodayEvent };
};

export default useGetUserTodayEvent;

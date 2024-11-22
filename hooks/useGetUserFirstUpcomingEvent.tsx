import { Alert } from "react-native";
import { router } from "expo-router";

import HTTPClient from "@/lib/api";
import useUserStore from "@/stores/useUser";
import React from "react";

const client = HTTPClient.getInstance();

const getUserFirstUpcomingEvent = () => {
  const [loadingUpcomingEvent, setLoadingUpcomingEvent] = React.useState(false);
  const { setUpcomingEvent } = useUserStore();

  const getUserFirstUpcomingEvent = async () => {
    setLoadingUpcomingEvent(true);
    try {
      const result = await client.getUserFirstUpcomingEvent();
      setUpcomingEvent(result);
      setLoadingUpcomingEvent(false);
      return result;
    } catch (err: any) {
      console.log(">>> getUserFirstUpcomingEvent error", err);
      if (String(err).includes("unauthorized")) {
        console.log("getUserFirstUpcomingEvent error", err);
        return router.replace("/(auth)/sign-in?redirectTo=/(dashboard)");
      }

      setLoadingUpcomingEvent(false);
      throw err;
    }
  };

  return { loadingUpcomingEvent, getUserFirstUpcomingEvent };
};

export default getUserFirstUpcomingEvent;

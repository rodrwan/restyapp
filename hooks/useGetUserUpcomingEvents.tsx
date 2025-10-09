import { router } from "expo-router";

import HTTPClient from "@/lib/api";
import useUserStore from "@/stores/useUser";
import React from "react";

const client = HTTPClient.getInstance();

const useGetUserUpcomingEvents = () => {
  const [loadingUpcomingEvent, setLoadingUpcomingEvent] = React.useState(false);
  const { setUpcomingEvent } = useUserStore();

  const getUserUpcomingEvents = React.useCallback(async () => {
    setLoadingUpcomingEvent(true);
    try {
      const result = await client.getUserUpcomingEvents();
      setUpcomingEvent(result?.data?.getUserUpcomingEvents?.events);
      setLoadingUpcomingEvent(false);
      return result;
    } catch (err: any) {
      setLoadingUpcomingEvent(false);
      throw err;
    }
  }, [setUpcomingEvent]);

  return { loadingUpcomingEvent, getUserUpcomingEvents };
};

export default useGetUserUpcomingEvents;

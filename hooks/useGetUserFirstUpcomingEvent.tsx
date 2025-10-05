import { router } from "expo-router";

import HTTPClient from "@/lib/api";
import useUserStore from "@/stores/useUser";
import React from "react";

const client = HTTPClient.getInstance();

const GetUserFirstUpcomingEvent = () => {
  const [loadingUpcomingEvent, setLoadingUpcomingEvent] = React.useState(false);
  const { setUpcomingEvent } = useUserStore();

  const getUserFirstUpcomingEvent = React.useCallback(async () => {
    setLoadingUpcomingEvent(true);
    try {
      const result = await client.getUserFirstUpcomingEvent();
      setUpcomingEvent(result?.data?.getUserFirstUpcomingEvent);
      setLoadingUpcomingEvent(false);
      return result;
    } catch (err: any) {
      setLoadingUpcomingEvent(false);
      throw err;
    }
  }, [setUpcomingEvent]);

  return { loadingUpcomingEvent, getUserFirstUpcomingEvent };
};

export default GetUserFirstUpcomingEvent;

import { Alert } from "react-native";
import { router } from "expo-router";

import HTTPClient from "@/lib/api";
import useUserStore from "@/stores/useUser";
import React from "react";

const client = HTTPClient.getInstance();

const useGetEventsFromUser = () => {
  const [loadingGetEvents, setLoadingGetEvents] = React.useState(false);
  const { setTickets, setDrinks, setEvents } = useUserStore();
  const getEvents = async () => {
    setLoadingGetEvents(true);
    try {
      const orders = await client.getOrderItemsByUser();

      if ((orders?.length ?? 0) === 0) {
        return {
          orders: [],
          tickets: [],
          drinks: [],
          events: [],
        };
      }

      const events = orders
        ?.map((order: any) => order?.items?.map((item: any) => item?.event_id))
        ?.flat()
        .filter((x: any, i: any, a: any) => a.indexOf(x) == i);

      const response = await client.getEventsByIds(events);
      if (!response) {
        return {
          orders: [],
          tickets: [],
          drinks: [],
          events: [],
        };
      }

      const data = await Promise.all(
        response?.events?.map(async (event: any) => {
          return await client.getTicketsByUserAndEventID(event.id);
        })
      );

      const tickets = data?.map((d) => {
        return d?.data?.map((cur: any) => {
          if (cur?.event_item?.type !== "ENTRANCE") {
            return;
          }

          return {
            id: cur?.ticket?.id,
            base64: cur?.ticket?.base64,
            isValidated: cur?.ticket?.is_validated,
            name: cur?.event_item?.name,
            event: cur?.event,
          };
        }, {});
      });

      const drinks = data?.map((d) => {
        return d?.data?.map((cur: any) => {
          if (cur?.event_item?.type !== "DRINK") {
            return;
          }

          return {
            id: cur?.ticket?.id,
            base64: cur?.ticket?.base64,
            isValidated: cur?.ticket?.is_validated,
            name: cur?.event_item?.name,
            event: cur?.event,
          };
        }, {});
      });

      const result = {
        orders,
        tickets: tickets?.flat()?.filter(Boolean),
        drinks: drinks?.flat()?.filter(Boolean),
        events: response?.events,
      };
      // .filter((ticket) => !ticket?.isValidated),
      // .filter((ticket) => !ticket?.isValidated),
      setTickets(result?.tickets);
      setDrinks(result?.drinks);
      setEvents(result?.events);

      setLoadingGetEvents(false);
      return result;
    } catch (error: any) {
      console.log(">>> getEvents error", error);
      if (String(error).includes("unauthorized")) {
        console.log("getEvents error", error);
        return router.replace("/(auth)/sign-in?redirectTo=(dashboard)");
      }
      setLoadingGetEvents(false);
      Alert.alert(">> Error", error.message);
      throw new Error(error);
    }
  };

  return { getEvents, loadingGetEvents };
};

export default useGetEventsFromUser;

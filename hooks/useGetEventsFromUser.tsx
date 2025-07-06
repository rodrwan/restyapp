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
      const orderData = orders.data?.getOrderItemsByUser;
      if ((orderData?.length ?? 0) === 0) {
        return {
          orders: [],
          tickets: [],
          drinks: [],
          events: [],
        };
      }

      const events = orderData
        ?.map((order: any) => order?.items?.map((item: any) => item?.event_id))
        ?.flat()
        .filter((x: any, i: any, a: any) => a.indexOf(x) == i);

      const response = await client.getEventsByIds(events);
      const eventsData = response.data?.getEventsByIds;
      if (!response.data?.getEventsByIds?.events) {
        return {
          orders: [],
          tickets: [],
          drinks: [],
          events: [],
        };
      }

      const ticketsData = await Promise.all(
        response.data?.getEventsByIds?.events?.map(async (event: any) => {
          return await client.getTicketsByUserAndEventID(event.id);
        })
      );

      const tickets = ticketsData?.map((d: any) => {
        return d?.data?.getTickets?.data?.map((cur: any) => {
          if (cur?.event_item?.type !== "ENTRANCE") {
            return;
          }

          return {
            id: cur?.ticket?.id,
            base64: cur?.ticket?.base64,
            isValidated: cur?.ticket?.is_validated,
            name: cur?.event_item?.name,
            event: cur?.event,
            cover: cur?.ticket?.cover,
          };
        }, {});
      });

      const drinks = ticketsData?.map((d: any) => {
        return d?.data?.getTickets?.data?.map((cur: any) => {
          if (
            cur?.event_item?.type !== "COVER" &&
            cur?.event_item?.type !== "DRINK"
          ) {
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
        events: response.data?.getEventsByIds?.events,
      };
      // .filter((ticket) => !ticket?.isValidated),
      // .filter((ticket) => !ticket?.isValidated),
      setTickets(result?.tickets);
      setDrinks(result?.drinks);
      setEvents(result?.events);

      setLoadingGetEvents(false);
      return result;
    } catch (error: any) {
      console.log(">>> useGetEventsFromUser getEvents error", error);
      if (String(error).includes("unauthorized")) {
        console.log("useGetEventsFromUser getEvents unauthorized error", error);
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

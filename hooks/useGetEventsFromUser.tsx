import { Alert } from "react-native";
import { router } from "expo-router";

import HTTPClient from "@/lib/api";
import useUserStore from "@/stores/useUser";
import React from "react";

const client = HTTPClient.getInstance();

const useGetEventsFromUser = () => {
  const [loadingGetEvents, setLoadingGetEvents] = React.useState(false);
  const { setTickets, setDrinks, setEvents } = useUserStore();
  const getEvents = React.useCallback(async () => {
    console.log("useGetEventsFromUser: Starting getEvents");
    setLoadingGetEvents(true);
    try {
      const orders = await client.getOrderItemsByUser();
      const orderData = orders.data?.getOrderItemsByUser;
      if ((orderData?.length ?? 0) === 0) {
        console.log(
          "useGetEventsFromUser: No orders found, setting loading to false"
        );
        setTickets([]);
        setDrinks([]);
        setEvents([]);
        setLoadingGetEvents(false);
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
        console.log(
          "useGetEventsFromUser: No events found, setting loading to false"
        );
        setTickets([]);
        setDrinks([]);
        setEvents([]);
        setLoadingGetEvents(false);
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
            is_validated: cur?.ticket?.is_validated,
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
            is_validated: cur?.ticket?.is_validated,
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
      // .filter((ticket) => !ticket?.is_validated),
      // .filter((ticket) => !ticket?.is_validated),
      setTickets(result?.tickets);
      setDrinks(result?.drinks);
      setEvents(result?.events);

      console.log("useGetEventsFromUser: Success, setting loading to false");
      setLoadingGetEvents(false);
      return result;
    } catch (error: any) {
      console.log(
        "useGetEventsFromUser: Error occurred, setting loading to false",
        error
      );
      setLoadingGetEvents(false);
      Alert.alert(">> Error", error.message);
      throw new Error(error);
    }
  }, [setTickets, setDrinks, setEvents]);

  return { getEvents, loadingGetEvents };
};

export default useGetEventsFromUser;

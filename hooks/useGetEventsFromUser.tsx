import { Alert } from "react-native";
import { router } from "expo-router";

import HTTPClient from "@/lib/api";
import useUserStore from "@/stores/useUser";

const client = HTTPClient.getInstance();

const useGetEventsFromUser = () => {
  const { setTickets, setDrinks, setEvents, setUpcomingEvent } = useUserStore();
  const getEvents = async () => {
    try {
      const orders = await client.getOrderItemsByUser();

      if (orders?.length === 0) {
        return {
          orders: [],
          tickets: [],
          drinks: [],
          events: [],
        };
      }

      const events = orders
        .map((order: any) => order?.items?.map((item: any) => item?.event_id))
        .flat()
        .filter((x: any, i: any, a: any) => a.indexOf(x) == i);

      const response = await client.getEventsByIds(events);

      const data = await Promise.all(
        response?.events?.map(async (event: any) => {
          return await client.getTicketsByUserAndEventID(event.id);
        })
      );

      const tickets = data.map((d) => {
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

      const drinks = data.map((d) => {
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
        // .filter((ticket) => ticket.isValidated === false),
        drinks: drinks
          ?.flat()
          ?.filter(Boolean)
          ?.filter((ticket) => ticket.isValidated === false),
        events: response?.events,
      };

      setTickets(result?.tickets);
      setDrinks(result?.drinks);
      setEvents(result?.events);
      return result;
    } catch (error: any) {
      console.log(">>> getEvents error", error);
      if (String(error).includes("unauthorized")) {
        console.log("getEvents error", error);
        return router.push("/(auth)/sign-in?redirectTo=/(dashboard)");
      }

      Alert.alert(">> Error", error.message);
      throw new Error(error);
    }
  };

  const getUserFirstUpcomingEvent = async () => {
    try {
      const result = await client.getUserFirstUpcomingEvent();
      setUpcomingEvent(result);
      return result;
    } catch (err: any) {
      console.log(">>> getUserFirstUpcomingEvent error", err);
      if (String(err).includes("unauthorized")) {
        console.log("getUserFirstUpcomingEvent error", err);
        return router.push("/(auth)/sign-in?redirectTo=/(dashboard)");
      }

      throw err;
    }
  };

  return { getEvents, getUserFirstUpcomingEvent };
};

export default useGetEventsFromUser;

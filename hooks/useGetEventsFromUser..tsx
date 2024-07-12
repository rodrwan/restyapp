import { Alert } from "react-native";
import { useEffect, useRef, useState } from "react";
import HTTPClient from "@/lib/api";
import useUserStore from "@/stores/useUser";

const client = HTTPClient.getInstance();

const useGetEventsFromUser = () => {
  const { setTickets, setDrinks, setEvents } = useUserStore();
  const getEvents = async () => {
    try {
      const orders = await client.getOrderItemsByUser();

      if (orders.length === 0) {
        return {
          orders: [],
          tickets: [],
          drinks: [],
          events: [],
        };
      }

      const events = orders
        .map((order: any) => order.items.map((item: any) => item.event_id))
        .flat()
        .filter((x: any, i: any, a: any) => a.indexOf(x) == i);

      const response = await client.getEventsByIds(events);

      const data = await Promise.all(
        response.events.map(async (event: any) => {
          return await client.getTicketsByUserAndEventID(event.id);
        })
      );

      const tickets = data.map((d) => {
        return d.data.map((cur: any) => {
          if (cur.event_item.type !== "ENTRANCE") {
            return;
          }

          return {
            id: cur.ticket.id,
            base64: cur.ticket.base64,
            name: cur.event_item.name,
            event: cur.event,
          };
        }, {});
      });

      const drinks = data.map((d) => {
        return d.data.map((cur: any) => {
          if (cur.event_item.type !== "DRINK") {
            return;
          }

          return {
            id: cur.ticket.id,
            base64: cur.ticket.base64,
            name: cur.event_item.name,
            event: cur.event,
          };
        }, {});
      });

      const result = {
        orders,
        tickets: tickets.flat().filter(Boolean),
        drinks: drinks.flat().filter(Boolean),
        events: response.events,
      };

      setTickets(result.tickets);
      setDrinks(result.drinks);
      setEvents(result.events);
      return result;
    } catch (error: any) {
      console.log("error", error);
      Alert.alert(">> Error", error.message);
      throw new Error(error);
    }
  };

  return { getEvents };
};

export default useGetEventsFromUser;

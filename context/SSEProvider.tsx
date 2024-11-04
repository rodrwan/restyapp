import React from "react";

import RNEventSource from "react-native-sse";
// import RNEventSource from "react-native-event-source";

import { MANGO_API_URL } from "@/constants";
import useUserStore from "@/stores/useUser";

const SSEContext = React.createContext({});
export const useSSEContext = () => React.useContext(SSEContext);

const SSEProvider = async ({ accessToken, query, operationName }: any) => {
  const { updateTicket } = useUserStore();

  if (accessToken) {
    const options = {
      method: "POST",
      headers: {
        accept: "text/event-stream",
        "Content-Type": "application/json",
        "x-user-platform": "mobile",
        "X-User-Roles": "system",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify({
        query: query,
        variables: {},
        operationName: operationName,
      }),
    };

    const eventSource = new RNEventSource(MANGO_API_URL, options);

    const listener = (event: any) => {
      console.log("event", event);
      if (event.type === "open") {
        console.log("Open SSE connection.");
      } else if (event.type === "message") {
        console.log("event.data", event.data);
        updateTicket(JSON.parse(event.data)?.data?.validatedTicket);
      } else if (event.type === "error") {
        console.error("Connection error:", event.message);
      } else if (event.type === "exception") {
        console.error("Error:", event.message, event.error);
      }
    };

    React.useEffect(() => {
      eventSource.addEventListener("open", listener);
      eventSource.addEventListener("message", listener);
      eventSource.addEventListener("error", listener);
      eventSource.addEventListener("close", listener);

      return () => {
        eventSource.close();
        eventSource.removeAllEventListeners();
      };
    }, []);
  }
};

export default SSEProvider;

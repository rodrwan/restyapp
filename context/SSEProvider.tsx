import React from "react";
import RNEventSource from "react-native-event-source";

import { MANGO_API_URL } from "@/constants";

const SSEContext = React.createContext(null);
export const useSSEContext = () => React.useContext(SSEContext);

const SSEProvider = ({ accessToken, children }: any) => {
  const options = { headers: { Authorization: `Bearer ${accessToken}` } };
  const eventSource = new RNEventSource(`${MANGO_API_URL}/sse`, options);

  const listener = (event: any) => {
    if (event.type === "open") {
      console.log("Open SSE connection.");
    } else if (event.type === "message") {
      console.log("event.data", event.data);
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
  }, []);

  return <SSEContext.Provider>{children}</SSEContext.Provider>;
};

export default SSEProvider;

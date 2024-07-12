import React, { createContext, useContext, useEffect, useState } from "react";
import RNEventSource from "react-native-event-source";

const API_URL = "https://api.cofradia.cl";

const SSEContext = createContext(null);
export const useSSEContext = () => useContext(SSEContext);

const SSEProvider = ({ accessToken, children }: any) => {
  const options = { headers: { Authorization: `Bearer ${accessToken}` } };
  const eventSource = new RNEventSource(`${API_URL}/sse`, options);

  const [isLogged, setIsLogged] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const listener = (event: any) => {
    if (event.type === "open") {
      console.log("Open SSE connection.");
    } else if (event.type === "message") {
      console.log("event.data", event.data);
      setData(event.data);
    } else if (event.type === "error") {
      console.error("Connection error:", event.message);
    } else if (event.type === "exception") {
      console.error("Error:", event.message, event.error);
    }
  };

  useEffect(() => {
    eventSource.addEventListener("open", listener);
    eventSource.addEventListener("message", listener);
    eventSource.addEventListener("error", listener);
  }, []);

  return (
    <SSEContext.Provider
      value={{
        isLogged,
        setIsLogged,
        data,
        setData,
        loading,
      }}
    >
      {children}
    </SSEContext.Provider>
  );
};

export default SSEProvider;

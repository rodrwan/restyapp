import { Alert } from "react-native";
import { useEffect, useState } from "react";
import HTTPClient from "@/lib/api";

const client = HTTPClient.getInstance();

const useGetTicketById = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const getTicket = async (ticketId: string) => {
    setLoading(true);
    try {
      const res = await client.getTicketById(ticketId);
      setData(res.data?.getTicketById);
    } catch (error: any) {
      Alert.alert(">> Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, getTicket };
};

export default useGetTicketById;

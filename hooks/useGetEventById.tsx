import { Alert } from "react-native";
import { useEffect, useState } from "react";
import HTTPClient from "@/lib/api";

const client = HTTPClient.getInstance();

const useGetEventById = (eventId: string) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await client.getEventById(eventId);
      setData(res);
    } catch (error: any) {
      Alert.alert(">> Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();

  return { data, loading, refetch };
};

export default useGetEventById;

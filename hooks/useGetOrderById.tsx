import { Alert } from "react-native";
import { useState } from "react";
import HTTPClient from "@/lib/api";

const client = HTTPClient.getInstance();

const useGetOrderById = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const getOrderById = async (orderId: string) => {
    setLoading(true);
    try {
      const res = await client.getOrderById(orderId);
      setData(res);
    } catch (error: any) {
      Alert.alert(">> Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, getOrderById };
};

export default useGetOrderById;

import { Alert } from "react-native";
import React from "react";
import HTTPClient from "@/lib/api";

const client = HTTPClient.getInstance();

const useGetOrderById = () => {
  const [data, setData] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  const getOrderById = React.useCallback(async (orderId: string) => {
    setLoading(true);
    try {
      const res = await client.getOrderById(orderId);
      setData(res.data?.getOrderById);
    } catch (error: any) {
      Alert.alert(">> Error", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, getOrderById };
};

export default useGetOrderById;

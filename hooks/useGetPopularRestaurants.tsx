import { Alert } from "react-native";
import React from "react";
import HTTPClient, { ApiResponse } from "@/lib/api";

const client = HTTPClient.getInstance();

const useGetPopularRestaurants = () => {
  const [data, setData] = React.useState<
    {
      id: string;
      name: string;
      address: string;
      phone: string;
      imageUrl: string;
      rating: number;
    }[]
  >([]);
  const [loading, setLoading] = React.useState(true);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await client.getPopularRestaurants();
      setData(res.data?.getPopularRestaurants ?? []);
    } catch (error: any) {
      Alert.alert(">> Error", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => fetchData();

  return { data, loading, refetch };
};

export default useGetPopularRestaurants;

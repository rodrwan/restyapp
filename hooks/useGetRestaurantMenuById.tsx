import { Alert } from "react-native";
import React from "react";
import HTTPClient from "@/lib/api";

const client = HTTPClient.getInstance();

const useGetRestaurantMenuById = (restaurantId: string) => {
  const [data, setData] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await client.getRestaurantMenuById(restaurantId);
      setData(res.data?.getMenu);
    } catch (error: any) {
      Alert.alert(">> Error", error.message);
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => fetchData();

  return { data, loading, refetch };
};

export default useGetRestaurantMenuById;

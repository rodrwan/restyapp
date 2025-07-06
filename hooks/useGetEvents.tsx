import { Alert } from "react-native";
import { useEffect, useRef, useState } from "react";
import HTTPClient from "@/lib/api";

const client = HTTPClient.getInstance();

const useGetPostWithPagination = () => {
  const limit = 5;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const nextPageIdentifierRef: any = useRef();
  const [isFirstPageReceived, setIsFirstPageReceived] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await client.getEvents();
      setData(res.data?.getEvents);
    } catch (error: any) {
      console.log("error", error);
      Alert.alert(">> Error", error.message);
    } finally {
      setLoading(false);
      !isFirstPageReceived && setIsFirstPageReceived(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();
  const nextPage = () => {
    if (nextPageIdentifierRef.current == null) {
      // End of data.
      return;
    }

    fetchData();
  };

  return { data, loading, isFirstPageReceived, refetch, nextPage };
};

export default useGetPostWithPagination;

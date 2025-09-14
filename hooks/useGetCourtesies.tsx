import { Alert } from "react-native";
import { useEffect, useRef, useState, useCallback } from "react";
import HTTPClient from "@/lib/api";
import { Courtesy } from "@/components/dashboard/types";
import useUserStore from "@/stores/useUser";

const client = HTTPClient.getInstance();

interface UseGetCourtesiesReturn {
  data: Courtesy | null;
  isLoadingGetCourtesies: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getCourtesies: () => Promise<void>;
}

const useGetCourtesies = (eventId: string): UseGetCourtesiesReturn => {
  const [data, setData] = useState<Courtesy | null>(null);
  const [isLoadingGetCourtesies, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setCourtesies } = useUserStore();

  const getCourtesies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await client.getCourtesies(eventId);
      if (res?.error?.message === "session has expired") {
        throw new Error("expired session");
      }
      setData(res.data);
      setCourtesies(res.data);
    } catch (err: any) {
      console.error("Error getting courtesy:", err);
      const errorMessage =
        err?.response?.errors?.[0]?.message === "session has expired"
          ? "expired session"
          : err?.message || "Error al obtener cortesía";

      setError(errorMessage);
      if (errorMessage === "expired session") {
        Alert.alert(
          "Sesión expirada",
          "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
        );
      }
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (eventId) {
      getCourtesies();
    }
  }, [eventId, getCourtesies]);

  const refetch = useCallback(() => getCourtesies(), [eventId, getCourtesies]);

  return { data, isLoadingGetCourtesies, error, refetch, getCourtesies };
};

export default useGetCourtesies;

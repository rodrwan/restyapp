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
  const [isLoadingGetCourtesies, setLoading] = useState(false); // Start with false
  const [error, setError] = useState<string | null>(null);
  const { setCourtesies } = useUserStore();

  const getCourtesies = useCallback(async () => {
    console.log("getCourtesies called with eventId:", eventId);
    setLoading(true);
    try {
      const res = await client.getCourtesies(eventId);
      console.log("getCourtesies response:", res);
      if (res?.error?.message === "session has expired") {
        throw new Error("expired session");
      }
      setData(res.data.getCourtesies.data);
      // console.log(">>>> res.data", res.data.getCourtesies.data);
      setCourtesies(res.data.getCourtesies.data);
    } catch (err: any) {
      console.log("getCourtesies error:", err);
      // console.error("Error getting courtesy:", err);
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
  }, [eventId, setCourtesies]);

  useEffect(() => {
    if (eventId && eventId.trim() !== "" && eventId !== "default") {
      console.log(
        "useGetCourtesies: Valid eventId found, calling getCourtesies"
      );
      getCourtesies();
    } else {
      console.log("useGetCourtesies: No valid eventId, skipping call");
      // Si no hay eventId válido, no hacer nada y limpiar loading
      setLoading(false);
      setError(null);
    }
  }, [eventId, getCourtesies]);

  const refetch = useCallback(() => getCourtesies(), [getCourtesies]);

  return {
    data,
    isLoadingGetCourtesies,
    error,
    refetch,
    getCourtesies,
  };
};

export default useGetCourtesies;

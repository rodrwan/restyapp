import { Alert } from "react-native";
import React from "react";
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
  const [data, setData] = React.useState<Courtesy | null>(null);
  const [isLoadingGetCourtesies, setLoading] = React.useState(false); // Start with false
  const [error, setError] = React.useState<string | null>(null);
  const { setCourtesies } = useUserStore();

  const getCourtesies = React.useCallback(async () => {
    if (!eventId || eventId.trim() === "" || eventId === "default") {
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    try {
      const res = await client.getCourtesies(eventId);
      if (res?.error?.message === "session has expired") {
        throw new Error("expired session");
      }
      setData(res.data.getCourtesies.data);
      setCourtesies(res.data.getCourtesies.data);
    } catch (err: any) {
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
    } finally {
      setLoading(false);
    }
  }, [eventId, setCourtesies]);

  const refetch = React.useCallback(() => getCourtesies(), [getCourtesies]);

  return {
    data,
    isLoadingGetCourtesies,
    error,
    refetch,
    getCourtesies,
  };
};

export default useGetCourtesies;

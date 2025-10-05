import HTTPClient from "@/lib/api";
import useUserStore from "@/stores/useUser";
import React from "react";

const client = HTTPClient.getInstance();

const useMe = () => {
  const [loadingUserData, setLoadingUserData] = React.useState(false);
  const { setUser, user } = useUserStore();

  const me = React.useCallback(
    async (forceRefresh = false) => {
      // Si ya tenemos datos del usuario y no es un refresh forzado, no hacer la llamada
      if (user && user.tickets && !forceRefresh) {
        return user;
      }

      setLoadingUserData(true);
      try {
        const response = await client.me();
        if (!response.data?.me?.user) {
          setLoadingUserData(false);
          return null;
        }
        setUser(response.data?.me?.user);
        setLoadingUserData(false);
        return response.data?.me?.user;
      } catch (err: any) {
        setLoadingUserData(false);
        // No manejar limpieza de sesión aquí, solo lanzar el error
        if (err?.response?.errors[0]?.message === "session has expired") {
          throw new Error("expired session");
        } else {
          return null;
        }
      }
    },
    [user, setUser]
  );

  return { loadingUserData, me };
};

export default useMe;

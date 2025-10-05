import React from "react";
import useUserStore from "@/stores/useUser";
import { useSession } from "@/stores/useSession";
import useMe from "@/hooks/useMe";

/**
 * Hook simplificado para manejar la autenticación
 * Usa el nuevo sistema de sesión basado en Zustand
 */
const useAuth = () => {
  const { user } = useUserStore();
  const { session, isAuthenticated, isLoading, verifySession } = useSession();
  const { me } = useMe();
  const [hasCheckedAuth, setHasCheckedAuth] = React.useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = React.useState(false);
  const hasInitialized = React.useRef(false);

  // Función para verificar autenticación
  const checkAuth = React.useCallback(
    async (forceRefresh = false) => {
      // Prevenir múltiples ejecuciones simultáneas
      if (hasInitialized.current && !forceRefresh) {
        return isAuthenticated;
      }

      hasInitialized.current = true;

      // Si ya estamos autenticados y no es un refresh forzado, no verificar
      if (isAuthenticated && !forceRefresh) {
        // Pero si no tenemos datos del usuario, cargarlos
        if ((!user || !user.tickets) && !isLoadingUserData) {
          console.log("useAuth: Authenticated but no user data, loading...");
          setIsLoadingUserData(true);
          try {
            await me(true);
          } catch (error) {
            console.log("useAuth: Failed to load user data", error);
          } finally {
            setIsLoadingUserData(false);
          }
        }
        setHasCheckedAuth(true);
        return true;
      }

      // Si no hay sesión, no verificar
      if (!session) {
        setHasCheckedAuth(true);
        return false;
      }

      // Solo verificar si tenemos sesión pero no estamos autenticados
      if (session && !isAuthenticated) {
        try {
          const isValid = await verifySession();
          if (isValid) {
            // Si la sesión es válida, cargar los datos del usuario
            console.log("useAuth: Session valid, loading user data");
            await me(true); // Forzar refresh para cargar datos
          }
          setHasCheckedAuth(true);
          return isValid;
        } catch (error) {
          console.log("useAuth: Session verification failed", error);
          setHasCheckedAuth(true);
          return false;
        }
      }

      setHasCheckedAuth(true);
      return isAuthenticated;
    },
    [session, verifySession, isAuthenticated, me, isLoadingUserData, user]
  );

  // Función para refrescar la autenticación
  const refreshAuth = React.useCallback(() => {
    hasInitialized.current = false;
    setHasCheckedAuth(false);
    return checkAuth(true);
  }, [checkAuth]);

  // Función para limpiar el estado de autenticación
  const clearAuth = React.useCallback(() => {
    hasInitialized.current = false;
    setHasCheckedAuth(false);
  }, []);

  return {
    isAuthenticated,
    hasCheckedAuth,
    loadingUserData: isLoading || isLoadingUserData,
    checkAuth,
    refreshAuth,
    clearAuth,
    user,
  };
};

export default useAuth;

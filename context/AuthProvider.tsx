import React, {
  useContext,
  createContext,
  type PropsWithChildren,
} from "react";
import useUserStore from "@/stores/useUser";
import { router } from "expo-router";
import { useSession as useSessionStore } from "@/stores/useSession";

const AuthContext = createContext<{
  signIn: (accessToken: string) => Promise<void>;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
  healhCheck: () => Promise<void>;
}>({
  signIn: async () => {},
  signOut: () => null,
  session: null,
  isLoading: false,
  healhCheck: async () => {},
});

// This hook can be used to access the user info.
export function useAuthContext() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error(
        "useAuthContext must be wrapped in a <SessionProvider />"
      );
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const {
    session,
    isLoading,
    signIn: sessionSignIn,
    signOut: sessionSignOut,
    verifySession,
  } = useSessionStore();
  const { setUser, setTickets, setDrinks, setEvents } = useUserStore();

  const signIn = React.useCallback(
    async (accessToken: string) => {
      sessionSignIn(accessToken);
      // Verificar la sesión inmediatamente después de establecer el token
      await verifySession();
    },
    [sessionSignIn, verifySession]
  );

  const signOut = React.useCallback(async () => {
    sessionSignOut();
    setUser(null);
    setTickets([]);
    setDrinks([]);
    setEvents([]);
    router.replace("/(home)");
  }, [sessionSignOut, setUser, setTickets, setDrinks, setEvents]);

  const healhCheck = React.useCallback(async () => {
    await verifySession();
  }, [verifySession]);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        session,
        isLoading,
        healhCheck,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

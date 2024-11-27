import { useContext, createContext, type PropsWithChildren } from "react";
import { useStorageState } from "./useStorageState";
import useUserStore from "@/stores/useUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const AuthContext = createContext<{
  signIn: (accessToken: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");

  const { setUser, setTickets, setDrinks, setEvents } = useUserStore();

  return (
    <AuthContext.Provider
      value={{
        signIn: (accessToken: string) => {
          setSession(accessToken);
        },
        signOut: async () => {
          setSession(null);
          setUser(null);
          setTickets([]);
          setDrinks([]);
          setEvents([]);
          AsyncStorage.removeItem("accessToken");
          router.replace("/(home)");
        },
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

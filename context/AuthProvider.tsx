import { useContext, createContext, type PropsWithChildren } from "react";
import { useStorageState } from "./useStorageState";
import useUserStore from "@/stores/useUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import useMe from "@/hooks/useMe";

const AuthContext = createContext<{
  signIn: (accessToken: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
  healhCheck: () => void;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
  healhCheck: () => null,
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
  const { me } = useMe();
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
        healhCheck: async () => {
          try {
            await me();
          } catch (err: any) {
            console.log("SessionProvider err", err);
            if (err?.response?.errors[0]?.message === "session has expired") {
              setSession(null);
              setUser(null);
              setTickets([]);
              setDrinks([]);
              setEvents([]);
              AsyncStorage.removeItem("accessToken");
              router.replace("/(home)");
            }
          }
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

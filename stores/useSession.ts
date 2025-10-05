import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SessionState {
  // Estado de la sesión
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Acciones
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  clearSession: () => void;
  initializeSession: () => void;

  // Verificación de sesión
  verifySession: () => Promise<boolean>;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Acciones básicas
      setToken: (token) => {
        set({
          token,
          isAuthenticated: false, // No establecer como autenticado hasta verificar
          isLoading: true, // Establecer como loading para verificar
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      clearSession: () => {
        set({
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      // Inicializar el estado cuando se carga desde el storage
      initializeSession: () => {
        const { token } = get();
        if (token) {
          // Si hay token, verificar la sesión
          set({ isLoading: true });
        } else {
          // Si no hay token, establecer como no autenticado
          set({ isAuthenticated: false, isLoading: false });
        }
      },

      // Verificación de sesión
      verifySession: async () => {
        const { token } = get();

        if (!token) {
          set({ isAuthenticated: false, isLoading: false });
          return false;
        }

        set({ isLoading: true });

        try {
          // Importar el cliente HTTP dinámicamente para evitar dependencias circulares
          const HTTPClient = (await import("@/lib/api")).default;
          const client = HTTPClient.getInstance();

          // Hacer una llamada simple para verificar el token
          const response = await client.me();

          if (response.data?.me?.user) {
            set({ isAuthenticated: true, isLoading: false });
            return true;
          } else {
            // Token inválido
            get().clearSession();
            return false;
          }
        } catch (error: any) {
          // console.log(
          //   "Session verification failed:",
          //   error?.response?.errors?.[0]?.message
          // );

          // Si es error de sesión expirada, limpiar todo
          if (error?.response?.errors?.[0]?.message === "session has expired") {
            get().clearSession();
          }

          set({ isAuthenticated: false, isLoading: false });
          return false;
        }
      },
    }),
    {
      name: "session-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // Solo persistir el token, no el estado derivado
      partialize: (state) => ({
        token: state.token,
        // No persistir isAuthenticated ni isLoading
      }),
    }
  )
);

// Hook simplificado para usar la sesión
export const useSession = () => {
  const store = useSessionStore();

  return {
    // Estado
    session: store.token,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,

    // Acciones
    signIn: (token: string) => {
      store.setToken(token);
    },

    signOut: () => {
      store.clearSession();
    },

    verifySession: store.verifySession,
    initializeSession: store.initializeSession,
  };
};

export default useSessionStore;

import { create } from "zustand";
import createSelectors from "./util";

interface Auth {
  isLogged: boolean;
  accessToken: string;
}

interface Store {
  auth: Auth;
  login: () => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
}

const useAuthStoreBase = create<Store>((set) => ({
  auth: {
    isLogged: false,
    accessToken: "",
  },
  setAccessToken: (token: string) => {
    set((state) => {
      return {
        ...state,
        auth: {
          ...state.auth,
          accessToken: token,
        },
      };
    });
  },
  login: () =>
    set((state) => {
      return {
        ...state,
        auth: {
          ...state.auth,
          isLogged: true,
        },
      };
    }),
  logout: () =>
    set((state) => {
      return {
        ...state,
        auth: {
          ...state.auth,
          isLogged: false,
        },
      };
    }),
}));

export default createSelectors(useAuthStoreBase);

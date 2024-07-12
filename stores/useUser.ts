import { create } from "zustand";

interface Ticket {
  id: string;
  base64: string;
  event: Event;
}

interface Drink {
  id: string;
  base64: string;
  event: Event;
}

interface Event {
  id: string;
  name: string;
  start_at: string;
  place: string;
  image: string;
  description: string;
}

interface User {
  firstname: string;
  lastname: string;
  email: string;
  picture: string;
  dni: string;
  tickets: Ticket[] | null;
  drinks: Drink[] | null;
  events: Event[] | null;
}

interface Store {
  user: User;
  setUser: (user: User | null) => void;
  setTickets: (tickets: Ticket[]) => void;
  setDrinks: (drinks: Drink[]) => void;
  setEvents: (events: Event[]) => void;
}

const initialState = {
  firstname: "",
  lastname: "",
  email: "",
  picture: "",
  dni: "",
  tickets: null,
  drinks: null,
  events: null,
};

const useUserStore = create<Store>((set) => ({
  user: initialState,
  setUser: (user: User | null) => {
    if (user) {
      set((state) => ({ ...state, user: { ...state.user, ...user } }));
    } else {
      set((state) => ({ ...state, user: { ...state.user, ...initialState } }));
    }
  },
  setTickets: (tickets: Ticket[]) =>
    set((state) => ({ ...state, user: { ...state.user, tickets } })),
  setDrinks: (drinks: Drink[]) =>
    set((state) => ({ ...state, user: { ...state.user, drinks } })),
  setEvents: (events: Event[]) =>
    set((state) => ({ ...state, user: { ...state.user, events } })),
}));

export default useUserStore;

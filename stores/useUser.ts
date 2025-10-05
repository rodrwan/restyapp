import { create } from "zustand";

interface Ticket {
  id: string;
  base64: string;
  event: Event;
  is_validated: boolean;
}

interface Drink {
  id: string;
  base64: string;
  event: Event;
  is_validated: boolean;
}
interface CourtesyEvent {
  courtesy: Courtesy;
  event: Event;
}

interface Courtesy {
  id: string;
  name: string;
  description?: string;
  base64: string;
  is_validated: boolean;
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
  gender: string;
  birth_date: Date;
  tickets: Ticket[] | null;
  drinks: Drink[] | null;
  events: Event[] | null;
  courtesies: CourtesyEvent[] | null;
  tbk_user_id: string | null;
  tbk_card_number: string | null;
}

interface Store {
  user: User;
  upcomingEventFetched: boolean;
  upcomingEvent: any;
  setUser: (user: User | null) => void;
  setTickets: (tickets: Ticket[]) => void;
  setDrinks: (drinks: Drink[]) => void;
  setEvents: (events: Event[]) => void;
  setTbkCardNumber: (
    userId: string,
    cardNumber: string,
    cardType: string
  ) => void;
  setUpcomingEvent: (event: any) => void;
  setTodayEvent: (event: any) => void;
  updateTicket: (ticket: Ticket) => void;
  setCourtesies: (courtesies: CourtesyEvent[]) => void;
}

const initialState = {
  firstname: "",
  lastname: "",
  email: "",
  picture: "",
  dni: "",
  gender: "",
  birth_date: new Date(),
  tickets: null,
  drinks: null,
  courtesies: null,
  events: null,
  tbk_user_id: null,
  tbk_card_number: null,
  tbk_card_type: null,
};

const useUserStore = create<Store>((set) => ({
  user: initialState,
  upcomingEvent: {},
  upcomingEventFetched: false,
  todayEvent: {},
  todayEventFetched: false,
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
  setCourtesies: (courtesies: CourtesyEvent[]) =>
    set((state) => ({ ...state, user: { ...state.user, courtesies } })),
  setEvents: (events: Event[]) =>
    set((state) => ({ ...state, user: { ...state.user, events } })),
  setTbkCardNumber: (userId: string, cardNumber: string, cardType: string) =>
    set((state) => ({
      ...state,
      user: {
        ...state.user,
        tbk_user_id: userId,
        tbk_card_number: cardNumber,
        tbk_card_type: cardType,
      },
    })),
  setTbkCardType: (cardType: string | null) =>
    set((state) => ({
      ...state,
      user: { ...state.user, tbk_card_type: cardType },
    })),
  setUpcomingEvent: (event: any) => {
    set((state) => ({
      ...state,
      upcomingEvent: event,
      upcomingEventFetched: true,
    }));
  },
  setTodayEvent: (event: any) => {
    set((state) => ({
      ...state,
      todayEvent: event,
      todayEventFetched: true,
    }));
  },
  updateTicket: (ticket: Ticket) => {
    set((state) => {
      const tickets = state?.user?.tickets ? [...state.user.tickets] : [];
      const ticketIndex = tickets.findIndex((t) => t?.id === ticket?.id);

      if (ticketIndex > -1) {
        tickets[ticketIndex] = {
          ...tickets[ticketIndex],
          is_validated: ticket?.is_validated,
        };

        return { ...state, user: { ...state.user, tickets } };
      }

      const drinks = state?.user?.drinks ? [...state.user.drinks] : [];
      const drinkIndex = drinks.findIndex((t) => t?.id === ticket?.id);
      if (drinkIndex > -1) {
        drinks[drinkIndex] = {
          ...drinks[drinkIndex],
          is_validated: ticket?.is_validated,
        };

        return { ...state, user: { ...state.user, drinks } };
      }

      return state;
    });
  },
}));

export default useUserStore;

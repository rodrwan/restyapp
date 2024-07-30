import { create } from "zustand";
import createSelectors from "./util";

interface Event {
  id: string;
  nominated: boolean;
  name: string;
  description: string;
  image: string;
  place: string;
  out_of_stock: number;
}

interface Store {
  event: Event;
  setEvent: (event: Event) => void;
}

const useEventStoreBase = create<Store>((set) => ({
  event: {
    id: "",
    nominated: false,
    name: "",
    description: "",
    image: "",
    place: "",
    out_of_stock: 0,
  },
  setEvent: (event: Event) => {
    set((state) => {
      return {
        ...state,
        event: {
          ...state.event,
          ...event,
        },
      };
    });
  },
}));

export default createSelectors(useEventStoreBase);

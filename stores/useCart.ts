import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CustomizationOption } from "@/app/(rest)/types";

type Product = {
  id: string;
  name: string;
  subtotal: number;
  total: number;
  quantity?: number;
  image_url: string;
  customizationOptions?: CustomizationOption[];
};

type CartState = {
  items: Product[];
  add: (item: Product) => void;
  remove: (id: string) => void;
  clear: () => void;
  subtotal: () => number;
  total: () => number;
  setTableId: (tableId: string) => void;
  tableId: string;
  setRestaurantId: (restaurantId: string) => void;
  restaurantId: string;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item: Product) => set((s) => ({ items: [...s.items, item] })),
      remove: (id) =>
        set((s) => {
          const idx = s.items.findIndex((x) => x.id === id);
          if (idx === -1) return s;
          const copy = [...s.items];
          copy.splice(idx, 1);
          return { items: copy };
        }),
      clear: () => set({ items: [] }),
      subtotal: () => get().items.reduce((acc, item) => acc + item.subtotal, 0),
      total: () => get().items.reduce((acc, item) => acc + item.total, 0),
      setTableId: (tableId: string) => set({ tableId }),
      tableId: "",
      setRestaurantId: (restaurantId: string) => set({ restaurantId }),
      restaurantId: "",
    }),
    {
      name: "cart-v1",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ items: state.items }), // solo persiste items
    }
  )
);

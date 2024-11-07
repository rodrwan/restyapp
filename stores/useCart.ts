import { create } from "zustand";

interface Item {
  id: string;
  name: string;
  type: string;
  price: string;
  quantity?: number;
}

interface Nominated {
  id: string;
  orderId?: string;
  name: string;
  type: string;
  email?: string;
  dni?: string;
}

interface Store {
  items: Item[];
  nominees: Nominated[];
  addToCart: (item: Item) => void;
  removeFromCart: (item: Item) => void;
  assignTicket: (orderId: string, ticket: Item, nominated: Nominated) => void;
  setTicketToNominate: (items: Item[]) => void;
  clearCart: () => void;
  clearTicketToNominate: () => void;
}

const initialCart: Item[] = [];
const initialNominees: Nominated[] = [];

const useCartStore = create<Store>((set) => ({
  items: initialCart,
  nominees: initialNominees,

  addToCart: (item: Item) => {
    set((state) => {
      const isItemInCart = state.items.find(
        (cartItem: any) => cartItem.id === item.id
      );

      if (isItemInCart) {
        return {
          ...state,
          items: state.items.map((cartItem: any) =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem?.quantity + 1 }
              : cartItem
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...item, quantity: 1 }],
      };
    });
  },
  removeFromCart: (item: Item) => {
    set((state) => {
      const isItemInCart = state.items.find(
        (cartItem: any) => cartItem.id === item.id
      );

      if (isItemInCart?.quantity === 1) {
        const newItems = state.items.filter(
          (cartItem: any) => cartItem.id !== item.id
        );
        return {
          ...state,
          items: newItems,
        };
      } else {
        const newItems = state.items.map((cartItem: any) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem?.quantity - 1 }
            : cartItem
        );
        return {
          ...state,
          items: newItems,
        };
      }
    });
  },
  assignTicket: (orderId: string, ticket: Item, newNominated: Nominated) => {
    set((state) => {
      return {
        ...state,
        nominees: state.nominees.map((nominated: any) =>
          nominated.id === ticket.id
            ? {
                ...nominated,
                orderId,
                email: newNominated.email,
                dni: newNominated.dni,
              }
            : nominated
        ),
      };
    });
  },
  setTicketToNominate: (items: Item[]) => {
    set((state) => {
      console.log("state.nominees", state.nominees);
      const nominated: Nominated[] = items.reduce((acc: any, item: any) => {
        if (
          state.nominees.find((nominated) => {
            console.log("nominated.id, item.id", nominated.id, item.id);
            return nominated.id === item.id;
          })
        ) {
          return acc;
        }

        return [
          ...acc,
          {
            id: item.id,
            name: item.name,
            type: item.type,
          },
        ];
      }, []);

      return {
        ...state,
        nominees: [...state.nominees, ...nominated],
      };
    });
  },
  clearTicketToNominate: () => {
    set((state) => {
      return {
        ...state,
        nominees: initialNominees,
      };
    });
  },
  clearCart: () => {
    set((state) => {
      return {
        ...state,
        items: initialCart,
        nominees: initialNominees,
      };
    });
  },
}));

export default useCartStore;

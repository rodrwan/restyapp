import { createContext, useState, useContext } from "react";

const CartContext = createContext<any>(null);
export const useCartContext = () => useContext(CartContext);

const CartProvider = ({ children }: any) => {
  const [cartItems, setCartItems] = useState<any>([]);
  const [nominees, setNominees] = useState<any>([]);

  const addToCart = (item: any) => {
    const isItemInCart = cartItems.find(
      (cartItem: any) => cartItem.id === item.id
    );

    if (isItemInCart) {
      setCartItems(
        cartItems?.map((cartItem: any) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem?.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (item: any) => {
    const isItemInCart = cartItems.find(
      (cartItem: any) => cartItem.id === item.id
    );

    if (isItemInCart?.quantity === 1) {
      setCartItems(
        cartItems?.filter((cartItem: any) => cartItem.id !== item.id)
      );
    } else {
      setCartItems(
        cartItems?.map((cartItem: any) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem?.quantity - 1 }
            : cartItem
        )
      );
    }
  };

  const assignTicket = (orderId: string, ticket: any, nominate: any) => {
    setNominees(
      nominees?.map((nominated: any) =>
        nominated.id === ticket.id
          ? { ...nominated, orderId, email: nominate.email, dni: nominate.dni }
          : nominated
      )
    );
  };

  const setTicketToNominate = (tickets: any) => {
    setNominees(tickets);
  };

  const clearCart = () => {
    setCartItems([]);
    setNominees([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total: any, item: any) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        nominees,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        setTicketToNominate,
        assignTicket,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

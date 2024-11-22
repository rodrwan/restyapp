export interface Item {
  id: string;
  name: string;
  type: "ENTRANCE" | "DRINK";
  price: number;
  stock: number;
  max_per_sale: number;
  description?: string;
  isValidated?: boolean;
  base64?: string;
  event?: Event;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  image: string;
  address: string;
  place: string;
  start_at: string;
  end_at: string;
  start_hour: string;
  end_hour: string;
  nominated: boolean;
  items: Item[];
}

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  dni: string;
  picture: string;
  tbk_card_number: string;
  tickets?: Item[];
  drinks?: Item[];
  events?: Event[];
}

export interface CartItem extends Item {
  quantity: number;
}

export interface Nominee {
  id: string;
  dni: string;
  email: string;
  name: string;
  item: Item;
}

export interface PaymentMethod {
  id: string;
  card_number: string;
  card_type: string;
  tbk_user: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
}

export interface APIResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

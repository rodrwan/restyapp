export interface Event {
  id: string;
  name: string;
  description: string;
  image: string;
  start_at: string;
  place: string;
}

export interface Ticket {
  id: string;
  base64: string;
  event: Event;
  is_validated: boolean;
}

export interface Drink {
  id: string;
  base64: string;
  event: Event;
  is_validated: boolean;
}

export interface Courtesy {
  id: string;
  name: string;
  description?: string;
  base64: string;
  event: Event;
  is_validated: boolean;
}

export interface User {
  firstname: string;
  lastname: string;
  email: string;
  dni: string;
  picture: string;
  gender: string;
  birth_date: Date;
  events: Event[] | null;
  tickets: Ticket[] | null;
  drinks: Drink[] | null;
  courtesies: Courtesy[] | null;
  tbk_user_id: string | null;
  tbk_card_number: string | null;
}

export interface UpcomingEvent {
  event: Event;
}

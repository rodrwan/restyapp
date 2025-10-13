export interface Event {
  id: string;
  name: string;
  start_at: string;
  start_hour: string;
  image: string;
  items: EventItem[];
}

interface EventItem {
  price: number;
  type: string;
}

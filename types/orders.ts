export type OrderTab = "active" | "past" | "cancelled";
export type OrderStatus = "confirmed" | "preparing" | "on_the_way" | "delivered";

export interface Order {
  id: string;
  orderNumber: string;
  planName: { en: string; ar: string };
  meals: number;
  price: number;
  dateFrom: string;   // ISO date string
  dateTo?: string;
  deliveryDate?: string;
  status: OrderStatus;
  image: string;
  tab: OrderTab;
}

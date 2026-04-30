export interface CheckoutTicket {
  id: number;
  title: string;
  description: string;
  quantity: number;
  price: number;
  total_price: number;
  formatted_total_price: string;
  created_at: string;
  type: {
    name: string;
    value: number;
  };
}

export interface CheckoutMeta {
  price: string;
  subtotal: string;
  fees: string;
  total: string;
  timer: number;
}

export interface ThankTicket {
  id: number;
  barcode: string;
  start_date: string;
  start_time: string;
  expires_at: string;
  created_at: string;
  ticket: {
    id: number;
    title: string;
    description: string;
    price: number;
    formatted_price: string;
    type: string;
    qr_code?: string
    pdf_url?: string
  };
};
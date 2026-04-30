export interface MyTicket {
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
    event: {
      id: number;
      name: string;
    };
  };
}

export interface Ticket {
  id?: number;
  title: string;
  description: string;
  listId: string;
  order: number;
  createdAt: Date;
}

export interface TicketList {
  id: string;
  name: string;
  order: number;
}

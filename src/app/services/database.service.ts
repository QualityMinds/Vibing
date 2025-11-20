import Dexie, { Table } from 'dexie';
import { Injectable } from '@angular/core';
import { Ticket, TicketList } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService extends Dexie {
  tickets!: Table<Ticket, number>;
  ticketLists!: Table<TicketList, string>;

  constructor() {
    super('VibingDB');
    
    this.version(1).stores({
      tickets: '++id, title, listId, order',
      ticketLists: 'id, name, order'
    });
  }

  async initializeDefaultLists(): Promise<void> {
    const count = await this.ticketLists.count();
    if (count === 0) {
      await this.ticketLists.bulkAdd([
        { id: 'todo', name: 'To Do', order: 0 },
        { id: 'in-progress', name: 'In Progress', order: 1 },
        { id: 'done', name: 'Done', order: 2 }
      ]);
    }
  }

  async addTicket(ticket: Omit<Ticket, 'id'>): Promise<number> {
    return await this.tickets.add(ticket as Ticket);
  }

  async updateTicket(id: number, changes: Partial<Ticket>): Promise<number> {
    return await this.tickets.update(id, changes);
  }

  async deleteTicket(id: number): Promise<void> {
    await this.tickets.delete(id);
  }

  async getTicketsByList(listId: string): Promise<Ticket[]> {
    return await this.tickets
      .where('listId')
      .equals(listId)
      .sortBy('order');
  }

  async getAllTickets(): Promise<Ticket[]> {
    return await this.tickets.toArray();
  }

  async getAllLists(): Promise<TicketList[]> {
    return await this.ticketLists.orderBy('order').toArray();
  }

  async moveTicket(ticketId: number, newListId: string, newOrder: number): Promise<void> {
    await this.updateTicket(ticketId, { listId: newListId, order: newOrder });
  }

  async reorderTickets(listId: string, ticketIds: number[]): Promise<void> {
    await this.transaction('rw', this.tickets, async () => {
      for (let i = 0; i < ticketIds.length; i++) {
        await this.updateTicket(ticketIds[i], { order: i });
      }
    });
  }
}

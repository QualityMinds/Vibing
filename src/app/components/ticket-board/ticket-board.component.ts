import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DatabaseService } from '../../services/database.service';
import { Ticket, TicketList } from '../../models/ticket.model';

interface TicketsByList {
  [listId: string]: Ticket[];
}

@Component({
  selector: 'app-ticket-board',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './ticket-board.component.html',
  styleUrls: ['./ticket-board.component.css']
})
export class TicketBoardComponent implements OnInit {
  lists = signal<TicketList[]>([]);
  ticketsByList = signal<TicketsByList>({});
  newTicketTitle: { [listId: string]: string } = {};
  newTicketDescription: { [listId: string]: string } = {};
  showAddForm: { [listId: string]: boolean } = {};

  constructor(private db: DatabaseService) {}

  async ngOnInit(): Promise<void> {
    await this.db.initializeDefaultLists();
    await this.loadData();
  }

  async loadData(): Promise<void> {
    const lists = await this.db.getAllLists();
    const allTickets = await this.db.getAllTickets();
    
    this.lists.set(lists);
    
    // Group tickets by list
    const grouped: TicketsByList = {};
    lists.forEach(list => {
      grouped[list.id] = allTickets
        .filter(ticket => ticket.listId === list.id)
        .sort((a, b) => a.order - b.order);
    });
    this.ticketsByList.set(grouped);
  }

  getListIds(): string[] {
    return this.lists().map(list => list.id);
  }

  toggleAddForm(listId: string): void {
    this.showAddForm[listId] = !this.showAddForm[listId];
    if (!this.showAddForm[listId]) {
      this.newTicketTitle[listId] = '';
      this.newTicketDescription[listId] = '';
    }
  }

  async addTicket(listId: string): Promise<void> {
    const title = this.newTicketTitle[listId]?.trim();
    const description = this.newTicketDescription[listId]?.trim() || '';

    if (!title) {
      return;
    }

    const tickets = this.ticketsByList()[listId] || [];
    const order = tickets.length;

    const newTicket: Omit<Ticket, 'id'> = {
      title,
      description,
      listId,
      order,
      createdAt: new Date()
    };

    await this.db.addTicket(newTicket);
    await this.loadData();

    this.newTicketTitle[listId] = '';
    this.newTicketDescription[listId] = '';
    this.showAddForm[listId] = false;
  }

  async deleteTicket(ticketId: number | undefined): Promise<void> {
    if (ticketId !== undefined) {
      await this.db.deleteTicket(ticketId);
      await this.loadData();
    }
  }

  async drop(event: CdkDragDrop<Ticket[]>): Promise<void> {
    const listId = this.lists()[this.getListIds().indexOf(event.container.id)]?.id;
    
    if (event.previousContainer === event.container) {
      // Reorder within same list
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      
      // Update order in database
      const ticketIds = event.container.data.map(t => t.id!);
      await this.db.reorderTickets(listId, ticketIds);
    } else {
      // Move to different list
      const ticket = event.previousContainer.data[event.previousIndex];
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Update ticket's listId and reorder both lists
      if (ticket.id !== undefined) {
        await this.db.moveTicket(ticket.id, listId, event.currentIndex);
        
        // Reorder the source list
        const sourceListId = this.lists()[this.getListIds().indexOf(event.previousContainer.id)]?.id;
        const sourceTicketIds = event.previousContainer.data.map(t => t.id!);
        await this.db.reorderTickets(sourceListId, sourceTicketIds);
        
        // Reorder the target list
        const targetTicketIds = event.container.data.map(t => t.id!);
        await this.db.reorderTickets(listId, targetTicketIds);
      }
    }

    await this.loadData();
  }

  trackByTicketId(index: number, ticket: Ticket): number | undefined {
    return ticket.id;
  }

  trackByListId(index: number, list: TicketList): string {
    return list.id;
  }
}

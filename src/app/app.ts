import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TicketBoardComponent } from './components/ticket-board/ticket-board.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TicketBoardComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'Vibing';
}

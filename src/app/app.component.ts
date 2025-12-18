// app.component.ts
import { Component } from '@angular/core';
import { TasktrekComponent } from './pages/tasktrek/tasktrek.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TasktrekComponent], // <-- import the standalone component here
  templateUrl: './app.component.html'
})
export class AppComponent {}

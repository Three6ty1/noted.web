import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { Note } from '../models/note.model';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { HeaderComponent } from "./core/header/header.component";
import { NotesService } from './core/notes/notes.service';
import { NoteComponent } from './app/components/note/note.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent, NoteComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private notesService: NotesService, private http: HttpClient) {}

  notes: Note[] = [];

  ngOnInit(): void {
    this.notesService.updateNotes();
    this.notesService.currentNotes.subscribe(n => this.notes = n);
  }

  onNoteDelete(id: string) {
    this.http.delete(`${environment.DB_STRING}/api/Notes/${id}`)
    .subscribe({
      next: () => {
        this.notesService.updateNotes();
      }
    })
  }
}

import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { Note } from '../models/note.model';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { HeaderComponent } from "./core/header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  http = inject(HttpClient);

  noteCreateForm = new FormGroup({
    title: new FormControl<string>(''),
    description: new FormControl<string>(''),
    links: new FormControl<string>(''),
    bookmarked: new FormControl<boolean>(false),
  })

  // $ means observable
  notes$ = this.getNotes();

  onNoteCreateSubmit() {
    console.log(this.noteCreateForm.value);
    const _link = this.noteCreateForm.value.links;

    const addNoteRequest = {
      title: this.noteCreateForm.value.title,
      description: this.noteCreateForm.value.description,
      links: _link == null || _link === "" ? [] : _link.split(","),
      bookmarked: this.noteCreateForm.value.bookmarked,
    };

    // Need to subscribe to the observable of the post
    this.http.post(`${environment.DB_STRING}/api/Notes`, addNoteRequest)
    .subscribe({
      next: (value) => {
        console.log(value);
        this.notes$ = this.getNotes();
        this.noteCreateForm.reset();
      }
    });
  }

  onNoteDelete(id: string) {
    this.http.delete(`${environment.DB_STRING}/api/Notes/${id}`)
    .subscribe({
      next: () => {
        this.notes$ = this.getNotes();
      }
    })
  }

  private getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`${environment.DB_STRING}/api/Notes`);
    // Returns an observable that we need to subscribe to
    // Whenver we call this we get the latest version of it
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Note } from '../../../models/note.model';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  notes = new BehaviorSubject<Note[]>([]);

  constructor(private http: HttpClient) {}

  currentNotes = this.notes.asObservable();
  
  updateNotes() {
    this.http.get<Note[]>(`${environment.DB_STRING}/api/Notes`).subscribe(n =>
      this.notes.next(n)
    );
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Note } from '../../../models/note.model';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

function spiral(notes: Note[]) {
  var n = Math.ceil(Math.sqrt(notes.length))
  var newNotes: (Note | null)[][] = Array.from(Array(n), _ => Array(n).fill(null));


  var top = 0
  var left = 0
  var down = n - 1
  var right = n - 1
  
  var totalSpaces = Math.pow(n, 2) - 1;
  var actual = notes.length - 1;
  
  
  console.log(actual)

  while (totalSpaces >= 0 && left <= right && top <= down) {
    for (var i = right; i >= left; i--) {
      if (totalSpaces <= actual) {
        newNotes[top][i] = notes[totalSpaces]
      }
      totalSpaces--
    }
    top++
    
    for (var i = top; i <= down; i++) {
      if (totalSpaces <= actual) {
        newNotes[i][left] = notes[totalSpaces]
      }
      totalSpaces--
    }
    left++
    
    if (top <= down) {
      for (var i = left; i <= right; i++) {
        if (totalSpaces <= actual) {
          newNotes[down][i] = notes[totalSpaces]
        }
        totalSpaces--
      }
      down--
    }
    
    if (left <= right) {
      for (var i = down; i >= top; i--) {
        if (totalSpaces <= actual) {
          newNotes[i][right] = notes[totalSpaces]
        }
        totalSpaces--
      }
      right--
    }
  }
  return newNotes;
}

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  notes = new BehaviorSubject<(Note | null)[][]>([]);

  constructor(private http: HttpClient) {}

  currentNotes = this.notes.asObservable();
  
  updateNotes() {
    this.http.get<Note[]>(`${environment.DB_STRING}/api/Notes`).subscribe(notes => {
      console.log(notes)
      var newNotes = spiral(notes);
      this.notes.next(newNotes)
    });
  }
}

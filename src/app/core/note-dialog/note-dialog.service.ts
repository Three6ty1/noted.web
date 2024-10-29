import { DatePipe } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, last } from 'rxjs';
import { Note } from '../../../models/note.model';
import { MatDialog } from '@angular/material/dialog';
import { NoteDialogComponent } from '../../features/note-dialog/note-dialog.component';

const tempNote: Note = {id: "x", title: "None", description: "None", likes: 0, lastEdited: new DatePipe('en-US'), created: new DatePipe('en-US'), links: [], bookmarked: false}

@Injectable({
  providedIn: 'root'
})
export class NoteDialogService {
  constructor() { }

  readonly dialog = inject(MatDialog);

  note = new BehaviorSubject<Note>(tempNote);
  currentNote = this.note.asObservable();
  
  editing = false;

  openDialog(note: Note) {
    this.note.next(note);
    const dialogRef = this.dialog.open(NoteDialogComponent, {
      data: { note: note, editing: false },
    });

    dialogRef.afterClosed().subscribe()
  }
}

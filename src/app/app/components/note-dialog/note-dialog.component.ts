import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Note } from '../../../../models/note.model';

@Component({
  selector: 'app-note-dialog',
  standalone: true,
  imports: [MatDialogModule, FontAwesomeModule],
  template: 'passed in {{ data.note }}',
  templateUrl: './note-dialog.component.html',
  styleUrl: './note-dialog.component.scss'
})
export class NoteDialogComponent {
  note: Note;
  constructor (@Inject(MAT_DIALOG_DATA) public data: {note: Note}) {
    this.note = data.note;
  }
}

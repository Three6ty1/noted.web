import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Note } from '../../../models/note.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { NotesService } from '../../core/notes/notes.service';
import { faPenToSquare, faCircleXmark, faCircleLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-note-dialog',
  standalone: true,
  imports: [MatDialogModule, FontAwesomeModule, ReactiveFormsModule],
  template: 'passed in {{ data.note }}',
  templateUrl: './note-dialog.component.html',
  styleUrl: './note-dialog.component.scss'
})
export class NoteDialogComponent {
  note: Note;
  editing: boolean;
  noteEditForm: FormGroup;
  error: string;
  editIcon = faPenToSquare;
  cancelIcon = faCircleLeft;

  constructor (@Inject(MAT_DIALOG_DATA) public data: {note: Note, editing: boolean}, private http: HttpClient, private noteService: NotesService) {
    this.note = data.note;
    this.editing = false;
    this.noteEditForm = new FormGroup({
      title: new FormControl<string>(data.note.title),
      description: new FormControl<string>(data.note.description),
    })
    this.error = "";
  }

  changeMode() {
    this.editing = !this.editing;
  }

  onNoteEditSubmit() {
    console.log(this.noteEditForm.value);

    const editNoteRequest = {
      title: this.noteEditForm.value.title,
      description: this.noteEditForm.value.description,
    };

    this.http.put(`${environment.DB_STRING}/api/Notes/${this.note.id}`, editNoteRequest)
    .subscribe({
      next: (value) => {
        this.noteService.updateNotes();
        // Optimistically changing since updateNotes is decoupled from dialog service
        this.note = {...this.note, ...value};
        this.editing = false;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
        this.error = err.message;
      },
    });
  }
}

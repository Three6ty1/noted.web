import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Note } from '../../../models/note.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { NotesService } from '../../core/notes/notes.service';
import { faPenToSquare, faCircleXmark, faCircleLeft, faBookmark as solidBookmark, faThumbsUp as solidThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as emptyBookmark, faThumbsUp as emptyThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { AuthService, User } from '../../core/auth/auth.service';

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
  isBookmarkedIcon = solidBookmark;
  notBookmarkedIcon = emptyBookmark;
  isLikedIcon = solidThumbsUp;
  notLikedIcon = emptyThumbsUp;
  user: (User | null) = null;

  constructor (@Inject(MAT_DIALOG_DATA) public data: {note: Note, editing: boolean}, private http: HttpClient, private noteService: NotesService, private authService: AuthService) {
    this.note = data.note;
    this.editing = false;
    this.noteEditForm = new FormGroup({
      title: new FormControl<string>(data.note.title),
      description: new FormControl<string>(data.note.description),
    })
    this.error = "";
  }

  ngOnInit() {
    this.authService.loggedUser.subscribe(user => this.user = user);
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

  onBookmark(toSet: boolean) {
    this.http.put(`${environment.DB_STRING}/api/Notes/Bookmark/${this.note.id}`, {toSet: toSet})
    .subscribe({
      next: () => {
        this.note["bookmarked"] = toSet;
      }
    })
  }

  onLike(toSet: boolean) {
    this.http.put(`${environment.DB_STRING}/api/Notes/Like/${this.note.id}`, {toSet: toSet})
    .subscribe({
      next: () => {
        if (toSet) {
          this.note["likes"] = [...this.note.likes, this.user!.subject]
        } else {
          this.note["likes"] = this.note["likes"].filter(sub => sub != this.user!.subject);
        }
      }
    })
  }
}

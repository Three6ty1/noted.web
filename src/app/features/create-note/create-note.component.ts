import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faNoteSticky } from '@fortawesome/free-solid-svg-icons';
import { MatTooltipModule } from '@angular/material/tooltip';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { NotesService } from '../../core/notes/notes.service';

// The component that is constructed for the content of the dialog, as well as the form
@Component({
  selector: 'app-create-note-form',
  standalone: true,
  imports: [MatDialogModule, ReactiveFormsModule],
  templateUrl: 'create-note-form.component.html',
  styleUrl: 'create-note-form.component.scss',
})
export class CreateNoteFormComponent {
  constructor(private http: HttpClient, private notesService: NotesService) {}

  noteCreateForm = new FormGroup({
    title: new FormControl<string>(''),
    description: new FormControl<string>(''),
    links: new FormControl<string>(''),
    bookmarked: new FormControl<boolean>(false),
  })

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
        this.notesService.updateNotes();
        this.noteCreateForm.reset();
      }
    });
  }
}

// The component that is being exported, i.e. the dialog "box"
@Component({
  selector: 'app-create-note',
  standalone: true,
  imports: [FontAwesomeModule, MatTooltipModule, MatDialogModule],
  templateUrl: './create-note.component.html',
  styleUrl: './create-note.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateNoteComponent {
  createIcon = faNoteSticky;

  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(CreateNoteFormComponent);

    // Probably unneeded
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result ${result}`);
    });
  }
}

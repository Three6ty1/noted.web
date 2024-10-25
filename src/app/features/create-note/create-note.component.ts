import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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

  links = inject(FormBuilder);

  noteCreateForm = new FormGroup({
    title: new FormControl<string>(''),
    description: new FormControl<string>(''),
    additionalLinks: this.links.array<string>(['']),
    bookmarked: new FormControl<boolean>(false),
  })

  onNoteCreateSubmit() {
    console.log(this.noteCreateForm.value);

    const addNoteRequest = {
      title: this.noteCreateForm.value.title,
      description: this.noteCreateForm.value.description,
      links: this.noteCreateForm.value.additionalLinks,
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

  get additionalLinks() {
    return this.noteCreateForm.get('additionalLinks') as FormArray;
  }

  removeLink(index: number) {
    this.additionalLinks.removeAt(index);
  }

  addLink() {
    this.additionalLinks.push(this.links.control(''));
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

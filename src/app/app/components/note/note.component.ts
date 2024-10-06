import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NoteDialogComponent } from '../note-dialog/note-dialog.component';
@Component({
  selector: 'app-note',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteComponent {
  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(NoteDialogComponent);

    dialogRef.afterClosed();
  }
}

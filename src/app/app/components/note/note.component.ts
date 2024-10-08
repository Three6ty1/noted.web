import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NoteDialogComponent } from '../note-dialog/note-dialog.component';
import { Note } from '../../../../models/note.model';
import { NgStyle } from '@angular/common';
@Component({
  selector: 'app-note',
  standalone: true,
  imports: [MatDialogModule, NgStyle],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteComponent {
  @Input() note!: Note;

  readonly dialog = inject(MatDialog);
  random_color: string = '#'+(0x1000000+Math.random()*0xffffff).toString(16).substring(1,7);

  openDialog(note: Note) {
    const dialogRef = this.dialog.open(NoteDialogComponent, {
      data: { note: note },
    });

    dialogRef.afterClosed();
  }
}

import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { Note } from '../../../models/note.model';
import { NgStyle } from '@angular/common';
import { NoteDialogService } from '../../core/note-dialog/note-dialog.service';
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

  random_color: string = '#'+(0x1000000+Math.random()*0xffffff).toString(16).substring(1,7);

  constructor (private noteDialogService: NoteDialogService) {}

  openDialog(e: MouseEvent, note: Note) {
    this.noteDialogService.openDialog(note);
  }
}

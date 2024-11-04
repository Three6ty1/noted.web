import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Host, HostListener, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { Note } from '../models/note.model';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { HeaderComponent } from "./core/header/header.component";
import { NotesService } from './core/notes/notes.service';
import { NoteComponent } from './components/note/note.component';
import { EmptyNoteComponent } from "./components/empty-note/empty-note.component";
import { NoteDialogService } from './core/note-dialog/note-dialog.service';
import { AuthService } from './core/auth/auth.service';

type DragType = {
  element: HTMLDivElement | null,
  x: number,
  y: number,
  state: boolean,
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent, NoteComponent, EmptyNoteComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private notesService: NotesService, private http: HttpClient, private noteDialogService: NoteDialogService, private authService: AuthService) {}
  
  @ViewChild('allNotesContainer') pannable!: ElementRef<HTMLDivElement>;

  ngOnInit(): void {
    this.notesService.updateNotes();
    this.notesService.currentNotes.subscribe(n => this.notes = n);

    this.authService.login();
  }

  ngAfterViewInit() {
    this.drag.element = this.pannable.nativeElement;
  }

  notes: (Note | null)[][] = [];
  
  // Panning
  // https://stackoverflow.com/a/22187471
  drag: DragType = {
    element: null,
    x: 0,
    y: 0,
    state: false,
  };

  delta = {
    x: 0,
    y: 0,
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (this.drag.state && this.drag.element) {
      console.log("Dragging");
      // current mouse position - old mouse position drag
      this.delta.x = e.pageX - this.drag.x;
      this.delta.y = e.pageY - this.drag.y;

      // Amount of position to move
      var newOffsetLeft = this.drag.element.offsetLeft + this.delta.x
      var newOffsetTop = this.drag.element.offsetTop + this.delta.y

      // Cannot use css translate (doesn't move element position therefore subsequent transforms are relative to 0, 0)
      this.drag.element.style.top = `${newOffsetTop}px`
      this.drag.element.style.left = `${newOffsetLeft}px`

      this.drag.x = e.pageX;
      this.drag.y = e.pageY;
    }
  }

  @HostListener('document:mousedown', ['$event'])
  onMouseDown(e: MouseEvent) {
    // Middle mouse button
    if (!this.drag.state && e.button == 1) {
      // Record current mouse location
      this.drag.x = e.pageX;
      this.drag.y = e.pageY;
      this.drag.state = true;
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(e: MouseEvent) {
    if (this.drag.state) {
      this.drag.state = false
    }
  }

  onNoteDelete(id: string) {
    this.http.delete(`${environment.DB_STRING}/api/Notes/${id}`)
    .subscribe({
      next: () => {
        this.notesService.updateNotes();
      }
    })
  }
}

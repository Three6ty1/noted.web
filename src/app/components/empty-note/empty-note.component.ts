import { Component } from '@angular/core';

@Component({
  selector: 'app-empty-note',
  standalone: true,
  imports: [],
  template: '<div></div>',
  styles: [
    ':host {width: 160px; height: 160px; background-color: inherit; display: inline-flex; outline: 1px solid black; outline-offset: -1px}'
  ],
})
export class EmptyNoteComponent {

}

import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faNoteSticky, faList, faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreateNoteComponent } from "../../features/create-note/create-note.component";
import { InfoComponent } from "../../features/info/info.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FontAwesomeModule, MatTooltipModule, CreateNoteComponent, InfoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  listIcon = faList;
}

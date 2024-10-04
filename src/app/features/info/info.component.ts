import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { faAngular, faDocker, faSass } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-info-content',
  standalone: true,
  imports: [MatDialogModule, FontAwesomeModule],
  templateUrl: './info-content.component.html',
  styleUrl: './info-content.component.scss'
})
export class InfoContentComponent {
  angularIcon = faAngular;
  dockerIcon = faDocker;
  sassIcon = faSass;
}

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [FontAwesomeModule, MatTooltipModule, MatDialogModule],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoComponent {
  infoIcon = faCircleQuestion;

  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(InfoContentComponent);

    // Probably unneeded
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result ${result}`);
    });
  }
}

import { Component } from '@angular/core';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { InfoComponent } from '../info/info.component';

@Component({
  selector: 'app-d-shape',
  templateUrl: './d-shape.component.html',
  styleUrls: ['./d-shape.component.scss']
})
export class DShapeComponent {
  constructor(private dialogService: DialogService) {}

  openInfoPopup(): void {
    this.dialogService.openDialog(InfoComponent, {
      width: '1000px',
      height: '430px',
    });
  }
}

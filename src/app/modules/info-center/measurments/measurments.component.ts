import { Component } from '@angular/core';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { InfoComponent } from '../info/info.component';

@Component({
  selector: 'app-measurments',
  templateUrl: './measurments.component.html',
  styleUrls: ['./measurments.component.scss']
})
export class MeasurmentsComponent {
  constructor(private dialogService: DialogService) {}

  openInfoPopup(): void {
    this.dialogService.openDialog(InfoComponent, {
      width: '1000px',
      height: '430px',
    });
  }
}

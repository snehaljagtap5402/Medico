import { Component } from '@angular/core';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { InfoComponent } from '../info/info.component';

@Component({
  selector: 'app-finger-measurment',
  templateUrl: './finger-measurment.component.html',
  styleUrls: ['./finger-measurment.component.scss']
})
export class FingerMeasurmentComponent {
  constructor(private dialogService: DialogService) {}

  openInfoPopup(): void {
    this.dialogService.openDialog(InfoComponent, {
      width: '1000px',
      height: '430px',
    });
  }
}

import { Component } from '@angular/core';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { InfoComponent } from '../info/info.component';

@Component({
  selector: 'app-round-data',
  templateUrl: './round-data.component.html',
  styleUrls: ['./round-data.component.scss']
})
export class RoundDataComponent {
  constructor(private dialogService: DialogService) {}

  openInfoPopup(): void {
    this.dialogService.openDialog(InfoComponent, {
      width: '1000px',
      height: '430px',
    });
  }
}

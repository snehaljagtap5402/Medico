import { Component } from '@angular/core';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { InfoComponent } from '../info/info.component';

@Component({
  selector: 'app-square-data',
  templateUrl: './square-data.component.html',
  styleUrls: ['./square-data.component.scss']
})
export class SquareDataComponent {
  constructor(private dialogService: DialogService) {}

  openInfoPopup(): void {
    this.dialogService.openDialog(InfoComponent, {
      width: '1000px',
      height: '430px',
    });
  }
}

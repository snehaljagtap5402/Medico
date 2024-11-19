import { Component } from '@angular/core';
import { InfoComponent } from '../info/info.component';
import { DialogService } from 'src/app/shared/services/dialog.service';

@Component({
  selector: 'app-sheet-data',
  templateUrl: './sheet-data.component.html',
  styleUrls: ['./sheet-data.component.scss']
})
export class SheetDataComponent {

  constructor(private dialogService: DialogService) {}

  openInfoPopup(): void {
    this.dialogService.openDialog(InfoComponent, {
      width: '1000px',
      height: '430px',
    });
  }
}
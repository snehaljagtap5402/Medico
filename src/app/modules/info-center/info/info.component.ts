import { Component } from '@angular/core';
import { SheetDataComponent } from '../sheet-data/sheet-data.component';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { BullionComponent } from '../bullion/bullion.component';
import { DShapeComponent } from '../d-shape/d-shape.component';
import { FingerCalculatorComponent } from '../finger-calculator/finger-calculator.component';
import { FingerMeasurmentComponent } from '../finger-measurment/finger-measurment.component';
import { MeasurmentsComponent } from '../measurments/measurments.component';
import { MeasurmentsCalculatorComponent } from '../measurments-calculator/measurments-calculator.component';
import { RoundDataComponent } from '../round-data/round-data.component';
import { SolderingComponent } from '../soldering/soldering.component';
import { StoneCalculatorComponent } from '../stone-calculator/stone-calculator.component';
import { TubingComponent } from '../tubing/tubing.component';
import { SquareDataComponent } from '../square-data/square-data.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent {
  constructor(private dialogService: DialogService, private dialogRef: MatDialogRef<InfoComponent>,) {}

  openSheetPopup(): void {
    this.dialogService.openDialog(SheetDataComponent, {
      width: '1200px',
      height: '1000px',
    });
  }

  openBullionPopup(): void {
    this.dialogService.openDialog(BullionComponent, {
      width: '800px',
      //height: '1000px',
    });
  }

  openDShapePopup(): void {
    this.dialogService.openDialog(DShapeComponent, {
      width: '1200px',
      height: '1000px',
    });
  }

  openFingerCalculatorPopup(): void {
    this.dialogService.openDialog(FingerCalculatorComponent, {
      width: '800px',
     // height: '1000px',
    });
  }

  openFingerMeasurementPopup(): void {
    this.dialogService.openDialog(FingerMeasurmentComponent, {
      width: '1200px',
      height: '1000px',
    });
  }

  openMeasurementPopup(): void {
    this.dialogService.openDialog(MeasurmentsComponent, {
      width: '1200px',
      height: '1000px',
    });
  }

  openFingerMeasurementCalcultorPopup(): void {
    this.dialogService.openDialog(MeasurmentsCalculatorComponent, {
      width: '1000px',
      height: '800px',
    });
  }

  openRoundWirePopup(): void {
    this.dialogService.openDialog(RoundDataComponent, {
      width: '1200px',
      height: '1000px',
    });
  }

  openSolderingPopup(): void {
    this.dialogService.openDialog(SolderingComponent, {
      width: '1200px',
      height: '1000px',
    });
  }

  openStonePopup(): void {
    this.dialogService.openDialog(StoneCalculatorComponent, {
      width: '1200px',
      height: '500px',
    });
  }

  openSquarePopup(): void {
    this.dialogService.openDialog(SquareDataComponent, {
      width: '1200px',
      height: '1000px',
    });
  }

  openTubingPopup(): void {
    this.dialogService.openDialog(TubingComponent, {
      width: '1500px',
      height: '700px',
    });
  }

  
  closePopup() {
    this.dialogRef.close();
  }
}

import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private dialogRef: MatDialogRef<any> | undefined;

  constructor(private dialog: MatDialog) {}

  openDialog(component: any, config: any): void {
    // Close the previous dialog if it's open
    this.closeDialog();

    // Open the new dialog and store its reference
    this.dialogRef = this.dialog.open(component, config);
  }

  private closeDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
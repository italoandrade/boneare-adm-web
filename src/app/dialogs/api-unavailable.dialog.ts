import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'dialog-api-unavailable',
  templateUrl: 'api-unavailable.dialog.html'
})

export class ApiUnavailableDialog {
  constructor(public dialogRef: MatDialogRef<ApiUnavailableDialog>) {
  }

  onTryAgainClick() {
    this.dialogRef.close();
  }
}

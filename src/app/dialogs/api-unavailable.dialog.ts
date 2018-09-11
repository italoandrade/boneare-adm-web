import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'dialog-api-unavailable',
  templateUrl: 'api-unavailable.dialog.html'
})

export class ApiUnavailableDialog implements OnInit {
  constructor(public dialogRef: MatDialogRef<ApiUnavailableDialog>) {
  }

  ngOnInit() {
  }

  onTryAgainClick() {
    this.dialogRef.close();
  }
}

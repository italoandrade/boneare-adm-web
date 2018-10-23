import {Component, Inject, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material';

@Component({
  selector: 'custom-snackbar',
  templateUrl: 'custom-snackbar.component.html',
  styleUrls: ['custom-snackbar.component.scss']
})

export class CustomSnackbarComponent implements OnInit {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data, @Inject(MatSnackBarRef) public snackBarRef) {
  }

  ngOnInit() {
  }
}

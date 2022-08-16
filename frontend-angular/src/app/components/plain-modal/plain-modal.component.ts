import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-plain-modal',
  templateUrl: './plain-modal.component.html',
  styleUrls: ['./plain-modal.component.scss']
})
export class PlainModalComponent implements OnInit {
  content?: string;
  note?: string;
  applyText?: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PlainModalComponent,
    private dialogRef: MatDialogRef<PlainModalComponent>
  ) { }

  ngOnInit(): void {
  }

  cancel() {
    this.dialogRef.close();
  }
}

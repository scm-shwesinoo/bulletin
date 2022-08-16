import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-list-modal',
  templateUrl: './list-modal.component.html',
  styleUrls: ['./list-modal.component.scss']
})
export class ListModalComponent implements OnInit {
  name?: string;
  email?: string;
  phone?: string;
  dob?: string;
  address?: string;
  created_date?: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ListModalComponent,
    private dialogRef: MatDialogRef<ListModalComponent>
  ) { }

  ngOnInit(): void {
  }

  cancel() {
    this.dialogRef.close();
  }
}

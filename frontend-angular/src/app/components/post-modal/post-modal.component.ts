import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-post-modal',
  templateUrl: './post-modal.component.html',
  styleUrls: ['./post-modal.component.scss']
})
export class PostModalComponent implements OnInit {
  title?: string;
  description?: string;
  status?: string;
  created_user_id?: string;
  updated_user_id?: string;
  created_at?: string;

  constructor(
    public dialogRef: MatDialogRef<PostModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PostModalComponent,
  ) { }

  ngOnInit(): void {
  }

  cancel() {
    this.dialogRef.close();
  }
}

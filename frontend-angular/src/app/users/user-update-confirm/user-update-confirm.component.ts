import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PlainModalComponent } from 'src/app/components/plain-modal/plain-modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { SharingDataService } from 'src/app/services/sharing-data.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-update-confirm',
  templateUrl: './user-update-confirm.component.html',
  styleUrls: ['./user-update-confirm.component.scss']
})
export class UserUpdateConfirmComponent implements OnInit {

  constructor() { }

  ngOnInit(): void { }

}

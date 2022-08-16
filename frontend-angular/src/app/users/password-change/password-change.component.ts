import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SharingDataService } from 'src/app/services/sharing-data.service';

//services
import { UsersService } from 'src/app/services/users.service';

//validators
import { MustMatch } from 'src/app/validators/must-match.validator';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent implements OnInit {

  public passwordForm!: FormGroup;
  userInfo: any;
  userId: any;
  eachUser: any;
  password: any;
  constructor(
    private fb: FormBuilder,
    private usersSvc: UsersService,
    private snackBar: MatSnackBar,
    private shareDataSvc: SharingDataService,
    private router: Router) { }

  ngOnInit(): void {
    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]{8,}$')]],
      confirmPassword: ['', [Validators.required, MustMatch]]
    },
      {
        validator: MustMatch('newPassword', 'confirmPassword')
      });
    this.userInfo = JSON.parse(localStorage.getItem('userInfo') || '[]');
    this.userId = this.shareDataSvc.getUserId();
    this.usersSvc.getUserDetail(this.userInfo.id).subscribe({
      next: result => {
        this.password = result.password;
      }
    });
    if (this.userId) {
      this.getUserData();
    }
  }

  getUserData() {
    this.usersSvc.getUserDetail(this.userId).subscribe({
      next: result => {
        this.eachUser = result;
      }
    });
  }
  public myError = (controlName: string, errorName: string) => {
    return this.passwordForm.controls[controlName].hasError(errorName);
  }

  onSubmit(formValue: any) {
    if (this.userInfo.type === 0) {
      const password = this.eachUser.password;
      if (password !== formValue.oldPassword) {
        this.snackBar.open('Incorrect Password!', '', { duration: 3000 });
      } else {
        const data = {
          id: this.userId,
          name: this.eachUser.name,
          email: this.eachUser.email,
          password: this.passwordForm.value.newPassword,
          type: this.eachUser.type,
          phone: this.eachUser.phone,
          address: this.eachUser.address,
          dob: this.eachUser.dob,
          created_user_id: this.eachUser.created_user_id,
          updated_user_id: this.eachUser.updated_user_id,
          deleted_user_id: this.eachUser.deleted_user_id,
          created_at: this.eachUser.created_at,
          updated_at: this.eachUser.updated_at,
          deleted_at: "",
          is_removed: false
        }
        this.usersSvc.updateUser(data, this.userId).subscribe({
          next: result => {
            this.router.navigate(['user-list']);
          }
        });
        this.snackBar.open('Password Change Successfully!', '', { duration: 3000 });
      }
    } else {
      if (this.password !== formValue.oldPassword) {
        this.snackBar.open('Incorrect Password!', '', { duration: 3000 });
      } else {
        const data = {
          id: this.userInfo.id,
          name: this.userInfo.name,
          email: this.userInfo.email,
          password: this.passwordForm.value.newPassword,
          type: this.userInfo.type,
          phone: this.userInfo.phone,
          address: this.userInfo.address,
          dob: this.userInfo.dob,
          created_user_id: this.userInfo.created_user_id,
          updated_user_id: this.userInfo.updated_user_id,
          deleted_user_id: this.userInfo.deleted_user_id,
          created_at: this.userInfo.created_at,
          updated_at: this.userInfo.updated_at,
          deleted_at: "",
          is_removed: false
        }
        this.usersSvc.updateUser(data, this.userInfo.id).subscribe({
          next: result => {
            this.router.navigate(['user-profile']);
          }
        });
        this.snackBar.open('Password Change Successfully!', '', { duration: 3000 });
      }
    }
  }

  clearForm() {
    this.passwordForm.reset();
  }
}

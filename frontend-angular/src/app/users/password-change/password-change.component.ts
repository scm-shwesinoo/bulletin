import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

//services
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/auth.service';
import { SharingDataService } from 'src/app/services/sharing-data.service';

//validators
import { MustMatch } from 'src/app/validators/must-match.validator';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent implements OnInit {

  public passwordForm!: FormGroup;
  userEmail!: string;
  role!: string;

  constructor(
    private fb: FormBuilder,
    private usersSvc: UsersService,
    private snackBar: MatSnackBar,
    private shareDataSvc: SharingDataService,
    private authSvc: AuthService,
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

    this.userEmail = this.shareDataSvc.getUserEmail();
    console.log('useremail', this.userEmail);
    this.role = localStorage.getItem('role') || '';
    this.authSvc.role.next(this.role);
    this.authSvc.role.subscribe((data: string | null) => {
      this.role = data || '';
    });
  }

  public myError = (controlName: string, errorName: string) => {
    return this.passwordForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    const data = {
      "identifier": this.userEmail,
      "password": this.passwordForm.value.oldPassword,
      "newPassword": this.passwordForm.value.newPassword
    }

    this.usersSvc.changePassword(data).subscribe({
      next: res => {
        console.log("Password Change");
        if (res.data === 'success') {
          this.snackBar.open('Password change Successfully!', '', { duration: 3000 });
          if (this.role === 'authenticated') {
            this.router.navigate(['/user-list']);
          } else {
            this.router.navigate(['/user-profile']);
          }
        } else {
          this.snackBar.open('Incorrect Password!', '', { duration: 3000 });
        }
      }
    })
  }

  clearForm() {
    this.passwordForm.reset();
  }
}

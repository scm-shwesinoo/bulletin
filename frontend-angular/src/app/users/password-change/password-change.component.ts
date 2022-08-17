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
  userInfo: any;
  userEmail: any;
  eachUser: any;
  password: any;
  role: any;

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
    this.role = localStorage.getItem('role');
    this.authSvc.role.next(this.role);
    this.authSvc.role.subscribe((data: string | null) => {
      this.role = data;
    });
    // this.getUserData();

    // this.usersSvc.getUserDetail(this.userInfo.id).subscribe({
    //   next: result => {
    //     this.password = result.password;
    //   }
    // });
    // if (this.userId) {
    //   this.getUserData();
    // }
  }

  // getUserData() {
  //   this.usersSvc.getEachUser(this.userId).subscribe({
  //     next: result => {
  //       this.eachUser = result;
  //       console.log('each user', this.eachUser);

  //     }
  //   });
  // }


  public myError = (controlName: string, errorName: string) => {
    return this.passwordForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    const data = {
      "identifier": this.userEmail,
      "password": this.passwordForm.value.oldPassword,
      "newPassword": this.passwordForm.value.newPassword
    }
    console.log(data.newPassword);
    
    this.usersSvc.changePassword(data).subscribe({
      next: res => {
        console.log(res); 
        console.log("Password Change");
        if (res.data === 'success') {
          this.snackBar.open('Password change Successfully!', '', { duration: 3000 });
          if(this.role === 'authenticated'){
            this.router.navigate(['/user-list']);
          }else{
            this.router.navigate(['user-profile']);
          }
        }else{
          this.snackBar.open('Incorrect Password!', '', { duration: 3000 });
        } 
      }
    })
  }

  // onSubmit(formValue: any) {
  //   const password = this.eachUser.user.password;
  //   console.log(password);

  //   if (password !== formValue.oldPassword) {
  //     this.snackBar.open('Incorrect Password!', '', { duration: 3000 });
  //   } else {
  //     console.log('===correct');

  //   }
  //   // if (this.userInfo.type === 0) {
  //   //   const password = this.eachUser.password;
  //   //   if (password !== formValue.oldPassword) {
  //   //     this.snackBar.open('Incorrect Password!', '', { duration: 3000 });
  //   //   } else {
  //   //     const data = {
  //   //       id: this.userId,
  //   //       name: this.eachUser.name,
  //   //       email: this.eachUser.email,
  //   //       password: this.passwordForm.value.newPassword,
  //   //       type: this.eachUser.type,
  //   //       phone: this.eachUser.phone,
  //   //       address: this.eachUser.address,
  //   //       dob: this.eachUser.dob,
  //   //       created_user_id: this.eachUser.created_user_id,
  //   //       updated_user_id: this.eachUser.updated_user_id,
  //   //       deleted_user_id: this.eachUser.deleted_user_id,
  //   //       created_at: this.eachUser.created_at,
  //   //       updated_at: this.eachUser.updated_at,
  //   //       deleted_at: "",
  //   //       is_removed: false
  //   //     }
  //   //     this.usersSvc.updateUser(data, this.userId).subscribe({
  //   //       next: result => {
  //   //         this.router.navigate(['user-list']);
  //   //       }
  //   //     });
  //   //     this.snackBar.open('Password Change Successfully!', '', { duration: 3000 });
  //   //   }
  //   // } else {
  //   //   if (this.password !== formValue.oldPassword) {
  //   //     this.snackBar.open('Incorrect Password!', '', { duration: 3000 });
  //   //   } else {
  //   //     const data = {
  //   //       id: this.userInfo.id,
  //   //       name: this.userInfo.name,
  //   //       email: this.userInfo.email,
  //   //       password: this.passwordForm.value.newPassword,
  //   //       type: this.userInfo.type,
  //   //       phone: this.userInfo.phone,
  //   //       address: this.userInfo.address,
  //   //       dob: this.userInfo.dob,
  //   //       created_user_id: this.userInfo.created_user_id,
  //   //       updated_user_id: this.userInfo.updated_user_id,
  //   //       deleted_user_id: this.userInfo.deleted_user_id,
  //   //       created_at: this.userInfo.created_at,
  //   //       updated_at: this.userInfo.updated_at,
  //   //       deleted_at: "",
  //   //       is_removed: false
  //   //     }
  //   //     this.usersSvc.updateUser(data, this.userInfo.id).subscribe({
  //   //       next: result => {
  //   //         this.router.navigate(['user-profile']);
  //   //       }
  //   //     });
  //   //     this.snackBar.open('Password Change Successfully!', '', { duration: 3000 });
  //   //   }
  //   // }
  // }

  clearForm() {
    this.passwordForm.reset();
  }
}

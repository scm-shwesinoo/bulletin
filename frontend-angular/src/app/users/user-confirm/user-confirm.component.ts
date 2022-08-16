import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PlainModalComponent } from 'src/app/components/plain-modal/plain-modal.component';

// Services
import { AuthService } from 'src/app/services/auth.service';
import { SharingDataService } from 'src/app/services/sharing-data.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-confirm',
  templateUrl: './user-confirm.component.html',
  styleUrls: ['./user-confirm.component.scss']
})
export class UserConfirmComponent implements OnInit {

  userData: any;
  userList: any = [];
  userListDetail: any;
  profileUrl: any;
  // public userInfo: any;
  loginId: any;

  constructor(
    private router: Router,
    private shareDataSvc: SharingDataService,
    private userSvc: UsersService,
    private authSvc: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.loginId = localStorage.getItem('id');
    this.authSvc.id.next(this.loginId);
    this.authSvc.id.subscribe((data: string | null) => {
      this.loginId = data;
    });
    this.userData = this.shareDataSvc.getUserData();
    this.getUserList();
    // this.userInfo = JSON.parse(localStorage.getItem('userInfo') || "[]");
  }

  getUserList() {
    this.userSvc.getUser().subscribe({
      next: result => {
        this.userList = result;
      },
      error: err => {
        console.log('=== handle error ====')
        console.log(err)
      }
    });
  }

  createUser() {
    console.log('====user data====');;
    console.log(this.userData.file);

    this.userSvc.uploadProfile(this.userData.file).subscribe({
      next: (res: any) => {
        this.profileUrl = res[0].url;
        const data = {
          "data": {
            "name": this.userData.name,
            "email": this.userData.email,
            "password": this.userData.password,
            "type": this.userData.type,
            "phone": this.userData.phone,
            "dob": this.userData.dob,
            "address": this.userData.address,
            "profile": this.profileUrl
          }
        };
        this.userSvc.createUser(data).subscribe({
          next: res => {
            this.shareDataSvc.setUserData(null);
            this.snackBar.open('User Created Successfully!', '', { duration: 3000 });
            this.router.navigate(['/user-list']);
          },
          error: err => {
            console.log('=== handle error ====')
            console.log(err)
          }
        })
      }
    })

    // const duplicateUser = this.userList.filter((item: any) => item.email === this.userData.email);
    // if (duplicateUser.length > 0) {
    //   this.dialog.open(PlainModalComponent, {
    //     data: {
    //       content: ` User with ${this.userData.email} already exists !`,
    //       note: '',
    //       applyText: 'Ok'
    //     }
    //   });
    // } else {
    //   const data = {
    //     name: this.userData.name,
    //     email: this.userData.email,
    //     password: this.userData.password,
    //     type: this.userData.type,
    //     phone: this.userData.phone,
    //     address: this.userData.address,
    //     dob: this.userData.dob,
    //     created_user_id: this.userInfo.id,
    //     updated_user_id: this.userInfo.id,
    //     deleted_user_id: this.userInfo.id,
    //     created_at: new Date(),
    //     updated_at: new Date(),
    //     deleted_at: '',
    //     is_removed: false
    //   };
    //   this.userSvc.createUser(data).subscribe({
    //     next: result => {
    //       this.shareDataSvc.setUserData(null);
    //     },
    //     error: err => {
    //       console.log('=== handle error ====')
    //       console.log(err)
    //     }
    //   });
    //   this.snackBar.open('User Created Successfully!', '', { duration: 3000 });
    //   this.router.navigate(['/user-list']);
    // }
  }

  goBackUserCreate() {
    this.router.navigate(['/user']);
  }
}



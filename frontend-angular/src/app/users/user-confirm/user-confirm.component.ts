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
  createdUser: any;
  role: any;
  userRole: any = [];
  loginRole: any;
  test: any;
  loginId: any;
  userId: any;
  formType: any;

  constructor(
    private router: Router,
    private shareDataSvc: SharingDataService,
    private userSvc: UsersService,
    private authSvc: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.createdUser = localStorage.getItem('username');
    this.authSvc.name.next(this.createdUser);
    this.authSvc.name.subscribe((data: string | null) => {
      this.createdUser = data;
    });
    this.loginId = localStorage.getItem('id');
    this.authSvc.id.next(this.loginId);
    this.authSvc.id.subscribe((data: string | null) => {
      this.loginId = data;
    });
    this.loginRole = localStorage.getItem('role');
    this.authSvc.role.next(this.loginRole);
    this.authSvc.role.subscribe((data: string | null) => {
      this.loginRole = data;
    });
    this.userData = this.shareDataSvc.getUserData();
    this.showAlert();
    this.userId = this.userData.userId;
    this.formType = this.userData.formType;
    console.log('formType', this.formType);
    this.getUserList();
    this.getRole();
    this.getEachUserData();
    console.log('formType', this.formType);
    console.log('type', this.userData.type)
    console.log('role', this.loginRole)
  }

  showAlert() {
    if (!this.userData) {
      if (window.confirm('Go back to user list page')) {
        this.router.navigate(['/user-list']);
      }
    }
  }

  getRole() {
    this.userSvc.getRole().subscribe({
      next: result => {
        this.userRole.push(result);
        if (this.userData.type == 0) {
          this.test = this.userRole.map((result: any) => result.roles.filter((item: any) => item.name == 'Authenticated'));
          this.role = this.test[0][0].id;
        } else {
          this.test = this.userRole.map((result: any) => result.roles.filter((item: any) => item.name == 'User'));
          this.role = this.test[0][0].id;
        }
      },
      error: err => {
        console.log('=== handle error ====')
        console.log(err)
      }
    })
  }

  getUserList() {
    this.userSvc.getAllUser().subscribe({
      next: result => {
        this.userList = result;
        console.log('====user list====');;
        console.log(this.userList);
      },
      error: err => {
        console.log('=== handle error ====')
        console.log(err)
      }
    });
  }

  getEachUserData() {
    if (this.userId) {
      this.userSvc.getEachUser(this.userId).subscribe({
        next: result => {
          this.userListDetail = result;
          console.log('detail')
          console.log(this.userListDetail);
        },
        error: err => {
          console.log('=== handle error ===');
          console.log(err);
        }
      });
    }
  }

  onSubmit() {
    if (this.formType == 'add') {
      this.createUser();
    } else {
      this.updateUser();
    }
  }

  createUser() {
    const duplicateUser = this.userList.filter((item: any) => item.user.email === this.userData.email);
    if (duplicateUser.length > 0) {
      this.dialog.open(PlainModalComponent, {
        data: {
          content: `User with ${this.userData.email} already exists !`,
          note: '',
          applyText: 'Ok'
        }
      });
    } else {
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
              "profile": this.profileUrl,
              "createdUser": this.createdUser,
              "role": this.role
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
    }
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

  updateUser() {
    if (this.userData.oldProfile !== null) {
      const data = {
        "data": {
          "name": this.userData.name,
          "email": this.userData.email,
          "type": this.userData.type,
          "phone": this.userData.phone,
          "dob": this.userData.dob,
          "address": this.userData.address,
          "profile": this.userData.oldProfile,
          "updated_user_id": this.loginId,
          "role": this.role
        }
      };
      this.update(data);
    } else {
      this.userSvc.uploadProfile(this.userData.file).subscribe({
        next: (res: any) => {
          this.profileUrl = res[0].url;
          const data = {
            "data": {
              "name": this.userData.name,
              "email": this.userData.email,
              "type": this.userData.type,
              "phone": this.userData.phone,
              "dob": this.userData.dob,
              "address": this.userData.address,
              "profile": this.profileUrl,
              "updated_user_id": this.loginId,
              "role": this.role
            }
          };
          this.update(data);
        }
      })
    }
  }

  update(data: any) {
    this.userSvc.updateUser(data, this.userId).subscribe({
      next: res => {
        this.shareDataSvc.setUserData(null);
        this.snackBar.open('User Updated Successfully!', '', { duration: 3000 });
        if (this.loginRole == 'authenticated') {
          this.router.navigate(['/user-list']);
        } else {
          this.router.navigate(['/user-profile']);
        }
      },
      error: err => {
        console.log('=== handle error ====')
        console.log(err)
      }
    })
  }

  goBackUserCreate() {
    if (this.formType == 'add') {
      this.router.navigate(['/user']);
    } else {
      this.router.navigate(['/user/' + this.userId]);
    }
  }
}



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
  profileUrl!: string;
  createdUser!: string;
  roleID!: number;
  userRole: any = [];
  loginRole!: string;
  loginID!: any;
  userID!: number;
  formType!: string;

  constructor(
    private router: Router,
    private shareDataSvc: SharingDataService,
    private userSvc: UsersService,
    private authSvc: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.createdUser = localStorage.getItem('username') || '';
    this.authSvc.name.next(this.createdUser);
    this.authSvc.name.subscribe((data: string | null) => {
      this.createdUser = data || '';
    });
    this.loginID = localStorage.getItem('id');
    this.authSvc.id.next(this.loginID);
    this.authSvc.id.subscribe((data: number | null) => {
      this.loginID = data;
    });
    this.loginRole = localStorage.getItem('role') || '';
    this.authSvc.role.next(this.loginRole);
    this.authSvc.role.subscribe((data: string | null) => {
      this.loginRole = data || '';
    });

    this.userData = this.shareDataSvc.getUserData();
    this.showAlert();
    this.userID = this.userData.userId;
    this.formType = this.userData.formType;
    this.getUserList();
    this.getRole();
    this.getEachUserData();
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
          let data = this.userRole.map((result: any) => result.roles.filter((item: any) => item.name == 'Authenticated'));
          this.roleID = data[0][0].id;
        } else {
          let data = this.userRole.map((result: any) => result.roles.filter((item: any) => item.name == 'User'));
          this.roleID = data[0][0].id;
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
      },
      error: err => {
        console.log('=== handle error ====')
        console.log(err)
      }
    });
  }

  getEachUserData() {
    if (this.userID) {
      this.userSvc.getEachUser(this.userID).subscribe({
        next: result => {
          this.userListDetail = result;
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
              "role": this.roleID
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
          "updated_user_id": this.loginID,
          "role": this.roleID
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
              "updated_user_id": this.loginID,
              "role": this.roleID
            }
          };
          this.update(data);
        }
      })
    }
  }

  update(data: any) {
    const duplicateUser = this.userList.filter((item: any) => item.user.email === this.userData.email && item.id != this.userID);
    if (duplicateUser.length > 0) {
      this.dialog.open(PlainModalComponent, {
        data: {
          content: `User with ${this.userData.email} already exists !`,
          note: '',
          applyText: 'Ok'
        }
      });
    } else {
      this.userSvc.updateUser(data, this.userID).subscribe({
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
  }

  goBackUserCreate() {
    if (this.formType == 'add') {
      this.router.navigate(['/user']);
    } else {
      this.router.navigate(['/user/' + this.userID]);
    }
  }
}



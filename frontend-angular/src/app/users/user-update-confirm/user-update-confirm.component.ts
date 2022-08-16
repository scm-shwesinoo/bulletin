import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PlainModalComponent } from 'src/app/components/plain-modal/plain-modal.component';
import { SharingDataService } from 'src/app/services/sharing-data.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-update-confirm',
  templateUrl: './user-update-confirm.component.html',
  styleUrls: ['./user-update-confirm.component.scss']
})
export class UserUpdateConfirmComponent implements OnInit {

  public userData: any;
  public userList: any = [];
  public userListDetail: any;
  public userId: any;
  public userInfo: any;

  constructor(
    private router: Router,
    private shareDataSvc: SharingDataService,
    private userSvc: UsersService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.userData = this.shareDataSvc.getUserData();
    this.userId = this.userData.userId;
    // this.getUserList();
    // if (this.userId) {
      this.getEachUserData();
    // }
    // this.userInfo = JSON.parse(localStorage.getItem('userInfo') || "[]");
  }

  // getUserList() {
  //   this.userSvc.getUser().subscribe({
  //     next: result => {
  //       this.userList = result;
  //     },
  //     error: err => {
  //       console.log('=== handle error ====')
  //       console.log(err)
  //     }
  //   });
  // }

  getEachUserData() {
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

  createUser() {
    const data = {
      "data": {
        "name": this.userData.name,
        "email": this.userData.email,
        "type": this.userData.type,
        "phone": this.userData.phone,
        "dob": this.userData.dob,
        "address": this.userData.address,
        "profile": '/uploads/poe_square_a8bc6e07fc.jpg'
      }
    };
    console.log(this.userData);
    console.log(this.userListDetail.user.email);
    
    this.userSvc.updateUser(data, this.userId).subscribe({
      next: res => {
        this.snackBar.open('User Updated Successfully!', '', { duration: 3000 });
        this.router.navigate(['/user-list']);
      },
      error: err => {
        console.log('=== handle error ===');
        console.log(err);
      }
    })
  


    // const duplicate = this.userList.filter((item: any) => item.email === this.userData.email && item.id != this.userId);
    // if (duplicate.length > 0) {
    //   this.dialog.open(PlainModalComponent, {
    //     data: {
    //       content: ` User with ${this.userData.email} already exists !`,
    //       note: '',
    //       applyText: 'Ok'
    //     }
    //   });
    //   return;
    // }
    // const data = {
    //   id: this.userId,
    //   name: this.userData.name,
    //   email: this.userData.email,
    //   password: this.userListDetail.password,
    //   type: this.userData.type,
    //   phone: this.userData.phone,
    //   dob: this.userData.dob,
    //   address: this.userData.address,
    //   created_user_id: this.userListDetail.created_user_id,
    //   updated_user_id: this.userInfo.id,
    //   deleted_user_id: this.userInfo.id,
    //   created_at: this.userListDetail.created_at,
    //   updated_at: new Date(),
    //   is_removed: false
    // };
    // this.userSvc.updateUser(data, this.userId)
    //   .subscribe({
    //     next: result => {
    //       this.shareDataSvc.setUserData(null);
    //     },
    //     error: err => {
    //       console.log('=== handle error ====')
    //       console.log(err)
    //     }
    //   });
    // this.snackBar.open('User Updated Successfully!', '', { duration: 3000 });
    // this.router.navigate(['/user-list']);
  }

  goBackUserCreate() {
    this.router.navigate(['/user/' + this.userId]);
  }

}

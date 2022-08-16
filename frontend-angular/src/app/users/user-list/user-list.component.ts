import { ViewChild, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

//services
import { UsersService } from 'src/app/services/users.service';

//pages
import { ListModalComponent } from 'src/app/components/list-modal/list-modal.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'profile', 'created_user_id', 'phone', 'dob', 'address', 'created_at', 'updated_at', 'action'];
  apiUrl: string = 'http://localhost:1337';
  userList: any = [];
  orgList: any = [];
  eachUser: any;
  dataSource!: MatTableDataSource<any>;
  userInfo: any;
  nameFilter: any;
  emailFilter: any;
  fromDate: any;
  toDate: any;
  ////
  loginUser: any;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private usersSvc: UsersService,
    private authSvc: AuthService) {
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngOnInit(): void {
    this.getAllUserData();
    // this.userInfo = JSON.parse(localStorage.getItem('userInfo') || '[]');
    this.loginUser = localStorage.getItem('username');
    // this.authSvc.role.next(this.loginUser);
    // this.authSvc.role.subscribe((data: string | null) => {
    //   this.loginUser= data;
    // });
  }

  getAllUserData() {
    this.usersSvc.getAllUser().subscribe({
      next: users => {
        this.orgList = users;
        this.dataSource = new MatTableDataSource(users);
        this.dataSource.paginator = this.paginator;
      },
      error: err => {
        console.log('=====error=====');
        console.log(err);
      }
    })
    // this.usersSvc.getUser().subscribe({
    //   next: data => {
    //     this.orgList = data.filter((result: any) => {
    //       this.usersSvc.getUserDetail(result.created_user_id).subscribe({
    //         next: user => {
    //           result.user_name = user.name;
    //         }
    //       });
    //       return result.is_removed === false;
    //     })
    //     this.userList = data.filter((result: any) => {
    //       this.usersSvc.getUserDetail(result.created_user_id).subscribe({
    //         next: user => {
    //           result.user_name = user.name;
    //         }
    //       });
    //       return result.is_removed === false;
    //     })
    //     this.orgList.sort((a: any, b: any) => a.order_key > b.order_key ? 1 : -1);
    //     this.userList.sort((a: any, b: any) => a.order_key > b.order_key ? 1 : -1);
    //     this.dataSource = new MatTableDataSource(this.userList);
    //     this.dataSource.paginator = this.paginator;
    //   },
    //   error: err => {
    //     console.log('=== handle error ===');
    //     console.log(err);
    //   }
    // });
  }

  getEachUserData(userId: any) {
    this.usersSvc.getEachUser(userId).subscribe({
      next: (user: any) => {
        console.log(user);
        this.dialog.open(ListModalComponent, {
          width: '600px',
          data: {
            name: user.user.username,
            email: user.user.email,
            phone: user.phone,
            dob: user.dob,
            address: user.address,
            created_date: user.createdAt
          }
        });
      }
    })
    // this.usersSvc.getUserDetail(userId).subscribe({
    //   next: res => {
    //     this.eachUser = res;
    //     this.dialog.open(ListModalComponent, {
    //       width: '600px',
    //       data: {
    //         name: res.name,
    //         email: res.email,
    //         phone: res.phone,
    //         dob: res.dob,
    //         address: res.address,
    //         created_date: res.created_at
    //       }
    //     });
    //   },
    //   error: err => {
    //     console.log('=== handle error ===');
    //     console.log(err);
    //   }
    // });
  }

  updateUserData(userId: any) {
    this.router.navigate(['/user/' + userId]);
  }

  deleteUserData(userId: any) {
    if (window.confirm('Are you sure, you want to delete?')) {
      this.usersSvc.deleteUser(userId).subscribe({
        next: res => {
          this.snackBar.open('User Deleted Successfully!', '', { duration: 3000 });
          this.getAllUserData();
        }
      })
    }
    // this.usersSvc.getUserDetail(userId).subscribe({
    //   next: data => {
    //     this.eachUser = data;
    //     const param = {
    //       id: userId,
    //       name: this.eachUser.name,
    //       email: this.eachUser.email,
    //       password: this.eachUser.password,
    //       type: this.eachUser.type,
    //       phone: this.eachUser.phone,
    //       address: this.eachUser.address,
    //       dob: this.eachUser.dob,
    //       created_user_id: this.eachUser.created_user_id,
    //       updated_user_id: this.eachUser.updated_user_id,
    //       deleted_user_id: this.userInfo.id,
    //       created_at: this.eachUser.created_at,
    //       updated_at: this.eachUser.updated_at,
    //       deleted_at: new Date(),
    //       is_removed: true
    //     };
    //     this.usersSvc.deleteUser(userId, param).subscribe({
    //       next: data => {
    //         this.snackBar.open('User Deleted Successfully!', '', { duration: 3000 });
    //         this.getAllUserData();
    //       },
    //       error: err => {
    //         console.log('=== handle error ===');
    //         console.log(err);
    //       }
    //     })
    //   }
    // });
  }

  onSearch() {
    console.log(this.orgList);

    if (!this.nameFilter && !this.emailFilter && !this.fromDate && !this.toDate) {
      this.getAllUserData();
    }
    else if (this.nameFilter && !this.emailFilter && !this.fromDate && !this.toDate) {
      //for name filter
      let result = this.orgList.filter((e: any) => {
        console.log('===e');
        console.log(e);
        return e.user.username.trim().toLowerCase().includes(this.nameFilter);
      });
      this.dataSource = new MatTableDataSource(result);
    } else if (!this.nameFilter && this.emailFilter && !this.fromDate && !this.toDate) {
      //for email filter
      let result = this.orgList.filter((e: any) => {
        return e.user.email.includes(this.emailFilter);
      });
      this.dataSource = new MatTableDataSource(result);
    }
    else if (!this.nameFilter && !this.emailFilter && this.fromDate && this.toDate) {
      //for date filter
      this.toDate.setTime(this.toDate.getTime() + ((23 * 60 + 59) * 60 + 59) * 1000);
      let result = this.orgList.filter((e: any) => {
        return new Date(e.createdAt) >= this.fromDate
          && new Date(e.createdAt) <= this.toDate
      });
      this.dataSource = new MatTableDataSource(result);
    } else if (this.nameFilter && this.emailFilter && !this.fromDate && !this.toDate) {
      //for name and email filter
      let result = this.orgList.filter((e: any) => {
        return e.user.username.trim().toLowerCase().includes(this.nameFilter) && e.user.email.includes(this.emailFilter);
      });
      this.dataSource = new MatTableDataSource(result);
    }
    else if (this.nameFilter && !this.emailFilter && this.fromDate && this.toDate) {
      //for name and date filter
      this.toDate.setTime(this.toDate.getTime() + ((23 * 60 + 59) * 60 + 59) * 1000);
      let result = this.orgList.filter((e: any) => {
        return e.user.username.trim().toLowerCase().includes(this.nameFilter)
          && new Date(e.createdAt) >= this.fromDate
          && new Date(e.createdAt) <= this.toDate
      });
      this.dataSource = new MatTableDataSource(result);
    }
    else if (!this.nameFilter && this.emailFilter && this.fromDate && this.toDate) {
      //for email and date filter
      this.toDate.setTime(this.toDate.getTime() + ((23 * 60 + 59) * 60 + 59) * 1000);
      let result = this.orgList.filter((e: any) => {
        return e.user.email.includes(this.emailFilter)
          && new Date(e.createdAt) >= this.fromDate
          && new Date(e.createdAt) <= this.toDate
      });
      this.dataSource = new MatTableDataSource(result);
    }
    else {
      //for name , email and date filter
      this.toDate.setTime(this.toDate.getTime() + ((23 * 60 + 59) * 60 + 59) * 1000);
      let result = this.orgList.filter((e: any) => {
        return e.user.username.trim().toLowerCase().includes(this.nameFilter)
          && e.user.email.includes(this.emailFilter)
          && new Date(e.createdAt) >= this.fromDate
          && new Date(e.createdAt) <= this.toDate
      });
      this.dataSource = new MatTableDataSource(result);
    }
    this.dataSource.paginator = this.paginator;
  }

  onConfirm() {
    this.router.navigate(['/user']);
  }
}

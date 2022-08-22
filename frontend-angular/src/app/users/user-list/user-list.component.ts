import { ViewChild, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

//services
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/auth.service';

//pages
import { ListModalComponent } from 'src/app/components/list-modal/list-modal.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'profile', 'created_user_id', 'phone', 'dob', 'address', 'created_at', 'updated_at', 'action'];
  dataSource!: MatTableDataSource<any>;
  apiUrl = environment.imageURL;
  orgList: any = [];
  nameFilter: any;
  emailFilter: any;
  fromDate: any;
  toDate: any;
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
    console.log('===user data===');
    this.loginUser = localStorage.getItem('username');
  }

  getAllUserData() {
    this.usersSvc.getAllUser().subscribe({
      next: users => {
        this.orgList = users;
        console.log(this.orgList);
        this.dataSource = new MatTableDataSource(users);
        this.dataSource.paginator = this.paginator;
      },
      error: err => {
        console.log('=====error=====');
        console.log(err);
      }
    })
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

import { ViewChild, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

//services
import { UsersService } from 'src/app/services/users.service';

//pages
import { ListModalComponent } from 'src/app/components/list-modal/list-modal.component';

// interface
import { UserList } from 'src/app/interfaces/interface';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'profile', 'created_user_id', 'phone', 'dob', 'address', 'created_at', 'updated_at', 'action'];
  dataSource!: MatTableDataSource<UserList>;
  apiUrl = environment.imageURL;
  orgList: UserList[] = [];
  nameFilter!: string;
  emailFilter!: string;
  fromDate!: Date;
  toDate!: Date;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private usersSvc: UsersService) {
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngOnInit(): void {
    this.getAllUserData();
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
  }

  getEachUserData(userID: number) {
    const data = this.orgList.filter((res: UserList) => res.id === userID);
    this.dialog.open(ListModalComponent, {
      width: '600px',
      data: {
        name: data[0].user.username,
        email: data[0].user.email,
        phone: data[0].phone,
        dob: data[0].dob,
        address: data[0].address,
        created_date: data[0].createdAt
      }
    });
  }

  updateUserData(userId: number) {
    this.router.navigate(['/user/' + userId]);
  }

  deleteUserData(userId: number) {
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
    let result = this.orgList;
    if (this.nameFilter) {
      result = result.filter((e: UserList) => {
        return e.user.username.trim().toLowerCase().includes(this.nameFilter);
      });
    }

    if (this.emailFilter) {
      result = result.filter((e: UserList) => {
        return e.user.email.includes(this.emailFilter);
      });
    }

    if (this.fromDate && this.toDate) {
      this.toDate.setTime(this.toDate.getTime() + ((23 * 60 + 59) * 60 + 59) * 1000);
      result = result.filter((e: UserList) => {
        return new Date(e.createdAt) >= this.fromDate
          && new Date(e.createdAt) <= this.toDate
      });
    }
    this.dataSource = new MatTableDataSource<UserList>(result);
    this.dataSource.paginator = this.paginator;
  }

  onConfirm() {
    this.router.navigate(['/user']);
  }
}

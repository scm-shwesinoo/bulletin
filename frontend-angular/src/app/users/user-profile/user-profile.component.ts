import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// service
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { SharingDataService } from 'src/app/services/sharing-data.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  id: any;
  // user: any;
  userData: any = {};
  role: any;
  userList: any;
  email: any;
  apiUrl: string = 'http://localhost:1337';
  userId: any;

  constructor(
    private router: Router,
    private userSvc: UsersService,
    private authSvc: AuthService,
    private shareDataSvc: SharingDataService
  ) { }

  ngOnInit(): void {
    this.id = localStorage.getItem('id');
    this.authSvc.id.next(this.id);
    this.authSvc.id.subscribe((data: string | null) => {
      this.id = data;
    });
    this.role = localStorage.getItem('role');
    this.authSvc.role.next(this.role);
    this.authSvc.role.subscribe((data: string | null) => {
      this.role = data;
    });
    this.getUserList();
  }

  getUserList() {
    this.userSvc.getAllUser().subscribe({
      next: result => {
        this.userList = result;
        const user = this.userList.filter((item: any) => this.id == item.user.id);
        this.userData = user;
        this.userId = this.userData[0]?.id;
      },
      error: err => {
        console.log('=== handle error ====')
        console.log(err)
      }
    });
  }

  editProfile() {
    this.router.navigate(['/user/' + this.userId]);
  }
}

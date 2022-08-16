import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

// service
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  id: any;
  userData: any;
  role: any;

  constructor(
    private userSvc: UsersService,
    private authSvc: AuthService
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
    this.getEachUserData();
    // this.userInfo = JSON.parse(localStorage.getItem('userInfo') || '[]');
    // if (this.userInfo.type == 0) {
    //   this.type = 'Admin';
    //   this.admin = false;
    // } else {
    //   this.type = 'User';
    //   this.admin = true;
    // }
  }

  getEachUserData(){
    this.userSvc.getEachUser(this.id).subscribe({
      next: (res) => {
        console.log(res.user);
        
        this.userData = res;  
        console.log(this.userData);
      }
    });
  }


}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserList, UserProfile } from 'src/app/interfaces/interface';

// service
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  id!: number;
  userData!: UserProfile;
  email!: string;
  userID!: number;

  constructor(
    private router: Router,
    private userSvc: UsersService,
    private authSvc: AuthService
  ) { }

  ngOnInit(): void {
    const id = localStorage.getItem('id') || '';
    this.authSvc.id.next(parseInt(id));
    this.authSvc.id.subscribe((data: number | null) => {
      this.id = data!;
    });
    this.getEachUser();
  }

  getEachUser() {
    this.userSvc.getUser(this.id).subscribe({
      next: result => {
        console.log('Result===',result)
        this.userData = result;
        this.userID = this.userData.employee.id;
      }
    })
  }

  editProfile() {
    this.router.navigate(['/user/' + this.userID]);
  }
}

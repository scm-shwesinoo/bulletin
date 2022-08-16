import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'bulletinboard-ojt';
  showNavBar = true;
  role: any;
  token: any;
  name: any;
  // user: any = null;
  // userData: any;

  constructor(private router: Router, private authSvc: AuthService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.router.url === '/login' || this.router.url === '/') {
          this.showNavBar = false;
        } else {
          this.showNavBar = true;
        }
        this.token = localStorage.getItem('token');
      }
    });

  }

  ngOnInit(): void {
    this.name = localStorage.getItem('username');
    this.authSvc.name.next(this.name);
    this.authSvc.name.subscribe((data: string | null) => {
      this.name = data;
    });
    this.role = localStorage.getItem('role');
    this.authSvc.role.next(this.role);
    this.authSvc.role.subscribe((data: string | null) => {
      this.role = data;
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

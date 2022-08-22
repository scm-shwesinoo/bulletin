import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

// pages
import { PlainModalComponent } from 'src/app/components/plain-modal/plain-modal.component';

//services
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {

  loginForm!: FormGroup;
  userList!: [];

  constructor(
    private fb: FormBuilder,
    private authSvc: AuthService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', [Validators.required])
    });
  }

  get myLoginForm() {
    return this.loginForm.controls;
  }

  onSubmit() {
    const data = {
      "identifier": this.loginForm.value.email,
      "password": this.loginForm.value.password
    }
    console.log('login data', data);

    this.authSvc.login(data).subscribe({
      next: async res => {
        const token = res.jwt;
        localStorage.setItem("token", token);
        await this.getMe();
      },
      error: err => {
        this.dialog.open(PlainModalComponent, {
          data: {
            content: `Email or password is incorrect...`,
            note: '',
            applyText: 'Ok'
          }
        });
      }
    });
  }

  async getMe() {
    (await this.authSvc.getMe()).subscribe({
      next: res => {
        console.log(res);
        localStorage.setItem('user', JSON.stringify(res));
        localStorage.setItem('username', res.username);
        localStorage.setItem('role', res.role.type);
        localStorage.setItem('id', res.id);
        this.authSvc.role.next(res.role.type);
        this.authSvc.name.next(res.username);
        this.authSvc.id.next(res.id);
        this.router.navigate(["/post-list"]);
      },
      error: err => {
        console.log(err);
      }
    })
  }

}

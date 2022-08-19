import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// validator
import { MustMatch } from 'src/app/validators/must-match.validator';

// service
import { SharingDataService } from 'src/app/services/sharing-data.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})

export class UserFormComponent implements OnInit {

  typeOption = [
    { value: 0, label: 'Admin' },
    { value: 1, label: 'User' }
  ];

  userForm!: FormGroup;
  userId: number = 0;
  userDetail: any;
  profileUrl: any;
  file!: File;
  chooseImage: boolean = false;
  apiUrl: string = 'http://localhost:1337';
  imageUrl: any;
  email: any;

  @Input() formType = 'add' || 'edit';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private shareDataSvc: SharingDataService,
    private userSvc: UsersService
  ) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      password: ['', [
        Validators.required,
        Validators.pattern('(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]{8,}$')]],
      confirmPwd: ['', [Validators.required, MustMatch]],
      type: [0],
      phone: ['', [Validators.required,
      Validators.pattern("^[0-9]{11}$")
      ]],
      dob: [''],
      address: ['']
    },
      {
        validator: MustMatch('password', 'confirmPwd')
      });

    this.userId = this.activatedRoute.snapshot.params['id'];

    this.getUserData();
  }

  getUserData() {
    const data = this.shareDataSvc.getUserData();
    this.userDetail = data;
    if (this.userDetail) {
      this.chooseImage = true;
      this.profileUrl = this.userDetail.profile
      this.file = this.userDetail.file
      this.userForm.setValue({
        name: this.userDetail.name ?? null,
        email: this.userDetail.email ?? null,
        password: this.userDetail.password ?? null,
        confirmPwd: this.userDetail.confirmPwd ?? null,
        type: this.userDetail.type ?? null,
        phone: this.userDetail.phone ?? null,
        dob: this.userDetail.dob ?? null,
        address: this.userDetail.address ?? null,
      });
    } else {
      if (this.userId) {
        this.userSvc.getEachUser(this.userId).subscribe({
          next: (user: any) => {
            console.log(user);
            this.chooseImage = true;
            this.email = user.user.email;
            this.imageUrl = user.profile;
            this.profileUrl = this.apiUrl + user.profile;
            this.userForm.patchValue({
              id: user.id,
              name: user.user.username,
              // password: user.user.password,
              // confirmPwd: user.user.password,
              password: 'Default123',
              confirmPwd: 'Default123',
              email: user.user.email,
              type: user.type == true ? 1 : 0,
              phone: user.phone,
              dob: user.dob,
              address: user.address
            });
          },
          error: err => {
            console.log('===handle error===');
            console.log(err);
          }
        })
      }
    }
  }

  get myForm() {
    return this.userForm.controls;
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onSelectFile(e: any) {
    this.chooseImage = true;
    this.imageUrl = null;
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      this.file = e.target.files[0];
      console.log('file===');
      console.log(this.file);
      reader.onload = (event: any) => {
        this.imageUrl = null;
        this.profileUrl = event.target.result;
        console.log('profileUrl===');
        console.log(this.profileUrl);
      }
    }
  }

  confirmUser() {
    this.shareDataSvc.setUserData({
      userId: this.userId,
      name: this.userForm.value.name,
      email: this.userForm.value.email,
      password: this.userForm.value.password,
      confirmPwd: this.userForm.value.confirmPwd,
      type: this.userForm.value.type,
      phone: this.userForm.value.phone,
      dob: this.userForm.value.dob,
      address: this.userForm.value.address,
      profile: this.profileUrl,
      oldProfile: this.imageUrl,
      file: this.file,
      formType: this.formType
    });
    this.router.navigate(['/user-confirm']);
  }

  changePassword() {
    this.shareDataSvc.setUserEmail(this.email);
  }

  clearData() {
    this.profileUrl = null;
    this.userForm.reset();
  }
}

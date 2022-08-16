import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// service
import { SharingDataService } from 'src/app/services/sharing-data.service';

// validator
import { MustMatch } from 'src/app/validators/must-match.validator';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {

  userForm!: FormGroup;
  value!: number;
  label!: string;
  typeOption = [
    { value: 0, label: 'Admin' },
    { value: 1, label: 'User' }
  ];
  file!: File;
  profileUrl: any;
  profileImg: any;
  userId: number = 0;
  userDetail: any;
  existingUser: any;
  isEditUser: boolean = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private shareDataSvc: SharingDataService
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
    this.getUserData();
  }

  getUserData() {
    const data = this.shareDataSvc.getUserData();
    this.userDetail = data;
    if (this.userDetail) {
      this.profileUrl = this.userDetail.profile
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
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      this.file = e.target.files[0];
      reader.onload = (event: any) => {
        this.profileUrl = event.target.result;
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
      file: this.file
    });
    this.router.navigate(['/user-confirm']);
  }

  clearData() {
    this.userForm.reset();
  }
}

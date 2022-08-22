import { Component, OnInit } from '@angular/core';
import {  FormGroup } from '@angular/forms';
import { SharingDataService } from 'src/app/services/sharing-data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss']
})
export class UserUpdateComponent implements OnInit {

  value!: number;
  label!: string;
  typeOption = [
    { value: 0, label: 'Admin' },
    { value: 1, label: 'User' }
  ];
  userForm!: FormGroup;
  userId: number = 0;
  file: any;
  userDetail: any;
  existingUser: any;
  isEditUser: boolean = true;
  apiUrl = environment.imageURL;
  profileUrl: any;

  constructor(
    private shareDataSvc: SharingDataService,
  ) { }

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData() {
    const data = this.shareDataSvc.getUserData();
    this.userDetail = data;
    if (this.userDetail) {
      this.profileUrl = this.userDetail.profile;
      this.file = this.userDetail.file;

      this.userForm.setValue({
        name: this.userDetail.name,
        email: this.userDetail.email,
        type: this.userDetail.type,
        phone: this.userDetail.phone,
        dob: this.userDetail.dob,
        address: this.userDetail.address,
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

  clearData() {
    this.userForm.reset();
  }

}

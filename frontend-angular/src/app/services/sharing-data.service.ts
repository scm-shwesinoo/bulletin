import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharingDataService {

  postData: any;
  userData: any;
  userEmail: any;
  uploadData: any = [];
  constructor() { }

  setPostData(data: any) {
    this.postData = data;
  }

  getPostData() {
    return this.postData;
  }

  setUserData(data: any) {
    this.userData = data;
  }

  getUserData() {
    return this.userData;
  }

  setUserEmail(email: any) {
    this.userEmail = email;
  }

  getUserEmail() {
    return this.userEmail;
  }

  setUploadData(data: any){
    this.uploadData.push(data);
  }

  getUploadData(){
    return this.uploadData;
  }

}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharingDataService {

  postData: any;
  userData: any;
  userId: any;
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

  setUserId(id: any) {
    this.userId = id;
  }

  getUserId() {
    return this.userId;
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import * as qs from 'qs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  apiUrl = 'http://localhost:1337/api';

  constructor(private http: HttpClient) { }

  getAllUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    const url = this.apiUrl + `/employees`;
    return this.http.get(url, { 'headers': headers });
  }

  getEachUser(userId: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    // const query = qs.stringify({
    //   populate: '*',
    // }, {
    //   encodeValuesOnly: true,
    // });

    // const url = this.apiUrl + `/employees/${userId}?${query}`;
    const url = this.apiUrl + `/employees/${userId}`;
    return this.http.get(url, { 'headers': headers });
  }

  createUser(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    const url = this.apiUrl + '/employees';
    return this.http.post(url, data);
  }

  uploadProfile(file: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    const fileData = new FormData();
    fileData.append('files', file);

    const url = this.apiUrl + '/upload';
    return this.http.post(url, fileData);
  }

  updateUser(data: any, userId: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    const url = this.apiUrl + `/employees/${userId}`;
    return this.http.put(url, data, { 'headers': headers });
  }

  deleteUser(userId: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    const url = this.apiUrl + `/employees/${userId}`;
    return this.http.delete(url, { 'headers': headers });
  }


  // no need
  getUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    const url = this.apiUrl + '/users';
    return this.http.get(url, { 'headers': headers });
  }
  // no need

  getUserDetail(paramId: any): Observable<any> {
    const url = this.apiUrl + '/users/' + paramId;
    return this.http.get(url);
  }

  // getEachUser(paramId: any): Observable<any> {
  //   const token = localStorage.getItem('token');
  //   const headers = new HttpHeaders()
  //     .set('content-type', 'application/json')
  //     .set('Authorization', `Bearer ${token}`);

  //   const url = this.apiUrl + '/users/' + paramId;
  //   return this.http.get(url);
  // }

  // createUser(data: any): Observable<any> {
  //   const url = this.apiUrl + '/users';
  //   return this.http.post(url, data);
  // }

  // updateUser(data: any, userId: any): Observable<any> {
  //   const url = this.apiUrl + '/users/' + userId;
  //   return this.http.put(url, data);
  // }

  // deleteUser(paramId: number, data: any): Observable<any> {
  //   const url = this.apiUrl + '/users/' + paramId;
  //   return this.http.put(url, data);
  // }
}



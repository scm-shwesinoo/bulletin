import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as qs from 'qs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  apiUrl = 'http://localhost:1337/api';

  constructor(private http: HttpClient) { }

  //get all post with relation data and status true
  getPost(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    const query = qs.stringify({
      populate: '*',
      sort: ['id:desc'],
      filters: {
        status: true
      }
    }, {
      encodeValuesOnly: true,
    });

    const url = this.apiUrl + `/posts?${query}`;
    return this.http.get(url, { 'headers': headers });
  }

  //get post related login user and role 
  getPostDetail(postId: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    const query = qs.stringify({
      populate: '*',
      filters: {
        status: true,
        user: {
          id: {
            $eq: postId
          }
        }
      }
    }, {
      encodeValuesOnly: true,
    });

    const url = this.apiUrl + `/posts?${query}`;
    return this.http.get(url, { 'headers': headers });
  }

  //get post with id
  getEachPost(postId: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    const query = qs.stringify({
      populate: '*',
    }, {
      encodeValuesOnly: true,
    });

    const url = this.apiUrl + `/posts/${postId}?${query}`;
    return this.http.get(url, { 'headers': headers });
  }

  //create post data
  createPost(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    const url = this.apiUrl + '/posts';
    return this.http.post(url, data, { 'headers': headers });
  }

  //update post data
  updatePost(data: any, postId: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    const url = this.apiUrl + '/posts/' + postId;
    return this.http.put(url, data, { 'headers': headers });
  }

  //delete post data
  deletePost(postId: any, data: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    const url = this.apiUrl + '/posts/' + postId;
    return this.http.put(url, data, { 'headers': headers });
  }

  //create csv data
  createCSV(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    const url = this.apiUrl + '/posts/excel';
    return this.http.post(url, data, { 'headers': headers });
  }


  // deletePost(postId: any, data: any): Observable<any> {
  //   const url = this.apiUrl + '/posts/' + postId;
  //   return this.http.put(url, data);
  // }

  // geAllPost(): Observable<any> {
  //   const url = this.apiUrl + '/posts';
  //   return this.http.get(url);
  // }

  // async getListDetail(postId: number): Promise<object> {
  //   const url = this.apiUrl + '/posts/' + postId;
  //   console.log(postId);
  //   return await this.http.get(url);
  // }

  // createPost(data: any): Observable<any> {
  //   const url = this.apiUrl + '/posts';
  //   return this.http.post(url, data);
  // }

}

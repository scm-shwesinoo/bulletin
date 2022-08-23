import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as qs from 'qs';


@Injectable({
  providedIn: 'root'
})
export class PostService {

  apiUrl = environment.apiURL;

   token = localStorage.getItem('token');
   headers = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Authorization', `Bearer ${this.token}`);

  constructor(private http: HttpClient) { }

  //get all post with relation data and status true
  getPost(): Observable<any> {
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
    return this.http.get(url, { 'headers': this.headers });
  }

  //get post related login user and role 
  getPostDetail(postId: any): Observable<any> {
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
    return this.http.get(url, { 'headers': this.headers });
  }

  //get post with id
  getEachPost(postId: number) {
    const query = qs.stringify({
      populate: '*',
    }, {
      encodeValuesOnly: true,
    });

    const url = this.apiUrl + `/posts/${postId}?${query}`;
    return this.http.get(url, { 'headers': this.headers });
  }

  //create post data
  createPost(data: any): Observable<any> {


    const url = this.apiUrl + '/posts';
    return this.http.post(url, data, { 'headers': this.headers });
  }

  //update post data
  updatePost(data: any, postId: any): Observable<any> {


    const url = this.apiUrl + '/posts/' + postId;
    return this.http.put(url, data, { 'headers': this.headers });
  }

  //delete post data
  deletePost(postId: any, data: any): Observable<any> {


    const url = this.apiUrl + '/posts/' + postId;
    return this.http.put(url, data, { 'headers': this.headers });
  }

  //create csv data
  createCSV(data: any): Observable<any> {


    const url = this.apiUrl + '/posts/excel';
    return this.http.post(url, data, { 'headers': this.headers });
  }

}

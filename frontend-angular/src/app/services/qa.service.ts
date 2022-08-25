import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QaService {

  apiUrl = environment.apiURL;
  token = localStorage.getItem('token');
  headers = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Authorization', `Bearer ${this.token}`);

  constructor(
    private http: HttpClient
  ) { }

  getQuestion(): Observable<any> {
    const url = this.apiUrl + '/question-and-answers';
    // return this.http.get(url, { 'headers': headers });
    return this.http.get(url);
  }

  createQuestion(data: any): Observable<any>{
    const url = this.apiUrl + '/question-and-answers';
    return this.http.post(url, data);
  }
}

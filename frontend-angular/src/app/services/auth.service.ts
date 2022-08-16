import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public role = new BehaviorSubject<string | null>(null);
  public role$ = this.role.asObservable();
  public name = new BehaviorSubject<string | null>(null);
  public name$ = this.role.asObservable();
  public id = new BehaviorSubject<string | null>(null);
  public id$ = this.role.asObservable();


  constructor(private http: HttpClient) {
    this.role.next(String(localStorage.getItem('role')));
    this.id.next(String(localStorage.getItem('id')));
    this.name.next(String(localStorage.getItem('name')));
  }

  apiUrl = 'http://localhost:1337/api';

  login(data: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')

    const url = this.apiUrl + '/auth/local';
    return this.http.post(url, data, { 'headers': headers });
  }

  async getMe(): Promise<Observable<any>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    const url = this.apiUrl + '/users/me';
    return this.http.get(url, { 'headers': headers });
  }
}

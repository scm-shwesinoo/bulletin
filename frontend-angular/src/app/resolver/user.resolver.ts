import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UsersService } from '../services/users.service';

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<boolean> {
  constructor(private userSvc: UsersService) { }
  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const paramId = route.params['id'];
    return this.userSvc.getUserDetail(paramId);
  }
}
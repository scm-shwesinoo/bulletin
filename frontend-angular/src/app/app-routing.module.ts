import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//pages
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostConfirmComponent } from './posts/post-confirm/post-confirm.component';
import { UserLoginComponent } from './users/user-login/user-login.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { PasswordChangeComponent } from './users/password-change/password-change.component';
import { UserResolver } from './resolver/user.resolver';
import { UserUpdateComponent } from './users/user-update/user-update.component';
import { UserUpdateConfirmComponent } from './users/user-update-confirm/user-update-confirm.component';
import { UserCreateComponent } from './users/user-create/user-create.component';
import { UserConfirmComponent } from './users/user-confirm/user-confirm.component';

//resolver
import { PostResolver } from './resolver/post.resolver';

//guard
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: UserLoginComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'post-list', component: PostListComponent, canActivate: [AuthGuard] },
  // { path: 'post-list', component: PostListComponent },
  { path: 'post', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'post/:id', component: PostCreateComponent, resolve: { post: PostResolver }, canActivate: [AuthGuard] },
  { path: 'post-confirm', component: PostConfirmComponent, canActivate: [AuthGuard] },
  { path: 'user-list', component: UserListComponent, canActivate: [AuthGuard] },
  { path: 'user', component: UserCreateComponent, canActivate: [AuthGuard] },
  { path: 'user-confirm', component: UserConfirmComponent, canActivate: [AuthGuard] },
  { path: 'user/:id', component: UserUpdateComponent, canActivate: [AuthGuard], resolve: { user: UserResolver } },
  { path: 'user-update-confirm', component: UserUpdateConfirmComponent, canActivate: [AuthGuard] },
  { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'password-change', component: PasswordChangeComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

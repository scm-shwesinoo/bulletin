import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AngularMaterialModule } from './angular-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatTableExporterModule } from 'mat-table-exporter';
import { CdkTableExporterModule } from 'cdk-table-exporter';

//pages
import { AppComponent } from './app.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostConfirmComponent } from './posts/post-confirm/post-confirm.component';
import { UserLoginComponent } from './users/user-login/user-login.component';
import { PlainModalComponent } from './components/plain-modal/plain-modal.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { ListModalComponent } from './components/list-modal/list-modal.component';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { PasswordChangeComponent } from './users/password-change/password-change.component';
import { UploadCsvComponent } from './posts/upload-csv/upload-csv.component';
import { UserCreateComponent } from './users/user-create/user-create.component';
import { UserConfirmComponent } from './users/user-confirm/user-confirm.component';
import { UserUpdateComponent } from './users/user-update/user-update.component';
import { UserUpdateConfirmComponent } from './users/user-update-confirm/user-update-confirm.component';

//pipes
import { PasswordPipe } from './pipes/password.pipe';

//services
import { PostService } from './services/post.service';
import { PostModalComponent } from './components/post-modal/post-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    PostConfirmComponent,
    PlainModalComponent,
    UserLoginComponent,
    PostListComponent,
    UserListComponent,
    ListModalComponent,
    PasswordChangeComponent,
    UserProfileComponent,
    UploadCsvComponent,
    UserCreateComponent,
    UserConfirmComponent,
    UserUpdateComponent,
    UserUpdateConfirmComponent,
    PasswordPipe,
    PostModalComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AngularMaterialModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableExporterModule,
    CdkTableExporterModule
  ],
  providers: [PostService],
  bootstrap: [AppComponent]
})
export class AppModule { }

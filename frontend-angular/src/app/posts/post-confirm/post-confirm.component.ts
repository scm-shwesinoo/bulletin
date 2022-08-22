import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

//services
import { PostService } from 'src/app/services/post.service';
import { SharingDataService } from 'src/app/services/sharing-data.service';
import { AuthService } from 'src/app/services/auth.service';

//pages
import { PlainModalComponent } from 'src/app/components/plain-modal/plain-modal.component';

@Component({
  selector: 'app-post-confirm',
  templateUrl: './post-confirm.component.html',
  styleUrls: ['./post-confirm.component.scss']
})
export class PostConfirmComponent implements OnInit {

  public postData: any;
  public postList: any;
  public postListDetail: any;
  public postId: any;
  public isChecked: boolean = true;
  public loginId: any;
  public type: string = '';

  constructor(
    private router: Router,
    private shareDataSvc: SharingDataService,
    private authSvc: AuthService,
    private postSvc: PostService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.postData = this.shareDataSvc.getPostData();
    this.showAlert();
    this.type = this.postData.type;
    this.postId = this.postData?.postId;
    if (this.postData?.status === true) {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }
    this.getPostData();

  }

  showAlert() {
    if (!this.postData) {
      if (window.confirm('Go back to post create page')) {
        this.router.navigate(['/post']);
      } else {
        this.router.navigate(['/post']);
      }
    }
  }

  getPostData() {
    if (this.postId) {
      this.getEachPost();
    } else {
      this.getPostList();
    }
  }

  getPostList() {
    this.postSvc.getPost().subscribe({
      next: result => {
        this.postList = result;
      },
      error: err => {
        console.log('=== handle error ====')
        console.log(err)
      }
    });
  }

  getEachPost() {
    this.postSvc.getPostDetail(this.postId).subscribe({
      next: result => {
        this.postListDetail = result;
      },
      error: err => {
        console.log('=== handle error ====')
        console.log(err)
      }
    });
  }

  onSubmit() {
    if (this.type == 'add') {
      this.createPost();
    } else {
      this.updatePost();
    }
  }

  createPost() {
    this.authSvc.id.subscribe((data: string | null) => {
      this.loginId = data;
    });
    const data = {
      "data": {
        "title": this.postData.title,
        "description": this.postData.description,
        "status": true,
        "user": [this.loginId]
      }
    };
    this.postSvc.createPost(data).subscribe({
      next: res => {
        this.shareDataSvc.setPostData(null);
        this.snackBar.open('Post Created Successfully!', '', { duration: 3000 });
        this.router.navigate(['/post-list']);
      },
      error: err => {
        this.dialog.open(PlainModalComponent, {
          data: {
            content: `Post title already exists in the post list!`,
            note: '',
            applyText: 'Ok'
          }
        });
        console.log('=== handle error ====')
        console.log(err)
      }
    })
  }

  updatePost() {
    this.authSvc.id.subscribe((data: string | null) => {
      this.loginId = data;
    });
    const data = {
      "data": {
        "title": this.postData.title,
        "description": this.postData.description,
        "status": this.postData.status
      }
    };
    this.postSvc.updatePost(data, this.postId).subscribe({
      next: res => {
        this.shareDataSvc.setPostData(null);
        this.snackBar.open('Post Updated Successfully!', '', { duration: 3000 });
        this.router.navigate(['/post-list']);
      },
      error: err => {
        this.dialog.open(PlainModalComponent, {
          data: {
            content: `Post title already exists in the post list!`,
            note: '',
            applyText: 'Ok'
          }
        });
        console.log('=======Handle error======');
        console.log(err);
      }
    })
  }

  goBackPostCreate() {
    if (this.postId) {
      this.router.navigate(['/post/' + this.postId]);
    }
    else {
      this.router.navigate(['/post']);
    }
  }
}

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
  // public userInfo: any;
  // public existingPost: any;
  public isChecked: boolean = true;
  public loginId: any;

  constructor(
    private router: Router,
    private shareDataSvc: SharingDataService,
    private authSvc: AuthService,
    private postSvc: PostService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.postData = this.shareDataSvc.getPostData();
    this.postId = this.postData.postId;
    if (this.postData.status === true) {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }

    this.getPostData();
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

  createPost() {
    if (!this.postId) {
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
    } else {
      this.authSvc.id.subscribe((data: string | null) => {
        this.loginId = data;
      });
      const data = {
        "data": {
          "title": this.postData.title,
          "description": this.postData.description,
          "status": this.postData.status
          // "user": [this.loginId]
        }
      };
      this.postSvc.updatePost(data, this.postId).subscribe({
        next: res => {
          console.log(res);
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

    // const duplicateTitle = this.postList.filter((item: any) => item.title === this.postData.title && item.id != this.postId);

    // if (duplicateTitle.length > 0) {
    //   this.dialog.open(PlainModalComponent, {
    //     data: {
    //       content: `${this.postData.title} already exists in the post list!`,
    //       note: '',
    //       applyText: 'Ok'
    //     }
    //   });
    // } else {
    //   if (this.postId) {
    //     const data = {
    //       title: this.postData.title,
    //       description: this.postData.description,
    //       status: this.postData.status,
    //       created_user_id: this.postListDetail.created_user_id,
    //       updated_user_id: this.userInfo.id,
    //       created_at: this.postListDetail.created_at,
    //       updated_at: new Date(),
    //       deleted_at: "",
    //       is_removed: false
    //     };
    //     this.postSvc.updatePost(data, this.postId)
    //       .subscribe({
    //         next: result => {
    //           this.shareDataSvc.setPostData(null);
    //           this.router.navigate(['/post-list']);
    //         },
    //         error: err => {
    //           console.log('=== handle error ====')
    //           console.log(err)
    //         }
    //       });
    //     this.snackBar.open('Post Updated Successfully!', '', { duration: 3000 });
    //   } else {
    //     const data = {
    //       title: this.postData.title,
    //       description: this.postData.description,
    //       status: 1,
    //       created_user_id: this.userInfo.id,
    //       updated_user_id: this.userInfo.id,
    //       created_at: new Date(),
    //       updated_at: new Date(),
    //       deleted_at: "",
    //       is_removed: false
    //     };
    //     this.postSvc.createPost(data).subscribe({
    //       next: result => {
    //         this.shareDataSvc.setPostData(null);
    //         this.router.navigate(['/post-list']);
    //       },
    //       error: err => {
    //         console.log('=== handle error ====')
    //         console.log(err)
    //       }
    //     });
    //     this.snackBar.open('Post Created Successfully!', '', { duration: 3000 });
    //   }
    // }
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

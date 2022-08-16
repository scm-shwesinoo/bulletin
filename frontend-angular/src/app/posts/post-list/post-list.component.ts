import { ViewChild, Component, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { PostModalComponent } from 'src/app/components/post-modal/post-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

//services
import { PostService } from 'src/app/services/post.service';
import { UsersService } from 'src/app/services/users.service';

//pages
import { UploadCsvComponent } from '../upload-csv/upload-csv.component';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})

export class PostListComponent implements OnInit {

  public postDetail: any = [];
  public allPost: any = [];
  public eachPost: any = [];
  public eachData: any = [];
  // public userInfo: any = [];
  public role: any = [];
  public postListDetail: any = [];
  public postId: any;
  public posts: any = [];
  public searchText: string = '';
  public user: any;

  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['title', 'description', 'username', 'created_at', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private postSvc: PostService,
    private userSvc: UsersService,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private authSvc: AuthService) { }

  ngOnInit(): void {
    // console.log('----hi----');
    // console.log(localStorage.getItem('role'));
    // console.log(localStorage.getItem('username'));
    this.role = localStorage.getItem('role');
    this.authSvc.role.next(this.role);
    this.authSvc.role.subscribe((data: string | null) => {
      this.role = data;
    });
    this.postData();
    console.log(this.role);
  }

  //user or admin filter
  postData() {
    if (this.role === 'authenticated') {
      this.getPostData();
    } else {
      this.getEachPost();
    }
  }

  //get all post for admin
  getPostData() {
    this.postSvc.getPost().subscribe({
      next: (posts: any) => {
        this.posts = posts.data;
        console.log(posts.data);
        console.log(posts.data.attributes);
        this.dataSource = new MatTableDataSource(posts.data);
        this.dataSource.paginator = this.paginator;
        // this.allPost = posts.filter((data: any) => {
        //   this.userSvc.getUserDetail(data.created_user_id).subscribe({
        //     next: user => {
        //       data.user_name = user.name;
        //     }
        //   });
        //   return data.is_removed == false && data.status === 1;
        // });
        // this.allPost.sort((a: any, b: any) => a.order_key > b.order_key ? 1 : -1);
        // this.dataSource = new MatTableDataSource(this.allPost);
        // this.dataSource.paginator = this.paginator;
      }
    });
  }

  //get user related post
  getEachPost() {
    this.postId = localStorage.getItem('id');
    this.authSvc.id.next(this.postId);
    this.authSvc.id.subscribe((data: string | null) => {
      this.postId = data;
    });
    // const loginUser = JSON.parse(localStorage.getItem('loginUser') || '[]');
    // console.log(JSON.parse(loginUser.id));

    // this.postId = localStorage.getItem('id');

    // this.postSvc.getPost().subscribe({
    //   next: posts => {
    //     this.postListDetail = posts.filter((data: any) => {
    //       this.userSvc.getUserDetail(data.created_user_id).subscribe({
    //         next: user => {
    //           data.user_name = user.name;
    //         }
    //       });
    //       return data.created_user_id === this.userInfo.id && data.is_removed == false && data.status === 1;
    //     });
    //     this.postListDetail.sort((a: any, b: any) => a.order_key < b.order_key ? 1 : -1);
    //     this.dataSource = new MatTableDataSource(this.postListDetail);
    //     this.dataSource.paginator = this.paginator;
    //   }
    // });
    // const id = localStorage.getItem('id');
    this.postSvc.getPostDetail(this.postId).subscribe({
      next: (posts: any) => {
        this.posts = posts.data;
        console.log(posts.data);
        this.dataSource = new MatTableDataSource(posts.data);
        this.dataSource.paginator = this.paginator;
        // this.userSvc.getEachUser()
        // this.postListDetail 
        // posts.data.map((res:any, ind:any) => {

        // })
        // console.log(posts.data.attributes.user.data.id)
        // this.dataSource = new MatTableDataSource(posts.data);
      },
      error: err => {
        console.log(err);
      }
    });
  }

  //post edit
  editPost(postId: number) {
    this.router.navigate(['/post/' + postId])
  }

  //post delete
  // deletePost(postId: any) {
  //   // this.postSvc.getPostDetail(postId).subscribe({
  //   //   next: data => {
  //   //     this.eachData = data;
  //   //     const param = {
  //   //       "title": this.eachData.title,
  //   //       "description": this.eachData.description,
  //   //       "status": this.eachData.status,
  //   //       "created_user_id": this.eachData.created_user_id,
  //   //       "updated_user_id": this.eachData.updated_user_id,
  //   //       "created_at": this.eachData.created_at,
  //   //       "is_removed": true,
  //   //       "deleted_at": new Date()
  //   //     }
  //   //     this.postSvc.deletePost(postId, param).subscribe({
  //   //       next: data => {
  //   //         if (this.userInfo.type === 0) {
  //   //           this.snackBar.open('Post Deleted Successfully!', '', { duration: 3000 });
  //   //           this.getPostData();
  //   //         }
  //   //         else {
  //   //           this.snackBar.open('Post Deleted Successfully!', '', { duration: 3000 });
  //   //           this.getEachPost();
  //   //         }
  //   //       }
  //   //     })
  //   //   }
  //   // })
  // }

  deletePost(postId: any) {
    const confirm = window.confirm('Are you sure want to delete?');
    if (confirm === true) {
      const param = {
        "data": {
          "status": false
        }
      }
      this.postSvc.deletePost(postId, param).subscribe({
        next: res => {
          console.log('success');
          this.getPostData();
        },
        error: err => {
          console.log(err);
        }
      })
    }


    // this.postSvc.getEachPost(postId).subscribe({
    //   next: data => {
    //     this.eachData = data;
    //     const param = {
    //       "status": false,
    //     }
    //     this.postSvc.deletePost(postId, param).subscribe({
    //       next: data => {
    //         // if (this.userInfo.type === 0) {
    //         //   this.snackBar.open('Post Deleted Successfully!', '', { duration: 3000 });
    //         //   this.getPostData();
    //         // }
    //         // else {
    //         //   this.snackBar.open('Post Deleted Successfully!', '', { duration: 3000 });
    //         //   this.getEachPost();
    //         // }
    //       }
    //     })
    //   }
    // })
  }

  //post create
  createPost() {
    this.router.navigate(['/post']);
  }

  //post upload
  uploadCSV() {
    let dialogRef = this.dialog.open(UploadCsvComponent, {
      width: '40%'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.postData();
    })
  }

  //post title details
  titleDetail(postId: any) {
    this.postSvc.getEachPost(postId).subscribe({
      next: (res: any) => {
        this.dialog.open(PostModalComponent, {
          width: '35%',
          data: {
            title: res.data.attributes.title,
            description: res.data.attributes.description,
            created_user_id: res.data.attributes.user.data.id,
            // // updated_user_id: res.updated_user_id,
            created_at: res.data.attributes.createdAt
          }
        });
      }
    });
  }

  //post search filter
  applyFilter() {
    console.log(this.posts);
    let result = this.posts.filter((e: any) => {
      return e.attributes.title.trim().toLowerCase().includes(this.searchText.trim().toLowerCase()) || e.attributes.description.trim().toLowerCase().includes(this.searchText.trim().toLowerCase());
    });
    this.dataSource = new MatTableDataSource(result);
    this.dataSource.paginator = this.paginator;
  }

}



import { ViewChild, Component, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PostModalComponent } from 'src/app/components/post-modal/post-modal.component';
import { MatDialog } from '@angular/material/dialog';

//services
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';

//pages
import { UploadCsvComponent } from '../upload-csv/upload-csv.component';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})

export class PostListComponent implements OnInit {

  public role: any = [];
  public postId: any;
  public posts: any = [];
  public searchText: string = '';

  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['title', 'description', 'username', 'created_at', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private postSvc: PostService,
    private router: Router,
    public dialog: MatDialog,
    private authSvc: AuthService) { }

  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    this.authSvc.role.next(this.role);
    this.authSvc.role.subscribe((data: string | null) => {
      this.role = data;
    });
    this.postData();
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
        this.dataSource = new MatTableDataSource(posts.data);
        this.dataSource.paginator = this.paginator;
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
    this.postSvc.getPostDetail(this.postId).subscribe({
      next: (posts: any) => {
        this.posts = posts.data;
        this.dataSource = new MatTableDataSource(posts.data);
        this.dataSource.paginator = this.paginator;
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
            created_at: res.data.attributes.createdAt
          }
        });
      }
    });
  }

  //post search filter
  applyFilter() {
    let result = this.posts.filter((e: any) => {
      return e.attributes.title.trim().toLowerCase().includes(this.searchText.trim().toLowerCase()) || e.attributes.description.trim().toLowerCase().includes(this.searchText.trim().toLowerCase());
    });
    this.dataSource = new MatTableDataSource(result);
    this.dataSource.paginator = this.paginator;
  }

}



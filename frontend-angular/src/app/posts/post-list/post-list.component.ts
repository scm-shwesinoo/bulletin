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
import { Post, PostFilter, PostList } from 'src/app/interfaces/interface';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})

export class PostListComponent implements OnInit {

  public role!: string;
  public postId!: number;
  public searchText: string = '';
  orgList: PostFilter[] = [];

  dataSource!: MatTableDataSource<PostFilter>;
  displayedColumns: string[] = ['title', 'description', 'username', 'created_at', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private postSvc: PostService,
    private router: Router,
    public dialog: MatDialog,
    private authSvc: AuthService) { }

  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';
    this.authSvc.role.next(this.role);
    this.authSvc.role.subscribe((data: string | null) => {
      this.role = data!;
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
      next: posts => {
        this.orgList = posts.data;
        this.dataSource = new MatTableDataSource(posts.data);
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  //get user related post
  getEachPost() {
    const id = localStorage.getItem('id') || '';
    this.authSvc.id.next(parseInt(id));
    this.authSvc.id.subscribe((data: number | null) => {
      this.postId = data!;
    });
    this.postSvc.getPostDetail(this.postId).subscribe({
      next: posts => {
        this.orgList = posts.data;
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

  deletePost(postId: number) {
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
  titleDetail(postID: number) {
    const data = this.orgList.filter((res: PostFilter) => res.id === postID);

    this.dialog.open(PostModalComponent, {
      width: '35%',
      data: {
        title: data[0].attributes.title,
        description: data[0].attributes.description,
        created_user_id: data[0].attributes.user.data.id,
        created_at: data[0].attributes.createdAt
      }
    });
  }

  //post search filter
  applyFilter() {
    let result = this.orgList.filter((e: PostFilter) => {
      return e?.attributes.title.trim().toLowerCase().includes(this.searchText.trim().toLowerCase()) || e.attributes.description.trim().toLowerCase().includes(this.searchText.trim().toLowerCase());
    });
    this.dataSource = new MatTableDataSource(result);
    this.dataSource.paginator = this.paginator;
  }

}



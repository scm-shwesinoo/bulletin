import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';

//services
import { SharingDataService } from 'src/app/services/sharing-data.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {

  public postForm!: FormGroup;
  public postId: number = 0;
  public isChecked: boolean = true;
  public status: boolean = true;
  public postDetail: any;
  // public existingPost: any;
  // public isEditPost: boolean = true;
  public postArr: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private shareDataSvc: SharingDataService,
    private postSvc: PostService) { }

  ngOnInit(): void {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.required]]
    });

    this.postId = this.activatedRoute.snapshot.params['id'];
    // this.existingPost = this.activatedRoute.snapshot.data['post'];
    if(this.postId){
      this.getEachPost();
    }
    this.getPostData();
 
  //  this.postData();
    // if (this.existingPost) {
    //   this.isEditPost = true;
    //   if (this.existingPost.status === 1) {
    //     this.isChecked = true;
    //   } else {
    //     this.isChecked = false;
    //   }
    //   this.status = this.existingPost.status;
    //   this.postForm.patchValue({
    //     id: this.existingPost.id,
    //     title: this.existingPost.title,
    //     description: this.existingPost.description
    //   });
    // }
  }

  getEachPost(){
    this.postSvc.getEachPost(this.postId).subscribe({
      next: res => {
        // console.log(res);
        this.postArr = res;
        this.postForm.patchValue({
          title: this.postArr.data.attributes.title,
          description: this.postArr.data.attributes.description,
          status: this.postArr.data.attributes.status
        });
      },
      error: err => {
        console.log(err);
      }
    })
  }

  getPostData() {
    const data = this.shareDataSvc.getPostData();
    this.postDetail = data;
    console.log(this.postDetail, '====get post detail====');  

    if (this.postDetail) {
      if (this.postDetail.status === true) {
        this.isChecked = true;
      } else {
        this.isChecked = false;
      }
      this.status = this.postDetail.status;
      this.postForm.setValue({
        title: this.postDetail.title,
        description: this.postDetail.description
      });
    }
  }

  public myError = (controlName: string, errorName: string) => {
    return this.postForm.controls[controlName].hasError(errorName);
  }

  changeToggle($event: MatSlideToggleChange) {
    if ($event.checked) {
      this.status = true;     
    } else {
      this.status = false;
    }
  }

  confirmPost() {
    this.shareDataSvc.setPostData({
      postId: this.postId,
      title: this.postForm.value.title,
      description: this.postForm.value.description,
      status: this.status
    });
    this.router.navigate(['/post-confirm']);
  }

  clearData() {
    this.postForm.reset();
  }
}

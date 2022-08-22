import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';

//services
import { SharingDataService } from 'src/app/services/sharing-data.service';
import { PostService } from 'src/app/services/post.service';

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
  public postArr: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private shareDataSvc: SharingDataService,
    private postSvc: PostService) { }

  @Input() type = 'add' || 'edit';

  ngOnInit(): void {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.required]]
    });

    this.postId = this.activatedRoute.snapshot.params['id'];
    this.getPostData();
  }

  getEachPost() {
    this.postSvc.getEachPost(this.postId).subscribe({
      next: res => {
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
    } else {
      if (this.postId) {
        this.getEachPost();
      }
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
      status: this.status,
      type: this.type
    });
    this.router.navigate(['/post-confirm']);
  }

  clearData() {
    this.postForm.reset();
  }
}

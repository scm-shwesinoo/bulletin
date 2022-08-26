import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { MyUploadAdapter } from 'src/my-upload-adapter';

import { AuthService } from 'src/app/services/auth.service';
import { QaService } from 'src/app/services/qa.service';
import { UsersService } from 'src/app/services/users.service';
import { SharingDataService } from 'src/app/services/sharing-data.service';

export class MyUploadAdapter {
  private loader;
  url!: string;
  test: any = []

  constructor(loader: any,
    private userSvc: UsersService,
    private shareSvc: SharingDataService) {
    this.loader = loader;
  }

  upload() {
    let loader = this.loader.file
      .then((file: any) => new Promise(async (resolve, reject) => {
        var myReader = new FileReader();

        console.log('file');
        console.log(file.length);
        console.log(file)

        myReader.onloadend = async (e) => {
          console.log('Reader Result=============');
          console.log(e);
          // this.userSvc.uploadProfile(file).subscribe({
          //   next: res => {
          //     this.url = res[0].url;
          //     // console.log('Url');
          //     // console.log(this.url);
          //     // console.log('urllength', res.length);
          //     console.log('Res');
          //     console.log(res[0].url);
          //   }
          // })
          this.test.push(
            {
              'file': file,
              'base64': myReader.result,
              // 'url': `http://localhost:1337${this.url}`
            }
          );
          // this.shareSvc.setUploadData(this.test);

          //   this.test.push({
          //     'file': file,
          //     'base64': myReader.result,
          //     'url': `http://localhost:1337${this.url}`
          // })
          // this.shareSvc.setUploadData(this.test);


          // console.log('Url');
          // console.log(this.url)
          // this.shareSvc.setUploadData(this.test);
          // console.log('Test Result');
          // console.log(this.test.length);

          resolve({ default: myReader.result });
          // resolve({ default: this.url });
        }

        myReader.readAsDataURL(file);
      }));
    this.shareSvc.setUploadData(this.test);
    console.log('Test Result');
    console.log(this.test);
    return loader;
  };

  
  
}


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public Editor = ClassicEditor;
  public qaForm!: FormGroup;

  //test
  public name: any = '';
  public data: any;
  public test: any;
  public question: any;
  public url: string = '';
  public base64: any;

  public config = {
    toolbar: {
      items: [
        'heading', '|',
        'bold', 'italic', 'link', '|',
        'bulletedList', 'numberedList',
        'blockQuote', 'imageUpload', '|',
        // 'insertTable','|',
        'undo', 'redo'
      ]
    }
  }

  constructor(
    private fb: FormBuilder,
    private qaSvc: QaService,
    private authSvc: AuthService,
    public userSvc: UsersService,
    public shareSvc: SharingDataService
  ) { }

  ngOnInit(): void {
    this.qaForm = this.fb.group({
      title: ['', Validators.required],
      question: ['']
    })
    this.getQuestion();
  }

  // onReady(eventData: any) {
  //   eventData.plugins.get('FileRepository').createUploadAdapter = function (loader: any, userSvc: any) {
  //     console.log('loader : ', loader)
  //     console.log('Loader File'); 
  //     console.log(btoa(loader.file));
  //     return new MyUploadAdapter(loader);
  //   };
  // }

  //   onReady(editor: any): void {
  //     editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader: any ) => {
  //         return new MyUploadAdapter( loader );
  //     };
  // }

  public onReady(editor: any) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
      return new MyUploadAdapter(loader, this.userSvc, this.shareSvc);
    };
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
  }

  get myForm() {
    return this.qaForm.controls;
  }

  getQuestion() {
    this.qaSvc.getQuestion().subscribe({
      next: res => {
        console.log(res);
        this.data = res.data;
      }
    })
  }

  onSubmit() {
    console.log('Data');
    console.log(this.qaForm.value.question);
    this.test = this.shareSvc.getUploadData();
    console.log('Question');
    console.log(this.qaForm.value.question);

    if (this.test) {

      this.test.map((res: any) => {
        console.log('Res');
            console.log(res[0].file);
            this.base64 = res[0].base64;
        this.userSvc.uploadProfile(res[0].file).subscribe({
          next: res => {
            this.url = res[0].url;
            console.log('Url');
            console.log(this.url);
            // console.log('urllength', res.length);
            this.question = this.qaForm.value.question.replace(this.base64, `http://localhost:1337${this.url}`)
            console.log('Replace');
            console.log(this.question);
          }
        })
        // console.log(res);
        // console.log('=======share upload=====');
        // console.log(this.test);
        // console.log(res[0].file);

      })

      // this.question = this.qaForm.value.question.replace(this.test[0].base64, this.test[0].url)
      // console.log('Replace');
      // console.log(this.question);
    }

    const data = {
      data: {
        title: this.qaForm.value.title,
        question: this.question
      }
    }
    // this.qaSvc.createQuestion(data).subscribe({
    //   next: res => {
    //     console.log(res);
    //     console.log('Create Successfully');
    // this.getQuestion();
    //   }
    // })
  }

  clearData() {
    this.qaForm.reset();
  }
}

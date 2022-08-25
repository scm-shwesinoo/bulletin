import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { MyUploadAdapter } from 'src/my-upload-adapter';
import { MyUploadAdapter } from 'src/my-upload-adapter';

import { AuthService } from 'src/app/services/auth.service';
import { QaService } from 'src/app/services/qa.service';
import { UsersService } from 'src/app/services/users.service';

// export class UploadAdapter {
//   private loader;
//   constructor( loader: any ) {
//      this.loader = loader;
//   }

//   upload() {
//      return this.loader.file
//            .then( (file: Blob) => new Promise( ( resolve, reject ) => {
//                  var myReader= new FileReader();
//                  myReader.onloadend = (e) => {
//                     resolve({ default: myReader.result });
//                  }

//                  myReader.readAsDataURL(file);
//            } ) );
//   };
// }


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

  constructor(
    private fb: FormBuilder,
    private qaSvc: QaService,
    private authSvc: AuthService,
    private userSvc: UsersService
  ) { }

  ngOnInit(): void {
    this.qaForm = this.fb.group({
      title: ['', Validators.required],
      question: ['']
    })
    this.getQuestion();
  }

  // public config = {
  //   toolbar: {
  //     items: [
  //       'SimpleUploadAdapter'
  //     ]
  //   }
  // }

  onReady(eventData: any) {
    eventData.plugins.get('FileRepository').createUploadAdapter = function (loader: any) {
      console.log('loader : ', loader)
      console.log('Loader File'); 
      console.log(btoa(loader.file));
      return new MyUploadAdapter(loader);
    };
  }

//   onReady(editor: any): void {
//     editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader: any ) => {
//         return new MyUploadAdapter( loader );
//     };
// }

// public onReady(editor: any) {
//   editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
//     return new MyUploadAdapter(loader);
//   };
//   editor.ui
//     .getEditableElement()
//     .parentElement.insertBefore(
//       editor.ui.view.toolbar.element,
//       editor.ui.getEditableElement()
//     );
// }

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
    console.log(this.qaForm.value.title);
    console.log(this.qaForm.value.question);

    const data = {
      data: {
        title: this.qaForm.value.title,
        question: this.qaForm.value.question
      }
    }
    // this.qaSvc.createQuestion(data).subscribe({
    //   next: res => {
    //     console.log(res);
    //     console.log('Create Successfully');
    //   }
    // })
  }

  clearData() {
    this.qaForm.reset();
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';

//pages
import { PlainModalComponent } from 'src/app/components/plain-modal/plain-modal.component';

//interface
import { CSVRecord } from 'src/app/interfaces/CSVModel';

//services
import { PostService } from 'src/app/services/post.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-upload-csv',
  templateUrl: './upload-csv.component.html',
  styleUrls: ['./upload-csv.component.scss']
})
export class UploadCsvComponent implements OnInit {

  public userInfo: any;
  public records: any = [];
  public postList: any = [];
  public duplicateTitle: any = [];
  public loginId: any;
  public csvData: any;
  // public title: any = [];
  // public description: any = [];
  public data: any = [];
  constructor(
    private postSvc: PostService,
    private authSvc: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialogRef: MatDialogRef<UploadCsvComponent>) { }

  @ViewChild('csvReader') csvReader: any;
  ngOnInit(): void {
    this.loginId = localStorage.getItem('id');
    this.authSvc.id.next(this.loginId);
    this.authSvc.id.subscribe((data: string | null) => {
      this.loginId = data;
    });

    // this.userInfo = JSON.parse(localStorage.getItem('userInfo') || "[]");
    // this.getPostList();
  }

  // getPostList() {
  //   this.postSvc.geAllPost().subscribe({
  //     next: result => {
  //       this.postList = result;
  //     },
  //     error: err => {
  //       console.log('=== handle error ====')
  //       console.log(err)
  //     }
  //   });
  // }

  uploadListener($event: any): void {
    let files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {

      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);
      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
        let headersRow = this.getHeaderArray(csvRecordsArray);
        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
        console.log('Record Data');
        console.log(this.records[0], '====0======');
        console.log(this.records[1], '====1======');
        console.log(this.records[2], '====2======');

        this.records.map((result: any) => {
          // this.title.push(result.title);
          // this.description.push(result.description);
          let res = {
            "title": result.title,
            "description": result.description,
            "status": true,
            "user": [parseInt(this.loginId)]
          };
          this.data.push(res);
        })
        // console.log(this.data, '====data===');
        this.csvData = {
          "data": this.data
        }
        console.log(this.csvData, '====csv data===');
        this.postSvc.createCSV(this.csvData).subscribe({
          next: res => {
            console.log(res, '===res');
            if (res.data === 'success') {
              this.snackBar.open('Post Created Successfully!', '', { duration: 3000 });
            } else {
              res.map((res: any) => {
                console.log(res.title.title);
                this.duplicateTitle.push(res.title.title);
              })
              this.dialog.open(PlainModalComponent, {
                data: {
                  content: `${this.duplicateTitle} already exists in the post list!`,
                  note: '',
                  applyText: 'Ok'
                }
              })
              console.log(res[0].title.title, 'title0');
              console.log(res[1].title.title, 'title1');
              console.log(res[2].title.title, 'title2');

              this.snackBar.open('Post Created errr!', '', { duration: 3000 });
            }
            // this.snackBar.open('Post Created Successfully!', '', { duration: 3000 });
          }
        });

        //check duplicate title
        // let csvTitle = this.records.map((rTitle: any) => { return rTitle.title });
        // this.duplicateTitle = this.postList.filter((item: any) => csvTitle.includes(item.title));
        //alert(this.duplicateTitle.length);

        // if (this.duplicateTitle.length > 0) {
        //   const csvTitle = this.duplicateTitle.map((item: any) => item.title)
        //   this.dialog.open(PlainModalComponent, {
        //     data: {
        //       content: `${csvTitle} already exists in the post list!`,
        //       note: '',
        //       applyText: 'Ok'
        //     }
        //   })
        // } else {

        // Start
        // this.records.map((result: any) => {
        //   console.log(result);
        //   let csvData = {
        //     "data": {
        //       "title": result.title,
        //       "description": result.description,
        //       "status": true,
        //       "user": [parseInt(this.loginId)]
        //     }
        //   };
        //   console.log(csvData);
        //   this.postSvc.createCSV(csvData).subscribe({
        //     next: res => {
        //       this.snackBar.open('Post Created Successfully!', '', { duration: 3000 });
        //     },
        //     error: err => {
        //       this.dialog.open(PlainModalComponent, {
        //         data: {
        //           content: `Post title already exists in the post list!`,
        //           note: '',
        //           applyText: 'Ok'
        //         }
        //       })
        //       console.log('========Error========');
        //       console.log(err);
        //     }
        //   });


        //   // this.postSvc.createPost(uploadData).subscribe({
        //   //   next: result => {
        //   //   }
        //   // });
        // })
        // End
        // data: [
        //   {
        //     "title": result.title,
        //     "description": result.description,
        //     "status": true,
        //     "user": [parseInt(this.loginId)]
        //   }, 
        //   {
        //     "title": result.title,
        //     "description": result.description,
        //     "status": true,
        //     "user": [parseInt(this.loginId)]
        //   }
        // ]


        // this.records.map((result: any) => {
        //   let data = {
        //     "data": {
        //       "title": result.title,
        //       "description": result.description,
        //       "status": true,
        //       "user": [parseInt(this.loginId)]
        //     }
        //   };
        //   console.log(data);
        //   this.postSvc.createCSV(data).subscribe({
        //     next: res => {
        //       console.log(res, '-----------')
        //       this.snackBar.open('Post Created Successfully!', '', { duration: 3000 });
        //     },
        //     error: err => {
        //       console.log('========Error========');
        //       console.log(err);
        //     }
        //   });


        //   // this.postSvc.createPost(uploadData).subscribe({
        //   //   next: result => {
        //   //   }
        //   // });
        // })


        this.dialogRef.close();
      };

      reader.onerror = function () {
        console.log('Error is occured while reading file!');
      };

    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');
      if (curruntRecord.length == headerLength) {
        let csvRecord: CSVRecord = new CSVRecord();
        csvRecord.title = curruntRecord[0];
        csvRecord.description = curruntRecord[1];
        csvArr.push(csvRecord);
      }
    }
    return csvArr;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset() {
    this.csvReader.nativeElement.value = "";
    this.records = [];
  }
}
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
import { AuthService } from 'src/app/services/auth.service';
import { Post } from 'src/app/interfaces/interface';

@Component({
  selector: 'app-upload-csv',
  templateUrl: './upload-csv.component.html',
  styleUrls: ['./upload-csv.component.scss']
})
export class UploadCsvComponent implements OnInit {

  public records: any = [];
  public duplicateTitle: any = [];
  public loginId!: number;
  public csvData: any;
  public data: any = [];

  constructor(
    private postSvc: PostService,
    private authSvc: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UploadCsvComponent>) { }

  @ViewChild('csvReader') csvReader: any;

  ngOnInit(): void {
    const id = localStorage.getItem('id') || '';
    this.authSvc.id.next(parseInt(id));
    this.authSvc.id.subscribe((data: number | null) => {
      this.loginId = data!;
    });
  }

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

        this.records.map((result: Post) => {
          let res = {
            "title": result.title,
            "description": result.description,
            "status": true,
            "user": [this.loginId]
          };
          this.data.push(res);
        })
        this.csvData = {
          "data": this.data
        }

        this.postSvc.createCSV(this.csvData).subscribe({
          next: res => {
            if (res.data === 'success') {
              this.snackBar.open('Post Created Successfully!', '', { duration: 3000 });
            } else {
              res.map((res: any) => {
                this.duplicateTitle.push(res.title.title);
              })
              this.dialog.open(PlainModalComponent, {
                data: {
                  content: `${this.duplicateTitle} already exists in the post list!`,
                  note: '',
                  applyText: 'Ok'
                }
              })

              this.snackBar.open('Post Created errr!', '', { duration: 3000 });
            }
          }
        });
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
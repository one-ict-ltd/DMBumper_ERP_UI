import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';


@Component({
  selector: 'ngx-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss']
})
export class ImageModalComponent implements OnInit {
  imagePaths: string[] = [];

  constructor(protected dialogRef: NbDialogRef<ImageModalComponent>) { }

  ngOnInit(): void { }

  downloadImage(imagePath: string) {
    window.open("http://103.106.236.93:9115/" + imagePath, '_blank');
  }


  close() {
    this.dialogRef.close();
  }
  cancel() {
    this.dialogRef.close();
  }

}
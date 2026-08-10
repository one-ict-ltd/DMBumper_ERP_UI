import { Component, OnInit } from "@angular/core";
import { CommonService } from '../../../../../@core/mock/common.service';

@Component({
  selector: "ngx-common-button",
  templateUrl: "./common-button.component.html",
  styleUrls: ["./common-button.component.scss"],
})
export class CommonButtonComponent implements OnInit {
  names: any = [];
  constructor(
    private commonService: CommonService
  ) {}
  buttons = this.commonService.btnList;
  buttonClicked = "";  
  ngOnInit() {}
  // openPopup() {
  //   this.dialogService
  //     .open(DialogConfirmComponent)
  //     .onClose.subscribe((name) => name && this.names.push(name));
  // }

  valueSet(value: any) {    
    this.commonService.valueSet(value);
    this.commonService.buttonClicked = value;
    this.buttonClicked = value;
  }
}

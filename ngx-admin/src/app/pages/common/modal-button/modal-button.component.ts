// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'ngx-modal-button',
//   templateUrl: './modal-button.component.html',
//   styleUrls: ['./modal-button.component.scss']
// })
// export class ModalButtonComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { NbDialogService } from "@nebular/theme";
import { CommonService } from "../../../@core/mock/common.service";
import { DialogConfirmComponent } from "../../client/dialog-confirm/dialog-confirm.component";

@Component({
  selector: 'ngx-modal-button',
  templateUrl: './modal-button.component.html',
  styleUrls: ['./modal-button.component.scss']
})
export class ModalButtonComponent implements OnInit {

  names: any = [];
  constructor(
    private commonService: CommonService,
    private dialogService: NbDialogService
  ) { }
  buttons = this.commonService.btnList;
  buttonClicked = "";
  ngOnInit() {
    //debugger;
    this.commonService.valueSet('modalrpt');
  }
  openPopup() {
    this.dialogService
      .open(DialogConfirmComponent)
      .onClose.subscribe((name) => name && this.names.push(name));
  }

  valueSet(value: any) {
    //debugger;
    this.commonService.valueSet(value);
    this.commonService.buttonClicked = value;
    this.buttonClicked = value;
  }

}


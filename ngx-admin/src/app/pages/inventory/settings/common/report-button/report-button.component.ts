import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { NbDialogService } from "@nebular/theme";
import { CommonService } from "../../../../../@core/mock/common.service";
import { DialogConfirmComponent } from "../../../../client/dialog-confirm/dialog-confirm.component";

@Component({
  selector: 'ngx-report-button',
  templateUrl: './report-button.component.html',
  styleUrls: ['./report-button.component.scss']
})
export class ReportButtonComponent implements OnInit {

  names: any = [];
  constructor(
    private commonService: CommonService,
    private dialogService: NbDialogService
  ) { }
  buttons = this.commonService.btnList;
  buttonClicked = "";
  ngOnInit() {
    this.commonService.valueSet('rpt');
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

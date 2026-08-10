import { Component, OnInit } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";

@Component({
  selector: "ngx-common-action",
  templateUrl: "./common-action.component.html",
  styleUrls: ["./common-action.component.scss"],
})
export class CommonActionComponent implements OnInit {
  
  constructor(private commonService: CommonService) {}
  buttons = this.commonService.btnList;
  agButtonClicked = "";
  valueSet(value: any) {
    this.commonService.agButtonClicked = value;
    this.agButtonClicked = value;
  }
  ngOnInit() {}
}

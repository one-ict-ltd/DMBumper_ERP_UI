import { ElementRef } from "@angular/core";
import { ViewChild } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { jsPDF } from "jspdf";

@Component({
  selector: "ngx-create-voucher",
  templateUrl: "./create-voucher.component.html",
  styleUrls: ["./create-voucher.component.scss"],
})
export class CreateVoucherComponent implements OnInit {
  constructor(private commonService: CommonService) {
    this.commonService.valueSet('showlist');
  }
  buttons = this.commonService.btnList;

  ngOnInit(): void {}
  
  @ViewChild('pdfTable', {static: false}) pdfTable: ElementRef;

  public captureScreen(fleName: any) {
    var data = document.getElementById(fleName);
    //this.commonService.getPdf(data, fleName);
  }
 
}

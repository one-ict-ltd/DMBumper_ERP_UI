import { Component, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import * as ExcelJS from "exceljs/dist/exceljs.min.js";
// import * as FileSaver from "file-saver";
import { ProcessattendanceService } from "app/services/attendance/processattendance.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: 'ngx-leavereport',
  templateUrl: './leavereport.component.html',
  styleUrls: ['./leavereport.component.scss']
})
export class LeavereportComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
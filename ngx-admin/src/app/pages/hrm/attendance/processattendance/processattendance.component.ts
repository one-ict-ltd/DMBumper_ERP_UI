import { Component, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as ExcelJS from "exceljs/dist/exceljs.min.js";
import * as FileSaver from "file-saver";
import { ProcessattendanceService } from "app/services/attendance/processattendance.service";

@Component({
  selector: "ngx-processattendance",
  templateUrl: "./processattendance.component.html",
  styleUrls: ["./processattendance.component.scss"],
})
export class ProcessattendanceComponent implements OnInit {
  master: {
    companyId: number;
    startDate: Date;
    endDate: Date;

    companySelected: {};
  };
  public getMaster() {
    this.master = {
      companyId: 0,
      startDate: new Date(),
      endDate: new Date(),

      companySelected: null,
    };
    this.getFirstAndLastDayOfMonth();
  }

  getFirstAndLastDayOfMonth(): void {
    //Date.UTC(yyyy, mm, dd)
    var date = this.master.startDate;//new Date();
    var firstDay = new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
    var lastDay = new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0));
    this.master.startDate = firstDay;
    this.master.endDate = lastDay;
  }

  public pageNavigation = "Attendance Process";
  public tableHeader = [
    "#",
    "Emp. No",
    "Name",
    "Designation",
    "Department",
    "Att. Date",
    "Check In",
    "Check Out",
    "Working Time",
    //"workingTimeTest",
    "Late Time",
    //"latetimeTest",
  ];

  public apiUrl = "";
  public bodyData: any = [];
  public showbody: boolean = false;
  public TotalDataProcessed = 0;

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private processattendanceService: ProcessattendanceService
  ) {
    this.LoadCompany();
    this.getMaster();
  }

  ngOnInit(): void { }
  public RptButtonAction() {
    const clicked = this.commonService.buttonClicked;
    if (clicked == "preview") {
      this.onPreview();
    } else if (clicked == "pdf") {
      this.generateReport("pdf");
    } else if (clicked == "print") {
      this.generateReport("print");
    } else if (clicked == "csv") {
      this.onExportCSV();
    } else if (clicked == "refresh") {
      this.onRefresh();
    } else if (clicked == "email") {
      this.onEmail();
    } else {
      this.toastrService.warning("Message", "please clicked any button");
    }
  }

  public companyItems = [];
  public LoadCompany() {
    this.comboService.getCompany().subscribe((returns: any) => {
      this.companyItems = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
    });
  }

  public ProcessAttendance() {
    debugger;
    //console.log(this.master);
    if (this.master.companyId == 0 || this.master.companyId == null) {
      this.toastrService.danger("Please select company", "Message");
      return false;
    }
    this.processattendanceService
      .ProcessAttendance(this.master)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.processmsg, "Message");
          //////////////Grid Refresh ///////////////////
          this.processattendanceService
            .GetAttendanceByDate(
              this.master.startDate.toString().substring(3, 15),
              this.master.endDate.toString().substring(3, 15),
              this.master.companyId
            )
            .subscribe((data: any) => {
              if (data.status) {
                this.bodyData = data.data;
                this.showbody = true;
                this.TotalDataProcessed = this.bodyData.length; //data.data[0].TotalDataProcessed;
              }
            });
          //////////////Grid Refresh ///////////////////
        }
        else this.toastrService.danger("Process failed !", "Message");
      });
  }

  private onRefresh() {
    this.bodyData = [];
    this.showbody = false;
  }

  private onPreview() {
    this.getGridData();
    this.showbody = true;
  }

  private getGridData() {
    if (this.master.companyId == 0 || this.master.companyId == null) {
      this.toastrService.danger("Please select company", "Message");
      return false;
    }
    this.processattendanceService
      .GetAttendanceByDate(
        this.master.startDate.toString().substring(3, 15),
        this.master.endDate.toString().substring(3, 15),
        this.master.companyId
      )
      .subscribe((data: any) => {
        if (data.status) {
          this.bodyData = data.data;
          this.showbody = true;
          this.TotalDataProcessed = this.bodyData.length; //data.data[0].TotalDataProcessed;
        }
      });
  }

  public generateReport(buttonAction: any) {
    this.GetRptSalarySheetPdf();
  }

  private onExportCSV() {
    this.GetRptSalarySheetExcel();
  }

  public GetRptSalarySheetPdf() {
    if (this.master.companyId == 0 || this.master.companyId == null) {
      this.toastrService.danger("Please select salary period", "Message");
      return false;
    }
    // this.salaryreportService.RptSalarySheet(1, 1, this.master.companyId, "Pdf").subscribe((returns: any) => {
    //   this.commonService.GenerateBase64ToReport(returns);
    // });
  }

  public GetRptSalarySheetExcel() {
    // this.salaryreportService.RptSalarySheet(1, 1, this.master.companyId, "Excel").subscribe((returns: any) => {
    //   this.commonService.GenerateBase64ToReport(returns);
    // });
  }

  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }
}

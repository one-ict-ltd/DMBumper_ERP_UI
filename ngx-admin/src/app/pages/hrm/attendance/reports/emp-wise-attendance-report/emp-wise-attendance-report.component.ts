import { Component, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../../@core/mock/common.service";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import * as ExcelJS from "exceljs/dist/exceljs.min.js";
// import * as FileSaver from "file-saver";
import { ProcessattendanceService } from "app/services/attendance/processattendance.service";
import { DatePipe } from "@angular/common";
import { I } from "@angular/cdk/keycodes";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

@Component({
  selector: 'ngx-emp-wise-attendance-report',
  templateUrl: './emp-wise-attendance-report.component.html',
  styleUrls: ['./emp-wise-attendance-report.component.scss']
})

export class EmpWiseAttendanceReportComponent implements OnInit {
  master: {
    companyId: number;
    empId: number;
    startDate: Date;
    endDate: Date;
  };

  companySelected = {};
  empSelected = {};
  public getMaster() {
    this.master = {
      companyId: 0,
      empId: 0,
      startDate: new Date(),
      endDate: new Date(),
    };
    this.getFirstAndLastDayOfMonth();
  }
  getFirstAndLastDayOfMonth(): void {
    //Date.UTC(yyyy, mm, dd)
    var date = this.master.startDate;//new Date();
    var firstDay = new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
    //var lastDay = new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0));
    this.master.startDate = firstDay;
    //this.master.endDate = lastDay;
  }


  DateValidation() {
    let presentDate: Date = new Date();
    if (this.commonService.DateFormat(this.master.endDate) > this.commonService.DateFormat(presentDate)) {
      this.toastrService.warning("To date can not be greater than of present day!", "Warning");
      this.master.endDate = presentDate;
    }
  }



  pageNavigation = "Employee Daily Attendance Report";
  rReportHeader = "Employee Daily Attendance Report";

  public tableHeader = [
    "#",
    "Att. Date",
    "Check In",
    "Check Out",
    "Working Time",
    "Late Time",
    "Status",
    "Clarification",
  ];

  apiUrl = "";
  bodyData: any = [];
  showbody: boolean = false;


  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private processattendanceService: ProcessattendanceService,
    private dp: DatePipe,
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

  empItems = [];
  LoadEmployee(): void {
    this.comboService.getEmployee(this.master.companyId, 0).subscribe((returns: any) => {
      this.empItems = returns.data.map((val) => ({
        id: val.employeeId,
        name: val.fullName,
      }));
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

  attendanceDate = "";
  totalDays = 0;
  ttlWeeklyOff = 0;
  ttlHoliday = 0;
  ttlLeave = 0;
  ttlPresent = 0;
  ttlAbsent = 0;
  ttlLate = 0;
  params = [];
  summaryData = [];

  private getGridData() {
    debugger
    if (this.master.companyId == 0 || this.master.companyId == null) {
      this.toastrService.danger("Please select a company", "Message");
      return false;
    }
    if (this.master.empId == 0 || this.master.empId == null) {
      this.toastrService.danger("Please select a employee", "Message");
      return false;
    }
    if (this.master.startDate == null) {
      this.toastrService.danger("Please select start date", "Message");
      return false;
    }
    if (this.master.endDate == null) {
      this.toastrService.danger("Please select end date", "Message");
      return false;
    }
    this.attendanceDate = ` ${this.dp.transform(this.master.startDate, "yyyy-MM-dd")} To ${this.dp.transform(this.master.endDate, "yyyy-MM-dd")}`;

    this.processattendanceService
      .GetEmpWiseAttendanceReport(
        this.master.companyId,
        this.master.empId,
        this.dp.transform(this.master.startDate, "yyyy-MM-dd"),
        this.dp.transform(this.master.endDate, "yyyy-MM-dd")
      )
      .subscribe((data: any) => {
        if (data.status) {
          this.bodyData = data.data;
          this.totalDays = this.bodyData.length;

          this.params = [];
          this.params.push({
            leftLabel: "Employee Name",
            leftValue: `${this.bodyData[0].fullName} (${this.bodyData[0].employeeNo})`,
            rightLabel: "Designation",
            rightValue: this.bodyData[0].currentDesignation,
          });

          this.params.push({
            leftLabel: "Department",
            leftValue: this.bodyData[0].currentDepartment,
            rightLabel: "Attendance For",
            rightValue: this.attendanceDate,
          });
          console.log("param", this.params);

          const objPropName = 'status';
          this.ttlWeeklyOff = this.commonService.GetValueCountOfObjArray(this.bodyData, objPropName, 'Weekend');
          this.ttlHoliday = this.commonService.GetValueCountOfObjArray(this.bodyData, objPropName, 'Holiday');
          let present = this.commonService.GetValueCountOfObjArray(this.bodyData, objPropName, 'Present');
          this.ttlAbsent = this.commonService.GetValueCountOfObjArray(this.bodyData, objPropName, 'Absent');
          this.ttlLate = this.commonService.GetValueCountOfObjArray(this.bodyData, objPropName, 'Late');
          this.ttlPresent = present + this.ttlLate;

          this.ttlLeave = this.totalDays - (this.ttlWeeklyOff + this.ttlHoliday + this.ttlPresent + this.ttlAbsent);


          this.showbody = true;

          this.summaryData.push(this.bodyData[0]);
        }
      });
  }
  GetCount(character) {
    return this.bodyData.filter(obj => obj.status === character).length;
  }
  public generateReport(rptFormat: any) {
    debugger;
    this.getGridData();
    const content = document.getElementById("reportHeader");
    //this.commonService.GenerateReport(this.rReportHeader, rptFormat, "p", content);
    this.generateAttReport(this.rReportHeader, this.pageNavigation, content);
  }

  public generateAttReport(
    buttonAction: any,
    fileName: string,
    content: any
    //,address: []
  ) {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(5); //optional
    doc.setTextColor(50); //optional
    const legend = {
      height: 100,
    };
    const addFooters = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      //var a = doc.internal.setFont("helvetica", "italic");
      doc.setFontSize(8);
      //debugger;
      for (var i = 1; i <= pageCount; i++) {
        // let addressLength = address.length;
        // for (var i = 1; i <= addressLength; i++) {
        //   console.log(address[i]["branchAddress"]);
        // }

        doc.setPage(i);
        doc.text(
          "Page " + String(i) + " of " + String(pageCount),
          doc.internal.pageSize.width / 1.2,
          doc.internal.pageSize.height - 20
        );
        doc.text(
          "Powered by : ONE ERP",
          doc.internal.pageSize.width / 2.3,
          doc.internal.pageSize.height - 20
        );
        doc.text(
          "Printed Date: " +
          new Date().toLocaleDateString() +
          " " +
          new Date().toLocaleTimeString(),
          20,
          doc.internal.pageSize.height - 20
        );
      }
    };

    //////////// TABLE DATA ////////////
    //debugger;

    doc.html(content, {
      callback: function (doc) {
        autoTable(doc, {
          html: "#header_table",
          startY: legend.height,// + 20,
          styles: { font: "Meta" },
          headStyles: {
            halign: "center",
            valign: "top",
            fontStyle: "bold",
            textColor: 50,
            fontSize: 20,
            fillColor: [255, 255, 255],
          },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 120,
          theme: "grid",
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.75,
          styles: {
            font: "Meta",
            lineColor: [44, 62, 80],
            lineWidth: 0.55,
          },
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
            fontSize: 11,
          },
          bodyStyles: {
            //fillColor: [216, 216, 216],
            textColor: 50,
            valign: "middle",
            //minCellHeight: 15,
          },

          // columnStyles: {
          //   2: { halign: "center" },
          //   4: { halign: "center" },
          //   5: { halign: "right" },
          //   6: { halign: "right" },
          //   7: { halign: "right" },
          //   8: { halign: "right" },
          //   9: { halign: "right" },
          //   10: { halign: "right" },
          // },
          // alternateRowStyles: {
          //   //fillColor: [250, 250, 250],
          // },
        });

        addFooters(doc);

        ////////////PRINT ////////////
        if (buttonAction == "pdf") {
          doc.save(fileName);
        } else {
          window.open(URL.createObjectURL(doc.output("blob")), "_blank"); //doc.output("dataurlnewwindow");
          doc.close();
        }
      },
    });

  }

  private onExportCSV() {
    let cellDataArray = this.bodyData.map((item, index) => {
      return [
        index + 1
        , item.attendanceDate
        , item.startTime
        , item.endTime
        , item.workingTimeTest
        , item.latetimeTest
        , item.status
        , item.clarification
      ];
    });

    let headerParams = this.params.map((item, index) => {
      return [
        , `${item.leftLabel}`
        , `: ${item.leftValue}`
        , `${item.rightLabel}`
        , `: ${item.rightValue}`
      ];
    });

    //console.log(this.summaryData);
    let summary = this.summaryData.map((item, index) => {
      return [
        `Total :  Day(s): ${this.totalDays}`
        , `Weekly Off: ${this.ttlWeeklyOff}`
        , `Holyday: ${this.ttlHoliday}`
        , `Leave: ${this.ttlLeave}`
        , `Present: ${this.ttlPresent}`
        , `Absent: ${this.ttlAbsent}`
        , `Late: ${this.ttlLate}`
      ];
      // return [
      //   'Total '
      //   , `Weekly Off: ${item.weeklyOff}`
      //   , `Holyday: ${item.holiday}`
      //   , `Leave: ${item.leave}`
      //   , `Present: ${item.present}`
      //   , `Absent: ${item.absent}`
      //   , `Late: ${item.late}`
      // ];
    });
    //console.log(summary);
    this.commonService.GenerateCSV(cellDataArray, this.tableHeader, this.rReportHeader, headerParams, summary)
  }



  public onExcel() {
    this.toastrService.warning("Message", "Excel button clicked");
  }

  private onEmail() {
    this.toastrService.warning("Message", "Email button clicked");
  }
}

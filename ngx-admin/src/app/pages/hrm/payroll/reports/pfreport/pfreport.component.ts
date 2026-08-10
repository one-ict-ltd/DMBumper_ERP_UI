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

import * as ExcelJS from "exceljs/dist/exceljs.min.js";
import * as FileSaver from "file-saver";
const EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

@Component({
  selector: 'ngx-pfreport',
  templateUrl: './pfreport.component.html',
  styleUrls: ['./pfreport.component.scss']
})
export class PFReportComponent implements OnInit {

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

  pageNavigation = "PF Report";
  rReportHeader = "PF Report";

  public tableHeader = [
    "#",
    "Month Name",
    "Year",
    "PF Amount",
  ];

  apiUrl = "";
  bodyData: any = [];
  showbody: boolean = false;

  public workbook: ExcelJS.Workbook;
  public worksheet: any;

  public companyData: any = [];
  public companyName = "";
  public companyId = 0;
  public addressLine = "";
  public officeTelephone = "";
  public companyEmail = "";
  public website = "";

  public totalEmployee = 0;


  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private processattendanceService: ProcessattendanceService,
    private dp: DatePipe,
  ) {
    this.LoadCompany();
    this.getMaster();
    this.getCompanyAddress();
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

  private getCompanyAddress() {
    this.comboService.getCompanybyId().subscribe((returns: any) => {
      debugger
      this.companyData = returns.data;
      this.companyId = this.companyData[0].companyId;
      this.companyName = this.companyData[0].companyName;
      this.addressLine = this.companyData[0].addressLine;
      this.officeTelephone = this.companyData[0].officeTelephone;
      this.companyEmail = this.companyData[0].companyEmail;
      this.website = this.companyData[0].website;
    });
  }

  empItems = [];
  LoadEmployee(): void {
    this.comboService.GetEmployeeInfoLoadByIdAndCompany(this.master.companyId, 0).subscribe((returns: any) => {
      this.empItems = returns.data.map((val) => ({
        id: val.employeeNo,
        name: val.fullName,
        joiningDate: val.joiningDate,
        currentDesignation: val.currentDesignation,
        currentDepartment: val.currentDepartment,
        serviceLenth: val.serviceLenth,
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

  public setParam() {
    this.params = [];
    this.params.push({
      leftLabel: "Employee No",
      leftValue: this.empSelected['id'],
      rightLabel: "Employee Name",
      rightValue: this.empSelected['name'],
    });
    this.params.push({
      leftLabel: "Designation",
      leftValue: this.empSelected['currentDesignation'],
      rightLabel: "Department",
      rightValue: this.empSelected['currentDepartment'],
    });
    this.params.push({
      leftLabel: "Joining Date",
      leftValue: this.empSelected['joiningDate'],
      rightLabel: "Service Length",
      rightValue: this.empSelected['serviceLenth'],
    });
  }

  private getGridData() {
    if (this.master.companyId == 0 || this.master.companyId == null) {
      this.toastrService.danger("Please select a company", "Message");
      return false;
    }
    if (this.master.empId == 0 || this.master.empId == null) {
      this.toastrService.danger("Please select a employee", "Message");
      return false;
    }
    this.setParam()
    console.log(this.params);
    // if (this.master.startDate == null) {
    //   this.toastrService.danger("Please select start date", "Message");
    //   return false;
    // }
    // if (this.master.endDate == null) {
    //   this.toastrService.danger("Please select end date", "Message");
    //   return false;
    // }
    this.totalDays = 0;
    this.apiUrl = `SalaryReport/HrmPFReportJson?employeeId=${this.master.empId}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.bodyData = returns.data;
        this.bodyData.forEach(a => this.totalDays += a.PF);

      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });

  }
  GetCount(character) {
    return this.bodyData.filter(obj => obj.status === character).length;
  }

  public datalength: number;
  public generateReport(rptFormat: any) {
    debugger;
    this.getGridData();
    //const content = document.getElementById("reportHeader");
    //this.commonService.GenerateReport(this.rReportHeader, rptFormat, "p", content);
    //this.generateAttReport(this.rReportHeader, this.pageNavigation, content);

    var fileName = this.pageNavigation + ".pdf";
    const content = document.getElementById("reportHeader");
    this.generateReportPDF("print", fileName, content, this.datalength);
  }

  public generateReportPDF(
    buttonAction: any,
    fileName: string,
    content: any,
    datalength: number
  ) {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(5); //optional
    doc.setTextColor(40); //optional

    var legend = {
      height: 100,
      totalheight: 100 + datalength,
    };
    //debugger;
    const addFooters = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      for (var i = 1; i <= pageCount; i++) {
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
    // legend.totalheight=legend.height+this.datalength;
    doc.html(content, {
      callback: function (doc) {
        // autoTable(doc, {
        //   html: "#header_table_top",
        //   startY: legend.height + 30,
        //   styles: { font: "Meta", fontSize: 15, halign: "center" },
        //   bodyStyles: {
        //     //fillColor: [216, 216, 216],
        //     textColor: 50,
        //   },
        //   alternateRowStyles: {
        //     //fillColor: [250, 250, 250],
        //   },
        // });

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
            fillColor: [250, 250, 250],
            fontSize: 11,
            textColor: 50,
          },
          bodyStyles: {
            //fillColor: [216, 216, 216],
            textColor: 50,
          },

          alternateRowStyles: {
            //fillColor: [250, 250, 250],
          },
          columnStyles: {
            2: { halign: "right" },
            //5: { halign: "right" },
          },
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
      height: 50,
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
    this.getGridData();
    var fileName = this.pageNavigation + ".xlsx";
    this.generateExcelPR(this.bodyData, this.tableHeader, fileName);
  }
  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }



  public onExcel() {
    this.toastrService.warning("Message", "Excel button clicked");
  }


  public generateExcelPR(objArray: any, header: any, fileName: string) {
    let data = objArray.map((item, index) => {
      return [
        index + 1,
        item.PeriodMonth,
        item.PeriodYear,
        item.PF
      ];
    });

    let data1 = this.params.map((item, index) => {
      return [
        item.leftLabel,
        item.leftValue,
        item.rightLabel,
        item.rightValue,
      ];

    });

    var alphabet = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ];
    var count = header.length;
    var endColumn = alphabet[count - 1];
    this.workbook = new ExcelJS.Workbook();

    // Set Workbook Properties
    this.workbook.creator = "Web";
    this.workbook.lastModifiedBy = "Web";
    this.workbook.created = new Date();
    this.workbook.modified = new Date();
    this.workbook.lastPrinted = new Date();

    // Add a Worksheet
    this.worksheet = this.workbook.addWorksheet(fileName);

    //Add Header Row
    let headerName = this.worksheet.addRow([this.companyName]);
    headerName.font = { size: 16, underline: "double", bold: true };
    headerName.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    this.worksheet.mergeCells(
      `A${headerName.number}:${endColumn + headerName.number}`
    );

    let headerAddress = this.worksheet.addRow([this.addressLine]);
    headerAddress.font = { size: 10 };
    headerAddress.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    this.worksheet.mergeCells(
      `A${headerAddress.number}:${endColumn + headerAddress.number}`
    );

    let headerPhone = this.worksheet.addRow([
      this.officeTelephone,
    ]);
    headerPhone.font = { size: 10 };
    headerPhone.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    this.worksheet.mergeCells(
      `A${headerPhone.number}:${endColumn + headerPhone.number}`
    );

    let headerWebsite = this.worksheet.addRow([
      this.companyEmail + "; " + this.website,
    ]);
    headerWebsite.font = { size: 10 };
    headerWebsite.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    this.worksheet.mergeCells(
      `A${headerWebsite.number}:${endColumn + headerWebsite.number}`
    );

    headerName.getCell(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFCCFFE5" },
    };
    headerName.getCell(1).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    this.worksheet.addRow([]);

    this.worksheet.addRows(data1);

    this.worksheet.addRow([]);
    var tableHeaderRow = this.worksheet.addRow(header);
    header.map((item, index) => {
      tableHeaderRow.getCell(index + 1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "696969" },
      };
      tableHeaderRow.getCell(index + 1).font = {
        bold: true,
        size: 12,
        family: 4,
        color: { argb: "FFFFFF" },
      };
    });

    this.worksheet.addRows(data);

    this.worksheet.addRow([]);
    //Footer Row
    let footerRow = this.worksheet.addRow([
      "This excel sheet is generated by ONE ERP.",
    ]);
    footerRow.getCell(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFCCFFE5" },
    };
    footerRow.getCell(1).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    //Merge Cells
    footerRow.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    this.worksheet.mergeCells(
      `A${footerRow.number}:${endColumn + footerRow.number}`
    );
    // Generate Excel File
    this.workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: EXCEL_TYPE });
      // Given name
      FileSaver.saveAs(blob, fileName);
    });
  }


}
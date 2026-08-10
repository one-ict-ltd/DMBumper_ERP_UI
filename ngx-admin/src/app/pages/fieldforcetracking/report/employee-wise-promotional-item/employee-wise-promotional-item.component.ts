import { Component, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { CommonService } from "app/@core/mock/common.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { FftReportService } from "app/services/fieldforcetracking/fft-report.service";
import { FieldforcemasterService } from "app/services/fieldforcetracking/fieldforcemaster.service";
import { MiovisitService } from "app/services/fieldforcetracking/miovisit.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DatePipe } from "@angular/common";
import { FftDashboardService } from "app/services/fieldforcetracking/fft-dashboard.service";

import * as ExcelJS from "exceljs/dist/exceljs.min.js";
const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
import * as FileSaver from "file-saver";

@Component({
  selector: "ngx-employee-wise-promotional-item",
  templateUrl: "./employee-wise-promotional-item.component.html",
  styleUrls: ["./employee-wise-promotional-item.component.scss"],
})
export class EmployeeWisePromotionalItemComponent implements OnInit {
  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private fieldforcemasterService: FieldforcemasterService,
    private fftReportService: FftReportService,
    private miovisitService: MiovisitService,
    private FftDashboardService: FftDashboardService,
    private DatePipe: DatePipe
  ) {
    this.GetZone();
    this.getMaster();
    this.GetEmployeeforAllEmployeeCT("", "");
    this.getCompanyAddress();
  }
  public pageNavigation = "Employee Wise Promotional Item Report";
  public tableHeader = [
    "#",
    "Visit Date",
    "Doctor Name",
    "Promotional Item Name",
    "Qty.",
    "UOM",
  ];
  public apiUrl = "";
  public bodyData: any = [];
  public bodyDatashow: any = [];
  public companies = [];
  public companyId: number = 0;
  public hide: boolean = false;
  public showbody: boolean = false;
  disabled: boolean = false;
  public company: {
    name: string;
    address: string;
    custom_footer: boolean;
    phone: string;
    fax: string;
    email: string;
    website: string;
    vat: string;
    tin: string;
  };
  master: {
    ZoneId: string;
    DepoId: string;
    RegionId: string;
    AreaId: string;
    TerritoryID: string;
    ChemistId: string;
    fromDate: Date;
    toDate: Date;
    BrandId: string;
    MIOCode: string;
    DoctorId: string;
    StoreId: Number;
    SalesInvoiceId: Number;

    ZoneCodeSelected: {};
    DepoCodeSelected: {};
    RegionCodeSelected: {};
    AreaCodeSelected: {};
    TerritoryCodeSelected: {};
    CustomerSelected: {};
    BrandSelected: {};
    MIOSelected: {};

    stockDetailsList: any[];
  };

  public getMaster() {
    this.master = {
      ZoneId: "",
      BrandId: "",
      DepoId: "",
      RegionId: "",
      AreaId: "",
      TerritoryID: "",
      ChemistId: "",
      MIOCode: "",
      DoctorId: "",
      SalesInvoiceId: 0,
      StoreId: 0,
      fromDate: new Date(),
      toDate: new Date(),

      ZoneCodeSelected: null,
      DepoCodeSelected: null,
      RegionCodeSelected: null,
      AreaCodeSelected: null,
      TerritoryCodeSelected: null,
      CustomerSelected: null,
      BrandSelected: null,
      MIOSelected: null,

      stockDetailsList: [],
    };
  }

  ngOnInit(): void { }
  public RptButtonAction() {
    const clicked = this.commonService.buttonClicked;
    if (clicked == "preview") {
      this.onPreview();
    } else if (clicked == "pdf") {
      this.GenerateReport("pdf");
    } else if (clicked == "print") {
      this.GenerateReport("print");
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

  public index = 0;
  public ZoneName: string = "";
  public DepotName: string = "";
  public RegionName: string = "";
  public AreaName: string = "";
  public TerritoryName: string = "";
  public MioName: string = "";
  public CustomerName: string = "";
  public FromDate: string = "";
  public ToDate: string = "";

  private onRefresh() {
    this.companyId = 0;
    this.bodyData = [];
    this.showbody = false;
  }
  private onPreview() {
    const fromDate = this.master.fromDate;
    const toDate = this.master.toDate;
    if (this.commonService.validateDates(fromDate, toDate)) {
      this.getReportData();
      this.showbody = true;
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
  }
  private onExportCSV() {
    const fromDate = this.master.fromDate;
    const toDate = this.master.toDate;
    if (this.commonService.validateDates(fromDate, toDate)) {
      this.getReportData();
      var fileName = this.pageNavigation + ".xlsx";
      this.generateExcel(this.bodyData, this.tableHeader, fileName);
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
  }
  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  public GenerateReport(buttonAction: any) {
    const fromDate = this.master.fromDate;
    const toDate = this.master.toDate;
    if (this.commonService.validateDates(fromDate, toDate)) {
      var fileName = this.pageNavigation + ".pdf";
      this.getReportData();
      const content = document.getElementById("reportHeader");
      this.generateReport(buttonAction, fileName, content, 11, 0, this.bodyData);
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
  }

  private getReportData() {
    debugger;
    this.fftReportService
      .GetEmp_DoctorPromotionalItemReportData(
        this.master.ZoneId,
        this.master.DepoId,
        this.master.RegionId,
        this.master.AreaId,
        this.master.TerritoryID,
        this.master.DoctorId,
        this.master.MIOCode,
        this.DatePipe.transform(this.master.fromDate, "yyyy-MM-dd"),
        this.DatePipe.transform(this.master.toDate, "yyyy-MM-dd")
      )
      .subscribe((returns: any) => {
        if (returns.success) {
          debugger;
          this.bodyData = returns.data;
          console.log(this.bodyData);

          this.ZoneName =
            this.master.ZoneCodeSelected == null
              ? "All"
              : this.master.ZoneCodeSelected["name"];
          this.DepotName =
            this.master.DepoCodeSelected == null
              ? "All"
              : this.master.DepoCodeSelected["name"];
          this.RegionName =
            this.master.RegionCodeSelected == null
              ? "All"
              : this.master.RegionCodeSelected["name"];
          this.AreaName =
            this.master.AreaCodeSelected == null
              ? "All"
              : this.master.AreaCodeSelected["name"];
          this.TerritoryName =
            this.master.TerritoryCodeSelected == null
              ? "All"
              : this.master.TerritoryCodeSelected["name"];
          this.CustomerName =
            this.master.CustomerSelected == null
              ? "All"
              : this.master.CustomerSelected["name"];
          this.MioName =
            this.master.MIOSelected == null
              ? "All"
              : this.master.MIOSelected["name"];
          this.FromDate = this.master.fromDate.toString().substring(3, 15);
          this.ToDate = this.master.toDate.toString().substring(3, 15);
        } else {
          this.toastrService.danger("Message", this.commonService.nodatafound);
        }
      });
  }

  public ZoneList = [];
  public GetZone() {
    this.fieldforcemasterService.getZone(0).subscribe((retuns: any) => {
      if (retuns.length > 0) {
        this.ZoneList = retuns.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }));
      }
    });
  }

  public DepoList = [];
  public GetDepo(ZoneCode) {
    this.master.DepoCodeSelected = {};
    this.fieldforcemasterService
      .getDepoByZoneCode(ZoneCode)
      .subscribe((retuns: any) => {
        if (retuns.success) {
          this.DepoList = retuns.data.map((val: any) => ({
            id: val.Code,
            name: val.Name,
          }));
        }
      });
    this.GetEmployeeforAllEmployeeCT(ZoneCode, "Z");
  }

  public RegionList = [];
  public GetRegion(DepoCode) {
    this.master.RegionCodeSelected = {};
    this.fieldforcemasterService
      .getRegionbydepocode(DepoCode)
      .subscribe((retuns: any) => {
        if (retuns.success) {
          this.RegionList = retuns.data.map((val: any) => ({
            id: val.Code,
            name: val.Name,
          }));
        }
      });
    this.GetEmployeeforAllEmployeeCT(DepoCode, "D");
  }

  public AreaList = [];
  public GetArea(RegionCode) {
    this.master.AreaCodeSelected = {};
    this.fieldforcemasterService
      .getAreabyRegopmcode(RegionCode)
      .subscribe((retuns: any) => {
        if (retuns.success) {
          this.AreaList = retuns.data.map((val: any) => ({
            id: val.Code,
            name: val.Name,
          }));
        }
      });
    this.GetEmployeeforAllEmployeeCT(RegionCode, "R");
  }

  public TerritoryList = [];
  public GetTerritory(AreaId) {
    this.master.TerritoryCodeSelected = {};
    this.fieldforcemasterService
      .getTerritorybyAreacode(AreaId)
      .subscribe((retuns: any) => {
        if (retuns.success) {
          this.TerritoryList = retuns.data.map((val: any) => ({
            id: val.TerritoryCode,
            name: val.TerritoryName,
          }));
        }
      });
    this.GetEmployeeforAllEmployeeCT(AreaId, "A");
  }

  public MIOList = [];
  public GetMIO(TerritoryCode) {
    //this.master.MIOSelected = {};
    // this.miovisitService.getMIO(TerritoryCode).subscribe((retuns: any) => {
    //   if (retuns.success) {
    //     this.MIOList = retuns.data.map((val: any) => ({
    //       id: val.EMP_ID,
    //       name: val.EMPLOYEE_NAME,
    //     }));
    //   }
    // });
    this.GetEmployeeforAllEmployeeCT(TerritoryCode, "T");
  }

  public LoadEmployees(code, Type, SType) {
    this.master.MIOCode = "";
    this.master.MIOSelected = null;
    this.FftDashboardService.GetEmployees(code, Type, SType).subscribe(
      (retuns: any) => {
        if (retuns.success) {
          this.MIOList = retuns.data.map((val: any) => ({
            id: val.employeeNo,
            name: `${val.fullName} (${val.employeeNo})`,
          }));
        }
      }
    );
  }

  public GetEmployeeforAllEmployeeCT(Code, Type) {
    this.master.MIOSelected = null;
    this.fieldforcemasterService
      .GetEmployeeforAllEmployeeCT(Code, Type)
      .subscribe((retuns: any) => {
        //debugger;
        if (retuns.status) {
          //console.log(retuns.data);
          this.MIOList = retuns.data.map((val: any) => ({
            id: val.employeeNo, //EMP_ID,
            name: `${val.fullName} (${val.employeeNo})`, //EMPLOYEE_NAME,
          }));
        }
      });
  }

  public CustomerList = [];
  public GetCustomer(TerritoryCode) {
    this.master.CustomerSelected = {};
    this.fieldforcemasterService
      .getCustomer(TerritoryCode)
      .subscribe((retuns: any) => {
        if (retuns.success) {
          this.CustomerList = retuns.data.map((val: any) => ({
            id: val.EMP_ID,
            name: val.EMPLOYEE_NAME,
          }));
        }
      });
  }

  public BrandList = [];
  public GetCustomer2(TerritoryCode) {
    this.master.BrandSelected = {};
    this.fieldforcemasterService
      .getCustomer(TerritoryCode)
      .subscribe((retuns: any) => {
        if (retuns.success) {
          this.BrandList = retuns.data.map((val: any) => ({
            id: val.EMP_ID,
            name: val.EMPLOYEE_NAME,
          }));
        }
      });
  }

  public generateReport(
    buttonAction: any,
    fileName: string,
    content: any,
    columnIndex: any,
    imageIndex: number,
    bodyData: any[]
  ) {
    //console.log(bodyData);
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(1); //optional
    doc.setTextColor(40); //optional
    const legend = {
      height: 100,
    };
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

    doc.html(content, {
      callback: function (doc) {
        autoTable(doc, {
          html: "#header_table_top",
          startY: legend.height + 20,
          styles: { font: "Meta", fontSize: 15, halign: "center" },
        });

        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 60,
          styles: { font: "Meta" },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 140,
          theme: "grid",
          // tableLineColor: [0, 0, 0],
          // tableLineWidth: 0.75,
          styles: {
            font: "Times New Roman",
            lineColor: [44, 62, 80],
            lineWidth: 0.55,
          },
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontSize: 11,
            halign: "center",
            valign: "middle",
            fontStyle: "bold",
          },
          bodyStyles: {
            //fillColor: [216, 216, 216],
            textColor: 50,
            valign: "middle",
          },
          // columnStyles: {
          //   0: { cellWidth: 30 },
          //   1: { cellWidth: 40 },
          //   2: { cellWidth: 70 },
          //   3: { cellWidth: 35 },
          //   4: { cellWidth: 45 },
          //   5: { cellWidth: 50 },
          //   6: { cellWidth: 50 },
          //   //7: { cellWidth: 75 },
          //   8: { cellWidth: 60 },
          //   9: { cellWidth: 50 },
          //   10: { cellWidth: 40 },
          //   11: { cellWidth: 40 },
          //   12: { cellWidth: 40 },
          //   13: { cellWidth: 50 },
          //   14: { cellWidth: 50 },
          //   15: { cellWidth: 40 },
          //   16: { cellWidth: 40 },
          // },
          alternateRowStyles: {
            fillColor: [250, 250, 250],
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

  workbook: ExcelJS.Workbook;
  worksheet: any;
  public generateExcel(objArray: any, header: any, fileName: string) {
    debugger;
    //console.log(objArray);
    let data = objArray.map((item, index) => {
      return [
        index + 1,
        item.VisitDate,
        item.DoctorName,
        item.productName,
        item.invoiceQty,
        item.uomName,
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
    debugger;
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
      // this.company.phone + "; " + this.company.fax,
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

    //this.worksheet.addRows(objArray);
    this.worksheet.addRows(data);

    // Add Data and Conditional Formatting
    // data.forEach((d) => {
    //   let row = this.worksheet.addRow(d);
    //   let qty = row.getCell(5);
    //   let color = "FF99FF99";
    //   if (+qty.value < 500) { color = "FF9999"; }
    //   qty.fill = { type: "pattern",  pattern: "solid", fgColor: { argb: color }};
    // });
    // this.worksheet.getColumn(3).width = 30;
    // this.worksheet.getColumn(4).width = 30;
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
  companyData;
  companyName;
  addressLine;
  officeTelephone;
  companyEmail;
  website;
  private getCompanyAddress() {
    this.comboService.getCompanybyId().subscribe((returns: any) => {
      this.companyData = returns.data;
      this.companyName = this.companyData[0].companyName;
      this.addressLine = this.companyData[0].addressLine;
      this.officeTelephone = this.companyData[0].officeTelephone;
      this.companyEmail = this.companyData[0].companyEmail;
      this.website = this.companyData[0].website;
    });
  }
}

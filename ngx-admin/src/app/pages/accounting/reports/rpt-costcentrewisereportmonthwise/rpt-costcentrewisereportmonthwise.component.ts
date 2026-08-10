import { Component, OnInit } from "@angular/core";
import { NbToastrService, NbDatepickerModule } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";
import { RptCoaService } from "../../../../services/accounting/reports/rpt-coa.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as ExcelJS from "exceljs/dist/exceljs.min.js";
import * as FileSaver from "file-saver";
import { CostcentreService } from "app/services/costcentre.service";
const EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";


@Component({
  selector: 'ngx-rpt-costcentrewisereportmonthwise',
  templateUrl: './rpt-costcentrewisereportmonthwise.component.html',
  styleUrls: ['./rpt-costcentrewisereportmonthwise.component.scss']
})
export class RptCostcentrewisereportmonthwiseComponent implements OnInit {

  public pageNavigation = "Cost Centre Wise Monthly Report";
  public tableHeader = [
    "#",
    "Account Code",
    "Account Name",
    "Debit Amount",
    "Credit Amount",
  ];
  public tableHeaderP = [

  ];
  public tableHeaderPP = [

  ];

  public apiUrl = "";
  public bodyData: any = [];
  public params = [];

  public companies = [];
  public branchs = [];
  public ledgers = [];
  public costCentres = [];
  public companyId: number = 0;
  public showbody: boolean = false;
  public ddlSelected: any;
  public branchSelected: any;
  public costCentreSelected: any;
  public ledgerSelected: any;
  public costCentreLocationSelected: any;
  public costCentreCategorySelected: any;
  public accountGroupSelected: any;
  public natureSelected: any;
  public fromdateSelected = new Date();
  public todateSelected = new Date();

  public workbook: ExcelJS.Workbook;
  public worksheet: any;
  public natureId: number = 0;
  public groupId: number = 0;
  public companyData: any = [];
  public companyName = "";
  public addressLine = "";
  public officeTelephone = "";
  public companyEmail = "";
  public website = "";

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private costcentreService: CostcentreService,
    private rptCoaService: RptCoaService
  ) {
    this.getDropdownData();
    this.getCompanyAddress();
    this.getCostCentreCategory();
    this.getCostCentreLocation();
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
  public setParam() {
    this.params = [];
    // this.params.push({
    //   leftLabel: "Company",
    //   leftValue: this.ddlSelected.name,
    //   
    //   
    // });
    debugger;
    this.params.push({
      leftLabel: "Company:",
      leftValue: this.ddlSelected["name"],
      rightLabel: "Branch:",
      rightValue: this.branchSelected["name"],
    });
    if (this.ledgerSelected == null) {
      this.params.push({
        leftLabel: "Date:",
        leftValue: this.fromdateSelected.toString().substring(3, 15) + ' to ' + this.todateSelected.toString().substring(3, 15),

      });
    }
    else {
      this.params.push({
        leftLabel: "Date:",
        leftValue: this.fromdateSelected.toString().substring(3, 15) + ' to ' + this.todateSelected.toString().substring(3, 15),
        rightLabel: "Ledger Name:",
        rightValue: this.ledgerSelected["name"],
      });
    }
    if (this.costCentreSelected == null) {

    } else if (this.costCentreLocationSelected == null) {
      this.params.push({
        leftLabel: "Cost Centre Name",
        leftValue: this.costCentreSelected["name"],
      });
    }
    else {
      this.params.push({
        leftLabel: "Cost Centre Name",
        leftValue: this.costCentreSelected["name"],
        rightLabel: "Cost Centre Location:",
        rightValue: this.costCentreLocationSelected["name"],

      });
    }

  }

  public LoadCostCentreByCategoryIdandLocationId() {
    var costCentreCategoryId = 0;
    if (this.costCentreCategorySelected != null) {
      costCentreCategoryId = this.costCentreCategorySelected["id"];
    }
    var costCentreLocationId = 0;
    if (this.costCentreLocationSelected != null) {
      costCentreLocationId = this.costCentreLocationSelected["id"];
    }
    this.costcentreService.getCostCentrebyCategoryIdandLocationId(costCentreLocationId, costCentreCategoryId).subscribe((returns: any) => {
      this.costCentres = returns.data.map((val) => ({
        id: val.costCentreId,
        name: val.costCentreName,
      }));
    });
  }

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
  private getDropdownData() {
    ////////// Call common service for dropdown data/////////
    this.comboService.getCompany().subscribe((returns: any) => {
      this.companies = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
      this.ddlSelected = {
        id: returns.data[0].companyId,
        name: returns.data[0].companyName,
      };
      this.getBranch(returns.data[0].companyId);
      this.getCostCentre();
      // this.getLedgers();
      this.getDdlGroupNatureData();

    });
  }
  public groupNatureItems: [];
  public getDdlGroupNatureData() {
    this.comboService.getGroupNature().subscribe((returns: any) => {
      this.groupNatureItems = returns.data.map((val) => ({
        id: val.groupNatureId,
        name: val.natureName,
      }));

    });
  }
  public accountGroupItems: [];
  public getDdlAccountGroupData(groupNatureId) {
    this.accountGroupSelected = null;
    this.comboService.getAccountGroupByNature(groupNatureId).subscribe((returns: any) => {
      this.accountGroupItems = returns.data.map((val) => ({
        id: val.accountGroupId,
        name: val.groupName,
      }));
    });
  }
  public getBranch(companyId) {
    this.comboService.getSbuForAccounting(companyId).subscribe((returns: any) => {
      this.branchs = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
      this.branchSelected = {
        id: returns.data[0].sbuId,
        name: returns.data[0].sbuName,
      };
    });
  }
  public getCostCentre() {
    this.comboService.getCostCentreMaster().subscribe((returns: any) => {
      this.costCentres = returns.data.map((val) => ({
        id: val.costCentreId,
        name: val.costCentreName,
      }));
      // this.costCentreSelected = {
      //   id: returns.data[0].costCentreId,
      //   name: returns.data[0].costCentreName,
      // };
    });
  }
  public getLedgers() {
    this.comboService.getLedgers().subscribe((returns: any) => {
      this.ledgers = returns.data.map((val) => ({
        id: val.ledgerId,
        name: val.accountName,
      }));
      console.log(this.ledgers);
      // this.costCentreSelected = {
      //   id: returns.data[0].costCentreId,
      //   name: returns.data[0].costCentreName,
      // };
    });
  }
  public getLedgersFilter(groupId) {
    this.comboService.getLedgersbyGroupId(groupId).subscribe((returns: any) => {
      this.ledgers = returns.data.map((val) => ({
        id: val.ledgerId,
        name: val.accountName,
      }));

    });
  }
  private getReportData() {
    debugger;
    this.bodyData = [];
    this.tableHeaderP = [];
    this.tableHeaderPP = [];
    var costCentreId = 0;
    var ledgerId = 0;
    var costCentreCategoryId = 0;
    var costCentreLocationId = 0;
    var natureId = 0;
    var groupId = 0;
    if (this.costCentreSelected == null) {
      this.toastrService.danger("Please select Cost Centre", "Message");
      return false;
    }
    if (this.costCentreSelected != null) {
      costCentreId = this.costCentreSelected["id"];
    }
    if (this.ledgerSelected != null) {
      ledgerId = this.ledgerSelected["id"];
    }
    if (this.costCentreCategorySelected != null) {
      costCentreCategoryId = this.costCentreCategorySelected["id"];
    }
    if (this.costCentreLocationSelected != null) {
      costCentreLocationId = this.costCentreLocationSelected["id"];
    }
    if (this.natureSelected != null) {
      natureId = this.natureSelected["id"];
    }
    if (this.accountGroupSelected != null) {
      groupId = this.accountGroupSelected["id"];
    }
    this.setParam();
    this.apiUrl = `AccountReport/getRptCostCentreWiseMonthlyReport?companyId=${this.ddlSelected.id}&sbuId=${this.branchSelected.id}&costCentreId=${costCentreId}&costCostCentreLocationId=${costCentreLocationId}&costCentreCategoryId=${costCentreCategoryId}&ledgerId=${ledgerId}&natureId=${natureId}&groupId=${groupId}&fromDate=${this.fromdateSelected.toString().substring(3, 15)}&toDate=${this.todateSelected
      .toString().substring(3, 15)}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        //   this.bodyData = returns.data;
        // console.log(this.bodyData);
        console.log(Object.keys(returns.data[0]));
        //this.tableHeaderP=returns.data[0]["key"];
        console.log(this.tableHeaderP);
        //    for (var property in returns.data[0]) {
        //      console.log(property);
        //     this.tableHeaderP.push(property);
        //     if(property!="accountName")
        //     {
        //       this.tableHeaderPP.push(property);
        //     }
        // }
        var i = 0;
        for (var property in returns.data[0]) {

          if (property == "natureName") {
            this.tableHeaderP.push("Nature Name");
          } else if (property == "groupName") {
            this.tableHeaderP.push("Group Name");
          } else if (property == "accountName") {
            this.tableHeaderP.push("Account Name");
          } else {
            this.tableHeaderP.push(property);
          }

          if (i > 2) {
            this.tableHeaderPP.push(property);
          }
          i = i + 1;
          //  debugger;
        }
        console.log(this.tableHeaderPP);

        this.bodyData = returns.data;
        console.log(this.bodyData);
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }
  private onRefresh() {
    this.ddlSelected = null;

    this.branchSelected = null;
    this.fromdateSelected = new Date();
    this.todateSelected = new Date();
    this.companyId = 0;
    this.bodyData = [];
    this.showbody = false;
  }
  private onPreview() {
    const fromDate = this.fromdateSelected;
    const toDate = this.todateSelected;
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
    const fromDate = this.fromdateSelected;
    const toDate = this.todateSelected;
    if (this.commonService.validateDates(fromDate, toDate)) {
      this.getReportDataExcel();
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
  }
  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  public generateReport(buttonAction: any) {
    const fromDate = this.fromdateSelected;
    const toDate = this.todateSelected;
    if (this.commonService.validateDates(fromDate, toDate)) {
      this.setParam();
      var fileName = this.pageNavigation + ".pdf";
      this.getReportData();
      const content = document.getElementById("reportHeader");
      this.generatePdfTrial(buttonAction, fileName, content);
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
  }

  currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

  public generatePdfTrial(buttonAction: any, fileName: string, content: any) {
    const doc = new jsPDF("l", "pt", "legal");
    doc.setFontSize(5);
    doc.setTextColor(40);
    var legend = {
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
          startY: legend.height + 2,
          styles: { font: "Meta", fontSize: 14, halign: "center" },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
        });

        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 25,
          styles: { font: "Meta", fontSize: 11 },
          columnStyles: {
            0: { halign: "left", cellWidth: 200, },
            1: { halign: "left", cellWidth: 200, },
            2: { halign: "left", cellWidth: 200, },
            3: { halign: "left", cellWidth: 250, },
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 100,
          theme: "grid",
          // tableLineColor: [0, 0, 0],
          // tableLineWidth: 0.75,
          styles: {
            font: "Meta",
            lineColor: [44, 62, 80],
            lineWidth: 0.55,
          },
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontSize: 9,
            halign: "center",
            valign: "middle",
            fontStyle: "bold",
          },
          bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
          columnStyles: {
            0: { halign: "left" },
            1: { halign: "right" },
            2: { halign: "right" },
            3: { halign: "right" },
            4: { halign: "right" },
            5: { halign: "right" },
            6: { halign: "right" },
            7: { halign: "right" },
            8: { halign: "right" },
            9: { halign: "right" },
            10: { halign: "right" },
            11: { halign: "right" },
            12: { halign: "right" },
            13: { halign: "right" },
            14: { halign: "right" },
            15: { halign: "right" },
            16: { halign: "right" },
            17: { halign: "right" },
            18: { halign: "right" },
            19: { halign: "right" },
            20: { halign: "right" },
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
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

  // Excel
  private getReportDataExcel() {
    this.bodyData = [];
    this.tableHeaderP = [];
    this.tableHeaderPP = [];
    var costCentreId = 0;
    var ledgerId = 0;
    var costCentreCategoryId = 0;
    var costCentreLocationId = 0;
    var natureId = 0;
    var groupId = 0;
    if (this.costCentreSelected != null) {
      costCentreId = this.costCentreSelected["id"];
    }
    if (this.ledgerSelected != null) {
      ledgerId = this.ledgerSelected["id"];
    }
    if (this.costCentreCategorySelected != null) {
      costCentreCategoryId = this.costCentreCategorySelected["id"];
    }
    if (this.costCentreLocationSelected != null) {
      costCentreLocationId = this.costCentreLocationSelected["id"];
    }
    if (this.natureSelected != null) {
      natureId = this.natureSelected["id"];
    }
    if (this.accountGroupSelected != null) {
      groupId = this.accountGroupSelected["id"];
    }
    this.apiUrl = `AccountReport/getRptCostCentreWiseMonthlyReport?companyId=${this.ddlSelected.id}&sbuId=${this.branchSelected.id}&costCentreId=${costCentreId}&costCostCentreLocationId=${costCentreLocationId}&costCentreCategoryId=${costCentreCategoryId}&ledgerId=${ledgerId}&natureId=${natureId}&groupId=${groupId}&fromDate=${this.fromdateSelected.toString().substring(3, 15)}&toDate=${this.todateSelected
      .toString().substring(3, 15)}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {

        var i = 0;
        for (var property in returns.data[0]) {
          if (property == "natureName") {
            this.tableHeaderP.push("Nature Name");
          } else if (property == "groupName") {
            this.tableHeaderP.push("Group Name");
          } else if (property == "accountName") {
            this.tableHeaderP.push("Account Name");
          } else {
            this.tableHeaderP.push(property);
          }

          if (i > 2) {
            this.tableHeaderPP.push(property);
          }
          i = i + 1;
          //  debugger;
        }
        console.log(this.tableHeaderPP);
        this.bodyData = returns.data;
        console.log(this.bodyData);
        var fileName = this.pageNavigation + ".xlsx";
        this.generateExcelPR(this.bodyData, this.tableHeaderP, fileName);
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }

  public CostCentreCategoryList = [];
  public getCostCentreCategory() {
    this.costcentreService.getCostCentreCategory().subscribe((retuns: any) => {
      if (retuns.success) {
        this.CostCentreCategoryList = retuns.data.map((val: any) => ({
          id: val.costCentreCategoryId,
          name: val.costCentreCategoryName,
        }));
        //console.log(this.LeaveTypeList);
      }
    })
  }

  public CostCentreLocationList = [];
  public getCostCentreLocation() {
    this.costcentreService.getCostCentreLocation().subscribe((retuns: any) => {
      if (retuns.success) {
        this.CostCentreLocationList = retuns.data.map((val: any) => ({
          id: val.costCentreLocationId,
          name: val.costCentreLocationName,
        }));
        //console.log(this.LeaveTypeList);
      }
    })
  }

  public generateExcelPR(objArray: any, header: any, fileName: string) {
    //debugger;

    let data = objArray.map((row, ri) => {
      let datax = [];
      let dataxx = [];

      //console.log(Object.values(row));
      debugger;
      datax = Object.values(row);
      let i = datax.length;
      // alert(i);
      let j = 0;
      while (j < i) {
        // alert(j);
        if (j <= 2) {
          dataxx.push(datax[j]);
        }
        else {
          let amount = datax[j];
          dataxx.push(this.currencyFormatter(amount));
          // dataxx.push(amount);
        }
        j = j + 1;
        console.log(j);
      }

      // console.log(dataxx);
      // objArray.forEach(element => {
      //   if(element.key=="accountName")
      //   {
      //     datax.push(Object.values(element));
      //   }
      //   else
      //   {
      //     datax.push(this.currencyFormatter(Object.values(element)));
      //   }
      // });
      return dataxx;



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
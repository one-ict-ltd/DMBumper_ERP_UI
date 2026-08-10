import { Component, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { CommonService } from "app/@core/mock/common.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { ProducttransferService } from "app/services/inventory/producttransfer.service";
import { StockinService } from "app/services/inventory/stockin.service";
import { MenuService } from "app/services/menu.service";
import * as ExcelJS from "exceljs/dist/exceljs.min.js";
import * as FileSaver from "file-saver";
const EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

@Component({
  selector: 'ngx-stocktransfer',
  templateUrl: './stocktransfer.component.html',
  styleUrls: ['./stocktransfer.component.scss']
})
export class StockTransferComponent implements OnInit {
  public pageNavigation = "Product (Stock) Transfer";
  public tableHeader = ["#", "Transfer From", "Transfer To", "Transfer No.", "Date", "Code", "Product Name", "Pack Size", "Qty.", "Value"];
  public tableHeader2 = ["#", "Transfer To", "Transfer No.", "Date", "Code", "Product Name", "Pack Size", "Qty.", "Value"];
  public apiUrl = "";
  public htmlBodyData: string = "";
  public bodyData: any = [];
  public bodyDatashow: any = [];
  public params = [];
  public companies = [];
  public companyId: number = 0;
  public sbuList = [];
  public fromSbuId: number = 0;
  public fromSbuSelected: any;

  public companyData: any = [];
  public companyName = "";
  public addressLine = "";
  public officeTelephone = "";
  public companyEmail = "";
  public website = "";

  public workbook: ExcelJS.Workbook;
  public worksheet: any;

  public storeList = [];
  public fromStoreId: number = 0;
  public fromStoreSelected: any;

  public showbody: boolean = false;

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private menuService: MenuService,
    private stockinService: StockinService,
    private producttransferService: ProducttransferService,

  ) {
    this.getDropdownData();
    this.getCompanyAddress();
    //debugger
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
    this.params.push({
      leftLabel: "Depot Name:",
      leftValue: this.fromSbuSelected.name == (undefined || null) ? 'All' : this.fromSbuSelected.name,
      rightLabel: "",
      rightValue: "",
    });
    this.params.push({
      leftLabel: "From Transfer Date:",
      leftValue: this.commonService.DateFormat(this.fromDate),
      rightLabel: "To Transfer Date:",
      rightValue: this.commonService.DateFormat(this.toDate),
    });

    // this.params.push({ leftLabel: "Company Name", leftValue: this.fromStoreSelected.name, rightLabel: "Branch Name", rightValue: this.fromStoreSelected.name});
    // this.params.push({ leftLabel: "Company Name", leftValue: this.fromStoreSelected.name, rightLabel: "Branch Name", rightValue: this.fromStoreSelected.name});
    // this.params.push({ leftLabel: "Company Name", leftValue: this.fromStoreSelected.name, rightLabel: "Branch Name", rightValue: this.fromStoreSelected.name});

  }
  private getDropdownData() {
    this.comboService.getSBU(0).subscribe((returns: any) => {
      this.sbuList = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
      if (this.sbuList.length == 1) {
        this.fromSbuSelected = { id: this.sbuList[0].id, name: this.sbuList[0].name };
        this.fromSbuId = this.sbuList[0].id;
        this.getStores(this.fromSbuId);
      }
    });
  }

  public getStores(fromsbuId) {
    this.storeList = [];
    this.stockinService.getStore(fromsbuId, 0).subscribe((returns: any) => {
      this.storeList = returns.data.map((val) => ({
        id: val.storeId,
        name: val.storeName,
      }));
      if (this.storeList.length == 1) {
        this.fromStoreSelected = { id: this.storeList[0].id, name: this.storeList[0].name };
        this.fromStoreId = this.storeList[0].id;
      }
    });
  }
  //public count = 0;
  public natureName = "";
  public groupCode = "";
  public groupName = "";
  public fromDate = new Date();
  public toDate = new Date();
  ttlValue = 0;
  private getReportData() {

    ////////// Call common service for report data/////////
    //this.apiUrl = `ProductTransfer/GetProductTransferReportData?`;
    this.ttlValue = 0;
    this.apiUrl = `ProductTransfer/GetProductTransferReportData?fromDate=${this.fromDate.toDateString().substring(4, 15)}&toDate=${this.toDate.toDateString().substring(4, 15)}&fromSbuId=${this.fromSbuId}&fromStoreId=${this.fromStoreId}`;

    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {

        returns.data.forEach(element => {
          this.ttlValue += element.value ?? 0;
        });
        this.ttlValue = this.commonService.roundWithDecimalPoint(this.ttlValue, 0);

        this.bodyData = [];
        this.bodyData = returns.data;
        // this.renderHtml(this.bodyData);
        // console.log("Report.bodyData")
        console.log(this.bodyData)
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
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

  public renderHtml(bodyData: any[]) {
    // this.htmlBodyData = '';

    // for (let index = 0; index < bodyData.length; index++) {
    //   const element = bodyData[index];
    //   this.htmlBodyData += '<tr> <td rowspan = "' + element.rowMerge + '" ' + element.hidden + '>' + element.prodTrnNo + '</td> <td rowspan = "' + element.rowMerge + '" ' + element.hidden + '>' + element.prodTrnDate + '</td> <td>' + index + 1 + '</td> <td>' + element.productName + '</td> <td>' + element.transferQty + '</td> <td>' + element.uomName + '</td> </tr>'
    // }

    // console.log(this.htmlBodyData);
    ////document.getElementById('#tBody').innerHTML = this.htmlBodyData;
  }

  private onRefresh() {
    this.fromStoreSelected = null;
    this.companyId = 0;
    this.bodyData = [];
    this.htmlBodyData = '';
    this.showbody = false;
  }

  private onPreview() {
    this.getReportData();
    this.showbody = true;
  }

  private onExportCSV() {
    if (this.bodyData.length == 0) {
      this.toastrService.warning("Click preview button first !", "Msg");
      return;
    }
    //this.getReportData();
    //this.commonService.downloadCSVFile( this.chartofAccounts, this.pageNavigation);
    var fileName = this.pageNavigation + ".xlsx";
    this.generateExcelPR(this.bodyData, this.tableHeader, fileName);
  }

  public generateExcelPR(objArray: any, header: any, fileName: string) {
    let data = objArray.map((item, index) => {
      return [
        index + 1,
        item.fromSbu,
        item.toSbuName,
        item.prodTrnNo,
        item.prodTrnDate,
        item.skuNumber,
        item.productName,
        item.packSize,
        item.transferQty,
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


  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  public generateReport(buttonAction: any) {
    debugger;
    if (this.bodyData.length == 0) {
      this.toastrService.warning('Please click preview first', 'Msg');
      return;
    }

    this.setParam();
    var fileName = this.pageNavigation + ".pdf";
    //this.getReportData();
    const content = document.getElementById("reportHeader");
    this.generateSalesReport(buttonAction, fileName, content);
  }

  public generateSalesReport(
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
          startY: legend.height + 20,
          styles: { font: "Meta" },
          headStyles: {
            halign: "center",
            valign: "top",
            fontStyle: "bold",
            textColor: 50,
            fontSize: 16,
            fillColor: [255, 255, 255],
          },
          alternateRowStyles: {
            //fillColor: [250, 250, 250],
          },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 130,
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
          },
          columnStyles: {
            // 2: { halign: "center" },
            // 4: { halign: "center" },
            // 5: { halign: "right" },
            // 6: { halign: "right" },
            // 7: { halign: "right" },
            // 8: { halign: "right" },
            8: { halign: "right" },
            9: { halign: "right" },
          },
          alternateRowStyles: {
            //fillColor: [250, 250, 250],
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
}


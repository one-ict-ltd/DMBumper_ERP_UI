import { Component, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { CommonService } from "app/@core/mock/common.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { ProducttransferService } from "app/services/inventory/producttransfer.service";
import { StockinService } from "app/services/inventory/stockin.service";
import { MenuService } from "app/services/menu.service";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import * as ExcelJS from "exceljs/dist/exceljs.min.js";
import * as FileSaver from "file-saver";
const EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";


@Component({
  selector: 'ngx-stocktransferreceive',
  templateUrl: './stocktransferreceive.component.html',
  styleUrls: ['./stocktransferreceive.component.scss']
})
export class StocktransferreceiveComponent implements OnInit {
  public pageNavigation = "Stock Receive Report";
  public tableHeader = ["#", "Received From", "Transfer Date", "Receive No.", "Receive Date", "Product Name", "Pack Size", "Qty.", "Value", "Remarks"];
  public apiUrl = "";
  public htmlBodyData: string = "";
  public bodyData: any = [];
  public bodyDatashow: any = [];
  public params = [];
  public companies = [];
  public sbuList = [];
  public storeList = [];
  public TRNList = [];
  public fromStoreId: number = 0;
  public showbody: boolean = false;
  fromdateSelected = new Date();
  todateSelected = new Date();
  fDate: Date;
  tDate: Date;


  public companyData: any = [];
  public companyId = 1;
  public companyName = "";
  public addressLine = "";
  public officeTelephone = "";
  public companyEmail = "";
  public website = "";

  public workbook: ExcelJS.Workbook;
  public worksheet: any;

  master: {
    storeId: number;
    sbuId: number;
    stockReceiveId: number;
    StoreSelected: {};
    TRNSelected: {};
    SbuSelected: {};
  };

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private menuService: MenuService,
    private stockinService: StockinService,
    private producttransferService: ProducttransferService,
  ) {
    this.getDropdownData();
    this.fDate = new Date(); //(this.commonService.GetAnyMonthAndDateOfYear(12, 1));
    this.tDate = new Date();
    this.getMaster();
    this.getCompanyAddress();
  }

  public getMaster() {
    this.master = {
      storeId: 0,
      sbuId: 0,
      stockReceiveId: 0,
      StoreSelected: null,
      TRNSelected: null,
      SbuSelected: null,
    };
  }


  ngOnInit(): void { }
  public RptButtonAction() {
    const clicked = this.commonService.buttonClicked;
    if (clicked == "preview") {
      this.onPreview();
    } else if (clicked == "pdf") {
      this.generateReport("pdf");
      //this.getMaster();
    } else if (clicked == "print") {
      this.generateReport("print");
      //this.getMaster();
    } else if (clicked == "csv") {
      this.onExportCSV();
    } else if (clicked == "refresh") {
      this.onRefresh();
      this.getMaster();
    } else if (clicked == "email") {
      this.onEmail();
    } else {
      this.toastrService.warning("Message", "please clicked any button");
    }
  }

  public setParam() {
    this.params = [];
    this.params.push({
      leftLabel: "SBU Name:",
      leftValue: this.master.SbuSelected == null ? 'All' : this.master.SbuSelected['name'],
      rightLabel: "",
      rightValue: "",
    });
    // this.params.push({
    //   leftLabel: "From Date.",
    //   leftValue: this.master.SbuSelected == null? 'All' : this.master.SbuSelected['name'],
    //   rightLabel: "Store Name:",
    //   rightValue: this.master.StoreSelected == null? 'All' : this.master.StoreSelected['name'],
    // });


  }

  private getDropdownData() {
    this.comboService.getSBU(0).subscribe((returns: any) => {
      this.sbuList = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
      if (this.sbuList.length == 1) {
        this.master.SbuSelected = { id: this.sbuList[0].id, name: this.sbuList[0].name };
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
    });
  }

  public SRNList = [];
  public getSRNo(storeId) {
    this.SRNList = [];
    this.stockinService.getSRNo(storeId).subscribe((returns: any) => {
      this.SRNList = returns.data.map((val) => ({
        id: val.stockReceiveId,
        name: val.stockReceiveNo,
      }));
    });
  }

  public natureName = "";
  public groupCode = "";
  public groupName = "";
  public fromDate = new Date();
  public toDate = new Date();
  public datalength: number;
  public ttlValue: number;
  public receivefromDate = "";
  public receiveToDate = "";
  private getReportData() {
    //debugger
    this.master.sbuId = this.master.SbuSelected['id'];
    this.receivefromDate = this.commonService.DateFormat(this.fDate, "dd-MMM-yyyy")
    this.receiveToDate = this.commonService.DateFormat(this.tDate, "dd-MMM-yyyy")
    this.ttlValue = 0;
    this.apiUrl = `stock/getStockTransferReceiveReportData?sbuId=${this.master.sbuId}&storeId=${this.master.storeId}&stockReceiveId=${this.master.stockReceiveId}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}`;

    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {

        returns.data.forEach(element => {
          this.ttlValue += element.value ?? 0;
        });
        this.ttlValue = this.commonService.roundWithDecimalPoint(this.ttlValue, 0);

        this.bodyData = [];
        this.bodyData = returns.data;
        this.datalength = returns.data.length * 50;
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }

  public renderHtml(bodyData: any[]) {
    this.htmlBodyData = '';
    // for (let index = 0; index < bodyData.length; index++) {
    //   const element = bodyData[index];
    //   this.htmlBodyData += '<tr> <td rowspan = "' + element.rowMerge + '" ' + element.hidden + '>' + element.prodTrnNo + '</td> <td rowspan = "' + element.rowMerge + '" ' + element.hidden + '>' + element.prodTrnDate + '</td> <td>' + index + 1 + '</td> <td>' + element.productName + '</td> <td>' + element.transferQty + '</td> <td>' + element.uomName + '</td> </tr>'
    // }
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

  private onRefresh() {
    this.bodyData = [];
    this.htmlBodyData = '';
    this.showbody = false;
    this.getMaster();
  }

  private onPreview() {
    if (this.master.sbuId == 0) {
      this.toastrService.warning("Please select a Depot", "Message")
    }
    this.getReportData();
    this.showbody = true;
  }

  private onExportCSV() {
    if (this.bodyData.length == 0) {
      this.toastrService.warning("Click preview button first !", "Msg");
      return;
    }
    //this.getReportData();
    var fileName = this.pageNavigation + ".xlsx";
    //this.commonService.generateExcel(this.bodyData, this.tableHeader, fileName);
    this.generateExcel(this.bodyData, this.tableHeader, fileName);
  }

  public generateExcel(objArray: any, header: any, fileName: string) {
    let data = objArray.map((item, index) => {
      return [
        index + 1,
        item.sbuName,
        item.prodTrnDate,
        item.stockReceiveNo,
        item.stockReceiveDate,
        item.productName,
        item.packSize,
        item.stockReceiveQty,
        item.value,
        item.purpose,
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
    if (this.bodyData.length == 0) {
      this.toastrService.warning("Click preview button first !", "Msg");
      return;
    }
    this.setParam();
    var fileName = this.pageNavigation + ".pdf";
    //this.getReportData();
    const content = document.getElementById("reportHeader");
    //this.commonService.generateReport(buttonAction, fileName, content);
    this.generateReportPrint(buttonAction, fileName, content, this.datalength);
  }

  /////////////////////////////report
  /////////////////////////////report
  public generateReportPrint(
    buttonAction: any,
    fileName: string,
    content: any,
    datalength: number
  ) {
    const doc = new jsPDF("l", "pt", "a4");
    doc.setFontSize(5); //optional
    doc.setTextColor(40); //optional

    var legend = {
      height: 60,
      totalheight: 60 + datalength,
    };
    //debugger;
    const addFooters = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      for (var i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(
          "Page " + String(i) + " of " + String(pageCount),
          doc.internal.pageSize.width / 1.1,
          doc.internal.pageSize.height - 20,
          {}
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
          40,
          doc.internal.pageSize.height - 20
        );
      }
    };

    //////////// TABLE DATA ////////////
    doc.html(content, {
      callback: function (doc) {
        autoTable(doc, {
          html: "#header_table_top",
          startY: legend.height + 40,
          styles: { font: "Meta", fontSize: 15, halign: "center" },
          bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });
        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 80,
          styles: { font: "Meta" },
          bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });
        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 140,
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
            fontSize: 11,
            halign: "center",
            valign: "middle",
            fontStyle: "bold",
          },
          bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
          columnStyles: {
            //3: { halign: "right" },
            // 4: { halign: "right" },
            // 5: { halign: "right" },
            // 6: { halign: "right" },
            7: { halign: "right" },
            8: { halign: "right" },
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });

        autoTable(doc, {
          html: "#footer_table",
          //startY: legend.totalheight + 300,
          theme: "grid",
          // tableLineColor: [0, 0, 0],
          // tableLineWidth: 0.75,
          styles: {
            font: "Meta",
            lineColor: [44, 62, 80],
            lineWidth: 0.55,
          },
          headStyles: {
            fillColor: [105, 105, 105],
            fontSize: 11,
          },
          bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
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




}





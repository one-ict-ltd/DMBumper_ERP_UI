// import { Component, OnInit } from "@angular/core";
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";

import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup } from "@angular/forms";
import {
  NbComponentStatus,
  NbDialogService,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";

import { NavigationStart, Router } from "@angular/router";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { PurchaseorderService } from "app/pages/purchase/settings/purchaseorder.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { ElementRef } from "@angular/core";
import { StockinService } from "app/services/inventory/stockin.service";
//import { NumberWithCommasPipe } from "../../../../@theme/pipes/number-with-commas.pipe";
import { RegionComponent } from "../../../../fieldforcetracking/setting/region/region.component";
import { DatePipe } from "@angular/common";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";
import { ProductService } from "app/services/inventory/product.service";

@Component({
  selector: "ngx-purchase-order-report",
  templateUrl: "./purchase-order-report.component.html",
  styleUrls: ["./purchase-order-report.component.scss"],
})
export class PurchaseOrderReportComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private PurchaseorderService: PurchaseorderService,
    private comboService: CommoncomboService,
    private salesinvoiceService: SalesinvoiceService,
    private datePipe: DatePipe,
    private productService: ProductService
  ) {
    this.supplierId = 0;
    this.purchaseOrderId = 0;
    this.userId = 0;
    this.getDropdownData();
  }
  ngOnInit(): void {
    //this.getProductType();
    //this.getSupplier();
  }

  pageNavigation = "Purchase Order Report";
  rReportHeader = "Purchase Order Summary";
  tableHeader = [
    "#",
    "PO No.",
    "PO Date",
    "Supplier",
    "Product",
    "Quantity",
    "Price",
    "Amount",
    "VAT(%)",
    "VAT Amount",
    "Net Amount",
    "Received Qty.",
  ];

  apiUrl = "";
  bodyData: any = [];
  params = [];

  supplierId: any = 0;
  supplierName: any = "";
  productTypeId: number = 0;
  productTypeName: string = "";
  partySelected: any;
  productTypeSelected: any;
  productSelected: any;
  partyList: any = [];
  productId: number = 0;
  productName: string = "";
  public productSpecList = [];

  reportTypeId: any = 0;
  reportTypeSelected: any;
  reportTypeList: any = [];

  purchaseOrderId: any = 0;
  purOrderNumber: any = "";
  purOrderNoSelected: any;
  purOrderNoList: any = [];

  userName: any = "";
  userId: any = 0;
  userList: any = [];
  userSelected: any;

  sbuId: number = 0;
  sbuList: any = [];
  sbuSelected: any;

  fromDate: Date = new Date();
  toDate: Date = new Date();

  showbody: boolean = false;
  netTotal: number = 0;

  RptButtonAction() {
    const clicked = this.commonService.buttonClicked;
    if (clicked == "preview") {
      this.onPreview();
    } else if (clicked == "pdf") {
      this.generateCrReport(this.supplierId, this.productTypeId, this.productId, this.fromDate, this.toDate, "pdf");
    } else if (clicked == "print") {
      //this.generateSummaryReport("print");
      this.generateCrReport(this.supplierId, this.productTypeId, this.productId, this.fromDate, this.toDate, "pdf");
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
  private onRefresh() {
    this.partySelected = null;
    this.userList = null;
    this.bodyData = [];
    this.showbody = false;
    this.productTypeSelected = null;
    this.productSelected = null;
  }

  private onPreview() {
    this.showbody = true;
    this.getReportData();
  }

  private onExportCSV() {
    this.getReportData();
    //this.commonService.downloadCSVFile( this.chartofAccounts, this.pageNavigation);
    var fileName = this.pageNavigation + ".xlsx";
    this.commonService.generateExcel(this.bodyData, this.tableHeader, fileName);
  }

  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  private getDropdownData() {
    //this.GetReportTypeList();
    //this.GetSbuList(0);
    //this.GetAllPartysByTypeId(0, 0);
    //this.GetPartyWisePO(0, 0);
    //this.GetDateRangeWiseUserName(null, null);
    this.getProductType();
    this.getSupplier();
  }

  GetReportName(param: any) {
    if (this.reportTypeId == 1) this.rReportHeader = "Purchase Order" + param;
    if (this.reportTypeId == 2) this.rReportHeader = "Direct Purchase" + param;
  }

  GetReportTypeList() {
    this.reportTypeList = [];
    this.reportTypeList = [
      { id: 1, name: "Purchase Order" },
      { id: 2, name: "Direct Purchase" },
    ];
  }
  public productTypeList = [];
  public getProductType() {
    this.productService.getProductType().subscribe((retuns: any) => {
      if (retuns.success) {
        this.productTypeList = retuns.data.map((val: any) => ({
          id: val.productTypeId,
          name: val.productTypeName,
        }))
      }
    })
  }
  supplierList = [];
  public getSupplier() {
    //this.master.supplierSelected = null;
    this.supplierList = null;
    this.comboService.GetSupplierForDropdown().subscribe((returns: any) => {
      this.supplierList = returns.data.map((val) => ({
        id: val.partyId,
        name: val.partyName,
      }));
    });
  }
  public prodSelected = [];
  public getTypeWiseProducts(productId, productTypeId) {
    this.productSpecList = [];
    this.productService.getTypeWiseProducts(productId, productTypeId).subscribe((returns: any) => {
      this.productSpecList = returns.data.map((val: any) => ({
        id: val.productWiseSpecificationId,
        name: val.productName,
        uomId: val.uomId,
        uomName: val.uomName,
        productId: val.productId,
        price: val.price,
      }));
    });
  }


  currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

  //#region  Report

  private agReport(event) {
    //this.generateVoucherReport(event.data.purchaseOrderId);
    this.getPOReportDataById(event.data.purchaseOrderId);
  }

  generateSummaryReport(buttonAction: any) {
    //debugger;
    this.GetReportName(" Summary");
    this.setParam();
    var fileName = this.pageNavigation + ".pdf";
    this.getReportData();
    this.netTotal = this.bodyData.reduce(
      (accumulator, current) => accumulator + current.grandTotal,
      0
    );
    this.params[0].rightValue = this.netTotal;
    const content = document.getElementById("reportHeaderSummary");
    this.commonService.generatePurchaeSummaryReport(
      buttonAction,
      fileName,
      content
    );
  }
  generateCrReport(supplierId: number, productTypeId: number, productId: number, fromDate: Date, toDate: Date, reportFormat: any) {
    debugger
    let apiUrl = `PurchaseRequisition/PurchaseOrderCrReport?supplierId=${supplierId}&productTypeId=${productTypeId}&productId=${productId}&fromDate=${this.datePipe.transform(
      this.fromDate,
      "yyyy-MM-dd"
    )}&toDate=${this.datePipe.transform(
      this.toDate,
      "yyyy-MM-dd"
    )}&reportFormat=${reportFormat}`;
    //console.log(this.apiUrl);
    this.commonService.GetCrystalReportData(apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }

  public setParam() {
    this.params = [];
    this.params.push({
      leftLabel: "Branch Name",
      leftValue: this.sbuSelected == undefined ? "All" : this.sbuSelected.name,
      rightLabel: "Report Type",
      rightValue:
        this.reportTypeSelected == undefined
          ? "All"
          : this.reportTypeSelected.name,
    });
    this.params.push({
      leftLabel: "From Date",
      leftValue: this.datePipe.transform(this.fromDate, "yyyy-MM-dd"),
      rightLabel: "To Date",
      rightValue: this.datePipe.transform(this.toDate, "yyyy-MM-dd"),
    });
  }
  private getReportData() {
    this.apiUrl = `PurchaseOrder/GetPurchaseOrdersReport?supplierId=${this.supplierId
      }&productTypeId=${this.productTypeId}&productId=${this.productId}&fromDate=${this.datePipe.transform(
        this.fromDate,
        "yyyy-MM-dd"
      )}&toDate=${this.datePipe.transform(this.toDate, "yyyy-MM-dd")}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        debugger;
        this.bodyData = [];
        this.bodyData = returns.data;
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }

  public subTotal = 0;
  public discount = 0;
  public vat = 0;
  public tax = 0;
  public grandTotal = 0;
  public grandTotalInWord = "";
  public grossAmount = 0;
  public totalVat = 0;
  public totalAit = 0;
  public totalDiscount = 0;
  public freightCharge = 0;
  public netAmount = 0;
  public netAmountInWord = "";

  public LcNo = "";
  public RefNo = "";
  public paymentMode = "";

  //public bodyData: any = [];
  public master: {
    supplierId: number;
    supplier: string;
    productTypeId: number;
    productType: string;
    productWiseSpecificationId: number;
    startDate: Date;
    endDate: Date
  }

  public masterData: any = [];
  public detailsData: any = [];
  public termsAndconditionData: any = [];
  public productList: any = [];

  public datalength: number;
  public purOrderNo = "";
  public purchaseOrderDate = "";
  public partyName = "";
  public price = "";
  //public params = [];
  public test =
    " 1. Material should be delivered in good condition & within the schedule";

  private getPOReportDataById(purchaseOrderId) {
    this.PurchaseorderService.getPurchaseOrder(purchaseOrderId, 0).subscribe(
      (returns: any) => {
        if (returns.success) {
          this.masterData = returns.data;
          debugger;
          //this.datalength = returns.data.length * 50;
          this.purOrderNo = this.masterData[0].purOrderNo;

          this.purchaseOrderDate = this.masterData[0].purchaseOrderDate;
          this.grandTotal = this.masterData[0].TotalAmount;
          this.grandTotalInWord = this.masterData[0].TotalAmountInWord;
          this.grossAmount = this.masterData[0].grossAmount;
          this.totalVat = this.masterData[0].totalVat;
          this.totalAit = this.masterData[0].totalAit;
          this.totalDiscount = this.masterData[0].totalDiscount;
          this.freightCharge = this.masterData[0].freightCharge;
          this.netAmount = this.masterData[0].netAmount;
          this.netAmountInWord = this.masterData[0].netAmountInWord;
          this.LcNo = this.masterData[0].lcNo;
          this.RefNo = this.masterData[0].refNo;
          this.paymentMode = this.masterData[0].transactionTypeName;
        } else {
          this.toastrService.danger("Message", this.commonService.nodatafound);
        }
      }
    );

    this.PurchaseorderService.getTermsAndConditionPOIdWiseInUpdate(
      purchaseOrderId
    ).subscribe((returns: any) => {
      if (returns.success) {
        this.termsAndconditionData = returns.data;
        //this.datalength = returns.data.length * 50;
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });

    this.PurchaseorderService.getPurchaseOrderDetailsData(
      purchaseOrderId
    ).subscribe((returns: any) => {
      this.GetReportName("");
      if (returns.success) {
        this.detailsData = returns.data;
        this.datalength = returns.data.length * 50;
        var fileName = this.rReportHeader + ".pdf";
        const content = document.getElementById("reportHeader");
        //console.log("reportHeader");
        //console.log(content);
        this.generateReport("print", fileName, content, this.datalength);
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }

  public generateReport(
    buttonAction: any,
    fileName: string,
    content: any,
    datalength: number
  ) {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(5);
    doc.setTextColor(40);

    var legend = {
      height: 100,
      totalheight: 100 + datalength,
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
          html: "#header_table",
          theme: "grid",
          startY: legend.height + 20,
          //styles: { font: "Meta" },

          columnStyles: {
            2: { halign: "center", valign: "middle", fontSize: 12 },
          },
          // styles:{
          //   valign: "middle"
          // },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 350,
          theme: "grid",
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.75,
          styles: {
            //font: "arial",
            lineColor: [44, 62, 80],
            lineWidth: 0.55,
          },
          headStyles: {
            fillColor: [105, 105, 105],
            fontSize: 11,
          },
          bodyStyles: {
            //fillColor: [216, 216, 216],
            textColor: 50,
            //vertical-align: middle,1
            // halign:"right"
          },
          columnStyles: {
            2: { halign: "right" },
            0: { halign: "center" },
            4: { halign: "right" },
            5: { halign: "right" },
          },
          alternateRowStyles: {
            fillColor: [250, 250, 250],
          },
        });

        addFooters(doc);

        ////////////PRINT ////////////
        if (buttonAction == "pdf") {
          doc.save(fileName);
        } else {
          doc.setProperties({
            title: fileName,
          });
          window.open(URL.createObjectURL(doc.output("blob")), "_blank"); //doc.output("dataurlnewwindow");
          doc.close();
        }
      },
    });
  }

  //#endregion
}

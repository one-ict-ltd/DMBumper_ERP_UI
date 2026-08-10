import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { CommonService } from 'app/@core/mock/common.service';
import { CommoncomboService } from 'app/services/commoncombo.service';
import { MenuService } from 'app/services/menu.service';
import { StockinService } from "app/services/inventory/stockin.service";
import { StockinwithoutpoService } from "app/services/inventory/Stockinwithoutpo.service";
import { ProductService } from 'app/services/inventory/product.service';

import * as ExcelJS from "exceljs/dist/exceljs.min.js";
import * as FileSaver from "file-saver";
const EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

@Component({
  selector: 'ngx-currentstock',
  templateUrl: './currentstock.component.html',
  styleUrls: ['./currentstock.component.scss']
})
export class CurrentstockComponent implements OnInit {

  public pageNavigation = "Current Stock";
  public tableHeader = ["#", "Store Name", "Product Name", "Product Specification", "Current Stock"];
  public apiUrl = "";
  public bodyData: any = [];
  public bodyDatashow: any = [];
  public params = [];
  public companies = [];
  public companyId: number = 0;
  public hide: boolean = false;
  public showbody: boolean = false;
  disabled: boolean = false;
  public company: { name: string; address: string; custom_footer: boolean; phone: string; fax: string; email: string; website: string; vat: string; tin: string; };

  workbook: ExcelJS.Workbook;
  worksheet: any;

  master: {
    stockMasterId: number;
    poReceiveId: number;
    companyId: number;
    sbuId: number;
    storeId: number;
    stockNo: string;
    stockDate: Date;
    stockTypeId: string;
    remarks: string;
    productTypeId: number;
    productTypeSelected: {};
    productId: number;
    productWiseSpecificationId: number;
    CurrentStock: number;
    stockQty: number;
    isStoreWiseGroup: boolean;
    companySelected: {};
    supplierSelected: {};
    branchSelected: {};
    storeSelected: {};
    POReceiveSelected: {};
    prodReqSelected: {};
    productSelected: {};
    productspecificationSelected: {};
    stockDetailsList: any[];
  };

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private menuService: MenuService,
    private StockinwithoutpoService: StockinwithoutpoService,
    private StockinService: StockinService,
    private productService: ProductService
  ) {
    this.getCompany();
    this.getAllProduct();
    this.getMaster();
    this.getProductType();
  }

  ngOnInit(): void { }
  public RptButtonAction() {
    const clicked = this.commonService.buttonClicked;
    if (clicked == "preview") {
      this.onPreview();
    } else if (clicked == "pdf") {
      // this.generateReport("pdf");
      this.generateCrReport("pdf");
    } else if (clicked == "print") {
      // this.generateReport("print");
      this.generateCrReport("pdf");
    } else if (clicked == "csv") {
      this.onExportCSV();
      // this.generateCrReport("Excel");
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
      leftLabel: "Depot Name",
      leftValue: this.master.branchSelected == null ? 'All' : this.master.branchSelected['name'],
      rightLabel: "Report Date",
      rightValue: this.commonService.DateFormat(new Date()),
    })
    this.params.push({
      leftLabel: "Product Type",
      leftValue: this.master.productTypeSelected == null ? 'All' : this.master.productTypeSelected['name'],
      rightLabel: "Product Name",
      rightValue: this.master.productSelected == null ? 'All' : this.master.productSelected['name'],
    });

  }

  generateCrReport(reportFormat: any) {
    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();

    // this.apiUrl = `${this.apiUrl}FieldForceTrackingReport/GetDCRSummaryReport?ZoneId=${this.master.ZoneId}&RegionId=${this.master.RegionId}&AreaId=${this.master.AreaId}&TerritoryID=${this.master.TerritoryID}&fromDate=${this.commonService.DateFormat(this.master.fromDate)}&toDate=${this.commonService.DateFormat(this.master.toDate)}&reportFormat=${reportFormat}&reportId=${this.master.reportId}`;
    this.apiUrl = `InventoryReport/GetCurrentStockReport?reportFormat=${reportFormat}&productId=${this.master.productId}&productWiseSpecificationId=${this.master.productWiseSpecificationId}&companyId=${this.master.companyId}&sbuId=${this.master.sbuId}&storeId=${this.master.storeId}&isStoreWiseGroup=${this.master.isStoreWiseGroup}&productTypeId=${this.master.productTypeId}`;

    this.commonService
      .GetCrystalReportData(this.apiUrl)
      .subscribe((returns: any) => {
        let res = JSON.parse(returns);
        if (res.status) {
          this.commonService.GenerateBase64ToReport(res.data[0].data);
        } else {
          this.toastrService.warning("Message", this.commonService.nodatafound);
        }
      });
  }

  public index = 0;
  ttlStockValue = 0;
  // public data:[];
  private getReportData() {
    this.ttlStockValue = 0;

    this.bodyData = [];
    if (this.master.isStoreWiseGroup == true) {
      this.hide = false;
      //this.tableHeader = ["#", "Store Name", "Product Name", "Product Specification", "Pack Size", "Batch No.", "Mfg Date", "Exp. Date", "Current Stock"];
      this.tableHeader = ["#", "Code", "Product Name", "Pack Size", "Batch No.", "Mfg. Date", "Exp. Date", "Current Stock", "Value"];
    }
    else {
      this.hide = true;
      //this.tableHeader = ["#", "Product Name", "Product Specification", "Pack Size", "Batch No.", "Mfg Date", "Exp. Date", "Current Stock"];
      this.tableHeader = ["#", "Code", "Product Name", "Pack Size", "Batch No.", "Mfg. Date", "Exp. Date", "Current Stock", "Value"];
    }


    this.apiUrl = `stock/getCurrentStockReport?productId=${this.master.productId}&productWiseSpecificationId=${this.master.productWiseSpecificationId}&companyId=${this.master.companyId}&sbuId=${this.master.sbuId}&storeId=${this.master.storeId}&isStoreWiseGroup=${this.master.isStoreWiseGroup}&productTypeId=${this.master.productTypeId}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {

        //this.data= returns.data;
        //debugger;
        returns.data.forEach(element => {
          this.ttlStockValue += element.ttlValue ?? 0;
        });

        //this.ttlStockValue = this.commonService.roundWithDecimalPoint(this.ttlStockValue);

        const storeSeen = {};
        const productSeen = {};
        const productspecSeen = {};

        if (this.master.isStoreWiseGroup == true) {
          this.bodyData = returns.data.sort((a, b) => {
            const storeSeen = a.storeName.localeCompare(b.storeName);
            return storeSeen ? storeSeen : a.Name.localeCompare(b.Name);
          }).map(x => {
            const storeSpan = storeSeen[x.storeName] ? 0 :
              returns.data.filter(y => y.storeName === x.storeName).length;

            storeSeen[x.storeName] = true;

            const productSpan = productSeen[x.storeName] && productSeen[x.storeName][x.Name] ? 0 :
              returns.data.filter(y => y.storeName === x.storeName && y.Name === x.Name).length;

            productSeen[x.storeName] = productSeen[x.storeName] || {};
            productSeen[x.storeName][x.Name] = true;

            return { ...x, storeSpan, productSpan };
          });
        }
        else {
          this.bodyData = returns.data.sort((a, b) => {
            const productSeen = a.Name.localeCompare(b.Name);
            return productSeen ? productSeen : a.Name.localeCompare(b.Name);
          }).map(x => {
            const productSpan = productSeen[x.Name] ? 0 :
              returns.data.filter(y => y.Name === x.Name).length;

            productSeen[x.Name] = true;

            // const productSpan = productSeen[x.storeName] && productSeen[x.storeName][x.Name] ? 0 :
            // returns.data.filter(y => y.storeName === x.storeName && y.Name === x.Name).length;

            // productSeen[x.storeName] = productSeen[x.storeName] || {};
            // productSeen[x.storeName][x.Name] = true;

            return { ...x, productSpan };
          });

        }
        console.log(this.bodyData);

      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }

  formatDecimalPoint(value: number): number {
    let res = this.commonService.roundWithDecimalPoint(value);
    return res
  }

  private onRefresh() {
    this.companyId = 0;
    this.bodyData = [];
    this.showbody = false;
  }
  private onPreview() {
    this.getReportData();
    this.showbody = true;
  }
  private onExportCSV() {

    if (this.bodyData.length == 0) {
      this.toastrService.info('No data found! Click to preview button first.', 'Info')
      return;
    }
    //this.getReportData();

    var fileName = this.pageNavigation + ".xlsx";
    let data = this.bodyData.map((item, index) => {
      return [index + 1, item.productCode, item.productName, item.packSize, item.batchNo, item.mfgDate, item.expDate, item.CurrentStock, item.ttlValue];
    });

    this.commonService.GetExcel(data, this.tableHeader, fileName);
  }
  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  public generateReport(buttonAction: any) {
    if (this.bodyData.length == 0) {
      this.toastrService.info('No data found! Click to preview button first.', 'Info')
      return;
    }
    this.setParam();
    var fileName = this.pageNavigation + ".pdf";
    //this.getReportData();
    const content = document.getElementById("reportHeader");
    this.commonService.generateCurrentStockReport(buttonAction, fileName, content);
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

  public getTypeWiseProducts(productId, productTypeId) {
    debugger
    if (productTypeId && productTypeId > 0) {

      this.productService.getTypeWiseProducts(productId, productTypeId).subscribe((returns: any) => {
        this.ProductList = returns.data.map((val: any) => ({
          id: val.productWiseSpecificationId,
          name: val.productName,
          uomId: val.uomId,
          uomName: val.uomName,
          productId: val.productId,
          prodSpecification: val.prodSpecification,
        }));
      });

    } else {
      this.ProductList = []
    }

  }

  public ProductList = [];
  public getAllProduct() {
    this.StockinwithoutpoService.getAllProduct().subscribe((returns: any) => {
      this.ProductList = returns.data.map((val) => ({
        id: val.productId,
        name: val.productName,
      }));
    });
  }

  public getMaster() {
    this.master = {
      stockMasterId: 0,
      poReceiveId: 0,
      companyId: 0,
      sbuId: 0,
      storeId: 0,
      productId: 0,
      stockNo: '',
      CurrentStock: 0,
      stockQty: 0,
      isStoreWiseGroup: false,
      stockDate: new Date(),
      stockTypeId: "",
      remarks: "",
      productTypeId: null,
      productTypeSelected: null,
      companySelected: null,
      supplierSelected: null,
      storeSelected: null,
      branchSelected: null,
      POReceiveSelected: null,
      prodReqSelected: null,
      productWiseSpecificationId: null,
      productSelected: null,
      productspecificationSelected: null,
      stockDetailsList: [],
    };
  }

  public ProductSpecificationList = [];
  public getAllProductSpecification(productId) {
    this.master.productspecificationSelected = {};
    this.StockinwithoutpoService.getAllProductSpecification(productId).subscribe((returns: any) => {
      this.ProductSpecificationList = returns.data.map((val) => ({
        id: val.productWiseSpecificationId,
        name: val.productName,
      }));
    });
  }

  public companyList = [];
  public getCompany() {
    this.comboService.getCompany().subscribe((returns: any) => {
      this.companyList = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
      this.master.companyId = returns.data[0].companyId ?? 0;
      this.master.companySelected = {
        id: returns.data[0].companyId,
        name: returns.data[0].companyName,
      }
      this.getSBU(this.master.companyId);
    });
  }
  public sbus = [];
  public getSBU(companyId) {
    this.master.branchSelected = {};
    this.comboService.getSBU(companyId).subscribe((returns: any) => {
      this.sbus = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
      this.master.sbuId = returns.data[0].sbuId ?? 0;
      this.master.branchSelected = {
        id: returns.data[0].sbuId,
        name: returns.data[0].sbuName,
      }
      this.getStore(this.master.sbuId);
    });
  }

  public StoreList = [];
  public getStore(sbuId) {
    this.master.storeSelected = {};
    this.StockinService.getStore(sbuId, this.master.companyId).subscribe((returns: any) => {
      this.StoreList = returns.data.map((val) => ({
        id: val.storeId,
        name: val.storeName,
      }));
      this.master.storeId = returns.data[0].storeId ?? 0;
      this.master.storeSelected = {
        id: returns.data[0].storeId,
        name: returns.data[0].storeName,
      }
    });
  }


  public GetExcel(objArray: any, header: any, fileName: string) {
    let data = objArray.map((item, index) => {
      return [index + 1, item.productCode, item.productName, item.packSize, item.batchNo, item.mfgDate, item.expDate, item.CurrentStock, item.ttlValue];
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
    let headerName = this.worksheet.addRow([this.company.name]);
    headerName.font = { size: 16, underline: "double", bold: true };
    headerName.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    this.worksheet.mergeCells(
      `A${headerName.number}:${endColumn + headerName.number}`
    );

    let headerAddress = this.worksheet.addRow([this.company.address]);
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
      this.company.phone + "; " + this.company.fax,
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
      this.company.email + "; " + this.company.website,
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

}


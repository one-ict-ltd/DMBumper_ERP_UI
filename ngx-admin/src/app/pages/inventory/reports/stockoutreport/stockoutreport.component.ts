import { Component, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";
import { RptCoaService } from "../../../../services/accounting/reports/rpt-coa.service";
import { MenuService } from "../../../../services/menu.service";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { StockinService } from "app/services/inventory/stockin.service";
import { StockinwithoutpoService } from "app/services/inventory/Stockinwithoutpo.service";
import { FiscalyearService } from "app/services/budget/fiscalyear.service";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

@Component({
  selector: 'ngx-stockoutreport',
  templateUrl: './stockoutreport.component.html',
  styleUrls: ['./stockoutreport.component.scss']
})
export class StockoutreportComponent implements OnInit {
  public pageNavigation = "Stock Out Stock";
  public tableHeader = ["#", "Store Name", "Product Name", "Product Specification", "Current Stock"];
  public apiUrl = "";
  public bodyData: any = [];
  public bodyDatashow: any = [];
  public params = [];
  public companies = [];
  public companyId: number = 0;

  public showbody: boolean = false;
  //public ddlSelected: any;
  disabled: boolean = false;
  public company: { name: string; address: string; custom_footer: boolean; phone: string; fax: string; email: string; website: string; vat: string; tin: string; };
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
    private StockinService: StockinService
  ) {
    this.getCompany();
    this.getAllProduct();
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

  public setParam() {
    this.params = [];
    this.params.push({
      leftLabel: "Company Name",
      leftValue: this.master.companySelected == null ? 'All' : this.master.companySelected['name'],
      rightLabel: "Branch Name",
      rightValue: this.master.branchSelected == null ? 'All' : this.master.branchSelected['name'],
    })
    this.params.push({
      leftLabel: "Store Name",
      leftValue: this.master.storeSelected == null ? 'All' : this.master.storeSelected['name'],
      rightLabel: "Product Name",
      rightValue: this.master.productSelected == null ? 'All' : this.master.productSelected['name'],
    });
  }

  public index = 0;
  private getReportData() {
    this.bodyData = [];
    this.apiUrl = `stock/getStockOutReport?productId=${this.master.productId}&productWiseSpecificationId=${this.master.productWiseSpecificationId}&companyId=${this.master.companyId}&sbuId=${this.master.sbuId}&storeId=${this.master.storeId}&isStoreWiseGroup=${this.master.isStoreWiseGroup}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.bodyData = returns.data;
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
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
    this.getReportData();
    var fileName = this.pageNavigation + ".xlsx";
    this.commonService.generateExcel(this.bodyData, this.tableHeader, fileName);
  }
  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  public generateReport(buttonAction: any) {
    this.setParam();
    var fileName = this.pageNavigation + ".pdf";
    this.getReportData();
    const content = document.getElementById("reportHeader");
    this.commonService.generateReport(buttonAction, fileName, content);
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
    });
  }


}



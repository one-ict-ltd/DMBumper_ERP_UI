import { Component, OnInit } from "@angular/core";
import { NbToastrService, NbDatepickerModule } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "app/@core/mock/common.service";
import { DomSanitizer } from "@angular/platform-browser";
import { ProductService } from "app/services/inventory/product.service";
import { PurchaseorderService } from "app/pages/purchase/settings/purchaseorder.service";
import { FormGroup } from "@angular/forms";
import { DatePipe } from "@angular/common";
@Component({
  selector: 'ngx-grn-report-list',
  templateUrl: './grn-report-list.component.html',
  styleUrls: ['./grn-report-list.component.scss']
})

export class GrnReportListComponent implements OnInit {

  fromdateSelected = new Date();
  todateSelected = new Date();
  reportTypeSelected: any = {};
  vlucherForm: FormGroup;

  pageNavigation = "GRN List Report";

  apiUrl = "";
  bodyData: any = [];
  bodyDataCollection: any = [];
  bodyDataPayment: any = [];
  params = [];


  companyId: number = 0;

  showbody: boolean = false;

  fDate: Date;
  tDate: Date;

  showDateRange: boolean = false;


  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,

    private productService: ProductService,
    private sanitizer: DomSanitizer,
    private PurchaseorderService: PurchaseorderService,
    private datePipe: DatePipe
  ) {



  }

  ngOnInit(): void { }
  public RptButtonAction() {
    const clicked = this.commonService.buttonClicked;
    if (clicked == "preview") {
      this.onPreview();
    } else if (clicked == "pdf") {
      this.generateCrReport("pdf");
    } else if (clicked == "print") {
      this.generateCrReport("pdf");
    } else if (clicked == "csv") {
      this.generateCrReport("Excel");
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

  }
  generateCrReport(reportFormat: any) {
debugger;
    let purchaseTypeId = (this.purchaseTypeSelected == undefined ||this.purchaseTypeSelected['id'] == undefined || null) ? 0 : this.purchaseTypeSelected['id'];
    if (purchaseTypeId == 0) {
      this.toastrService.warning("Please select Purchase Type", "Message");
      return;
    }

    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();
    if (purchaseTypeId == 1) {
      let purchaseOrderId = !this.purchaseOrderSelected || (this.purchaseOrderSelected['id'] == undefined || null) ? 0 : this.purchaseOrderSelected['id'];
      let supplierChallanNo = !this.supplierChallanNoSelected || (this.supplierChallanNoSelected['id'] == undefined || null) ? "" : this.supplierChallanNoSelected['id'];
      this.apiUrl = `PurchaseRequisition/GetGRNByPOId?reportFormat=pdf&masterId=${purchaseOrderId}&supplierChallanNo=${supplierChallanNo}`;
    }
    else {
      let lCNoId = !this.lCNoSelected || (this.lCNoSelected['id'] == undefined || null) ? 0 : this.lCNoSelected['id'];
      this.apiUrl = `PurchaseRequisition/GetGRNImportByLCId?reportFormat=${reportFormat}&masterId=${lCNoId}`;
    }

    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        this.toastrService.warning(res.message, "Message");
      }
    });
  }

  base64Pdf: any;
  private GetPreviewData() {
    debugger
    let userInfo = this.commonService.GetUserProfileJson();
   
    let purchaseTypeId = (this.purchaseTypeSelected == undefined ||this.purchaseTypeSelected['id'] == undefined || null) ? 0 : this.purchaseTypeSelected['id'];
    if (purchaseTypeId == 0) {
      this.toastrService.warning("Please select Purchase Type", "Message");
      return;
    }

    if (purchaseTypeId == 1) {
      let purchaseOrderId = !this.purchaseOrderSelected || (this.purchaseOrderSelected['id'] == undefined || null) ? 0 : this.purchaseOrderSelected['id'];
      let supplierChallanNo = !this.supplierChallanNoSelected || (this.supplierChallanNoSelected['id'] == undefined || null) ? "" : this.supplierChallanNoSelected['id'];
      this.apiUrl = `PurchaseRequisition/GetGRNByPOId?reportFormat=pdf&masterId=${purchaseOrderId}&supplierChallanNo=${supplierChallanNo}`;
    }
    else {
      let lCNoId = !this.lCNoSelected || (this.lCNoSelected['id'] == undefined || null) ? 0 : this.lCNoSelected['id'];
      this.apiUrl = `PurchaseRequisition/GetGRNImportByLCId?reportFormat=pdf&masterId=${lCNoId}`;
    }

    debugger;
    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.base64Pdf = this.sanitizer.bypassSecurityTrustResourceUrl(res.data[0].data);

      }
      else {
        console.log(res.message);
        this.toastrService.warning(res.message, "Message");
      }
    });
  }

  public onCheckboxChange(e) {
    if (e.target.checked) {
      this.showDateRange = true;
    } else {
      this.showDateRange = false;
    }
  }

  purchaseTypeSelected: {};

  public quotationTypeList = [
    { id: 1, name: "Local" },
    { id: 2, name: "Import" }
  ];

  getPOListbyPurchaseType(event: any) {
    debugger
    if (event) {
      debugger
      this.purchaseOrderSelected = null;
      this.lCNoSelected = null;
      if (event.id == 1) {

        this.getAllPurchaseOrdersForGRN();

      } else {
        this.getAllLcNo();
      }
      this.getGRNsupplierChallanNo();
    }

  }
  purchaseOrderSelected: {};
  purchaseOrderList = [];
  public getAllPurchaseOrdersForGRN() {
    this.purchaseOrderSelected = null;
    this.purchaseOrderList = null;
    //debugger
    this.PurchaseorderService.getPurchaseOrdersForGRN(0).subscribe((returns: any) => {
      if (returns.success) {

        this.purchaseOrderList = returns.data.map((val) => ({
          id: val.purchaseOrderId,
          name: val.purOrderNo,
          purchaseOrderDate: val.purchaseOrderDate,
          supplierId: val.supplierId,
          supplierName: val.supplierName,

        }));
      }
    });
  }


  lCNoSelected: {};
  lcNoList = []
  public getAllLcNo() {
    this.lCNoSelected = null;
    this.lcNoList = null;
    debugger
    this.PurchaseorderService.getLcNo().subscribe((returns: any) => {
      if (returns.success) {
        //debugger;
        this.lcNoList = returns.data.map((val) => ({
          id: val.ImpPreLCInfoMasterId,
          name: val.LCNo + ' | ' + val.LCOpenDate + ' | ' + val.partyName + ' | ' + val.countryName,
          LCOpenDate: val.LCOpenDate,
          ImpLCInfoMasterId: val.ImpLCInfoMasterId,
          partyId: val.partyId,
          partyName: val.partyName,
          countryName: val.countryName,
        }));
      }
    });
  }

  supplierChallanNoSelected: {};
  supplierChallanNoList = [];
  public getGRNsupplierChallanNo() {
    this.supplierChallanNoSelected = null;
    this.supplierChallanNoList = null;
    //debugger
    this.PurchaseorderService.getGRNsupplierChallanNo(0).subscribe((returns: any) => {
      if (returns.success) {

        this.supplierChallanNoList = returns.data.map((val) => ({
          id: val.supplierChallanNo,
          name: val.supplierChallanNo,
        }));
      }
    });
  }

  private onRefresh() {

    window.location.reload();
  }

  private onPreview() {

    this.GetPreviewData();
    this.showbody = true;
  }


  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  currencyFormatter(currency) {
    return this.commonService.roundWithDecimalPoint(currency, 0);
  }
}
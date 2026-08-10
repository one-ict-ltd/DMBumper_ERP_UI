import { Component, OnInit } from "@angular/core";
import { NbToastrService, NbDatepickerModule } from "@nebular/theme";
import { CommonService } from "../../../../@core/mock/common.service";
import { DomSanitizer } from "@angular/platform-browser";

import { ProductService } from "app/services/inventory/product.service";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";

@Component({
  selector: 'ngx-productwise-rmpm-stock-report',
  templateUrl: './productwise-rmpm-stock-report.component.html',
  styleUrls: ['./productwise-rmpm-stock-report.component.scss']
})

export class ProductwiseRMPMStockReportComponent implements OnInit {


  pageNavigation = "Product Wise RM/PM Stock";

  fDate: Date;
  tDate: Date;
  showDateRange: boolean = false;
  apiUrl = "";

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private productrequisitionService: ProductrequisitionService,
    private productService: ProductService,
    private sanitizer: DomSanitizer
  ) {
    this.fDate = new Date();//(this.commonService.GetFirstDateOfMonth(new Date()));
    this.tDate = new Date();//(this.commonService.GetLastDateOfMonth(new Date()));
    this.getAllDropdown();

  }

  ngOnInit(): void { }

  public getAllDropdown() {
    //this.GetAllFinishGoods();
    this.loadTypeList();
  }

  typeList: any = [];
  materialsTypeSelected: {}
  loadTypeList() {
    this.typeList = [
      {
        id: 5,
        name: "Raw Materials (RM)",
      },
      {
        id: 6,
        name: "Packing Materials(PM)",
      }
    ];
  }
  public getType(id) {
    debugger
    // if (id == 5) {
    //   this.getBomDetailsProductSpec(5)
    // }
    // if (id == 6) {
    //   this.getBomDetailsProductSpec(6)
    // }
    this.getBomDetailsProductSpec(id);
  }

  public getBomDetailsProductSpec(id) {
    this.productrequisitionService
      .getAllProductForBOM(id)
      .subscribe((returns: any) => {
        this.productSpecList = returns.data.map((val: any) => ({
          id: val.productWiseSpecificationId,
          name: val.productName,
          uomId: val.uomId,
          uomName: val.uomName,
          productId: val.productId,
          price: val.price,
          imageUrl: val.imageUrl,
          isRound: val.isRound
        }));
      });
  }
  productSpecList = [];
  productSelected = {};
  // public GetAllFinishGoods() {
  //   this.productService.GetAllFinishGoods().subscribe((returns: any) => {
  //     this.productSpecList = returns.data.map((val: any) => ({
  //       id: val.productWiseSpecificationId,
  //       name: val.Name + ' ' + val.packSize + '-' + val.skuNumber,//,val.productName,
  //     }));
  //   });
  // }

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

  generateCrReport(reportFormat: any) {

    // if (this.reportType == undefined || this.reportType == null || this.reportType == '') {
    //   this.toastrService.warning('Please Select Report Type', 'Warning');
    //   return false;
    // }


    let productSpecId = (this.productSelected['id'] == undefined || null) ? 0 : this.productSelected['id'];

    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();
    this.apiUrl = `ProductionReport/GetRMPMStockReportbyDate?reportFormat=${reportFormat}&userId=${userInfo[0].employeeid}&productWiseSpecificationId=${productSpecId}&productType=${this.materialsTypeSelected['id']}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}`;


    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        this.toastrService.warning(this.commonService.procesFailed, "Message");
      }
    });
  }

  private onPreview() {
    this.GetPreviewData();
  }
  base64Pdf: any;
  private GetPreviewData() {

    let userInfo = this.commonService.GetUserProfileJson();
    let productSpecId = (this.productSelected['id'] == undefined || null) ? 0 : this.productSelected['id'];

    this.apiUrl = `ProductionReport/GetRMPMStockReportbyDate?reportFormat=Pdf&userId=${userInfo[0].employeeid}&productWiseSpecificationId=${productSpecId}&productType=${this.materialsTypeSelected['id']}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}`;

    debugger;
    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      //console.log(res);
      if (res.status) {
        this.base64Pdf = this.sanitizer.bypassSecurityTrustResourceUrl(res.data[0].data);
        //this.commonService.GenerateBase64ToReport(returns);
      }
      else {
        console.log(res.message);
        this.toastrService.warning(this.commonService.procesFailed, "Message");
      }
    });
  }

  private onRefresh() {
    window.location.reload();
  }

  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  currencyFormatter(currency) {
    return this.commonService.roundWithDecimalPoint(currency, 0);
  }


}
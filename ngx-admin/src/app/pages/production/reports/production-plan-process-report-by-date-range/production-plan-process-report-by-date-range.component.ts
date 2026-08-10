import { Component, OnInit } from "@angular/core";
import { NbToastrService, NbDatepickerModule } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ProductService } from "app/services/inventory/product.service";

@Component({
  selector: 'ngx-production-plan-process-report-by-date-range',
  templateUrl: './production-plan-process-report-by-date-range.component.html',
  styleUrls: ['./production-plan-process-report-by-date-range.component.scss']
})
export class ProductionPlanProcessReportByDateRangeComponent implements OnInit {


  fromdateSelected = new Date();
  todateSelected = new Date();
  reportTypeSelected: any = {};


  pageNavigation = "Production Process Report";

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
    private sanitizer: DomSanitizer
  ) {
    this.fDate = new Date(this.commonService.GetFirstDateOfMonth(new Date())); //(this.commonService.GetAnyMonthAndDateOfYear(12, 1));
    this.tDate = new Date(this.commonService.GetLastDateOfMonth(new Date()));
    this.GetAllFinishGoods();
    this.batchNo = "";
    this.productSelected = null;
  }
  batchNo: string = '';
  productSpecList = [];
  productSelected: any = {};
  public GetAllFinishGoods() {
    this.productService.GetAllFinishGoods().subscribe((returns: any) => {
      this.productSpecList = returns.data.map((val: any) => ({
        id: val.productWiseSpecificationId,
        //name: val.Name + ' ' + val.packSize + '-' + val.skuNumber,//,val.productName,
        name: val.productName,
      }));
    });
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

  generateCrReport(reportFormat: any) {


    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();
    let productWiseSpecificationId = 0;
    if (this.productSelected != undefined || this.productSelected != null) {
      productWiseSpecificationId = this.productSelected['id'] == 'undefined' ? 0 : this.productSelected['id'];
    }

    this.apiUrl = `ProductionReport/GetProductionProcessReport?reportFormat=${reportFormat}&userId=${userInfo[0].employeeid}&productionPlanId=0&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&productWiseSpecificationId=${productWiseSpecificationId}&batchNo=${this.batchNo}`;

    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
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

  }


  public onCheckboxChange(e) {
    if (e.target.checked) {
      this.showDateRange = true;
    } else {
      this.showDateRange = false;
    }
  }








  base64Pdf: SafeResourceUrl;
  private GetPreviewData() {

    let userInfo = this.commonService.GetUserProfileJson();
    let productWiseSpecificationId = 0;
    if (this.productSelected != undefined || this.productSelected != null) {
      productWiseSpecificationId = this.productSelected['id'];
    }

    this.apiUrl = `ProductionReport/GetProductionProcessReport?reportFormat=Pdf&userId=${userInfo[0].employeeid}&productionPlanId=0&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&productWiseSpecificationId=${productWiseSpecificationId}&batchNo=${this.batchNo}`;

    debugger;
    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);

      if (res.status) {
        this.base64Pdf = this.sanitizer.bypassSecurityTrustResourceUrl(res.data[0].data);
      }
      else {
        console.log(res.message);
        this.toastrService.warning("Message", this.commonService.nodatafound);
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


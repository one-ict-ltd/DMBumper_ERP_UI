import { Component, OnInit } from "@angular/core";
// import { FormControl } from "@angular/forms";
import { NbToastrService, NbDatepickerModule } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";

// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { FieldforcemasterService } from "app/services/fieldforcetracking/fieldforcemaster.service";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";

@Component({
  selector: 'ngx-national-product-sales-report',
  templateUrl: './national-product-sales-report.component.html',
  styleUrls: ['./national-product-sales-report.component.scss']
})
export class NationalProductSalesReportComponent implements OnInit {



  //date = new Date().getFullYear();
  fromdateSelected = new Date();
  todateSelected = new Date();
  territorySelected: any = {};
  territoryList: any[]
  territoryCode: any = "";
  depotCode: any = "";
  partyId: any = "0";
  // yearName = this.date;
  // prevYearName = this.date - 1;

  pageNavigation = "National Product Sales Report";

  // tableHeader = [
  //   "Date",
  //   this.yearName + " (Tk.)",
  //   "Previous Year (Tk.)",
  // ];

  apiUrl = "";
  bodyData: any = [];
  bodyDataCollection: any = [];
  bodyDataPayment: any = [];
  params = [];

  parties = [];
  branchs = [];
  companyId: number = 0;

  showbody: boolean = false;
  partySelected: any;
  branchSelected: any;

  TotalReceived = 0;
  TotalPayment = 0;
  fDate: Date;
  tDate: Date;

  showDateRange: boolean = false;

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private salesinvoiceService: SalesinvoiceService,
  ) {
    this.fDate = new Date(); //(this.commonService.GetAnyMonthAndDateOfYear(12, 1));
    this.tDate = new Date();
    this.getAllDropdown();
  }

  ngOnInit(): void { }
  public RptButtonAction() {
    const clicked = this.commonService.buttonClicked;
    if (clicked == "preview") {
      this.onPreview();
    } else if (clicked == "pdf") {
      //this.generateReport("pdf");
      this.generateCrReport("pdf");
    } else if (clicked == "print") {
      this.generateCrReport("pdf");
    } else if (clicked == "csv") {
      //this.onExportCSV();
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
    debugger;
    const fromDate = this.fDate;
    const toDate = this.tDate;
    if (this.commonService.validateDates(fromDate, toDate)) {
      this.apiUrl = "";
      let userInfo = this.commonService.GetUserProfileJson();

      this.apiUrl = `SalesInvoiceReport/GetNationalProductSalesReport?reportFormat=${reportFormat}&userId=${userInfo[0].employeeid}&depoCode=${this.depotCode}&territoryCode=${this.territoryCode}&partyId=${this.partyId}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}`;

      //console.log(this.apiUrl);
      this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
        let res = JSON.parse(returns);
        if (res.status) {
          this.commonService.GenerateBase64ToReport(res.data[0].data);
        } else {
          this.toastrService.warning("Message", this.commonService.nodatafound);
        }
      });
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
  }

  public setParam() {
    this.params = [];
    this.params.push({
      leftLabel: "Customer Name",
      leftValue: this.partySelected.name,
    });
  }


  public onCheckboxChange(e) {
    if (e.target.checked) {
      this.showDateRange = true;
    } else {
      this.showDateRange = false;
    }
  }

  public getAllDropdown() {
    debugger;
    this.GetAllDepo();
    //this.GetAllPartysByTypeId(0);
  }

  depotList: any[];
  depotSelected = {};
  public GetAllDepo() {
    this.depotSelected = {};

    this.apiUrl = "";
    this.apiUrl = `SalesInvoice/GetAllDepot`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.depotList = returns.data.map((val: any) => ({
          id: val.depotCode,
          name: val.depotName,
        }));

        //if (this.depotList.length > 0) {
        if (this.depotList.length == 1) {
          this.depotSelected = { id: this.depotList[0].id, name: this.depotList[0].name };
          this.depotCode = this.depotList[0].id;
          this.getAllTerritory(this.depotCode);
        }
        //}
      }
    })
  }

  getAllTerritory(depotCode: any = '') {
    this.territoryList = [];
    this.territoryCode = '';
    this.territorySelected = {};
    this.salesinvoiceService.GetAllTerritoryForDepot(depotCode).subscribe((returns: any) => {
      if (returns.success) {
        this.territoryList = returns.data.map((val: any) => ({
          id: val.TerritoryCode,
          name: val.TerritoryName,
        }));
      }
    });
  }

  GetPartyByTerritoryCode(territoryCode: any) {
    this.partyId = 0;
    this.partyList = [];
    this.partySelected = null;

    this.salesinvoiceService
      .GetPartyByTerritoryCode(territoryCode, this.depotCode)
      .subscribe((returns: any) => {
        this.parties = returns.data.map((val: any) => ({
          id: val.partyId,
          name: val.partyName,
          address: val.address,
          mobileNo: val.mobileNo,
          territoryDetails: val.territoryDetails,
        }));
      });
  }

  public partyList = [];
  public GetAllPartysByTypeId(partyTypeId: any) {
    this.comboService
      .GetAllPartysByTypeId(partyTypeId)
      .subscribe((returns: any) => {
        this.parties = returns.data.map((val: any) => ({
          id: val.partyId,
          name: val.partyName,
          address: val.address,
          mobileNo: val.mobileNo,
          territoryDetails: val.territoryDetails,
        }));
      });
  }

  salesCtnQty = 0.00;
  salesPcsQty = 0.00;
  ttlSalesAmonut = 0.00;
  bonusCtnQty = 0.00;
  bonusPcsQty = 0.00;
  ttlBonusAmonut = 0.00;

  salesReturnsCtnQty = 0.00;
  salesReturnsPcsQty = 0.00;
  ttlSalesReturnAmonut = 0.00;

  bonusReturnsCtnQty = 0.00;
  bonusReturnsPcsQty = 0.00;
  ttlBonusReturnAmonut = 0.00;

  netSalesCtnQty = 0.00;
  netSalesPcsQty = 0.00;
  ttlNetSalesAmonut = 0.00;



  private getPreviewData() {
    debugger;
    this.bodyData = [];
    this.bodyDataCollection = [];

    this.salesCtnQty = 0.00;
    this.salesPcsQty = 0.00;
    this.ttlSalesAmonut = 0.00;
    this.bonusCtnQty = 0.00;
    this.bonusPcsQty = 0.00;
    this.ttlBonusAmonut = 0.00;

    this.salesReturnsCtnQty = 0.00;
    this.salesReturnsPcsQty = 0.00;
    this.ttlSalesReturnAmonut = 0.00;

    this.bonusReturnsCtnQty = 0.00;
    this.bonusReturnsPcsQty = 0.00;
    this.ttlBonusReturnAmonut = 0.00;

    this.netSalesCtnQty = 0.00;
    this.netSalesPcsQty = 0.00;
    this.ttlNetSalesAmonut = 0.00;



    this.apiUrl = "";
    this.apiUrl = `SalesInvoice/GetNationalProductSalesReport?fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&depoCode=${this.depotCode}&territoryCode=${this.territoryCode}&partyId=${this.partyId}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.bodyData = returns.data;
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }


      this.bodyData.forEach(a => {

        this.salesCtnQty += parseFloat(a.salesCtnQty);
        this.salesPcsQty += parseFloat(a.salesPcsQty);
        this.ttlSalesAmonut += parseFloat(a.ttlSalesAmonut);

        this.bonusCtnQty += parseFloat(a.bonusCtnQty);
        this.bonusPcsQty += parseFloat(a.bonusPcsQty);
        this.ttlBonusAmonut += parseFloat(a.ttlBonusAmonut);

        this.salesReturnsCtnQty += parseFloat(a.salesReturnsCtnQty);
        this.salesReturnsPcsQty += parseFloat(a.salesReturnsPcsQty);
        this.ttlSalesReturnAmonut += parseFloat(a.ttlSalesReturnAmonut);

        this.bonusReturnsCtnQty += parseFloat(a.bonusReturnsCtnQty);
        this.bonusReturnsPcsQty += parseFloat(a.bonusReturnsPcsQty);
        this.ttlBonusReturnAmonut += parseFloat(a.ttlBonusReturnAmonut);

        this.netSalesCtnQty += parseFloat(a.netSalesCtnQty);
        this.netSalesPcsQty += parseFloat(a.netSalesPcsQty);
        this.ttlNetSalesAmonut += parseFloat(a.ttlNetSalesAmonut);

      });
    });
  }

  totalInvoice = 0;

  private onRefresh() {
    // this.partySelected = null;
    // //this.branchSelected = null;
    // this.fromdateSelected = new Date();
    // this.todateSelected = new Date();
    // //this.companyId = 0;
    // this.bodyData = [];
    // //this.bodyDataCollection = [];
    // //this.bodyDataPayment = [];
    // this.showbody = false;
    window.location.reload();
  }

  private onPreview() {
    const fromDate = this.fDate;
    const toDate = this.tDate;
    if (this.commonService.validateDates(fromDate, toDate)) {
      this.getPreviewData();
      this.showbody = true;
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
  }

  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  currencyFormatter(currency) {
    return this.commonService.roundWithDecimalPoint(currency, 0);
  }
}
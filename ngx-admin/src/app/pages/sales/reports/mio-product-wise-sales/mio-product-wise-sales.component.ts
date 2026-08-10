import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { CommonService } from 'app/@core/mock/common.service';
import { ProductrequisitionService } from 'app/pages/purchase/settings/productrequisition.service';
import { CommoncomboService } from 'app/services/commoncombo.service';
import { SalesinvoiceService } from 'app/services/sales/salesinvoice.service';

@Component({
  selector: 'ngx-mio-product-wise-sales',
  templateUrl: './mio-product-wise-sales.component.html',
  styleUrls: ['./mio-product-wise-sales.component.scss']
})
export class MioProductWiseSalesComponent implements OnInit {

  //date = new Date().getFullYear();
  fromdateSelected = new Date();
  todateSelected = new Date();
  territorySelected: any = {};
  territoryList: any[]
  territoryCode: any = "";
  depotCode: any = "";

  pageNavigation = "MIO Product Wise Sales Report";


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
  depotList: any[];
  depotSelected = {};
  totalInvoice = 0;
  isSummary: boolean = true;

  showDateRange: boolean = false;
  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private salesinvoiceService: SalesinvoiceService,
    private productrequisitionService: ProductrequisitionService,
  ) {
    this.fDate = new Date();
    this.tDate = new Date();
  }

  ngOnInit(): void {
    this.getAllDropdown();
  }

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
    const fromDate = this.fDate;
    const toDate = this.tDate;
    if (this.commonService.validateDates(fromDate, toDate)) {
      this.apiUrl = "";
      let userInfo = this.commonService.GetUserProfileJson();

      debugger

      this.apiUrl = `SalesInvoiceReport/GetMioProductSalesReport?reportFormat=${reportFormat}&userId=${userInfo[0].employeeid}&depoCode=${this.depotCode}&territoryCode=${this.territoryCode}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&zoneCode=${this.zoneCode}&regionCode=${this.regionCode}&areaCode=${this.areaCode}&partyId=${this.partyId}&productWiseSpecificationId=${this.productWiseSpecificationId}&isSummary=${this.isSummary}`;

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
    this.GetAllZone();
    this.GetAllDepo();
    this.getAllProduct();
  }

  productWiseSpecificationId: number = 0;
  productSpecList: any[] = [];
  productSelected: {} = {};
  public getAllProduct() {
    this.productSpecList = [];
    this.productWiseSpecificationId = 0;
    this.productSelected = {};

    this.productrequisitionService
      .getAllProductForRequisition()
      .subscribe((returns: any) => {
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
  zoneCode = "";
  zoneList: any[];
  zoneSelected = {};
  public GetAllZone() {
    this.zoneSelected = {};

    this.apiUrl = "";
    this.apiUrl = `SalesInvoice/GetZone`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.zoneList = returns.data.map((val: any) => ({
          id: val.ZoneCode,
          name: val.ZoneName,
        }));

        //if (this.zoneList.length > 0) {
        if (this.zoneList.length == 1) {
          this.zoneSelected = { id: this.zoneList[0].id, name: this.zoneList[0].name };
          this.zoneCode = this.zoneList[0].id;
          this.GetAllRegion(this.zoneCode);
        }
        //}
      }
    })
  }

  regionList: any = [];
  regionCode: any = "";
  regionSelected: any = {};
  GetAllRegion(zoneCode: any = '') {
    this.regionList = [];
    this.regionCode = "";
    this.regionSelected = {};
    this.apiUrl = "";
    this.apiUrl = `SalesInvoice/GetRegion?zoneCode=${zoneCode}`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.regionList = returns.data.map((val: any) => ({
          id: val.RegionCode,
          name: val.RegionName,
        }));
      }
    });
  }
  areaList: any = [];
  areaCode = '';
  areaSelected: any = {};
  getAllArea(regionCode: string = '') {
    this.areaList = [];
    this.areaSelected = {};
    this.apiUrl = "";
    this.apiUrl = `SalesInvoice/GetArea?regionCode=${regionCode}`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.areaList = returns.data.map((val: any) => ({
          id: val.AreaCode,
          name: val.AreaName,
        }));
      }
    });
  }

  getAllTerritoryByArea(areaCode: string = '') {
    this.territoryList = [];
    this.territorySelected = {};
    this.apiUrl = "";
    this.apiUrl = `SalesInvoice/GetTerritory?areaCode=${areaCode}`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.territoryList = returns.data.map((val: any) => ({
          id: val.TerritoryCode,
          name: val.TerritoryName
        }));
      }
    });
  }


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

  partyList = [];
  partyId = 0;
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
  checkAll(e) {
    debugger
    let isChecked: boolean = false;
    isChecked = e.target.checked;

    if (isChecked) {
      this.isSummary = true;
    }
    else this.isSummary = false;
  }


  salesQty = 0.00;
  salesTpValue = 0.00;
  salesVat = 0.00;
  ttlSalesAmonut = 0.00;

  bonusQty = 0.00;
  bonusTpValue = 0.00;
  bonusVat = 0.00;
  ttlBonusAmonut = 0.00;

  netBonusQty = 0.00;
  netBonusTpValue = 0.00;
  netBonusVat = 0.00;
  ttlNetBonusAmonut = 0.00;

  salesReturnsQty = 0.00;
  salesReturnsVat = 0.00;
  salesReturnsTpValue = 0.00;
  ttlSalesReturnAmonut = 0.00;

  netSalesQty = 0.00;
  netSalesTpValue = 0.00;
  netTP = 0.00;
  netSalesVat = 0.00;
  ttlNetSalesAmonut = 0.00;



  private getPreviewData() {
    this.bodyData = [];
    this.bodyDataCollection = [];

    this.salesQty = 0.00;
    this.salesTpValue = 0.00;
    this.salesTpValue = 0.00;
    this.ttlSalesAmonut = 0.00;

    this.bonusQty = 0.00;
    this.bonusTpValue = 0.00;
    this.bonusVat = 0.00;
    this.ttlBonusAmonut = 0.00;

    this.salesReturnsQty = 0.00;
    this.salesReturnsTpValue = 0.00;
    this.salesReturnsVat = 0.00;
    this.ttlSalesReturnAmonut = 0.00;


    this.netSalesQty = 0.00;
    this.netSalesTpValue = 0.00;
    this.netTP = 0.00;
    this.netSalesVat = 0.00;
    this.ttlNetSalesAmonut = 0.00;


    debugger
    this.apiUrl = "";
    this.apiUrl = `SalesInvoice/GetMioProductSalesReport?depotCode=${this.depotCode}&territoryCode=${this.territoryCode}&fromDate=${this.commonService.DateFormat(this.fDate)}&toDate=${this.commonService.DateFormat(this.tDate)}&zoneCode=${this.zoneCode}&regionCode=${this.regionCode}&areaCode=${this.areaCode}&partyId=${this.partyId}&productWiseSpecificationId=${this.productWiseSpecificationId}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.bodyData = returns.data;
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }


      this.bodyData.forEach(a => {

        this.salesQty += parseFloat(a.salesQty);
        this.salesTpValue += parseFloat(a.salesTpValue);
        this.salesVat += parseFloat(a.salesVat);
        this.ttlSalesAmonut += parseFloat(a.ttlSalesAmonut);

        this.bonusQty += parseFloat(a.bonusQty);
        this.bonusTpValue += parseFloat(a.bonusTpValue);
        this.bonusVat += parseFloat(a.bonusVat);
        this.ttlBonusAmonut += parseFloat(a.ttlBonusAmonut);

        this.salesReturnsQty += parseFloat(a.salesReturnsCtnQty);
        this.salesReturnsTpValue += parseFloat(a.salesReturnsTpValue);
        this.salesReturnsVat += parseFloat(a.salesReturnsVat);
        this.ttlSalesReturnAmonut += parseFloat(a.ttlSalesReturnAmonut);

        this.netSalesQty += parseFloat(a.netSalesQty);
        this.netSalesTpValue += parseFloat(a.netSalesTpValue);
        this.netTP += parseFloat(a.netTP);
        this.netSalesVat += parseFloat(a.netSalesVat);
        this.ttlNetSalesAmonut += parseFloat(a.ttlNetSalesAmonut);

      });
    });
  }


  private onRefresh() {
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

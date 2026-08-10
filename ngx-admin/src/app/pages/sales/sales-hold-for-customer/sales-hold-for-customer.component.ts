import { Component, OnInit } from "@angular/core";
// import { FormControl } from "@angular/forms";
import { NbToastrService, NbDatepickerModule } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "app/@core/mock/common.service";

// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { FieldforcemasterService } from "app/services/fieldforcetracking/fieldforcemaster.service";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";
import { PartyService } from "app/services/party.service";

@Component({
  selector: 'ngx-sales-hold-for-customer',
  templateUrl: './sales-hold-for-customer.component.html',
  styleUrls: ['./sales-hold-for-customer.component.scss']
})

export class SalesHoldForCustomerComponent implements OnInit {

  //date = new Date().getFullYear();
  fromdateSelected = new Date();
  todateSelected = new Date();
  territorySelected: any = {};
  territoryList: any[]
  territoryCode: any = "";
  depotCode: any = "";

  // yearName = this.date;
  // prevYearName = this.date - 1;

  pageNavigation = "Sales Hold For Customer Report";

  // tableHeader = [
  //   "Date",
  //   this.yearName + " (Tk.)",
  //   "Previous Year (Tk.)",
  // ];

  apiUrl = "";
  //bodyData: any = [];
  //bodyDataCollection: any = [];
  // bodyDataPayment: any = [];
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
    private partyService: PartyService,
  ) {
    this.commonService.valueSet("create");
    this.fDate = new Date(); //(this.commonService.GetAnyMonthAndDateOfYear(12, 1));
    this.tDate = new Date();
    this.getAllDropdown();
    this.getMaster();
  }
  public getMaster() {
    this.master = {

      lstAccPartyViewModel: [],
    };
  }
  master: {

    lstAccPartyViewModel: any[];
  };

  ngOnInit(): void { }

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      //this.GetPurchaseRequisitionListForApproval();
      //this.getMaster();
      //this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      //this.GetPurchaseRequisitionListForApproval();
      //this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      this.save();
      //this.commonService.valueSet("create");
    } else if (this.commonService.buttonClicked == "update") {
      //this.save();
      //this.commonService.valueSet("create");
    } else if (this.commonService.buttonClicked == "view") {
      //this.show = false;
    } else if (this.commonService.buttonClicked == "reset") {
      //this.GetPurchaseRequisitionListForApproval();
      //this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      //this.show = false;
    }
  }
  private save() {
    var button = this.commonService.buttonClicked;

    this.partyService
      .SaveSalesHoldForCustomer(this.master)
      .subscribe((returns: any) => {
        if (returns.success) {
          if (button == "update") {
            this.toastrService.success(
              this.commonService.updatedmsg,
              "Message"
            );
          } else {
            this.toastrService.success(
              this.commonService.successmsg,
              "Message"
            );
          }

          this.getMaster();
        }
      });

  }
  generateCrReport(reportFormat: any) {
    debugger;

    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();
    //console.log("userInfo[0].employeeid", userInfo[0].employeeid);
    this.apiUrl = `SalesInvoiceReport/PartyReport?reportFormat=${reportFormat}&userId=${userInfo[0].employeeid}&depotCode=${this.depotCode}&territoryCode=${this.territoryCode}&partyId=0`;

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

        if (returns.data.length == 1) {
          this.depotSelected = { id: returns.data[0].depotCode, name: returns.data[0].depotName };
          this.depotCode = returns.data[0].depotCode;
          this.getAllTerritory(this.depotCode);
        }
        //}
      }
    })
  }

  getAllTerritory(depotCode: any = '') {
    this.territoryList = [];
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

  totalInvoiceAmt = 0.00;
  totalReturnAmt = 0.00;
  totalNetSalesAmt = 0.00;

  totalCollection = 0.00;
  totalDiscount = 0.00;
  totalOthers = 0.00;
  totalGrossRet = 0.00;

  totalDues = 0.00;
  totalNetCollectionAmt = 0.00;
  ttlIncentiveAmount = 0.00;
  totalBalance = 0.00;

  openingBalance = 0.00;
  closingBalance = 0.00;
  ttlOpeningBalance = 0.00;
  totalclosingBalance = 0.00;
  partyId = 0;

  private getReportData() {
    debugger;
    this.master.lstAccPartyViewModel = [];
    //this.bodyDataCollection = [];


    this.totalNetSalesAmt = 0.00;

    this.totalDiscount = 0.00;


    this.apiUrl = "";
    this.apiUrl = `Party/AccSpGetPartyByDepotTerritoyJson?depoCode=${this.depotCode}&territoryCode=${this.territoryCode}&partyId=0`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.master.lstAccPartyViewModel = returns.data;
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }

  totalInvoice = 0;

  private onRefresh() {

    window.location.reload();
  }

  public onPreview() {
    this.getReportData();
    this.showbody = true;
  }

  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  currencyFormatter(currency) {
    return this.commonService.roundWithDecimalPoint(currency, 0);
  }
}
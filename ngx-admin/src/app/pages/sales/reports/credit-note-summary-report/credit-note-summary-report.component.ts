import { Component, OnInit } from "@angular/core";
// import { FormControl } from "@angular/forms";
import { NbToastrService, NbDatepickerModule } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";
import { SalesreturnService } from "app/services/sales/salesreturn.service";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";

@Component({
  selector: 'ngx-credit-note-summary-report',
  templateUrl: './credit-note-summary-report.component.html',
  styleUrls: ['./credit-note-summary-report.component.scss']
})
export class CreditNoteSummaryReportComponent implements OnInit {


  //date = new Date().getFullYear();
  fromdateSelected = new Date();
  todateSelected = new Date();
  territorySelected: any = {};
  territoryList: any[]
  territoryCode: any = "";
  depotCode: any = "";

  // yearName = this.date;
  // prevYearName = this.date - 1;

  pageNavigation = "Credit Note Summary Report";

  // tableHeader = [
  //   "Date",
  //   this.yearName + " (Tk.)",
  //   "Previous Year (Tk.)",
  // ];

  apiUrl = "";
  bodyData: any = [];
  bodyDetailsData: any = [];
  bodyDataCollection: any = [];
  bodyDataPayment: any = [];
  params = [];

  parties = [];
  branchs = [];
  companyId: number = 0;

  showbody: boolean = false;
  partySelected: any = {};
  branchSelected: any = {};

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
    private salesreturnService: SalesreturnService,
  ) {
    this.fDate = new Date(); //(this.commonService.GetAnyMonthAndDateOfYear(12, 1));
    this.tDate = new Date();
    this.depotSelected = null;
    this.territorySelected = null;
    this.partySelected = null;
    this.getAllDropdown();
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
    debugger;
    const fromDate = this.fDate;
    const toDate = this.tDate;
    if (this.commonService.validateDates(fromDate, toDate)) {

      this.apiUrl = "";
      let userInfo = this.commonService.GetUserProfileJson();


      let depotCode = this.depotSelected == (undefined || null) ? '' : this.depotSelected["id"];
      let territoryCode = this.territorySelected == (undefined || null) ? '' : this.territorySelected["id"];
      let partyId = this.partySelected == (undefined || null) ? '0' : this.partySelected["id"];

      //console.log("userInfo[0].employeeid", userInfo[0].employeeid);


      this.apiUrl = `SalesInvoiceReport/GetCreditNoteSummaryReport?reportFormat=${reportFormat}&userId=${userInfo[0].employeeid}&masterId=${0}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&depotCode=${depotCode}&territoryCode=${territoryCode}&partyId=${partyId}`;

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
  depotSelected: any = {};
  public GetAllDepo() {
    this.depotSelected = null;

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
    this.territorySelected = null;
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

  totalInvoiceAmt = 0.00;
  totalReturnAmt = 0.00;
  //totalReturnAmt = 0.00;

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
    this.bodyData = [];
    this.totalReturnAmt = 0.00;

    let depotCode = this.depotSelected == (undefined || null) ? '' : this.depotSelected["id"];
    let territoryCode = this.territorySelected == (undefined || null) ? '' : this.territorySelected["id"];
    let partyId = this.partySelected == (undefined || null) ? '0' : this.partySelected["id"];
    territoryCode = (territoryCode === undefined) ? "" : territoryCode;

    this.apiUrl = "";
    this.apiUrl = `SalesReturn/GetCreditNoteReport?masterId=${0}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&depotCode=${depotCode}&territoryCode=${territoryCode}&partyId=${partyId}`;
    debugger;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {

        this.bodyData = returns.data;
        this.bodyData.forEach(a => {
          this.totalReturnAmt += parseFloat(a.amount ?? 0);
        });
        this.totalReturnAmt = this.commonService.roundWithDecimalPoint(this.totalReturnAmt, 0);
        // alert(this.totalReturnAmt);
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }

  master: {} = {};
  lstInvoiceDetails: any[] = [];
  lstDetailsViewModel: any[] = [];
  ttlCollectionAmount: number = 0;
  NetTotalPrice: number = 0;



  public expireReturnNumber = "";
  public returnDate = "";
  public salesInvoiceNo = "";
  public territory = "";
  public mioName = "";
  public partyName = "";
  public productName = "";
  public rgrandTotal: number = 0;
  public retQty: number = 0;
  public datalength: number;

  public getCreditNoteReportData(data: any) {

    this.expireReturnNumber = data['expireReturnNumber'];
    this.returnDate = data['returnDate'];
    this.salesInvoiceNo = data['salesInvoiceNo'];
    this.territory = data['territory'];
    this.mioName = data['mioName'];
    this.partyName = data['partyName'];

    this.bodyDetailsData = data.lstDetailsViewModel;

    this.datalength = data.lstDetailsViewModel.length;
    this.rgrandTotal = 0;
    this.bodyDetailsData.forEach(element => {
      this.rgrandTotal = this.rgrandTotal + element.amount;
    });
    var fileName = this.pageNavigation + ".pdf";
    const content = document.getElementById("reportHeader");
    this.generateReportPdf("print", fileName, content, this.datalength);
    // } else {
    //   this.toastrService.danger("Message", this.cs.nodatafound);
    // }
  }

  totalInvoice = 0;
  private onRefresh() {
    window.location.reload();
  }

  private onPreview() {
    const fromDate = this.fDate;
    const toDate = this.tDate;
    if (this.commonService.validateDates(fromDate, toDate)) {

      this.getReportData();
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

  public generateReportPdf(
    buttonAction: any,
    fileName: string,
    content: any,
    datalength: number
  ) {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(5);
    doc.setTextColor(40);
    const legend = {
      height: 100,
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
          startY: legend.height + 20,
          styles: { font: "Meta" },
          headStyles: {
            halign: "center",
            valign: "top",
            fontStyle: "bold",
            textColor: [0, 0, 0],
            fontSize: 20,
            fillColor: [255, 255, 255],
          },
          bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            valign: "middle",
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 150,
          theme: "grid",
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.75,
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
            textColor: [0, 0, 0],
            valign: "middle",
          },
          columnStyles: {
            2: { halign: "right" },
            4: { halign: "right" },
            5: { halign: "right" },

          },
          // alternateRowStyles: {
          //   fillColor: [250, 250, 250],
          // },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });

        autoTable(doc, {
          html: "#table_signature",
          startY: legend.height + 300,
          styles: { font: "Meta", fontSize: 11, halign: "center" },
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


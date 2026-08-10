import { Component, OnInit } from "@angular/core";
import { NbToastrService, NbDatepickerModule } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";
import { RptCoaService } from "../../../../services/accounting/reports/rpt-coa.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

@Component({
  selector: "ngx-rpt-visapurchase",
  templateUrl: "./rpt-visapurchase.component.html",
  styleUrls: ["./rpt-visapurchase.component.scss"],
})
export class RptVisapurchaseComponent implements OnInit {
  public reportTypeName = "VISA PURCHASE";
  public company: {
    name: string;
    address: string;
    custom_footer: boolean;
    phone: string;
    fax: string;
    email: string;
    website: string;
    vat: string;
    tin: string;
  };

  public pageNavigation = "VISA PURCHASE REPORT";
  public tableHeader = [
    "#",
    "Company Name",
    "Trade Name",
    "Work Order No",
    "Issue Date",
    "Purchase Quantity",
    "Amount",
  ];

  public apiUrl = "";
  public bodyData: any = [];
  public params = [];

  public toDateSelected = new Date();
  public fromDateSelected = new Date();

  public reportId: number = 0;
  public companyId: number = 0;
  public tradeId: number = 0;
  public totalAmount: number = 0;

  public reportNamesItems = [];
  public companyItems = [];
  public tradeItems = [];

  public ddlReportNameSelected: any;
  public ddlCompanySelected: any;
  public ddlTradeSelected: any;

  showTrade: boolean = false;
  showCompany: boolean = false;

  public showbody: boolean = false;

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private rptCoaService: RptCoaService
  ) {
    this.getReportList();
    this.getCompanyData();
    this.getTradeData();

    // this.company = {
    //   name: "Dahmashi Group",
    //   address: "Block H, Plot 33/A Road-12, Dhaka 1213",
    //   custom_footer: true,
    //   phone: "02-55042777",
    //   fax: "02-55042777",
    //   email: "info@dahmashigroup.com",
    //   website: "https://www.dahmashigroup.com/",
    //   vat: "",
    //   tin: "",
    // };
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
      leftValue: "",
      rightLabel: "Branch Name",
      rightValue: "",
    });
  }

  private getReportList() {
    this.comboService
      .getReportByUserPermission(this.reportTypeName)
      .subscribe((returns: any) => {
        this.reportNamesItems = returns.data.map((val) => ({
          id: val.reportId,
          name: val.reportName,
        }));
      });
  }

  private getCompanyData() {
    this.comboService.getVisaCompany().subscribe((returns: any) => {
      this.companyItems = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
    });
  }

  private getTradeData() {
    this.comboService.getVisaTrade().subscribe((returns: any) => {
      //debugger
      this.tradeItems = returns.data.map((val) => ({
        id: val.tradeId,
        name: val.trade,
      }));
    });
  }

  public showHideDdl() {
    //this.ddlReportNameSelected = null;
    if (this.ddlReportNameSelected.name == "Purchase Register") {
      this.showTrade = false;
      this.showCompany = false;
    } else if (this.ddlReportNameSelected.name == "Trade Wise Purchase") {
      this.showTrade = true;
      this.showCompany = false;
    } else if (this.ddlReportNameSelected.name == "Company Wise Purchase") {
      this.showCompany = true;
      this.showTrade = false;
    } else {
      this.showTrade = false;
      this.showCompany = false;
      //this.partyId = 0;
    }
  }

  private getReportData() {
    //debugger;
    var companyId = 0;
    var tradeId = 0;
    this.totalAmount = 0;

    if (this.ddlCompanySelected != null) {
      companyId = this.ddlCompanySelected["id"];
    }

    if (this.ddlTradeSelected != null) {
      tradeId = this.ddlTradeSelected["id"];
    }

    this.apiUrl = `Dahmashi/getRptVisaPurchaseByDate?tradeId=${tradeId}&companyId=${companyId}&fromDate=${this.fromDateSelected
      .toString()
      .substring(3, 15)}&toDate=${this.toDateSelected
        .toString()
        .substring(3, 15)}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.bodyData = returns.data;
        this.bodyData.forEach(a => this.totalAmount += a.purchaseAmount);
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }
  private onRefresh() {
    this.ddlCompanySelected = null;
    this.ddlReportNameSelected = null;
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
    //this.commonService.downloadCSVFile( this.chartofAccounts, this.pageNavigation);
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
    this.generatePdfLedgerBook(buttonAction, fileName, content);
  }

  currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

  public generatePdfLedgerBook(
    buttonAction: any,
    fileName: string,
    content: any
  ) {
    const doc = new jsPDF("l", "pt", "a4");
    doc.setFontSize(5); //optional
    doc.setTextColor(40); //optional

    var legend = {
      height: 100,
      //totalheight:100+datalength,
    };
    //debugger;

    const addFooters = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      //var a = doc.internal.setFont("helvetica", "italic");
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
    // legend.totalheight=legend.height+this.datalength;
    doc.html(content, {
      callback: function (doc) {
        autoTable(doc, {
          html: "#header_table_top",
          startY: legend.height + 20,
          styles: { font: "Meta", fontSize: 15, halign: "center" },
        });

        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 40,
          styles: { font: "Meta" },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 70,
          theme: "grid",
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.75,
          styles: {
            font: "Meta",
            lineColor: [44, 62, 80],
            lineWidth: 0.55,
          },
          headStyles: {
            fillColor: [105, 105, 105],
            fontSize: 11,
            halign: "center",
          },
          bodyStyles: {
            fillColor: [216, 216, 216],
            textColor: 50,
            // halign:"right"
          },
          columnStyles: {
            5: { halign: "center" },
            6: { halign: "right" },
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

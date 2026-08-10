import { Component, OnInit } from "@angular/core";
import { NbToastrService, NbDatepickerModule } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";
import { RptCoaService } from "../../../../services/accounting/reports/rpt-coa.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

@Component({
  selector: "ngx-rpt-visastock",
  templateUrl: "./rpt-visastock.component.html",
  styleUrls: ["./rpt-visastock.component.scss"],
})
export class RptVisastockComponent implements OnInit {
  public reportTypeName = "VISA STOCK";
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

  public pageNavigation = "Visa Stock";
  public tableHeader = [
    "Work Order No",
    "Group Title",
    "Agency",
    "Company",
    "Status",
    "Visa Quantity",
    "Visa Amount",
    "Sales Quantity",
    "Sales Amount",
    "COGS",
    "Balance Quantity",
    "Balance Amount",
  ];

  public apiUrl = "";
  public bodyData: any = [];
  public params = [];

  public reportNamesItems = [];
  public workOrderItems = [];
  public agencyItems = [];

  public visaWorkOrderId: number = 0;
  public totalsalesAmount: number = 0;
  public totalpurchaseRate: number = 0;
  public totalbalAmount: number = 0;

  public showbody: boolean = false;

  public ddlWrkOrderSelected: any;
  public ddlReportNameSelected: any;
  public agencySelected: any;

  showAgency: boolean = false;
  showWorkOrder: boolean = false;

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private rptCoaService: RptCoaService
  ) {
    this.getWorkorderData();
    this.getReportList();
    //this.getVisaParties();
    this.getVisaAgency();
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

  private getWorkorderData() {
    this.comboService.getVisaWorkOrder().subscribe((returns: any) => {
      this.workOrderItems = returns.data.map((val) => ({
        id: val.visaWorkOrderId,
        name: val.workOrderNo,
      }));
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

  // private getVisaParties() {
  //   this.comboService.getVisaParty().subscribe((returns: any) => {
  //     //debugger
  //     this.parties = returns.data.map((val) => ({
  //       id: val.visaPartyId,
  //       name: val.partyName,
  //     }));
  //   });
  // }

  private getVisaAgency() {
    this.comboService.getVisaAgency().subscribe((returns: any) => {
      //debugger
      this.agencyItems = returns.data.map((val) => ({
        id: val.licenseId,
        name: val.license,
      }));
    });
  }

  public showHideDdl() {
    //this.ddlReportNameSelected = null;
    if (this.ddlReportNameSelected.name == "Agency Wise Stock Report") {
      this.showAgency = true;
      this.showWorkOrder = false;
    } else if (this.ddlReportNameSelected.name == "Work Order Status") {
      this.showWorkOrder = true;
      this.showAgency = false;
    } else {
      this.showAgency = false;
      this.showWorkOrder = false;
    }
  }

  private getReportData() {
    //debugger;
    var workId = 0;
    var agencyId = 0;
    this.totalsalesAmount = 0;
    this.totalpurchaseRate = 0;
    this.totalbalAmount = 0;

    if (this.ddlWrkOrderSelected != null) {
      workId = this.ddlWrkOrderSelected["id"];
    }

    if (this.agencySelected != null) {
      agencyId = this.agencySelected["id"];
    }

    this.apiUrl = `Dahmashi/getRptVisaStock?visaWorkOrderId=${workId}&agencyId=${agencyId}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.bodyData = returns.data;
        this.bodyData.forEach(a => this.totalsalesAmount += a.salesAmount);
        this.bodyData.forEach(a => this.totalpurchaseRate += a.purchaseRate);
        this.bodyData.forEach(a => this.totalbalAmount += a.balAmount);
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }
  private onRefresh() {
    this.ddlWrkOrderSelected = null;
    this.ddlReportNameSelected = null;
    this.visaWorkOrderId = 0;
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
            5: { halign: "right" },
            6: { halign: "right" },
            7: { halign: "right" },
            8: { halign: "right" },
            9: { halign: "right" },
            10: { halign: "right" },
            11: { halign: "right" },
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

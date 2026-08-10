import { Component, OnInit } from "@angular/core";
import { NbToastrService, NbDatepickerModule } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";
import { RptCoaService } from "../../../../services/accounting/reports/rpt-coa.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

@Component({
  selector: "ngx-rpt-cashflowdirect",
  templateUrl: "./rpt-cashflowdirect.component.html",
  styleUrls: ["./rpt-cashflowdirect.component.scss"],
})
export class RptCashflowdirectComponent implements OnInit {
  public date = new Date().getFullYear();
  public fromdateSelected = new Date();
  public todateSelected = new Date();

  public yearName = this.date;
  public prevYearName = this.date - 1;

  public pageNavigation = "Cash Flow Statement (Direct)";
  public tableHeader = [
    "Particulars",
    this.yearName + " (Tk.)",
    "Previous Year (Tk.)",
  ];

  public apiUrl = "";
  public bodyData: any = [];
  public bodyDataCFI: any = [];
  public bodyDataCFF: any = [];
  public bodyDataOB: any = [];
  public params = [];

  public companies = [];
  public branchs = [];
  public companyId: number = 0;

  public showbody: boolean = false;
  public companySelected: any;
  public branchSelected: any;

  public TotalCFO = 0;
  public TotalCFI = 0;
  public TotalCFF = 0;

  public TotalCFIncrDecr = 0;
  public TotalOB = 0;
  public TotalCFEnd = 0;

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private rptCoaService: RptCoaService
  ) {
    this.getCompanyData();
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
      leftLabel: "Date:",
      leftValue: this.fromdateSelected.toString().substring(3, 15) + ' to ' + this.todateSelected.toString().substring(3, 15),
    });
  }

  public getCompanyData() {
    this.comboService.getCompany().subscribe((returns: any) => {
      this.companies = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
      this.companySelected = {
        id: returns.data[0].companyId,
        name: returns.data[0].companyName,
      };
      this.getBranch(returns.data[0].companyId);
    });
  }

  public getBranch(companyId) {
    this.comboService.getSbuForAccounting(companyId).subscribe((returns: any) => {
      this.branchs = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
      this.branchSelected = {
        id: returns.data[0].sbuId,
        name: returns.data[0].sbuName,
      };
    });
  }

  private getReportData() {
    //debugger;
    this.apiUrl = `AccountReport/getRptCashFlowDirect?companyId=${this.companySelected.id
      }&sbuId=${this.branchSelected.id}&fromDate=${this.fromdateSelected
        .toString()
        .substring(3, 15)}&toDate=${this.todateSelected
          .toString()
          .substring(3, 15)}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.bodyData = returns.data.filter(
          (item) => item.activityType === "CFO"
        );
        this.TotalCFO = 0;
        this.bodyData.forEach(
          (a) => (this.TotalCFO += parseFloat(a.currentAmount))
        );

        this.bodyDataCFI = returns.data.filter(
          (item) => item.activityType === "CFI"
        );
        this.TotalCFI = 0;
        this.bodyDataCFI.forEach(
          (a) => (this.TotalCFI += parseFloat(a.currentAmount))
        );

        this.bodyDataCFF = returns.data.filter(
          (item) => item.activityType === "CFF"
        );
        this.TotalCFF = 0;
        this.bodyDataCFF.forEach(
          (a) => (this.TotalCFF += parseFloat(a.currentAmount))
        );

        this.bodyDataOB = returns.data.filter(
          (item) => item.activityType === "OB"
        );
        this.TotalOB = 0;
        this.bodyDataOB.forEach(
          (a) => (this.TotalOB += parseFloat(a.currentAmount))
        );
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
      this.TotalCFIncrDecr = this.TotalCFO + this.TotalCFI + this.TotalCFF;
      this.TotalCFEnd =
        this.TotalCFO + this.TotalCFI + this.TotalCFF + this.TotalOB;
    });
  }

  private onRefresh() {
    this.companySelected = null;
    this.branchSelected = null;
    this.fromdateSelected = new Date();
    this.todateSelected = new Date();
    this.companyId = 0;
    this.bodyData = [];
    this.bodyDataCFI = [];
    this.bodyDataCFF = [];
    this.bodyDataOB = [];
    this.showbody = false;
  }

  private onPreview() {
    const fromDate = this.fromdateSelected;
    const toDate = this.todateSelected;
    if (this.commonService.validateDates(fromDate, toDate)) {
      this.getReportData();
      this.showbody = true;
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
  }

  private onExportCSV() {
    const fromDate = this.fromdateSelected;
    const toDate = this.todateSelected;
    if (this.commonService.validateDates(fromDate, toDate)) {
      this.getReportData();
      var fileName = this.pageNavigation + ".xlsx";
      this.commonService.generateExcel(this.bodyData, this.tableHeader, fileName);
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
  }

  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  public generateReport(buttonAction: any) {
    const fromDate = this.fromdateSelected;
    const toDate = this.todateSelected;
    if (this.commonService.validateDates(fromDate, toDate)) {
      this.setParam();
      var fileName = this.pageNavigation + ".pdf";
      this.getReportData();
      const content = document.getElementById("reportHeader");
      this.generatePdfCashFlow(buttonAction, fileName, content);
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
  }

  currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

  getYearName(e) {
    //debugger;
    this.yearName = e.getFullYear();
    this.prevYearName = e.getFullYear() - 1;
  }

  public generatePdfCashFlow(buttonAction: any, fileName: string, content: any) {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(5);
    doc.setTextColor(40);
    var legend = {
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
          html: "#header_table_top",
          startY: legend.height + 2,
          styles: { font: "Meta", fontSize: 14, halign: "center" },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
        });

        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 25,
          styles: { font: "Meta", fontSize: 11 },
          columnStyles: {
            0: { halign: "left", cellWidth: 40, },
            1: { halign: "left", cellWidth: 160, },
            2: { halign: "left", cellWidth: 80, },
            3: { halign: "left", cellWidth: 250, },
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 55,
          theme: "grid",
          // tableLineColor: [0, 0, 0],
          // tableLineWidth: 0.75,
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
            textColor: 50,
          },
          columnStyles: {
            1: { halign: "right" },
            2: { halign: "right" },
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
          window.open(URL.createObjectURL(doc.output("blob")), "_blank");
          doc.close();
        }
      },
    });
  }
}

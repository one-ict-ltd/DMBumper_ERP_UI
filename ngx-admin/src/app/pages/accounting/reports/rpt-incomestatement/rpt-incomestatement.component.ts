import { Component, OnInit } from "@angular/core";
import { NbToastrService, NbDatepickerModule } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";
import { RptCoaService } from "../../../../services/accounting/reports/rpt-coa.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

@Component({
  selector: "ngx-rpt-incomestatement",
  templateUrl: "./rpt-incomestatement.component.html",
  styleUrls: ["./rpt-incomestatement.component.scss"],
})
export class RptIncomestatementComponent implements OnInit {
  public date = new Date().getFullYear();
  public fromdateSelected = new Date();
  public todateSelected = new Date();

  public yearName = this.date;
  public prevYearName = this.date - 1;

  public pageNavigation = "Income Statement";
  public tableHeader = [
    "Particulars",
    this.yearName + " (Tk.)",
    "Previous Year (Tk.)",
  ];

  public apiUrl = "";
  public bodyData: any = [];
  public bodyDataExpense: any = [];
  public params = [];

  public companies = [];
  public branchs = [];
  public companyId: number = 0;

  public showbody: boolean = false;
  public companySelected: any;
  public branchSelected: any;

  public TotalIncome = 0;
  public TotalExpense = 0;
  public NetProfit = 0;

  public TotalIncomePrevYear = 0;
  public TotalExpensePrevYear = 0;
  public NetProfitPrevYear = 0;

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
      leftLabel: "Company",
      leftValue: this.companySelected.name,
      rightLabel: "Branch",
      rightValue: this.branchSelected.name,
    });
    this.params.push({
      leftLabel: "From Date",
      leftValue: this.fromdateSelected.toString().substring(3, 15),
      rightLabel: "To Date",
      rightValue: this.todateSelected.toString().substring(3, 15),
    });
  }

  private getCompanyData() {
    this.comboService.getCompany().subscribe((returns: any) => {
      this.companies = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
    });
  }

  public getBranch(companyId) {
    this.comboService.getSBU(companyId).subscribe((returns: any) => {
      this.branchs = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
    });
  }

  private getReportData() {
    //debugger;
    this.apiUrl = `AccountReport/getRptIncomeStatement?companyId=${this.companySelected.id
      }&sbuId=${this.branchSelected.id}&fromDate=${this.fromdateSelected
        .toString()
        .substring(3, 15)}&toDate=${this.todateSelected
          .toString()
          .substring(3, 15)}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.bodyData = returns.data.filter(
          (item) => item.natureName === "Incomes"
        );
        this.TotalIncome = 0;
        this.bodyData.forEach(
          (a) => (this.TotalIncome += parseFloat(a.currentAmount))
        );
        this.TotalIncomePrevYear = 0;
        this.bodyData.forEach(
          (a) => (this.TotalIncomePrevYear += parseFloat(a.previousAmount))
        );

        this.bodyDataExpense = returns.data.filter(
          (item) => item.natureName === "Expenses"
        );
        this.TotalExpense = 0;
        this.bodyDataExpense.forEach(
          (a) => (this.TotalExpense += parseFloat(a.currentAmount))
        );
        this.TotalExpensePrevYear = 0;
        this.bodyDataExpense.forEach(
          (a) => (this.TotalExpensePrevYear += parseFloat(a.previousAmount))
        );
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
      this.NetProfit = this.TotalIncome - this.TotalExpense;
      this.NetProfitPrevYear =
        this.TotalIncomePrevYear - this.TotalExpensePrevYear;
    });
  }

  private onRefresh() {
    this.companySelected = null;
    this.branchSelected = null;
    this.fromdateSelected = new Date();
    this.todateSelected = new Date();
    this.companyId = 0;
    this.bodyData = [];
    this.bodyDataExpense = [];
    this.showbody = false;
  }

  private onPreview() {
    this.getReportData();
    this.showbody = true;
  }

  private onExportCSV() {
    this.getReportData();
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
    this.generatePdfPLSheet(buttonAction, fileName, content);
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

  public generatePdfPLSheet(buttonAction: any, fileName: string, content: any) {
    const doc = new jsPDF("p", "pt", "a4");
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
          startY: legend.height + 60,
          styles: { font: "Meta" },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 140,
          theme: "grid",
          // tableLineColor: [0, 0, 0],
          // tableLineWidth: 0.75,
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
            1: { halign: "right" },
            2: { halign: "right" },
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });

        autoTable(doc, {
          html: "#body_table2",
          startY: legend.height + 500,
          theme: "grid",
          // tableLineColor: [0, 0, 0],
          // tableLineWidth: 0.75,
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
            0: { halign: "center", minCellWidth: 50 },
            1: { halign: "right", minCellWidth: 150 },
            2: { halign: "right", minCellWidth: 150 },
            3: { halign: "right", minCellWidth: 150 },
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

import { Component, OnInit, TemplateRef } from "@angular/core";
import { NbToastrService, NbDatepickerModule, NbDialogService } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

@Component({
  selector: 'ngx-rpt-ownersequity',
  templateUrl: './rpt-ownersequity.component.html',
  styleUrls: ['./rpt-ownersequity.component.scss']
})
export class RptOwnersequityComponent implements OnInit {

  public date = new Date().getFullYear();
  public fromdateSelected = new Date();
  public todateSelected = new Date();

  public pageNavigation = "Statement of Changes in Equity";

  public params = [];
  public companies = [];
  public branchs = [];
  public companyId: number = 0;
  public companySelected: any;
  public branchSelected: any;
  public showbody: boolean = false;
  public showDrawing: boolean = false;

  public apiUrl = "";
  public apiUrlProfitLoss = "";
  public apiUrlProfitLossPrev = "";
  public apiUrlDrawing = "";

  public bodyDataEquityCurPrev: any = [];
  public bodyDataEquityCurCur: any = [];
  public TotalCapitalCurPrevYear = 0;
  public TotalCapitalCurCurYear = 0;

  public bodyDataEquityPrevPrev: any = [];
  public bodyDataEquityPrevCur: any = [];
  public TotalCapitalPrevPrevYear = 0;
  public TotalCapitalPrevCurYear = 0;

  public bodyDataIncome: any = [];
  public bodyDataExpense: any = [];
  public TotalIncome = 0;
  public TotalExpense = 0;
  public NetProfit = 0;
  public TotalIncomePrevYear = 0;
  public TotalExpensePrevYear = 0;
  public NetProfitPrevYear = 0;

  public bodyDataIncomePrev: any = [];
  public bodyDataExpensePrev: any = [];
  public TotalIncomePrev = 0;
  public TotalExpensePrev = 0;
  public NetProfitPrev = 0;
  public TotalIncomePrevYearPrev = 0;
  public TotalExpensePrevYearPrev = 0;
  public NetProfitPrevYearPrev = 0;

  public bodyDataDrawing: any = [];
  public TotalDrawingCurYear = 0;
  public TotalDrawingPrevYear = 0;

  public yearEndDate = "";
  public prevYearEndDate = "";
  public tableHeader = ["Particulars", "Share Capital", "Retained Earnings", "Reserve", "Total (Amount)"];

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private dialogService: NbDialogService,
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
    this.comboService.getSBU(companyId).subscribe((returns: any) => {
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
    this.apiUrl = `AccountReport/getRptOwnersEquity?companyId=${this.companySelected.id}&sbuId=${this.branchSelected.id}&fromDate=${this.fromdateSelected.toString().substring(3, 15)}&toDate=${this.todateSelected.toString().substring(3, 15)}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {

        this.bodyDataEquityCurPrev = returns.data.filter((item) => item.yearType === "CurPrevious");
        this.TotalCapitalCurPrevYear = 0;
        this.bodyDataEquityCurPrev.forEach(
          (a) => (this.TotalCapitalCurPrevYear += parseFloat(a.capitalAmount))
        );

        this.bodyDataEquityCurCur = returns.data.filter((item) => item.yearType === "CurCurrent");
        this.TotalCapitalCurCurYear = 0;
        this.bodyDataEquityCurCur.forEach(
          (a) => (this.TotalCapitalCurCurYear += parseFloat(a.capitalAmount))
        );
        this.yearEndDate = this.bodyDataEquityCurPrev[0].yearEndDate;


        this.bodyDataEquityPrevPrev = returns.data.filter((item) => item.yearType === "PrevPrevious");
        this.TotalCapitalPrevPrevYear = 0;
        this.bodyDataEquityPrevPrev.forEach(
          (a) => (this.TotalCapitalPrevPrevYear += parseFloat(a.capitalAmount))
        );

        this.bodyDataEquityPrevCur = returns.data.filter((item) => item.yearType === "PrevCurrent");
        this.TotalCapitalPrevCurYear = 0;
        this.bodyDataEquityPrevCur.forEach(
          (a) => (this.TotalCapitalPrevCurYear += parseFloat(a.capitalAmount))
        );
        this.prevYearEndDate = this.bodyDataEquityCurPrev[0].prevYearEndDate;

      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });

    this.getReportDataDrawing();
    this.getReportDataProfit();
    this.getReportDataProfitPrev();
  }

  private getReportDataDrawing() {
    this.apiUrlDrawing = `AccountReport/getRptWithDrawings?companyId=${this.companySelected.id}&sbuId=${this.branchSelected.id}&fromDate=${this.fromdateSelected.toString().substring(3, 15)}&toDate=${this.todateSelected.toString().substring(3, 15)}`;

    this.commonService.getReportData(this.apiUrlDrawing).subscribe((returnss: any) => {
      if (returnss.success) {

        this.bodyDataDrawing = returnss.data;
        this.TotalDrawingCurYear = 0;
        this.TotalDrawingPrevYear = 0;
        this.bodyDataDrawing.forEach(
          (a) => (this.TotalDrawingCurYear += parseFloat(a.currentAmount)
            , this.TotalDrawingPrevYear += parseFloat(a.previousAmount)
          )
        );
        if (this.bodyDataDrawing.length == 0) {
          this.showDrawing = false;
        } else {
          this.showDrawing = true;
        }

      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }

  private getReportDataProfit() {
    this.apiUrlProfitLoss = `AccountReport/getRptIncomeStatementIFRS?companyId=${this.companySelected.id}&sbuId=${this.branchSelected.id}&noteMasterId=0&fromDate=${this.fromdateSelected.toString().substring(3, 15)}&toDate=${this.todateSelected.toString().substring(3, 15)}&rptType=SUMMARY`;

    this.commonService.getReportData(this.apiUrlProfitLoss).subscribe((returnss: any) => {
      if (returnss.success) {

        this.bodyDataIncome = returnss.data.filter((item) => item.parentName === "INCOME");
        this.TotalIncome = 0;
        this.TotalIncomePrevYear = 0;
        this.bodyDataIncome.forEach(
          (a) => (this.TotalIncome += parseFloat(a.currentAmount),
            this.TotalIncomePrevYear += parseFloat(a.previousAmount))
        );

        this.bodyDataExpense = returnss.data.filter((item) => item.parentName != "INCOME");
        this.TotalExpense = 0;
        this.TotalExpensePrevYear = 0;
        this.bodyDataExpense.forEach(
          (a) => (this.TotalExpense += parseFloat(a.currentAmount),
            this.TotalExpensePrevYear += parseFloat(a.previousAmount))
        );

      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
      debugger;
      this.NetProfit = (this.TotalIncome) - (this.TotalExpense);
      this.NetProfitPrevYear = this.TotalIncomePrevYear - this.TotalExpensePrevYear;
    });
  }

  private getReportDataProfitPrev() {
    this.apiUrlProfitLossPrev = `AccountReport/getRptProfitLossForOwnersEquity?companyId=${this.companySelected.id}&sbuId=${this.branchSelected.id}&fromDate=${this.fromdateSelected.toString().substring(3, 15)}&toDate=${this.todateSelected.toString().substring(3, 15)}`;

    this.commonService.getReportData(this.apiUrlProfitLossPrev).subscribe((returnss: any) => {
      if (returnss.success) {

        this.bodyDataIncomePrev = returnss.data.filter((item) => item.parentName === "INCOME");
        this.TotalIncomePrev = 0;
        this.TotalIncomePrevYearPrev = 0;
        this.bodyDataIncomePrev.forEach(
          (a) => (this.TotalIncomePrev += parseFloat(a.currentAmount),
            this.TotalIncomePrevYearPrev += parseFloat(a.previousAmount))
        );

        this.bodyDataExpensePrev = returnss.data.filter((item) => item.parentName != "INCOME");
        this.TotalExpensePrev = 0;
        this.TotalExpensePrevYearPrev = 0;
        this.bodyDataExpensePrev.forEach(
          (a) => (this.TotalExpensePrev += parseFloat(a.currentAmount),
            this.TotalExpensePrevYearPrev += parseFloat(a.previousAmount))
        );

      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
      debugger;
      this.NetProfitPrev = (this.TotalIncomePrev) - (this.TotalExpensePrev);
      this.NetProfitPrevYearPrev = this.TotalIncomePrevYearPrev - this.TotalExpensePrevYearPrev;
    });
  }

  private onRefresh() {
    this.companySelected = null;
    this.branchSelected = null;
    this.fromdateSelected = new Date();
    this.todateSelected = new Date();
    this.companyId = 0;
    this.showbody = false;
    this.showDrawing = false;
  }

  private onPreview() {
    this.getReportData();
    this.showbody = true;
  }

  private onExportCSV() {
    this.getReportData();
    var fileName = this.pageNavigation + ".xlsx";
    this.commonService.generateExcel(this.bodyDataEquityCurPrev, this.tableHeader, fileName);
  }

  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  public generateReport(buttonAction: any) {
    var fileName = this.pageNavigation + ".pdf";
    this.getReportData();
    const content = document.getElementById("reportHeader");
    this.generatePdfOwnersEquity(buttonAction, fileName, content);
  }

  currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

  public generatePdfOwnersEquity(
    buttonAction: any,
    fileName: string,
    content: any
  ) {
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
          startY: legend.height + 5,
          styles: { font: "Meta", fontSize: 14, halign: "center" },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
        });

        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 25,
          styles: { font: "Meta", fontSize: 11, halign: "center" },
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
            // halign:"right"
          },
          columnStyles: {
            1: { halign: "right" },
            2: { halign: "right" },
            3: { halign: "right" },
            4: { halign: "right" },
          },

          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });

        autoTable(doc, {
          html: "#body_tablePrev",
          startY: legend.height + 250,
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
            // halign:"right"
          },
          columnStyles: {
            1: { halign: "right" },
            2: { halign: "right" },
            3: { halign: "right" },
            4: { halign: "right" },
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

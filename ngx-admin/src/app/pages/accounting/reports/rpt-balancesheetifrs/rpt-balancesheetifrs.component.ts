import { Component, OnInit, TemplateRef } from "@angular/core";
import {
  NbToastrService,
  NbDatepickerModule,
  NbDialogService,
} from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";
import { RptCoaService } from "../../../../services/accounting/reports/rpt-coa.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { AccountreportService } from "app/services/accounting/reports/accountreport.service";

@Component({
  selector: "ngx-rpt-balancesheetifrs",
  templateUrl: "./rpt-balancesheetifrs.component.html",
  styleUrls: ["./rpt-balancesheetifrs.component.scss"],
})
export class RptBalancesheetifrsComponent implements OnInit {
  public date = new Date().getFullYear();
  public fromdateSelected = new Date();
  public todateSelected = new Date();

  public pageNavigation = "Statement of Financial Position";

  public params = [];
  public companies = [];
  public branchs = [];
  public companyId: number = 0;
  public singleCheckClick: number = 0;
  public companySelected: any;
  public branchSelected: any;

  public showbody: boolean = false;
  public showbodySingle: boolean = false;

  public showNonCurAsset: boolean = false;
  public showCurAsset: boolean = false;
  public showNonCurLiability: boolean = false;
  public showCurLiability: boolean = false;
  public showAccDepreciation: boolean = false;
  public showEquity: boolean = false;

  public apiUrlLedgerList = "";
  public bodyDataLedgerList: any = [];

  public apiUrl = "";
  public apiUrl2 = "";
  public apiUrlDrawing = "";

  public bodyDataNonCurAsset: any = [];
  public TotalNonCurntAssetCurYear = 0;
  public TotalNonCurntAssetPrevYear = 0;

  public bodyDataCurAsset: any = [];
  public TotalCurntAssetCurYear = 0;
  public TotalCurntAssetPrevYear = 0;

  public TotalAssetCurYear = 0;
  public TotalAssetPrevYear = 0;

  public bodyDataNonCurntLiablity: any = [];
  public TotalNonCurLiabilityCurYear = 0;
  public TotalNonCurLiabilityPrevYear = 0;

  public bodyDataCurntLiablity: any = [];
  public TotalCurLiabilityCurYear = 0;
  public TotalCurLiabilityPrevYear = 0;

  public bodyDataAccDepr: any = [];
  public TotalAccDeprCurYear = 0;
  public TotalAccDeprPrevYear = 0;

  public bodyDataEquity: any = [];
  public TotalEquityCurYear = 0;
  public TotalEquityPrevYear = 0;

  public TotalLOECurYear = 0;
  public TotalLOEPrevYear = 0;

  public bodyDataIncome: any = [];
  public bodyDataExpense: any = [];

  public TotalIncome = 0;
  public TotalExpense = 0;
  public NetProfit = 0;

  public TotalIncomePrevYear = 0;
  public TotalExpensePrevYear = 0;
  public NetProfitPrevYear = 0;

  public curFinancialYearName = "";
  public prevFinancialYearName = "";
  public yearEndDate = "";

  public bodyDataDrawing: any = [];
  public TotalDrawingCurYear = 0;
  public TotalDrawingPrevYear = 0;

  public tableHeader = [
    "Particulars",
    "Notes",
    this.curFinancialYearName,
    this.prevFinancialYearName,
  ];

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private rptCoaService: RptCoaService,
    private dialogService: NbDialogService,
    private accountreportService: AccountreportService
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

  public onCheckboxChange(e) {
    if (e.target.checked) {
      this.showbody = false;
      this.showbodySingle = true;
      this.singleCheckClick = 1;
    } else {
      this.showbodySingle = false;
      this.showbody = true;
      this.singleCheckClick = 0;
    }
  }

  private getReportData() {
    this.apiUrl = `AccountReport/getRptBalanceSheetDetails?companyId=${this.companySelected.id
      }&sbuId=${this.branchSelected.id
      }&noteMasterId=0&fromDate=${this.fromdateSelected
        .toString()
        .substring(3, 15)}&toDate=${this.todateSelected
          .toString()
          .substring(3, 15)}&rptType=SUMMARY`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.bodyDataNonCurAsset = returns.data.filter(
          (item) => item.shortParentName === "NONCURASSET"
        );
        this.TotalNonCurntAssetCurYear = 0;
        this.TotalNonCurntAssetPrevYear = 0;
        this.bodyDataNonCurAsset.forEach(
          (a) => (
            (this.TotalNonCurntAssetCurYear += parseFloat(a.currentAmount)),
            (this.TotalNonCurntAssetPrevYear += parseFloat(a.previousAmount))
          )
        );
        if (this.bodyDataNonCurAsset.length == 0) {
          this.showNonCurAsset = false;
        } else {
          this.showNonCurAsset = true;
        }

        this.bodyDataCurAsset = returns.data.filter(
          (item) => item.shortParentName === "CURASSET"
        );
        this.TotalCurntAssetCurYear = 0;
        this.TotalCurntAssetPrevYear = 0;
        this.bodyDataCurAsset.forEach(
          (a) => (
            (this.TotalCurntAssetCurYear += parseFloat(a.currentAmount)),
            (this.TotalCurntAssetPrevYear += parseFloat(a.previousAmount))
          )
        );
        if (this.bodyDataCurAsset.length == 0) {
          this.showCurAsset = false;
        } else {
          this.showCurAsset = true;
        }

        this.bodyDataNonCurntLiablity = returns.data.filter(
          (item) => item.shortParentName === "NONCURLIABILITY"
        );
        this.TotalNonCurLiabilityCurYear = 0;
        this.TotalNonCurLiabilityPrevYear = 0;
        this.bodyDataNonCurntLiablity.forEach(
          (a) => (
            (this.TotalNonCurLiabilityCurYear += parseFloat(a.currentAmount)),
            (this.TotalNonCurLiabilityPrevYear += parseFloat(a.previousAmount))
          )
        );
        if (this.bodyDataNonCurntLiablity.length == 0) {
          this.showNonCurLiability = false;
        } else {
          this.showNonCurLiability = true;
        }

        this.bodyDataCurntLiablity = returns.data.filter(
          (item) => item.shortParentName === "CURLIABILITY"
        );
        this.TotalCurLiabilityCurYear = 0;
        this.TotalCurLiabilityPrevYear = 0;
        this.bodyDataCurntLiablity.forEach(
          (a) => (
            (this.TotalCurLiabilityCurYear += parseFloat(a.currentAmount)),
            (this.TotalCurLiabilityPrevYear += parseFloat(a.previousAmount))
          )
        );
        if (this.bodyDataCurntLiablity.length == 0) {
          this.showCurLiability = false;
        } else {
          this.showCurLiability = true;
        }

        this.bodyDataAccDepr = returns.data.filter(
          (item) => item.shortParentName === "ACCDEPR"
        );
        this.TotalAccDeprCurYear = 0;
        this.TotalAccDeprPrevYear = 0;
        this.bodyDataAccDepr.forEach(
          (a) => (
            (this.TotalAccDeprCurYear += parseFloat(a.currentAmount)),
            (this.TotalAccDeprPrevYear += parseFloat(a.previousAmount))
          )
        );
        if (this.bodyDataAccDepr.length == 0) {
          this.showAccDepreciation = false;
        } else {
          this.showAccDepreciation = true;
        }

        this.bodyDataEquity = returns.data.filter(
          (item) => item.shortParentName === "EQUITY"
        );
        this.TotalEquityCurYear = 0;
        this.TotalEquityPrevYear = 0;
        this.bodyDataEquity.forEach(
          (a) => (
            (this.TotalEquityCurYear += parseFloat(a.currentAmount)),
            (this.TotalEquityPrevYear += parseFloat(a.previousAmount))
          )
        );
        if (this.bodyDataEquity.length == 0) {
          this.showEquity = false;
        } else {
          this.showEquity = true;
        }

        this.curFinancialYearName =
          this.bodyDataNonCurAsset[0].curFinancialYearName;
        this.prevFinancialYearName =
          this.bodyDataNonCurAsset[0].prevFinancialYearName;
        this.yearEndDate = this.bodyDataNonCurAsset[0].yearEndDate;
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }

      this.TotalAssetCurYear =
        this.TotalNonCurntAssetCurYear + this.TotalCurntAssetCurYear;
      this.TotalAssetPrevYear =
        this.TotalNonCurntAssetPrevYear + this.TotalCurntAssetPrevYear;

      this.TotalEquityCurYear = this.TotalEquityCurYear + this.NetProfit;
      this.TotalEquityPrevYear =
        this.TotalEquityPrevYear + this.NetProfitPrevYear;

      this.TotalLOECurYear =
        this.TotalEquityCurYear +
        this.TotalNonCurLiabilityCurYear +
        this.TotalCurLiabilityCurYear +
        this.TotalAccDeprCurYear;
      this.TotalLOEPrevYear =
        this.TotalEquityPrevYear +
        this.TotalNonCurLiabilityPrevYear +
        this.TotalCurLiabilityPrevYear +
        this.TotalAccDeprPrevYear;
    });

    // this.getReportDataDrawing();
    // this.getReportDataProfit();
  }

  private getReportDataDrawing() {
    this.apiUrlDrawing = `AccountReport/getRptWithDrawings?companyId=${this.companySelected.id
      }&sbuId=${this.branchSelected.id}&fromDate=${this.fromdateSelected
        .toString()
        .substring(3, 15)}&toDate=${this.todateSelected
          .toString()
          .substring(3, 15)}`;

    this.commonService
      .getReportData(this.apiUrlDrawing)
      .subscribe((returnss: any) => {
        if (returnss.success) {
          this.bodyDataDrawing = returnss.data;
          this.TotalDrawingCurYear = 0;
          this.TotalDrawingPrevYear = 0;
          this.bodyDataDrawing.forEach(
            (a) => (
              (this.TotalDrawingCurYear += parseFloat(a.currentAmount)),
              (this.TotalDrawingPrevYear += parseFloat(a.previousAmount))
            )
          );
        } else {
          this.toastrService.danger("Message", this.commonService.nodatafound);
        }

        this.NetProfit =
          this.TotalIncome +
          this.TotalIncomePrevYear -
          (this.TotalExpense +
            this.TotalExpensePrevYear +
            this.TotalDrawingCurYear);
        this.NetProfitPrevYear =
          this.TotalIncomePrevYear -
          (this.TotalExpensePrevYear + this.TotalDrawingPrevYear);
      });
  }

  private getReportDataProfit() {
    this.apiUrl2 = `AccountReport/getRptIncomeStatementIFRS?companyId=${this.companySelected.id
      }&sbuId=${this.branchSelected.id
      }&noteMasterId=0&fromDate=${this.fromdateSelected
        .toString()
        .substring(3, 15)}&toDate=${this.todateSelected
          .toString()
          .substring(3, 15)}&rptType=SUMMARY`;

    this.commonService
      .getReportData(this.apiUrl2)
      .subscribe((returnss: any) => {
        if (returnss.success) {
          this.bodyDataIncome = returnss.data.filter(
            (item) => item.parentName == "INCOME"
          );
          this.TotalIncome = 0;
          this.TotalIncomePrevYear = 0;
          this.bodyDataIncome.forEach(
            (a) => (
              (this.TotalIncome += parseFloat(a.currentAmount)),
              (this.TotalIncomePrevYear += parseFloat(a.previousAmount))
            )
          );

          this.bodyDataExpense = returnss.data.filter(
            (item) => item.parentName != "INCOME"
          );
          this.TotalExpense = 0;
          this.TotalExpensePrevYear = 0;
          this.bodyDataExpense.forEach(
            (a) => (
              (this.TotalExpense += parseFloat(a.currentAmount)),
              (this.TotalExpensePrevYear += parseFloat(a.previousAmount))
            )
          );
        } else {
          this.toastrService.danger("Message", this.commonService.nodatafound);
        }

        this.NetProfit =
          this.TotalIncome +
          this.TotalIncomePrevYear -
          (this.TotalExpense +
            this.TotalExpensePrevYear +
            this.TotalDrawingCurYear);
        this.NetProfitPrevYear =
          this.TotalIncomePrevYear -
          (this.TotalExpensePrevYear + this.TotalDrawingPrevYear);
      });
  }

  private onRefresh() {
    this.companySelected = null;
    this.branchSelected = null;
    this.fromdateSelected = new Date();
    this.todateSelected = new Date();
    this.companyId = 0;
    this.showbody = false;
    this.showbodySingle = false;
  }

  private onPreview() {
    const fromDate = this.fromdateSelected;
    const toDate = this.todateSelected;
    if (this.commonService.validateDates(fromDate, toDate)) {
      if (this.singleCheckClick == 1) {
        this.showbody = false;
        this.showbodySingle = true;
      } else {
        this.showbodySingle = false;
        this.showbody = true;
      }
      this.getReportData();
      //this.showbody = true;
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
      this.commonService.generateExcel(
        this.bodyDataNonCurAsset,
        this.tableHeader,
        fileName
      );
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
      var fileName = this.pageNavigation + ".pdf";
      this.getReportData();
      if (this.showbody == true) {
        const content = document.getElementById("reportHeader");
        this.generatePdfBalanceSheet(buttonAction, fileName, content);
      } else {
        const content = document.getElementById("reportHeaderSingle");
        this.generatePdfBalanceSheetSingle(buttonAction, fileName, content);
      }

      //this.GetRptBalanceSheetNotes();
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

  public generatePdfBalanceSheet(
    buttonAction: any,
    fileName: string,
    content: any
  ) {
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
          willDrawCell: (data) => {
            if (data.section === 'body') {
              if (data.row.index === 0 || data.row.index === 1 || data.row.index === 6 || data.row.index === 17 || data.row.index === 18 || data.row.index === 19 || data.row.index === 20 || data.row.index === 23 || data.row.index === 25 || data.row.index === 30 || data.row.index === 32) {
                //doc.setTextColor(231, 76, 60); // Red
                doc.setFontSize(11);
              }
            }

          },
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
            2: { halign: "right" },
            3: { halign: "right" },
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

  public generatePdfBalanceSheetSingle(
    buttonAction: any,
    fileName: string,
    content: any
  ) {
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
          html: "#header_table_top_Single",
          startY: legend.height + 5,
          styles: { font: "Meta", fontSize: 14, halign: "center" },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
        });

        autoTable(doc, {
          html: "#header_table_Single",
          startY: legend.height + 25,
          styles: { font: "Meta", fontSize: 11, halign: "center" },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
        });

        autoTable(doc, {
          html: "#body_table_Single",
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
            2: { halign: "right" },
            3: { halign: "right" },
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

  //Pop UP
  public noteMasterId = 0;
  public noteName = "";
  public noteNo = "";
  public noteAmountCurYear = 0;
  public noteAmountPrevYear = 0;

  public openWithDataObjModel(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {});
  }


  percentageCalculator(myValue, totalValue) {
    var sansDec = ((myValue / totalValue) * 100).toFixed(2);
    return `${sansDec}`;
  }



  public getLedgersList(dialog: TemplateRef<any>, noteMasterId) {
    this.apiUrlLedgerList = `AccountReport/getRptBalanceSheetDetails?companyId=${this.companySelected.id
      }&sbuId=${this.branchSelected.id
      }&noteMasterId=${noteMasterId}&fromDate=${this.fromdateSelected
        .toString()
        .substring(3, 15)}&toDate=${this.todateSelected
          .toString()
          .substring(3, 15)}&rptType=DETAIL`;
    this.commonService
      .getReportData(this.apiUrlLedgerList)
      .subscribe((data: any) => {
        if (data.success) {
          this.openWithDataObjModel(dialog);
          this.bodyDataLedgerList = data.data;

          this.noteMasterId = noteMasterId;
          this.noteName = data.data[0].noteName;
          this.noteNo = data.data[0].noteNo;

          this.noteAmountCurYear = 0;
          this.noteAmountPrevYear = 0;
          this.bodyDataLedgerList.forEach(
            (a) => (
              (this.noteAmountCurYear += parseFloat(a.currentAmount)),
              (this.noteAmountPrevYear += parseFloat(a.previousAmount))
            )
          );
        }
      });
  }

  //Pdf Report for Notes
  public datalength: number;

  public generateNoteReport() {
    //this.getNoteReportData();
    this.GetRptBalanceSheetNotes();
  }

  public GetRptBalanceSheetNotes() {
    this.accountreportService.RptBalanceSheetNotes(this.companySelected.id, this.branchSelected.id, this.noteMasterId, this.fromdateSelected.toString().substring(3, 15), this.todateSelected.toString().substring(3, 15), "DETAIL", "Pdf").subscribe((returns: any) => {
      this.commonService.GenerateBase64ToReport(returns);
    });
  }

  private getNoteReportData() {
    this.apiUrlLedgerList = `AccountReport/getRptBalanceSheetDetails?companyId=${this.companySelected.id
      }&sbuId=${this.branchSelected.id}&noteMasterId=${this.noteMasterId
      }&fromDate=${this.fromdateSelected
        .toString()
        .substring(3, 15)}&toDate=${this.todateSelected
          .toString()
          .substring(3, 15)}&rptType=DETAIL`;
    this.commonService
      .getReportData(this.apiUrlLedgerList)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.bodyDataLedgerList = returns.data;
          this.datalength = returns.data.length * 50;

          var fileName = this.pageNavigation + ".pdf";
          const content = document.getElementById("reportHeader");
          this.generatePdfNoteReport(
            "print",
            fileName,
            content,
            this.datalength
          );
        } else {
          this.toastrService.danger("Message", this.commonService.nodatafound);
        }
      });
  }

  public generatePdfNoteReport(
    buttonAction: any,
    fileName: string,
    content: any,
    datalength: number
  ) {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(5); //optional
    doc.setTextColor(40); //optional

    var legend = {
      height: 100,
      totalheight: 100 + datalength,
    };

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

    doc.html(content, {
      callback: function (doc) {
        autoTable(doc, {
          html: "#header_table_top_voucher",
          startY: legend.height + 20,
          styles: { font: "Meta", fontSize: 15, halign: "center" },
        });

        autoTable(doc, {
          html: "#body_table_Voucher",
          startY: legend.height + 40,
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
            0: { halign: "center", fontStyle: "bold" },
            2: { halign: "right" },
            3: { halign: "right" },
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
            // fontStyle: "bold",
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

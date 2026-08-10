import { Component, OnInit, TemplateRef } from "@angular/core";
import { NbToastrService, NbDatepickerModule, NbDialogService } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";
import { RptCoaService } from "../../../../services/accounting/reports/rpt-coa.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

@Component({
  selector: 'ngx-rpt-incomestmentifrs',
  templateUrl: './rpt-incomestmentifrs.component.html',
  styleUrls: ['./rpt-incomestmentifrs.component.scss']
})
export class RptIncomestmentifrsComponent implements OnInit {

  public date = new Date().getFullYear();
  public fromdateSelected = new Date();
  public todateSelected = new Date();

  public pageNavigation = "Statement of Comprehensive Income";

  public apiUrl = "";
  public apiUrlLedgerList = "";
  public bodyDataLedgerList: any = [];

  public bodyData: any = [];
  public bodyDataCostofSale: any = [];
  public bodyDataExpense: any = [];
  public bodyDataOtherIncome: any = [];
  public bodyDataFinCost: any = [];
  public bodyDataTax: any = [];

  public params = [];
  public companies = [];
  public branchs = [];
  public companyId: number = 0;
  public singleCheckClick: number = 0;

  public showbody: boolean = false;
  public showbodySingle: boolean = false;

  public showGrossProfit: boolean = false;
  public showOperationalExpense: boolean = false;
  public showOtherIncome: boolean = false;
  public showProfitBeforeTax: boolean = false;

  public companySelected: any;
  public branchSelected: any;

  public TotalIncomeCurYear = 0;
  public TotalIncomePrevYear = 0;

  public TotalCostofSaleCurYear = 0;
  public TotalCostofSalePrevYear = 0;

  public GrossProfitCurYear = 0;
  public GrossProfitPrevYear = 0;

  public TotalExpenseCurYear = 0;
  public TotalExpensePrevYear = 0;

  public TotalOtherIncomeCurYear = 0;
  public TotalOtherIncomePrevYear = 0;

  public TotalProfitCurYear = 0;
  public TotalProfitPrevYear = 0;

  public TotalFinCostCurYear = 0;
  public TotalFinCostPrevYear = 0;

  public NetProfitBefTaxCurYear = 0;
  public NetProfitBefTaxPrevYear = 0;

  public TotalTaxCurYear = 0;
  public TotalTaxPrevYear = 0;

  public NetProfitAfterTaxCurYear = 0;
  public NetProfitAfterTaxPrevYear = 0;

  public curFinancialYearName = "";
  public prevFinancialYearName = "";
  public yearEndDate = "";

  public tableHeader = [
    "Particulars"
    , "Notes",
    this.curFinancialYearName,
    this.prevFinancialYearName,
  ];

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private rptCoaService: RptCoaService,
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


  private getCompanyData() {
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
    this.apiUrl = `AccountReport/getRptIncomeStatementIFRS?companyId=${this.companySelected.id}&sbuId=${this.branchSelected.id}&noteMasterId=0&fromDate=${this.fromdateSelected.toString().substring(3, 15)}&toDate=${this.todateSelected.toString().substring(3, 15)}&rptType=SUMMARY`;

    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {

        this.bodyData = returns.data.filter(
          (item) => item.shortParentName === "INCOME"
        );
        this.TotalIncomeCurYear = 0;
        this.TotalIncomePrevYear = 0;
        this.bodyData.forEach(
          (a) => (this.TotalIncomeCurYear += parseFloat(a.currentAmount),
            this.TotalIncomePrevYear += parseFloat(a.previousAmount)),
        );
        if (this.bodyData.length == 0) {
          this.showGrossProfit = false;
        } else {
          this.showGrossProfit = true;
        }

        this.bodyDataCostofSale = returns.data.filter(
          (item) => item.shortParentName === "COGS"
        );
        this.TotalCostofSaleCurYear = 0;
        this.TotalCostofSalePrevYear = 0;
        this.bodyDataCostofSale.forEach(
          (a) => (this.TotalCostofSaleCurYear += parseFloat(a.currentAmount),
            this.TotalCostofSalePrevYear += parseFloat(a.previousAmount)),
        );


        this.bodyDataExpense = returns.data.filter(
          (item) => item.shortParentName === "EXPENSE"
        );
        this.TotalExpenseCurYear = 0;
        this.TotalExpensePrevYear = 0;
        this.bodyDataExpense.forEach(
          (a) => (this.TotalExpenseCurYear += parseFloat(a.currentAmount),
            this.TotalExpensePrevYear += parseFloat(a.previousAmount)),
        );
        if (this.bodyDataExpense.length == 0) {
          this.showOperationalExpense = false;
        } else {
          this.showOperationalExpense = true;
        }


        this.bodyDataOtherIncome = returns.data.filter(
          (item) => item.shortParentName === "OTHERINCOME"
        );
        this.TotalOtherIncomeCurYear = 0;
        this.TotalOtherIncomePrevYear = 0;
        this.bodyDataOtherIncome.forEach(
          (a) => (this.TotalOtherIncomeCurYear += parseFloat(a.currentAmount),
            this.TotalOtherIncomePrevYear += parseFloat(a.previousAmount)),
        );
        if (this.bodyDataOtherIncome.length == 0) {
          this.showOtherIncome = false;
        } else {
          this.showOtherIncome = true;
        }

        this.bodyDataFinCost = returns.data.filter(
          (item) => item.shortParentName === "COST"
        );
        this.TotalFinCostCurYear = 0;
        this.TotalFinCostPrevYear = 0;
        this.bodyDataFinCost.forEach(
          (a) => (this.TotalFinCostCurYear += parseFloat(a.currentAmount),
            this.TotalFinCostPrevYear += parseFloat(a.previousAmount)),
        );
        if (this.bodyDataFinCost.length == 0) {
          this.showProfitBeforeTax = false;
        } else {
          this.showProfitBeforeTax = true;
        }

        this.bodyDataTax = returns.data.filter(
          (item) => item.shortParentName === "TAX"
        );
        this.TotalTaxCurYear = 0;
        this.TotalTaxPrevYear = 0;
        this.bodyDataTax.forEach(
          (a) => (this.TotalTaxCurYear += parseFloat(a.currentAmount),
            this.TotalTaxPrevYear += parseFloat(a.previousAmount)),
        );


        this.curFinancialYearName = this.bodyData[0].curFinancialYearName;
        this.prevFinancialYearName = this.bodyData[0].prevFinancialYearName;
        this.yearEndDate = this.bodyData[0].yearEndDate;


      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }

      this.GrossProfitCurYear = this.TotalIncomeCurYear - this.TotalCostofSaleCurYear;
      this.GrossProfitPrevYear = this.TotalIncomePrevYear - this.TotalCostofSalePrevYear;

      this.TotalProfitCurYear = this.GrossProfitCurYear - this.TotalExpenseCurYear;
      this.TotalProfitPrevYear = this.GrossProfitPrevYear - this.TotalExpensePrevYear;

      this.NetProfitBefTaxCurYear = this.TotalProfitCurYear + this.TotalOtherIncomeCurYear - this.TotalFinCostCurYear;
      this.NetProfitBefTaxPrevYear = this.TotalProfitPrevYear + this.TotalOtherIncomePrevYear - this.TotalFinCostPrevYear;

      this.NetProfitAfterTaxCurYear = this.NetProfitBefTaxCurYear - this.TotalTaxCurYear;
      this.NetProfitAfterTaxPrevYear = this.NetProfitBefTaxPrevYear - this.TotalTaxPrevYear;
    });

  }

  private onRefresh() {
    this.companySelected = null;
    this.branchSelected = null;
    this.fromdateSelected = new Date();
    this.todateSelected = new Date();
    this.companyId = 0;

    this.bodyData = [];
    this.bodyDataCostofSale = [];
    this.bodyDataExpense = [];
    this.bodyDataFinCost = [];
    this.bodyDataTax = [];

    this.showbody = false;
    this.showbodySingle = false;
  }

  private onPreview() {
    const fromDate = this.fromdateSelected;
    const toDate = this.todateSelected;
    if (this.commonService.validateDates(fromDate, toDate)) {
      //alert(this.singleCheckClick);
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
      var fileName = this.pageNavigation + ".pdf";
      this.getReportData();
      if (this.showbody == true) {
        const content = document.getElementById("reportHeader");
        this.generatePdfPLSheet(buttonAction, fileName, content);
      }
      else {
        const content = document.getElementById("reportHeaderSingle");
        this.generatePdfPLSheetSingle(buttonAction, fileName, content);
      }
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

  public generatePdfPLSheet(buttonAction: any, fileName: string, content: any) {
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

  public generatePdfPLSheetSingle(buttonAction: any, fileName: string, content: any) {
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
    this.dialogService.open(dialog, {
    });
  }

  public getLedgersList(dialog: TemplateRef<any>, noteMasterId) {
    this.apiUrlLedgerList = `AccountReport/getRptIncomeStatementIFRS?companyId=${this.companySelected.id
      }&sbuId=${this.branchSelected.id}&noteMasterId=${noteMasterId}&fromDate=${this.fromdateSelected.toString().substring(3, 15)}&toDate=${this.todateSelected.toString().substring(3, 15)}&rptType=DETAIL`;
    this.commonService.getReportData(this.apiUrlLedgerList).subscribe((data: any) => {
      if (data.success) {

        this.openWithDataObjModel(dialog);
        this.bodyDataLedgerList = data.data;

        this.noteMasterId = noteMasterId
        this.noteName = data.data[0].noteName;
        this.noteNo = data.data[0].noteNo;

        this.noteAmountCurYear = 0;
        this.noteAmountPrevYear = 0;
        this.bodyDataLedgerList.forEach(
          (a) => (this.noteAmountCurYear += parseFloat(a.currentAmount),
            this.noteAmountPrevYear += parseFloat(a.previousAmount))
        );
      }
    });
  }

  //Pdf Report for Notes
  public datalength: number;

  public generateNoteReport() {
    this.getNoteReportData();
  }

  private getNoteReportData() {
    this.apiUrlLedgerList = `AccountReport/getRptIncomeStatementIFRS?companyId=${this.companySelected.id
      }&sbuId=${this.branchSelected.id}&noteMasterId=${this.noteMasterId}&fromDate=${this.fromdateSelected.toString().substring(3, 15)}&toDate=${this.todateSelected.toString().substring(3, 15)}&rptType=DETAIL`;
    this.commonService.getReportData(this.apiUrlLedgerList).subscribe((returns: any) => {
      if (returns.success) {
        this.bodyDataLedgerList = returns.data;
        this.datalength = returns.data.length * 50;

        var fileName = this.pageNavigation + ".pdf";
        const content = document.getElementById("reportHeader");
        this.generatePdfNoteReport("print", fileName, content, this.datalength);
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
            0: { halign: "center", fontStyle: "bold", },
            2: { halign: "right", },
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

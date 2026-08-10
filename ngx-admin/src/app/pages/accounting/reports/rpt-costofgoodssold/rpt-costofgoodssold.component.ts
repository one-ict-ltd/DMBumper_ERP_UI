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
  selector: 'ngx-rpt-costofgoodssold',
  templateUrl: './rpt-costofgoodssold.component.html',
  styleUrls: ['./rpt-costofgoodssold.component.scss']
})
export class RptCostofgoodssoldComponent implements OnInit {

  public date = new Date().getFullYear();
  public fromdateSelected = new Date();
  public todateSelected = new Date();

  public pageNavigation = "Cost of Goods Sold (COGS)";

  public params = [];
  public companies = [];
  public branchs = [];
  public companyId: number = 0;
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
  public apiUrl3 = "";
  public apiUrlDrawing = "";

  //All Variable for data load 
  public openingRaw = 0;
  public purchaseRaw = 0;
  public avaiableRaw = 0;
  public closingRaw = 0;
  public consumeRaw = 0;
  public openingPack = 0;
  public purchasePack = 0;
  public avaiablePack = 0;
  public closingPack = 0;
  public consumePack = 0;
  public totalRawPack = 0;
  public factoryOverhead = 0;
  public totalmanucost = 0;
  public openingwip = 0;
  public closingwip = 0;
  public costofgoodsmenufecture = 0;
  public openingFinish = 0;
  public purchaseFinish = 0;
  public costofgoodsavaiableforsale = 0;
  public closingFinish = 0;
  public costAfterSales = 0;

  public inventoryDestry = 0;
  public productBonus = 0;
  public costAfterBonus = 0;

  public sampleproduction = 0;
  public cogsReport = 0;


  //All Variable for Previous data load 
  public prevopeningRaw = 0;
  public prevpurchaseRaw = 0;
  public prevavaiableRaw = 0;
  public prevclosingRaw = 0;
  public prevconsumeRaw = 0;
  public prevopeningPack = 0;
  public prevpurchasePack = 0;
  public prevavaiablePack = 0;
  public prevclosingPack = 0;
  public prevconsumePack = 0;
  public prevtotalRawPack = 0;
  public prevfactoryOverhead = 0;
  public prevtotalmanucost = 0;
  public prevopeningwip = 0;
  public prevclosingwip = 0;
  public prevcostofgoodsmenufecture = 0;
  public prevopeningFinish = 0;
  public prevpurchaseFinish = 0;
  public prevcostofgoodsavaiableforsale = 0;
  public prevclosingFinish = 0;
  public prevcostAfterSales = 0;
  public previnventoryDestry = 0;
  public prevproductBonus = 0;
  public prevcostAfterBonus = 0;
  public prevsampleproduction = 0;
  public prevcogsReport = 0;

  public PrevOIRM: any = [];
  public PrevPRMDTP: any = [];
  public PrevCIORM: any = [];
  public PrevOIOPM: any = [];
  public PrevPPMDTP: any = [];
  public PrevCIPM: any = [];
  public PrevFO: any = [];
  public PrevOWIP: any = [];
  public PrevCWIP: any = [];
  public PrevOFG: any = [];
  public PrevPFGDTP: any = [];
  public PrevCFG: any = [];
  public PrevPB: any = [];
  public PrevID: any = [];
  public PrevCPS: any = [];


  public OIRM: any = [];
  public TotalOIRMCurYear = 0;
  public TotalOIRMPrevYear = 0;

  public PRMDTP: any = [];
  public TotalPRMDTPCurYear = 0;
  public TotalPRMDTPPrevYear = 0;

  public TotalAssetCurYear = 0;
  public TotalAssetPrevYear = 0;

  public CIORM: any = [];
  public TotalCIORMCurYear = 0;
  public TotalCIORMPrevYear = 0;

  public OIOPM: any = [];
  public TotalOIOPMCurYear = 0;
  public TotalOIOPMPrevYear = 0;

  public PPMDTP: any = [];
  public TotalPPMDTPCurYear = 0;
  public TotalPPMDTPPrevYear = 0;

  public CIPM: any = [];
  public TotalCIPMCurYear = 0;
  public TotalCIPMPrevYear = 0;

  public PFGDTP: any = [];
  public TotalPFGDTPCurYear = 0;
  public TotalPFGDTPPrevYear = 0;

  public FO: any = [];
  public TotalFOCurYear = 0;
  public TotalFOPrevYear = 0;

  public FOPO: any = [];
  public TotalFOPOCurYear = 0;
  public TotalFOPOPrevYear = 0;

  public FONPO: any = [];
  public OFG: any = [];
  public CFG: any = [];
  public OWIP: any = [];
  public CWIP: any = [];
  public PB: any = [];
  public ID: any = [];
  public CPS: any = [];
  public TotalFONPOCurYear = 0;
  public TotalFONPOPrevYear = 0;

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
    } else {
      this.showbodySingle = false;
      this.showbody = true;
    }
  }

  private getReportData() {
    this.apiUrl = `AccountReport/getRptCostOfGoodsSold?companyId=${this.companySelected.id
      }&sbuId=${this.branchSelected.id
      }&noteMasterId=0&fromDate=${this.fromdateSelected
        .toString()
        .substring(3, 15)}&toDate=${this.todateSelected
          .toString()
          .substring(3, 15)}&rptType=SUMMARY`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.OIRM = returns.data.filter(
          (item) => item.parentNoteName === "Opening inventory of row materials"
        );
        this.openingRaw = 0;
        this.OIRM.forEach(
          (a) => (
            (this.openingRaw += parseFloat(a.amount))
          )
        );
        this.PRMDTP = returns.data.filter(
          (item) => item.parentNoteName === "Purchased RM during the period"
        );
        this.purchaseRaw = 0;
        this.PRMDTP.forEach(
          (a) => (
            (this.purchaseRaw += parseFloat(a.amount))
          )
        );

        this.avaiableRaw = this.openingRaw + this.purchaseRaw;

        this.CIORM = returns.data.filter(
          (item) => item.parentNoteName === "Raw materials Consumed"
        );
        this.consumeRaw = 0;
        this.CIORM.forEach(
          (a) => (
            (this.consumeRaw += parseFloat(a.amount))
          )
        );

        this.closingRaw = this.avaiableRaw - this.consumeRaw;

        this.OIOPM = returns.data.filter(
          (item) => item.parentNoteName === "Opening inventory of packing materials"
        );
        this.openingPack = 0;
        this.OIOPM.forEach(
          (a) => (
            (this.openingPack += parseFloat(a.amount))
          )
        );


        this.PPMDTP = returns.data.filter(
          (item) => item.parentNoteName === "Purchased of PM during the period"
        );
        this.purchasePack = 0;
        this.PPMDTP.forEach(
          (a) => (
            (this.purchasePack += parseFloat(a.amount))
          )
        );

        this.avaiablePack = this.openingPack + this.purchasePack;

        this.CIPM = returns.data.filter(
          (item) => item.parentNoteName === "Packing materials Consumed"
        );
        this.consumePack = 0;
        this.CIPM.forEach(
          (a) => (
            (this.consumePack += parseFloat(a.amount))
          )
        );

        this.closingPack = this.avaiablePack - this.consumePack;

        this.totalRawPack = this.consumePack + this.consumeRaw;

        this.FO = returns.data.filter(
          (item) => item.parentNoteName === "Factory Overhead"
        );
        this.factoryOverhead = 0;
        this.FO.forEach(
          (a) => (
            (this.factoryOverhead += parseFloat(a.amount))
          )
        );

        this.totalmanucost = this.totalRawPack + this.factoryOverhead;


        this.OWIP = returns.data.filter(
          (item) => item.parentNoteName === "Opening WIP"
        );
        this.openingwip = 0;
        this.OWIP.forEach(
          (a) => (
            (this.openingwip += parseFloat(a.amount))
          )
        );

        this.CWIP = returns.data.filter(
          (item) => item.parentNoteName === "Closing WIP"
        );
        this.closingwip = 0;
        this.CWIP.forEach(
          (a) => (
            (this.closingwip += parseFloat(a.amount))
          )
        );

        this.costofgoodsmenufecture = this.totalmanucost + (this.openingwip - this.closingwip);


        this.OFG = returns.data.filter(
          (item) => item.parentNoteName === "Opening stock of finished goods"
        );
        this.openingFinish = 0;
        this.OFG.forEach(
          (a) => (
            (this.openingFinish += parseFloat(a.amount))
          )
        );

        this.PFGDTP = returns.data.filter(
          (item) => item.parentNoteName === "Purchased of Finished Goods during the period"
        );
        this.purchaseFinish = 0;
        this.PFGDTP.forEach(
          (a) => (
            (this.purchaseFinish += parseFloat(a.amount))
          )
        );

        this.costofgoodsavaiableforsale = this.costofgoodsmenufecture + this.openingFinish + this.purchaseFinish;

        this.CFG = returns.data.filter(
          (item) => item.parentNoteName === "Closing stock of finished goods"
        );
        this.closingFinish = 0;
        this.CFG.forEach(
          (a) => (
            (this.closingFinish += parseFloat(a.amount))
          )
        );
        this.costAfterSales = this.costofgoodsavaiableforsale - this.closingFinish;

        this.PB = returns.data.filter(
          (item) => item.parentNoteName === "Product Bonus"
        );
        this.productBonus = 0;
        this.PB.forEach(
          (a) => (
            (this.productBonus += parseFloat(a.amount))
          )
        );

        this.ID = returns.data.filter(
          (item) => item.parentNoteName === "Inventory destryed"
        );
        this.inventoryDestry = 0;
        this.ID.forEach(
          (a) => (
            (this.inventoryDestry += parseFloat(a.amount))
          )
        );

        this.costAfterBonus = this.costAfterSales - this.productBonus - this.inventoryDestry;

        this.CPS = returns.data.filter(
          (item) => item.parentNoteName === "Cost of Sample from production/Toll(at COG)"
        );
        this.sampleproduction = 0;
        this.CPS.forEach(
          (a) => (
            (this.sampleproduction += parseFloat(a.amount))
          )
        );
        this.cogsReport = this.costAfterBonus - this.sampleproduction;



        this.curFinancialYearName =
          this.todateSelected
            .toString()
            .substring(3, 15);
        this.prevFinancialYearName =
          this.fromdateSelected
            .toString()
            .substring(3, 15);
        this.yearEndDate = this.todateSelected
          .toString()
          .substring(3, 15);

      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }

    });

    this.getReportDataPrevious();
    // this.getReportDataProfit();
  }

  private getReportDataPrevious() {
    this.apiUrl3 = `AccountReport/getRptCostOfGoodsSoldPrevious?companyId=${this.companySelected.id
      }&sbuId=${this.branchSelected.id
      }&noteMasterId=0&fromDate=${this.fromdateSelected
        .toString()
        .substring(3, 15)}&toDate=${this.todateSelected
          .toString()
          .substring(3, 15)}&rptType=SUMMARY`;
    this.commonService.getReportData(this.apiUrl3).subscribe((returns: any) => {
      if (returns.success) {
        this.PrevOIRM = returns.data.filter(
          (item) => item.parentNoteName === "Opening inventory of row materials"
        );
        this.prevopeningRaw = 0;
        this.PrevOIRM.forEach(
          (a) => (
            (this.prevopeningRaw += parseFloat(a.amount))
          )
        );
        this.PrevPRMDTP = returns.data.filter(
          (item) => item.parentNoteName === "Purchased RM during the period"
        );
        this.prevpurchaseRaw = 0;
        this.PrevPRMDTP.forEach(
          (a) => (
            (this.prevpurchaseRaw += parseFloat(a.amount))
          )
        );

        this.prevavaiableRaw = this.prevopeningRaw + this.prevpurchaseRaw;

        this.PrevCIORM = returns.data.filter(
          (item) => item.parentNoteName === "Raw materials Consumed"
        );
        this.prevconsumeRaw = 0;
        this.PrevCIORM.forEach(
          (a) => (
            (this.prevconsumeRaw += parseFloat(a.amount))
          )
        );

        this.prevclosingRaw = this.prevavaiableRaw - this.prevconsumeRaw;

        this.PrevOIOPM = returns.data.filter(
          (item) => item.parentNoteName === "Opening inventory of packing materials"
        );
        this.prevopeningPack = 0;
        this.PrevOIOPM.forEach(
          (a) => (
            (this.prevopeningPack += parseFloat(a.amount))
          )
        );


        this.PrevPPMDTP = returns.data.filter(
          (item) => item.parentNoteName === "Purchased of PM during the period"
        );
        this.prevpurchasePack = 0;
        this.PrevPPMDTP.forEach(
          (a) => (
            (this.prevpurchasePack += parseFloat(a.amount))
          )
        );

        this.prevavaiablePack = this.prevopeningPack + this.prevpurchasePack;

        this.PrevCIPM = returns.data.filter(
          (item) => item.parentNoteName === "Packing materials Consumed"
        );
        this.prevconsumePack = 0;
        this.PrevCIPM.forEach(
          (a) => (
            (this.prevconsumePack += parseFloat(a.amount))
          )
        );

        this.prevclosingPack = this.prevavaiablePack - this.prevconsumePack;

        this.prevtotalRawPack = this.prevconsumePack + this.prevconsumeRaw;

        this.PrevFO = returns.data.filter(
          (item) => item.parentNoteName === "Factory Overhead"
        );
        this.prevfactoryOverhead = 0;
        this.PrevFO.forEach(
          (a) => (
            (this.prevfactoryOverhead += parseFloat(a.amount))
          )
        );

        this.prevtotalmanucost = this.prevtotalRawPack + this.prevfactoryOverhead;


        this.PrevOWIP = returns.data.filter(
          (item) => item.parentNoteName === "Opening WIP"
        );
        this.prevopeningwip = 0;
        this.PrevOWIP.forEach(
          (a) => (
            (this.prevopeningwip += parseFloat(a.amount))
          )
        );

        this.PrevCWIP = returns.data.filter(
          (item) => item.parentNoteName === "Closing WIP"
        );
        this.prevclosingwip = 0;
        this.PrevCWIP.forEach(
          (a) => (
            (this.prevclosingwip += parseFloat(a.amount))
          )
        );

        this.prevcostofgoodsmenufecture = this.prevtotalmanucost + (this.prevopeningwip - this.prevclosingwip);


        this.PrevOFG = returns.data.filter(
          (item) => item.parentNoteName === "Opening stock of finished goods"
        );
        this.prevopeningFinish = 0;
        this.PrevOFG.forEach(
          (a) => (
            (this.prevopeningFinish += parseFloat(a.amount))
          )
        );

        this.PrevPFGDTP = returns.data.filter(
          (item) => item.parentNoteName === "Purchased of Finished Goods during the period"
        );
        this.prevpurchaseFinish = 0;
        this.PrevPFGDTP.forEach(
          (a) => (
            (this.prevpurchaseFinish += parseFloat(a.amount))
          )
        );

        this.prevcostofgoodsavaiableforsale = this.prevcostofgoodsmenufecture + this.prevopeningFinish + this.prevpurchaseFinish;

        this.PrevCFG = returns.data.filter(
          (item) => item.parentNoteName === "Closing stock of finished goods"
        );
        this.prevclosingFinish = 0;
        this.PrevCFG.forEach(
          (a) => (
            (this.prevclosingFinish += parseFloat(a.amount))
          )
        );
        this.prevcostAfterSales = this.prevcostofgoodsavaiableforsale - this.prevclosingFinish;

        this.PrevPB = returns.data.filter(
          (item) => item.parentNoteName === "Product Bonus"
        );
        this.prevproductBonus = 0;
        this.PrevPB.forEach(
          (a) => (
            (this.prevproductBonus += parseFloat(a.amount))
          )
        );

        this.PrevID = returns.data.filter(
          (item) => item.parentNoteName === "Inventory destryed"
        );
        this.previnventoryDestry = 0;
        this.PrevID.forEach(
          (a) => (
            (this.previnventoryDestry += parseFloat(a.amount))
          )
        );

        this.prevcostAfterBonus = this.prevcostAfterSales - this.prevproductBonus - this.previnventoryDestry;

        this.PrevCPS = returns.data.filter(
          (item) => item.parentNoteName === "Cost of Sample from production/Toll(at COG)"
        );
        this.prevsampleproduction = 0;
        this.PrevCPS.forEach(
          (a) => (
            (this.prevsampleproduction += parseFloat(a.amount))
          )
        );
        this.prevcogsReport = this.prevcostAfterBonus - this.prevsampleproduction;

      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }

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
      this.commonService.generateExcel(
        this.OIRM,
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
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
    //this.GetRptBalanceSheetNotes();
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
              if (data.row.index === 2 || data.row.index === 4 || data.row.index === 7 || data.row.index === 9 || data.row.index === 10 || data.row.index === 12 || data.row.index === 15 || data.row.index === 18 || data.row.index === 20 || data.row.index === 23 || data.row.index === 25) {
                //doc.setTextColor(231, 76, 60); // Red
                doc.setFontSize(12);
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



  public getLedgersList(dialog: TemplateRef<any>, noteMasterId, type) {
    this.apiUrlLedgerList = `AccountReport/getRptCostOfGoodsSoldbyParentId?companyId=${this.companySelected.id
      }&sbuId=${this.branchSelected.id
      }&noteMasterId=${noteMasterId}&fromDate=${this.fromdateSelected
        .toString()
        .substring(3, 15)}&toDate=${this.todateSelected
          .toString()
          .substring(3, 15)}&rptType=${type}`;
    this.commonService
      .getReportData(this.apiUrlLedgerList)
      .subscribe((data: any) => {
        if (data.success) {
          this.openWithDataObjModel(dialog);
          this.bodyDataLedgerList = data.data;

          this.noteMasterId = noteMasterId;
          this.noteName = data.data[0].natureName;
          this.noteNo = '';

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

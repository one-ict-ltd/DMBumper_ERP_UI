import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup, NgForm } from "@angular/forms";
import {
  NbComponentStatus,
  NbDialogService,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { AccountgroupService } from "app/services/accountgroup.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { ElementRef } from "@angular/core";

//import { CanvasJS } from "../../../../../../node_modules/canvasjs";
import * as CanvasJS from "../../../../../assets/js/canvasjs.min";
import { VoucherService } from "app/services/transaction/voucher.service";

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: "ngx-accountdashboard",
  templateUrl: "./accountdashboard.component.html",
  styleUrls: ["./accountdashboard.component.scss"],
})
export class AccountdashboardComponent implements OnInit {
  public apiUrl = "";
  public apiUrl2 = "";
  public bodyData2: any = [];
  public apiUrl3 = "";
  public bodyData3: any = [];
  public apiUrlTodayVoucherList = "";
  public bodyDataTodayVoucherList: any = [];

  public todayTotalVoucher = 0;
  public todayTotalReceive = 0;
  public todayTotalPayment = 0;
  public curMonthTotalVoucher = 0;
  public curMonthTotalReceive = 0;
  public curMonthTotalPayment = 0;

  public showPaymentSignature: boolean = false;
  public showReceiptSignature: boolean = false;
  public showJournalSignature: boolean = false;

  //For Report
  public pageNavigation = "Accounting Dashboard";
  public pageNavigationreport = "Voucher Preview";
  public tableHeader = [
    "Account Name",
    "Party Name",
    "Cost Centre Name",
    "Debit (Tk)",
    "Credit (Tk)",
  ];
  private gridApi;
  private gridColumnApi;

  public modules: Module[] = AllCommunityModules;
  public columnDefs;
  public defaultColDef;
  public rowData: [];
  public params = [];
  public bodyData: any = [];
  public TDR = 0;
  public TCR = 0;
  public AmountInWord = "";
  public Narration = "";
  public VoucherNo = "";
  public VoucherDate = "";
  public voucherTypeName = "";
  public CreatedBy = "";

  constructor(
    private http: HttpClient,
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private accountgroupService: AccountgroupService,
    private comboService: CommoncomboService,
    private voucherService: VoucherService
  ) {
    this.getDashboardInfo();
  }

  public getDashboardInfo() {
    //debugger;
    this.apiUrl = `AccountReport/getDashboardDailyVoucher?filterType=Summary&voucherTypeId=0&dateType=`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      this.todayTotalVoucher = returns.data[0].todayTotalVoucher;
      this.todayTotalReceive = returns.data[0].todayTotalReceive;
      this.todayTotalPayment = returns.data[0].todayTotalPayment;
      this.curMonthTotalVoucher = returns.data[0].curMonthTotalVoucher;
      this.curMonthTotalReceive = returns.data[0].curMonthTotalReceive;
      this.curMonthTotalPayment = returns.data[0].curMonthTotalPayment;
    });
  }

  public getTodaysVoucherList(
    dialog: TemplateRef<any>,
    voucherTypeId,
    dateType
  ) {
    //debugger;
    this.apiUrlTodayVoucherList = `AccountReport/getDashboardDailyVoucher?filterType=Details&voucherTypeId=${voucherTypeId}&dateType=${dateType}`;
    this.commonService
      .getReportData(this.apiUrlTodayVoucherList)
      .subscribe((data: any) => {
        if (data.success) {
          //debugger;
          this.openWithDataObjModel(dialog);

          this.bodyDataTodayVoucherList = data.data;
        }
      });
  }

  //////////  Open Modal

  data: Country[] = [
    {
      name: "Russia",
      flag: "f/f3/Flag_of_Russia.svg",
      area: 17075200,
      population: 146989754,
    },
    {
      name: "Canada",
      flag: "c/cf/Flag_of_Canada.svg",
      area: 9976140,
      population: 36624199,
    },
    {
      name: "United States",
      flag: "a/a4/Flag_of_the_United_States.svg",
      area: 9629091,
      population: 324459463,
    },
    {
      name: "China",
      flag: "f/fa/Flag_of_the_People%27s_Republic_of_China.svg",
      area: 9596960,
      population: 1409517397,
    },
  ];

  names: any;

  openWithDataModel() {
    this.dialogService
      .open(DialogNamePromptComponent)
      .onClose.subscribe((name) => name && this.names.push(name));
  }

  public openWithDataObjModel(dialog: TemplateRef<any>) {
    //debugger;
    this.dialogService.open(dialog, {
      context: this.data,
    });
  }

  /////////   End Modal

  currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

  ///////////////////////////// PDF report

  public setParam() {
    this.params = [];
    this.params.push({
      leftLabel: "Voucher No",
      leftValue: "",
      rightLabel: "Voucher Date",
      rightValue: "",
    });
  }
  public datalength: number;

  private getReportData(voucherMasterId) {
    //debugger;
    this.voucherService
      .getVoucherReportById(voucherMasterId)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.bodyData = returns.data;
          this.datalength = returns.data.length * 50;
          //debugger;
          this.TDR = 0;
          this.TCR = 0;
          this.bodyData.forEach((a) => (this.TDR += parseFloat(a.drAmount)));
          this.bodyData.forEach((a) => (this.TCR += parseFloat(a.crAmount)));
          this.VoucherNo = this.bodyData[0].voucherNo;
          this.VoucherDate = this.bodyData[0].voucherDate;
          this.Narration = this.bodyData[0].remarks;
          this.AmountInWord = this.bodyData[0].amountInWord;
          this.voucherTypeName = this.bodyData[0].voucherTypeName;
          this.CreatedBy = this.bodyData[0].fullName;

          if (this.voucherTypeName == "PAYMENT") {
            this.showReceiptSignature = false;
            this.showJournalSignature = false;
            this.showPaymentSignature = true;
          } else if (this.voucherTypeName == "RECEIPT") {
            this.showJournalSignature = false;
            this.showPaymentSignature = false;
            this.showReceiptSignature = true;
          } else {
            this.showPaymentSignature = false;
            this.showReceiptSignature = false;
            this.showJournalSignature = true;
          }

          this.setParam();
          var fileName = this.pageNavigation + ".pdf";
          const content = document.getElementById("reportHeader");
          this.generateReport("print", fileName, content, this.datalength);
          // this.showbody = true;
        } else {
          this.toastrService.danger("Message", this.commonService.nodatafound);
        }
      });
  }

  public generateVoucherReport(voucherMasterId) {
    this.getReportData(voucherMasterId);
  }

  public generateReport(
    buttonAction: any,
    fileName: string,
    content: any,
    datalength: number
  ) {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(5);
    doc.setTextColor(40);

    var legend = {
      height: 100,
      totalheight: 100 + datalength,
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
          startY: legend.height + 20,
          styles: { font: "Meta", fontSize: 14, halign: "center" },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
        });

        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 60,
          styles: { font: "Meta", fontSize: 11 },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 100,
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
            textColor: 50,
          },
          columnStyles: {
            3: { halign: "right" },
            4: { halign: "right" },
          },

          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });

        autoTable(doc, {
          html: "#footer_table",
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
          },
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

  ngOnInit(): void {
    this.apiUrl2 = `AccountReport/getDashboardTotalVoucherByType`;
    this.commonService.getReportData(this.apiUrl2).subscribe((returns: any) => {
      //this.bodyData2 = returns.data;

      //Insert Array Assignment function here
      for (var i = 0; i < returns.data.length; i++) {
        this.bodyData2.push({
          label: returns.data[i].voucherTypeName,
          y: returns.data[i].totalVoucher,
        });
      }

      let chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        exportEnabled: true,
        title: {
          text: "Monthly Total Voucher by Type",
        },
        data: [
          {
            type: "column",
            dataPoints: this.bodyData2,
            // dataPoints: [
            //   { y: 70, label: "Payment" },
            //   { y: 55, label: "Receive" },
            //   { y: 50, label: "Journal" },
            //   { y: 65, label: "Contra" }
            // ]
          },
        ],
      });
      chart.render();
    });

    this.apiUrl3 = `AccountReport/getDashboardGroupNaturePercent`;
    this.commonService.getReportData(this.apiUrl3).subscribe((returns: any) => {
      for (var i = 0; i < returns.data.length; i++) {
        this.bodyData3.push({
          name: returns.data[i].natureName,
          y: returns.data[i].totalAmount,
        });
      }

      let chart2 = new CanvasJS.Chart("chartContainer2", {
        theme: "light2",
        animationEnabled: true,
        exportEnabled: true,
        title: {
          text: "Monthly Voucher Percentage by Nature",
        },
        data: [
          {
            type: "pie",
            showInLegend: true,
            toolTipContent: "<b>{name}</b>: ${y} (#percent%)",
            indexLabel: "{name} - #percent%",
            dataPoints: this.bodyData3,
            // dataPoints: [
            //   { y: 450, name: "Assets" },
            //   { y: 220, name: "Liabilities" },
            //   { y: 500, name: "Incomes" },
            //   { y: 400, name: "Expenses" }
            // ]
          },
        ],
      });

      chart2.render();
    });
  }
}

import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { formatDate } from "@angular/common";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { NbToastrService } from "@nebular/theme";
import { CommonService } from "app/@core/mock/common.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { SalesRemittanceService } from "app/services/sales/sales-remittance.service";
import { take } from "rxjs/operators";
import * as XLSX from "xlsx-js-style";

@Component({
  selector: "ngx-cash-inhand-report",
  templateUrl: "./cash-inhand-report.component.html",
  styleUrls: ["./cash-inhand-report.component.scss"],
})
export class CashInhandReportComponent implements OnInit {
  formSalesRemittanceSummary: FormGroup;
  pageNavigation = "Cash in Hand Report";
  showbody = false;
  submitted = true;

  public columnDefs;
  public defaultColDef;
  public rowData: [];
  private gridApi;
  private gridColumnApi;
  public frameworkComponents: {};
  bankList: any[] = [];
  bankItems: any[] = [];
  depotList: any[] = [];
  bodyData: any = [];
  noDataAvailable: boolean = false;

  fromdateSelected = new Date();
  todateSelected = new Date();
  depotCode: any = "";
  bankId: any = 0;
  apiUrl = "";
  fDate: Date;
  tDate: Date;
  public depotSelected: any = {};
  public bankSelected: any = {};
  public tableHeaderP = [];
  public tableHeaderPP = [];

  userProfile: any[];
  companyName: string;
  companyAlias: string;
  reportTitleName: string = "Cash In Hand Report";
  dateRange: string;
  totalCashInHandAmount: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private comboService: CommoncomboService,
    private remittanceService: SalesRemittanceService
  ) {
    this.fDate = new Date();
    this.tDate = new Date();
    this.depotSelected = null;
    this.bankSelected = null;
    this.userProfile = commonService.GetUserProfileJson();
    this.companyName = this.userProfile[0].uc[0].companyName;
    this.companyAlias = this.userProfile[0].uc[0].aliasName;
  }

  ngOnInit(): void {
    this.createSalesRemittanceForm();
    this.loadDropDowns();
    //this.setColumnDef();
    this.getBankList();
  }

  loadDropDowns(): void {
    //this.getDepotList();
    this.GetAllDepo();
    this.getBankList();
  }

  public GetAllDepo() {
    this.depotSelected = {};

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
          this.depotSelected = {
            id: this.depotList[0].id,
            name: this.depotList[0].name,
          };
          this.depotCode = this.depotList[0].id;
        }
        //}
      }
    });
  }

  // depotSelected = {}

  // getDepotList(): void {
  //   this.comboService.GetDepotList().pipe(take(1)).subscribe(
  //     (returns: any) => {
  //       if (returns.success) {
  //         const depotDropdown=   returns.data.map((val) => ({
  //           value: val.depotCode,
  //           text: val.depotName,
  //         }));

  //         this.depotSelected = depotDropdown[0];
  //         this.depotList = [...depotDropdown];

  //       }
  //     }
  //   )
  // }

  public getBankList() {
    this.bankSelected = {};
    this.apiUrl = "";
    this.apiUrl = `SalesInvoice/GetAllDepot`;
    this.comboService
      .getBank(0, 0)
      .pipe(take(1))
      .subscribe((returns: any) => {
        this.bankItems = returns.data.map((val: any) => ({
          id: val.bankId,
          name: val.bankName,
        }));
      });
  }

  // getBankList(): void {
  //   this.comboService.getBank(0, 0).pipe(take(1)).subscribe(
  //     (returns: any) => {
  //       if (returns.success) {
  //         const bankDropdown = returns.data.map((val) => ({
  //           value: val.bankId,
  //           text: val.bankName,
  //         }));
  //         this.bankList = [...bankDropdown];
  //       }
  //     }
  //   )
  // }

  onChange(event: any) {
    console.log(event);
  }

  RptButtonAction(): void {
    const clicked = this.commonService.buttonClicked;
    if (clicked == "preview") {
      this.onPreview();
    } else if (clicked == "pdf") {
      this.generateCrReport("pdf");
    } else if (clicked == "print") {
      this.generateCrReport("pdf");
    } else if (clicked == "csv") {
      this.ExportTOExcel(this.reportTitleName);
    } else if (clicked == "refresh") {
      this.onRefresh();
    } else if (clicked == "email") {
      //this.onEmail();
    } else {
      this.toastrService.warning("Message", "please clicked any button");
    }
  }

  setColumnDef(): void {
    this.columnDefs = [
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.rowIndex + 1",
        pinned: "left",
        filter: false,
        width: 50,
      }, /// Dont Change
      {
        headerName: "Sl. No",
        field: "remittanceNo",
        width: 160,
      },
      {
        headerName: "Depot Name",
        field: "remittanceDate",
        width: 160,
        valueFormatter: (params) =>
          formatDate(params.data.remittanceDate, "dd-MMM-yyyy", "en"),
      },
      {
        headerName: "Cash On Hand",
        field: "remittanceTypeName",
        width: 160,
      },
    ];
    this.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: true,
    };
  }

  createSalesRemittanceForm(): void {
    this.formSalesRemittanceSummary = this.formBuilder.group({
      depotCode: new FormControl("", Validators.required),
      bankId: new FormControl(""),
      fromDate: new FormControl(new Date(), Validators.required),
      toDate: new FormControl(new Date(), Validators.required),
    });
    this.submitted = false;
  }

  private onPreview() {
    this.getReportData();
  }

  private getReportData() {
    let userInfo = this.commonService.GetUserProfileJson();
    debugger;
    this.apiUrl = "";
    this.apiUrl = `SalesInvoice/GetCashInHand?DepotCode=${
      this.depotCode
    }&userId=${userInfo[0].employeeid}&fDate=${this.commonService.DateFormat(
      this.fDate
    )}`;

    this.tableHeaderP = ["Sl. No.", "Depot Name", "Cash In Hand"];
    this.showbody = true;

    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      this.bodyData = [];
      let totalCashInHandAmount = 0;

      if (returns.success) {
        this.bodyData = returns.data.map((item, index) => {
          item.sl = index + 1;
          totalCashInHandAmount += item.CashInHand;

          return item;
        });
      } else {
        this.noDataAvailable = true;
      }
      this.totalCashInHandAmount = totalCashInHandAmount;
      let fDate = this.formatDate(this.fDate);
      this.dateRange = "As On Date: " + fDate;
    });
  }

  private formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? "0" + day : day}-${
      month < 10 ? "0" + month : month
    }-${year}`;
  }

  @ViewChild("simple_table", { static: false }) TABLE: ElementRef;
  //title = 'Excel';

  ExportTOExcel(fileName: string) {
    console.log(fileName);
    // debugger;
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      this.TABLE.nativeElement
    );

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    fileName = fileName + ".xlsx";
    console.log(fileName);
    XLSX.writeFile(wb, fileName);
  }
  onRefresh(): void {
    this.createSalesRemittanceForm();
    this.loadDropDowns();
    this.showbody = false;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getReportData();
  }

  generateCrReport(reportFormat: any) {
    let userInfo = this.commonService.GetUserProfileJson();
    // const params = this.formSalesRemittanceSummary.getRawValue();

    debugger;

    let depotCode =
      this.depotSelected === (undefined || null)
        ? ""
        : this.depotSelected["id"];
    let bankId =
      this.bankSelected === (undefined || null) ? "" : this.bankSelected["id"];
    if (!depotCode || depotCode == "") {
      depotCode = "";
      if (this.depotList.length == 1) {
        return;
      }
    }
    if (!bankId) bankId = "";

    // const apiUrl = `SalesRemittance/GetRemittanceSummary?depotCode=${depotCode}&fromDate=${this.commonService.DateFormat(this.fDate)}&toDate=${this.commonService.DateFormat(this.tDate)}&bankId=${bankId}`;

    const apiUrl = `SalesInvoiceReport/GetCashInHandReport?reportFormat=Pdf&userId=${
      userInfo[0].employeeid
    }&depotCode=${depotCode}&fDate=${this.commonService.DateFormat(
      this.fDate
    )}`;

    this.commonService
      .GetCrystalReportData(apiUrl)
      .pipe(take(1))
      .subscribe((returns: any) => {
        let res = JSON.parse(returns);
        if (res.status) {
          this.commonService.GenerateBase64ToReport(res.data[0].data);
        } else {
          this.toastrService.warning("Message", this.commonService.nodatafound);
        }
      });
  }
}

import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { CommonService } from 'app/@core/mock/common.service';
import { CommoncomboService } from 'app/services/commoncombo.service';
import { SalesRemittanceService } from 'app/services/sales/sales-remittance.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'ngx-sales-remittance-summary',
  templateUrl: './sales-remittance-summary.component.html',
  styleUrls: ['./sales-remittance-summary.component.scss']
})
export class SalesRemittanceSummaryComponent implements OnInit {


  formSalesRemittanceSummary: FormGroup;
  pageNavigation = "Remittance Summary";
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

  fromdateSelected = new Date();
  todateSelected = new Date();
  depotCode: any = "";
  bankId: any = 0;
  apiUrl = "";
  fDate: Date;
  tDate: Date;
  public depotSelected: any = {};
  public bankSelected: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private comboService: CommoncomboService,
    private remittanceService: SalesRemittanceService,
  ) {
    this.fDate = new Date();
    this.tDate = new Date();
    this.depotSelected = null;
    this.bankSelected = null;
  }

  ngOnInit(): void {
    this.createSalesRemittanceForm();
    this.loadDropDowns();
    this.setColumnDef();
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
          this.depotSelected = { id: this.depotList[0].id, name: this.depotList[0].name };
          this.depotCode = this.depotList[0].id;
        }
        //}
      }
    })
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
    this.comboService.getBank(0, 0).pipe(take(1)).subscribe(
      (returns: any) => {
        this.bankItems = returns.data.map((val: any) => ({
          id: val.bankId,
          name: val.bankName,
        }));
      })
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
    console.log(event)
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
      this.generateCrReport("Excel");
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
        headerName: "R.S. No",
        field: "remittanceNo",
        width: 130,
      },
      {
        headerName: "R.S. Date",
        field: "remittanceDate",
        width: 140,
        valueFormatter: (params) => formatDate(params.data.remittanceDate, 'dd-MMM-yyyy', 'en')
      },
      {
        headerName: "R.S. Type",
        field: "remittanceTypeName",
        width: 130,
      },
      {
        headerName: "OPL Tran No",
        field: "oplTranNo",
        width: 140,
      },
      {
        headerName: "Bank",
        field: "bankName",
        width: 220,
      },
      {
        headerName: "Branch",
        field: "bankBranchName",
        width: 200,
      },
      {
        headerName: "Deposit Date",
        field: "depositDate",
        width: 150,
        valueFormatter: (params) => formatDate(params.data.depositDate, 'dd-MMM-yyyy', 'en')
      },
      {
        headerName: "Amount",
        field: "depositAmount",
        width: 150,
        valueFormatter: (params) =>
          this.commonService.currencyFormatter(params.data.depositAmount),
        type: "rightAligned",
      }
    ];
    this.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: true,
    };
  }

  createSalesRemittanceForm(): void {
    this.formSalesRemittanceSummary = this.formBuilder.group({
      depotCode: new FormControl('', Validators.required),
      bankId: new FormControl(''),
      fromDate: new FormControl(new Date(), Validators.required),
      toDate: new FormControl(new Date(), Validators.required)
    });
    this.submitted = false;
  }

  private onPreview() {
    this.getReportData();
    this.showbody = true;
    // if (this.formSalesRemittanceSummary.valid) {
    //   this.getReportData();
    //   this.showbody = true;
    // } else {
    //   this.toastrService.warning("Please Check Data","Message");
    // }
  }

  getReportData(): void {
    //const params = this.formSalesRemittanceSummary.getRawValue();
    // console.log(params);
    debugger

    let depotCode = (this.depotSelected === (undefined || null)) ? '' : this.depotSelected["id"];
    let bankId = (this.bankSelected === (undefined || null)) ? '' : this.bankSelected["id"];
    if (!depotCode || depotCode == "") {
      depotCode = "";
      if (this.depotList.length == 1) {
        return;
      }
    }
    if (!bankId) bankId = "";

    const apiUrl = `SalesRemittance/GetRemittanceSummary?depotCode=${depotCode}&fromDate=${this.commonService.DateFormat(this.fDate)}&toDate=${this.commonService.DateFormat(this.tDate)}&bankId=${bankId}`;
    //console.log(apiUrl);
    this.commonService.getReportData(apiUrl).pipe(take(1)).subscribe((returns: any) => {
      if (returns.success) {
        this.rowData = returns.data;
      } else {
        this.toastrService.danger(this.commonService.nodatafound, "Message");
      }
    });
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
    const fromDate = this.fDate;
    const toDate = this.tDate;
    if (this.commonService.validateDates(fromDate, toDate)) {
      let userInfo = this.commonService.GetUserProfileJson();
      // const params = this.formSalesRemittanceSummary.getRawValue();

      debugger

      let depotCode = (this.depotSelected === (undefined || null)) ? '' : this.depotSelected["id"];
      let bankId = (this.bankSelected === (undefined || null)) ? '' : this.bankSelected["id"];
      if (!depotCode || depotCode == "") {
        depotCode = "";
        if (this.depotList.length == 1) {
          return;
        }
      }
      if (!bankId) bankId = "";

      // const apiUrl = `SalesRemittance/GetRemittanceSummary?depotCode=${depotCode}&fromDate=${this.commonService.DateFormat(this.fDate)}&toDate=${this.commonService.DateFormat(this.tDate)}&bankId=${bankId}`;

      const apiUrl = `SalesInvoiceReport/GetRemittanceSummaryReport?userId=${userInfo[0].employeeid}&depotCode=${depotCode}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&bankId=${bankId}&reportFormat=${reportFormat}`;

      this.commonService.GetCrystalReportData(apiUrl).pipe(take(1)).subscribe((returns: any) => {
        let res = JSON.parse(returns);
        if (res.status) {
          this.commonService.GenerateBase64ToReport(res.data[0].data);
        } else {
          this.toastrService.warning("Message", this.commonService.nodatafound);
        }
      });
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { CommonService } from 'app/@core/mock/common.service';
import { CommoncomboService } from 'app/services/commoncombo.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'ngx-territory-officer-wise-collection',
  templateUrl: './territory-officer-wise-collection.component.html',
  styleUrls: ['./territory-officer-wise-collection.component.scss']
})
export class TerritoryOfficerWiseCollectionComponent implements OnInit {

  frmParams: FormGroup;
  pageNavigation = "Territory Officer Wise Collection";
  showbody = false;
  submitted = true;

  public columnDefs;
  public defaultColDef;
  public rowData: [];
  private gridApi;
  private gridColumnApi;
  public frameworkComponents: {};


  fromdateSelected = new Date();
  todateSelected = new Date();
  depotCode: any = "";
  apiUrl = "";
  fDate: Date;
  tDate: Date;
  isDepotUser = false;

  depotList: any[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private comboService: CommoncomboService,
  ) {
    this.fDate = new Date();
    this.tDate = new Date();
  }

  ngOnInit(): void {
    this.createParamsForm();
    this.loadDropDowns();
    this.setColumnDef();
  }

  loadDropDowns(): void {
    // this.getDepotList();
    this.GetAllDepo();
  }

  depotSelected = {};
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
          this.isDepotUser = true;
        }
        //}
      }
    })
  }


  getDepotList(): void {
    this.comboService.GetDepotList().pipe(take(1)).subscribe(
      (returns: any) => {
        if (returns.success) {
          const depotDropdown = returns.data.map((val) => ({
            value: val.depotCode,
            text: val.depotName,
          }));
          this.depotList = [...depotDropdown];
        }
      }
    )
  }

  createParamsForm(): void {
    this.frmParams = this.formBuilder.group({
      depotCode: new FormControl('', Validators.required),
      fromDate: new FormControl(new Date(), Validators.required),
      toDate: new FormControl(new Date(), Validators.required)
    });
    this.submitted = false;
  }


  RptButtonAction(): void {
    const clicked = this.commonService.buttonClicked;
    if (clicked == "preview") {
      this.onPreview();
    } else if (clicked == "pdf") {
      this.generateCrReport("Pdf");
    } else if (clicked == "print") {
      this.generateCrReport("Pdf");
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
        headerName: "MIO Name",
        field: "territoryOfficerName",
        width: 380,
      },
      {
        headerName: "Designation",
        field: "designation",
        width: 300,
      },
      {
        headerName: "Territory",
        field: "territoryName",
        width: 550,
      },
      {
        headerName: "Amount",
        field: "collectionAmount",
        width: 240,
        valueFormatter: (params) =>
          this.commonService.currencyFormatter(params.data.collectionAmount),
        type: "rightAligned",
        pinned: "right",
      }
    ];
    this.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: true,
    };
  }

  private onPreview() {
    const fromDate = this.fDate;
    const toDate = this.tDate;
    if (this.commonService.validateDates(fromDate, toDate)) {

      this.getReportData();
      this.showbody = true;
      // if (this.frmParams.valid) {
      //   this.getReportData();
      //   this.showbody = true;
      // } else {
      //   this.toastrService.warning("Please Check Data","Message");
      // }
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
  }

  getReportData(): void {
    debugger
    let depotCode = this.depotSelected == (undefined || null) ? '' : this.depotSelected["id"];
    if (!depotCode || depotCode == "") {
      depotCode = "";
      if (this.depotList.length == 1) {
        return;
      }
    }
    const apiUrl = `SalesCollection/GetTerritoryOfficerWiseCollection?depotCode=${depotCode}&fromDate=${this.commonService.DateFormat(this.fDate)}&toDate=${this.commonService.DateFormat(this.tDate)}`;
    // console.log(apiUrl);
    this.commonService.getReportData(apiUrl).pipe(take(1)).subscribe((returns: any) => {
      if (returns.success) {
        //console.log(returns.data);
        this.rowData = returns.data;
      } else {
        this.toastrService.danger(this.commonService.nodatafound, "Message");
      }
    });
  }




  onRefresh(): void {
    this.createParamsForm();
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
      let depotCode = this.depotSelected == (undefined || null) ? '' : this.depotSelected["id"];
      if (!depotCode || depotCode == "") {
        depotCode = "";
        if (this.depotList.length == 1) {
          return;
        }
      }
      const apiUrl = `SalesInvoiceReport/GetTerritoryOfficerWiseCollectionReport?userId=${userInfo[0].employeeid}&depotCode=${depotCode}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&reportFormat=${reportFormat}`;

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

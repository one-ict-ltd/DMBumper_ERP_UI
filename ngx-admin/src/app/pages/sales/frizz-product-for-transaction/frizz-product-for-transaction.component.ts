import { Component, OnInit } from '@angular/core';
import { NbDateService, NbToastrService } from '@nebular/theme';
import { CommonService } from 'app/@core/mock/common.service';
import { CommoncomboService } from 'app/services/commoncombo.service';
import { BillcollectionService } from 'app/services/sales/billcollection.service';
import { SalesinvoiceService } from 'app/services/sales/salesinvoice.service';
import { BtnCellRenderer } from '../settings/common/btn-cell-renderer.component';
import { ProductrequisitionService } from 'app/pages/purchase/settings/productrequisition.service';

@Component({
  selector: 'ngx-frizz-product-for-transaction',
  templateUrl: './frizz-product-for-transaction.component.html',
  styleUrls: ['./frizz-product-for-transaction.component.scss']
})
export class FrizzProductForTransactionComponent implements OnInit {

  pageNavigation: any = "Update Frizz Product's Status";
  show: boolean = true;
  private gridApi;
  private gridColumnApi;

  public columnDefs;
  public defaultColDef;
  public rowData: [];
  public noOfProduct: number = 0;
  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };
  public bodyData: any[];

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    protected dateService: NbDateService<Date>,
    private salesinvoiceService: SalesinvoiceService,
    private billcollectionService: BillcollectionService,
    private productrequisitionService: ProductrequisitionService
  ) {
    debugger
    //this.commonService.valueSet("showlist");
    this.commonService.valueSet("create");
    this.show = false;
    this.grdFromDate = new Date();
    this.grdToDate = new Date();
    this.getServerDateTime();
    this.columnDefs = [
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.rowIndex + 1",
        pinned: "left",
        filter: false,
        width: 70,
      },

      {
        headerName: "Date",
        field: "moneyReceiptDate",
        width: 160,
      },
      {
        headerName: "Money Receipt Book",
        field: "moneyBook",
        width: 180,
        type: "rightAligned",
      },
      {
        headerName: "Page Range",
        field: "pageRange",
        width: 180,
      },
      {
        headerName: "Depot Name",
        field: "DepotName",
        width: 200,
      },
      {
        headerName: "Territory Name",
        field: "TerritoryName",
        width: 200,
      },
      {
        field: "Action",
        cellRenderer: "btnCellRenderer",
        cellRendererParams: {
          clicked: function (field: any) { },
        },
        minWidth: 200,
        editable: false,
        filter: false,
        shorable: false,
        pinned: "right",
      },
    ];

    this.frameworkComponents = {
      btnCellRenderer: BtnCellRenderer,
    };
    this.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: true,
    };
    this.getAllProductForRequisition();
    this.getMaster();

  }

  ngOnInit(): void {
    localStorage.setItem("button", "");
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    //this.GetGridData();
  }
  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      this.getSelectedList(this.productSpecList);
      if (this.ValidationForSave() == false) {
        this.commonService.valueSet("create");
        return;
      };
      this.save();
    } else if (this.commonService.buttonClicked == "update") {
      if (this.ValidationForSave() == false) {
        this.commonService.valueSet("create");
        return;
      };
      this.save();
      this.commonService.valueSet("create");
    } else if (this.commonService.buttonClicked == "view") {
      this.show = false;
    } else if (this.commonService.buttonClicked == "reset") {
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      this.show = false;
      this.toastrService.info("Edit Button Click.", "Message")
    }
  }
  private selectedRows = [];
  public onRowClicked(event) {
    this.selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked;
    if (data == "edit") {
      this.toastrService.info("Access denied", "Message");

      // this.getMaster();
      // this.agEdit(event);
      // this.show = false;
    } else if (data == "view") {
      this.toastrService.info("Access denied", "Message");
      // this.agEdit(event);
      // this.show = false;
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
      this.agDelete(event);
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }

  minDate: Date = new Date();
  maxDate: Date = new Date();
  currentDate: Date = new Date();
  getServerDateTime() {
    let apiUrl = `menu/getServerDateTime`;
    this.commonService.getApiData(apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.currentDate = new Date(returns.data[0].currentDate);
        this.minDate = this.dateService.addDay(new Date(returns.data[0].maxDate), -180);
        this.maxDate = this.dateService.addDay(new Date(returns.data[0].maxDate), 0);
      } else {
        this.currentDate = new Date();
        this.minDate = new Date();
        this.maxDate = new Date();
      }
    });
  }

  grdFromDate: Date = new Date();
  grdToDate: Date = new Date();
  GetGridData() {
    // debugger;
    // this.billcollectionService.GetAllMoneyReceipt(0, this.commonService.DateFormat(this.grdFromDate), this.commonService.DateFormat(this.grdToDate)).subscribe((data: any) => {
    //   if (data.success) {
    //     this.rowData = data.data;
    //     console.log(data.data);
    //   }
    // });
  }

  master: {
    moneyReceiptDate: Date,
    depotCode: string,
    batchNo: string,
    territoryCode: string,
    mioCode: string,
    moneyReceiptBook: string,
    fromPageNo: number,
    toPageNo: number,
    lstDetailsViewModel: any[];
    fromNumber: number,
    toNumber: number,
    productWiseSpecificationId: number,
    isSelect: number
  };

  public getMaster() {
    this.master = {
      moneyReceiptDate: new Date,
      depotCode: "",
      batchNo: "",
      territoryCode: "",
      mioCode: "",
      fromPageNo: 0,
      toPageNo: 0,
      moneyReceiptBook: '',
      lstDetailsViewModel: null,
      fromNumber: 0,
      toNumber: 0,
      productWiseSpecificationId: 0,
      isSelect: 0
    };

    this.depotSelected = null;
    this.territorySelected = null;
    this.mioSelected = null;
    this.mrTypeSelected = null;
    this.PaymentModeSelected = null;
    this.frizzStatusSelected = { id: 2, name: 'All' };

    //this.ChangeNumber();
    //this.GetAllBatchNo();
  }

  PaymentModeList = [];
  paymentModeId: number = 0;
  PaymentModeSelected: any = {};


  frizzStatusList: any = [{ 'id': 2, 'name': 'All' }, { 'id': 1, 'name': 'Frizzed' }, { 'id': 0, 'name': 'Un-Frizzed' }];
  frizzStatusSelected: any;

  public getPaymentMode() {
    this.PaymentModeList = [];
    this.paymentModeId = 0;
    this.PaymentModeSelected = null;
    this.billcollectionService.getpaymentMode().subscribe((retuns: any) => {
      if (retuns.success) {
        this.PaymentModeList = retuns.data.map((val: any) => ({
          id: val.paymentModeId,
          name: val.paymentMode,
        }));
      }
    })
  }

  apiUrl: string = "";
  mrTypeList: any = [];
  mrTypeSelected: any = {};
  GetMoneyReceiptType() {
    this.mrTypeList = [];
    this.mrTypeSelected = {};
    this.apiUrl = `SalesInvoice/GetMoneyReceiptType`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.mrTypeList = returns.data.map((val: any) => ({
          id: val.mrTypeId,
          name: val.mrTypeName,
        }));
      }
    });
  }

  batchList: any[];
  batchSelected = {};

  public GetAllBatchNo() {
    this.depotList = [];
    this.apiUrl = `Stock/getAllBatchFromStock`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.batchList = returns.data.map((val: any) => ({
          id: val.batchNo,
          name: val.batchNo,
        }));
      }
    });
  }

  depotList: any[];
  depotSelected = {};

  public GetAllDepo() {
    this.depotList = [];
    this.apiUrl = `SalesInvoice/GetAllDepot`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.depotList = returns.data.map((val: any) => ({
          id: val.depotCode,
          name: val.depotName,
        }));
      }
    });
  }

  territoryList = [];
  territorySelected: any = {};
  getAllTerritory(depotCode: any = '') {
    this.territoryList = [];
    this.salesinvoiceService.GetAllTerritoryForDepot(depotCode).subscribe((returns: any) => {
      if (returns.success) {
        this.territoryList = returns.data.map((val: any) => ({
          id: val.TerritoryCode,
          name: val.TerritoryName,
        }));
      }
    });
  }

  mioList: any = [];
  mioSelected: any = {};
  public GetAllMIOByTerritory() {
    this.mioList = [];
    this.comboService
      .GetAllMIOByTerritory(this.master.territoryCode)
      .subscribe((returns: any) => {
        if (returns.status) {
          debugger;
          console.log(returns);
          this.mioList = returns.data.map((val: any) => ({
            id: val.employeeNo,
            name: val.mioName,
          }));
        }
      });
  }



  addToDetailsGrid(): void {
    this.master.lstDetailsViewModel = [];
    for (let i = this.master.fromNumber; i <= this.master.toNumber; i++) {
      this.master.lstDetailsViewModel.push({ number: i });
    }
    this.show = false;
  }

  checkedChildCount: number = 0;
  ValidationForSave(): boolean {

    if (this.master.lstDetailsViewModel == null || this.master.lstDetailsViewModel == undefined) {
      this.toastrService.warning(`No data seleceted !`, "Message");
      return false;
    }
    if (this.master.moneyReceiptBook == undefined || this.master.moneyReceiptBook == null) {
      this.toastrService.warning(`Please enter a MR book number !`, "Message");
      return false;
    }
    return true;
  }

  private save() {
    debugger
    var button = this.commonService.buttonClicked;
    //this.show = true;
    this.productrequisitionService
      .updateFrizzProductStatus(this.master.lstDetailsViewModel)
      .subscribe((returns: any) => {
        if (returns.success) {
          if (button == "update") {
            this.toastrService.success(
              this.commonService.updatedmsg,
              "Message"
            );
            this.getAllProductForRequisition();
          } else {
            this.toastrService.success(
              this.commonService.successmsg,
              "Message"
            );
            this.getAllProductForRequisition();
          }
          this.bodyData = [];
          this.commonService.valueSet("create");
          //this.GetGridData();

        }
        else {
          this.toastrService.danger(this.commonService.failedmsg, "Message");
        }
      });
    this.getMaster();
    this.getAllProductForRequisition();
    this.noOfProduct = this.productSpecList.filter(x => x.isSelect === true).length;
  }

  private agEdit(event) {

  }

  private reset() {
    this.getMaster();
  }

  selectedRow: any;
  onRefesh() {
    this.selectedRow = "";
    this.ngOnInit();
    this.toastrService.warning("warning", this.commonService.warningmsg);
  }
  agReport(event: any) {
    // this.apiUrl = "";
    // let userInfo = this.commonService.GetUserProfileJson();
    // this.apiUrl = `SalesInvoiceReport/GetMoneyReceiptNoteReportById?reportFormat=Pdf&userId=${userInfo[0].employeeid}&masterId=${event.node.data.moneyReceiptId}`;
    // this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
    //   let res = JSON.parse(returns);
    //   if (res.status) {
    //     this.commonService.GenerateBase64ToReport(res.data[0].data);
    //   } else {
    //     console.log(res.message);
    //     this.toastrService.warning("Message", this.commonService.nodatafound);
    //   }
    // });
  }

  agDelete(event: any) {

  }


  isSelectAll: boolean = false;
  checkCounter: number = 0;
  checkAllChange(e: any) {
    debugger
    let isChecked: boolean = false;
    isChecked = e.target.checked;

    this.productSpecList.forEach(element => {
      element.isSelect = isChecked;
    });
  }

  checkChange(e: any) {
    debugger
    let isChecked: boolean = false;
    isChecked = e.target.checked;
    this.productSpecList;

    this.productSpecList.forEach(element => {
      if (!e.node.data.isUpdate) {
        e.node.data.isUpdate = isChecked;
        e.node.data.isSelect = isChecked;
      }
      else {
        e.node.data.isSelect = isChecked;
      }

    });
  }
  getSelectedList(myData: any) {
    debugger
    this.master.lstDetailsViewModel = [];
    myData.forEach((data) => {
      var obj = {
        productWiseSpecificationId: data.id,
        isSelect: data.isSelect,
        isUpdate: data.isUpdate,
        batchNumbers: data.batchNumbers
      }
      this.master.lstDetailsViewModel.push(obj);
    });
  }
  onChangeDropDown(controll: string, event: any) {
    debugger
    if (controll == 'product' && (event == null || event == undefined)) {

      this.master.productWiseSpecificationId = 0;
      //this.filterTableData(0);

    }
    else if (controll == 'status' && (event == null || event == undefined)) {

      this.master.isSelect = 2;
      this.getAllProductForRequisition();
    }
    //this.filterTableData(this.master.productWiseSpecificationId);

  }
  productSelected = {};
  public productSpecList = [];
  productSpecListForFilter = [];
  public getAllProductForRequisition() {
    this.productrequisitionService
      .getAllProductForFrizz()
      .subscribe((returns: any) => {
        if (returns.success) {
          this.productSpecList = returns.data.map((val: any) => ({
            id: val.productWiseSpecificationId,
            name: val.productName,
            uomId: val.uomId,
            uomName: val.uomName,
            productId: val.productId,
            price: val.price,
            frizzStatus: val.frizzStatus,
            isSelect: val.isSelect,
            batchNumbers: val.batchNumbers
          }));
          //this.productSpecListForFilter = this.productSpecList;
          this.noOfProduct = this.productSpecList.filter(x => x.isSelect == true).length;
        }
      });
  }

  // filteredProductSpecList = [];
  // filterTableData(productWiseSpecificationId: number) {
  //   debugger
  //   let frizzStatus = this.frizzStatusSelected.id;
  //   if (productWiseSpecificationId > 0) {
  //     this.filteredProductSpecList = this.productSpecList.filter(x => x.id == productWiseSpecificationId);
  //   }
  //   if (productWiseSpecificationId == 0) {
  //     this.filteredProductSpecList = this.productSpecList;
  //   }
  //   if (frizzStatus != null || frizzStatus != undefined) {
  //     if (frizzStatus != 2) {
  //       this.filteredProductSpecList = this.productSpecList.filter(x => x.isSelect == frizzStatus);
  //     }

  //     this.productSpecList = this.filteredProductSpecList;

  //   }
  // }


}

import { AllCommunityModules, Module } from '@ag-grid-community/all-modules';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NbComponentStatus, NbDateService, NbGlobalLogicalPosition, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrConfig, NbToastrService } from '@nebular/theme';
import { CommonService } from 'app/@core/mock/common.service';
import { ProductrequisitionService } from 'app/pages/purchase/settings/productrequisition.service';
import { CommoncomboService } from 'app/services/commoncombo.service';
import { SalesinvoiceService } from 'app/services/sales/salesinvoice.service';
import { BtnCellRenderer } from '../settings/common/btn-cell-renderer.component';
import { BtnCellRendererWithoutPrintService } from '../settings/common/btn-cell-renderer-without-print.service';

@Component({
  selector: 'ngx-product-monitor',
  templateUrl: './product-monitor.component.html',
  styleUrls: ['./product-monitor.component.scss']
})
export class ProductMonitorComponent implements OnInit {


  master: {
    monitorId: number;
    territoryCode: string;
    productWiseSpecificationId: number;
    fromDate: Date;
    toDate: Date;
    lstProductMonitor: any[];
  };

  disabled: boolean = false;
  config: NbToastrConfig;
  index = 1;
  destroyByClick = true;
  duration = 2000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  preventDuplicates = false;
  status: NbComponentStatus = "primary";
  public productSpecList = [];
  public territoryList = [];

  productSpecSelected = {
    id: null,
    name: 'Select Product'
  }

  territorySelected = {
    id: null,
    name: 'Select Territory'
  }

  title = "HI there!";
  content = `I'm cool toaster!`;

  types: NbComponentStatus[] = [
    "primary",
    "success",
    "info",
    "warning",
    "danger",
  ];
  positions: string[] = [
    NbGlobalPhysicalPosition.TOP_RIGHT,
    NbGlobalPhysicalPosition.TOP_LEFT,
    NbGlobalPhysicalPosition.BOTTOM_LEFT,
    NbGlobalPhysicalPosition.BOTTOM_RIGHT,
    NbGlobalLogicalPosition.TOP_END,
    NbGlobalLogicalPosition.TOP_START,
    NbGlobalLogicalPosition.BOTTOM_END,
    NbGlobalLogicalPosition.BOTTOM_START,
  ];

  quotes = [
    { title: null, body: "We rock at Angular" },
    { title: null, body: "Titles are not always needed" },
    { title: null, body: "Toastr rock!" },
  ];
  //////////////////

  show: boolean = true;
  vlucherForm: FormGroup;
  submitted: boolean;
  saveupdate: string = "Save";
  gridbutton: string = "";
  name: string;
  description: string;
  selectedRow: any;
  partyCodeIsDuplicate: boolean = false;
  loadFromDateShow: Date = new Date();
  loadToDateShow: Date = new Date();

  constructor(
    protected dateService: NbDateService<Date>,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private comboService: CommoncomboService,
    private productRequisitionService: ProductrequisitionService,
    private salesinvoiceService: SalesinvoiceService,
  ) {
    this.commonService.valueSet("showlist");
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
        headerName: "hide",
        field: "monitorId",
        hide: true
      },
      {
        headerName: "hide",
        field: "territoryCode",
        hide: true
      },
      {
        headerName: "hide",
        field: "productWiseSpecificationId",
        hide: true
      },
      {
        headerName: "Territory",
        field: "territoryName",
        width: 180,
      },
      {
        headerName: "Product name",
        field: "productName",
        width: 380,
      },
      {
        headerName: "From Date",
        field: "fromDate",
        width: 130,
      },
      {
        headerName: "To Date",
        field: "toDate",
        width: 130,
      },
      {
        field: "Action",
        cellRenderer: "btnCellRenderer",
        cellRendererParams: {
          clicked: function (field: any) { },
        },
        minWidth: 250,
        editable: false,
        filter: false,
        shorable: false,
        pinned: "right",
      },
    ];
    this.frameworkComponents = {
      btnCellRenderer: BtnCellRendererWithoutPrintService,
    };
    this.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: true,
    };
  }

  ngOnInit(): void {
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
    this.getDropdownData();
  }



  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Product Ponitor";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      //this.openConfirmPopup("");
      this.save();
      //this.show = true;
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
      //this.show = true;
    } else if (this.commonService.buttonClicked == "view") {
      this.show = false;
    } else if (this.commonService.buttonClicked == "reset") {
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      //this.edit();
      this.show = false;
    }
  }
  public getMaster() {
    this.master = {
      monitorId: 0,
      territoryCode: '',
      productWiseSpecificationId: 0,
      fromDate: new Date(),
      toDate: new Date(),
      lstProductMonitor: [],
    };
  }


  clearMaster() {
    this.master.monitorId= 0;
    this.master.territoryCode= '';
    this.master.productWiseSpecificationId= 0;
    this.master.fromDate= new Date();
    this.master.toDate= new Date();

    this.productSpecSelected = {
      id: null,
      name: 'Select Product'
    }

    this.territorySelected = {
      id: null,
      name: 'Select Territory'
    }
  }


  public getProductSpec() {
    this.productSpecList = [];
    this.productRequisitionService.getAllProductForRequisition().subscribe((returns: any) => {
      if (returns.status) {
        this.productSpecList = returns.data.map((val: any) => ({
          id: val.productWiseSpecificationId,
          name: val.productName,
        }));
      }
    })
  }

  public getTerritoryList() {
    this.territoryList = [];
    this.salesinvoiceService
      .GetAllTerritoryForDepot()
      .subscribe((returns: any) => {
        if (returns.success) {
          this.territoryList = returns.data.map((val: any) => ({
            id: val.TerritoryCode,
            name: val.TerritoryName,
          }));
        }
      });
  }


  public agButtonAction() {
    if (this.commonService.agButtonClicked == "pin") {
      this.commonService.onPin(this.gridColumnApi);
    } else if (this.commonService.agButtonClicked == "unpin") {
      this.commonService.onClear(this.gridColumnApi);
    } else if (this.commonService.agButtonClicked == "refresh") {
      window.location.reload();
    } else if (this.commonService.agButtonClicked == "csv") {
      this.commonService.onExportCSV(this.gridApi, this.pageNavigation);
    } else {
      console.log("Click action button");
    }
  }
  /////End of Dynamic Button section (Do Not Edit)///////

  //////////////////////////////////////////////CRUD////////////////////////////
  public companies = [];
  public sbus = [];
  public parties = [];
  public companyCategoryItems = [];
  public genderItems = [];
  public addressTypeItems = [];
  public divisionItems = [];
  public districtItems = [];
  public thanaItems = [];
  public bankItems = [];

  public getDropdownData() {
    ////////// Call common service for dropdown data/////////
    this.getProductSpec();
    this.getTerritoryList();

  }


  private save() {
    if(this.master.lstProductMonitor.length > 0) {
      this.productRequisitionService.saveProductMonitor(this.master).subscribe(
        (returns: any) => {
          if(returns.success){
            this.show = true;
          } else{
            this.commonService.valueSet("create");
          }
        }
      );
    } else {
      this.commonService.valueSet("create");
      this.toastrService.danger("warning", 'Please add product to details.');
    }
  }

  private reset() {
    this.getMaster();
    this.clearMaster();
  }

  //////////////////////////////// End CRUD /////////////////////////////////////////

  onRefesh() {
    this.selectedRow = "";
    this.ngOnInit();
    this.toastrService.warning("warning", this.commonService.warningmsg);
  }

  onEditGrid() {
    const d = this.gridApi.getEditingCells();
    if (this.gridApi.getSelectedRows().length == 0) {
      this.toastrService.danger("error", this.commonService.selectdata);
      return;
    }
    var row = this.gridApi.getSelectedRows();
    this.selectedRow = row[0];
    this.ngOnInit();

    this.saveupdate = "Update";
  }

  //////// grid data load from api////////

  private gridApi;
  private gridColumnApi;

  public modules: Module[] = AllCommunityModules;
  public columnDefs;
  public defaultColDef;
  public rowData: [];
  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRendererWithoutPrintService;
  };


  GetGridData() {
    this.rowData = [];
    this.productRequisitionService.getProductMonitorById(0,this.commonService.DateFormat(this.loadFromDateShow),this.commonService.DateFormat(this.loadToDateShow)).subscribe(
      (returns: any) => {
        if(returns.success){
          this.rowData = returns.data;
        }
      }
    );
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.GetGridData();
  }

  private selectedRows = [];
  public onRowClicked(event) {
    this.selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked;
    if (data == "edit") {
      this.agEdit(event);
      this.show = false;
    } else if (data == "view") {
      this.agEdit(event);
      this.show = false;
      this.disabled = true;
     } else if (data == "transectionreport") {
      this.agReport(event);
    }
     else if (data == "delete") {
      this.agDelete(event);
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }



  private agEdit(event) {
    this.disabled = false;
    let temp = 0;
    for (let i = 0; i < this.selectedRows.length; i++) {
      if (this.selectedRows[i] == event.node.data) {
        this.selectedRows.splice(i, 1);
        this.selectedRow = event.node.data;
        temp = 1;
        this.ngOnInit();
      }
    }
    this.master = {
      monitorId: this.selectedRow.monitorId,
      territoryCode: this.selectedRow.territoryCode,
      productWiseSpecificationId: this.selectedRow.productWiseSpecificationId,
      fromDate: this.commonService.DateFormat(this.selectedRow.fromDate),
      toDate: this.commonService.DateFormat(this.selectedRow.toDate),
      lstProductMonitor: [],
    };

    this.productSpecSelected = {
      id: this.selectedRow.productWiseSpecificationId,
      name: this.selectedRow.productName
    }

    this.territorySelected = {
      id: this.selectedRow.territoryCode,
      name: this.selectedRow.territoryName
    }

  }

  private agDelete(event) {
    const monitorId = event.data.monitorId;
    if(confirm('Are You sure!')){
      this.productRequisitionService.deleteProductMonitor(monitorId).subscribe(
        (returns: any) => {
          if(returns.success){
            this.toastrService.success('Success', 'Data Deleted successfully!');
            this.GetGridData();
          } else{
            this.toastrService.danger('Fail', 'Data Deleted failed!')
          }
        }
      );
    }
  }

  private agReport(event) {
    this.generateReport2("print", event.data.monitorId);
  }

  public generateReport2(buttonAction: any, monitorId: number = 0) {


  }

  addDetails() {
    if (this.validateMasterData()) {
      const productName = this.productSpecSelected.name;
      const territoryName = this.territorySelected.name;
      const data = {
        monitorId: this.master.monitorId,
        productWiseSpecificationId: this.master.productWiseSpecificationId,
        productName: productName,
        territoryCode: this.territorySelected.id,
        territoryName: territoryName,
        fromDate: this.commonService.DateFormat(this.master.fromDate),
        toDate: this.commonService.DateFormat(this.master.toDate),
      }

      this.master.lstProductMonitor.push(data);
      this.clearMaster();
    }
  }

  validateMasterData(): boolean {

    if (this.master.productWiseSpecificationId == null || this.master.productWiseSpecificationId == 0)
      return false;

    if (this.master.productWiseSpecificationId == null || this.master.productWiseSpecificationId == 0)
      return false;

    if (this.master.productWiseSpecificationId == null || this.master.productWiseSpecificationId == 0)
      return false;

    return true;
    // return this.master.productWiseSpecificationId>0 && this.master.toDate != null && this.master.fromDate != null && this.master.fromDate >= this.master.toDate;
  }

  deleteDetails(rowIndex) {
    this.master.lstProductMonitor.splice(rowIndex, 1);
  }

  changeProductSpec(event) {
    this.master.productWiseSpecificationId = event.id;
  }

}

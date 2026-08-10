import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup } from "@angular/forms";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  NbComponentStatus,
  NbDialogService,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
import { PurchaseorderService } from "app/pages/purchase/settings/purchaseorder.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { BillcollectionService } from "app/services/sales/billcollection.service";
import { HrmmasterService } from "app/services/hrm/hrmmaster.service";
import { FormBuilder } from "@angular/forms";
import { PurchaserequisitionService } from "app/pages/purchase/settings/purchaserequisition.service";
import { ProductionServiceService } from "app/services/production/production-service.service";


@Component({
  selector: 'ngx-machine-clening-maintenence',
  templateUrl: './machine-clening-maintenence.component.html',
  styleUrls: ['./machine-clening-maintenence.component.scss']
})
export class MachineCleningMaintenenceComponent implements OnInit {
  public company: { name: string; address: string; custom_footer: boolean; phone: string; fax: string; email: string; website: string; vat: string; tin: string; };

  /////////////////////////////
  master: {
    machineInfoId: number;
    machineName: string;
    originCountry: string;
    purchaseDate: Date;
    startDate: Date;
    purchaseAmount: number;
    remarks: string;
    status: number;
    machineCode: string;
    lstReqDetailsViewModel: any;
    sHour: number;
    eHour: number;
    sMin: number;
    eMin: number;
    sTimeSelected: any;
    eTimeSelected: any;
  };

  protected options: {};
  protected cd: ChangeDetectorRef;
  showMessages: any = {};
  errors: string[];

  disabled: boolean = false;
  config: NbToastrConfig;
  index = 1;
  destroyByClick = true;
  duration = 2000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  preventDuplicates = false;
  status: NbComponentStatus = "primary";

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

  show: boolean = true;
  vlucherForm: FormGroup;
  submitted: boolean;
  saveupdate: string = "Save";
  gridbutton: string = "";
  name: string;
  description: string;
  selectedRow: any;

  ngOnInit() {
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }

  public pageNavigation = "Machine Clening Maintenance";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
      this.disabled = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      this.save();
      //this.show = true;
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
      this.show = true;
    } else if (this.commonService.buttonClicked == "view") {
      this.show = false;
    } else if (this.commonService.buttonClicked == "reset") {
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      this.show = false;
    }
  }

  public getMaster() {
    this.master = {
      machineInfoId: 0,
      machineName: "",
      originCountry: "",
      purchaseDate: new Date(),
      startDate: new Date(),
      purchaseAmount: 0,
      remarks: "",
      status: 1,
      machineCode: "",
      lstReqDetailsViewModel: [],
      sHour: 0,
      eHour: 0,
      sMin: 0,
      eMin: 0,
      sTimeSelected: {},
      eTimeSelected: {},

    };
    this.loadMeridiemList();
  }

  public employeeItems = [];
  public companyItems = [];

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

  /////////////////////////////// CRUD ///////////////////////////////////////////


  private save() {
    if (this.master.machineName == "") {
      this.toastrService.danger("Pleae fill up required field", "Message");
      this.commonService.valueSet("create");
    }
    else {
      debugger;
      this.show = true;
      var button = this.commonService.buttonClicked;

      this.master.purchaseDate = this.commonService.DateFormat(this.master.purchaseDate);
      this.master.startDate = this.commonService.DateFormat(this.master.startDate);
      this.productionProcessService.SaveMachineInfo(this.master).subscribe((returns: any) => {
        if (returns.success) {
          if (button == "update") {
            this.toastrService.success(this.commonService.updatedmsg, "Message");
          }
          else {
            this.toastrService.success(this.commonService.successmsg, "Message");
          }

          this.getMaster();
          this.productionProcessService.GetMachineInfoById(0).subscribe((data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          });
        }

      });
    }

  }

  private reset() {
    this.getMaster();
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

  public selectdetailRows = [];
  private gridApi;
  private gridColumnApi;
  public modules: Module[] = AllCommunityModules;
  public columnDefs;
  public defaultColDef;
  public rowData: [];

  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };

  constructor(
    private http: HttpClient,
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private PurchaseorderService: PurchaseorderService,
    private hrmmasterService: HrmmasterService,
    private comboService: CommoncomboService,
    private billcollectionService: BillcollectionService,
    private formBuilder: FormBuilder,
    private purchaserequisitionService: PurchaserequisitionService,
    private productionProcessService: ProductionServiceService,
  ) {
    this.commonService.valueSet('showlist');
    this.columnDefs = [
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.rowIndex + 1",
        pinned: "left",
        filter: false,
        width: 50,
      },
      {
        headerName: "Machine Code",
        field: "machineCode",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 180,
      },
      {
        headerName: " Machine Name",
        field: "machineName",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 180,
      },
      {
        headerName: "Country Origin",
        field: "originCountry",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 180,
      },
      {
        headerName: "Purchase Date",
        field: "purchaseDate",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 180,
      },
      {
        headerName: "Purchase Amount",
        field: "purchaseAmount",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 180,
      },
      {
        headerName: "Is Active",
        field: "isActive",
        width: 160,
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
      btnCellRenderer: BtnCellRenderer,
    };
    this.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: true,
      editable: true,
    };
    this.getMaster();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.productionProcessService.GetMachineInfoById(0).subscribe((data: any) => {
      if (data.success) {
        this.rowData = data.data;
      }
    })
  }

  getSelectedRowData() {
    let selectedNodes = this.gridApi.getSelectedNodes();
    let selectedData = selectedNodes.map((node) => node.data);
    alert(`${JSON.stringify(selectedData)}`);
    this.name = selectedData[0].currencyName;
    return selectedData;
  }

  ////////////////////////////////// Ag Grid Data Load/////////////////////////////////
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
    } else if (data == "delete") {
      this.agDelete(event);
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }

  private agDelete(event) {
    debugger;
    this.master.machineInfoId = event.node.data.machineInfoId;
    // this.hrmmasterService.deleteGender(this.master.processHeadId).subscribe((returns: any) => {
    //   if (returns.success) {
    //     this.toastrService.success(this.commonService.deletedmsg, "Message");

    //     //////////////Grid Refresh ///////////////////

    //     //////////////Grid Refresh ///////////////////
    //   }
    // });
    if (confirm('Are you sure?')) {
      this.productionProcessService.DeleteMachineInfoById(this.master.machineInfoId).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          this.productionProcessService.GetMachineInfoById(0).subscribe((data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          });
        }
      });
    }
  }

  //public tableHeader = ['#', 'Product Name', 'Store Name', 'Current Stock']
  private agReport(event) {
    //this.generateStockInReport(event.data.stockMasterId);
  }

  public datalength: number;
  public stockNo = '';
  public stockDate = '';
  public bodyData = [];

  public params = [];
  public setParam() {
    this.params = [];
    this.params.push({ leftLabel: "Voucher No", leftValue: "", rightLabel: "Voucher Date", rightValue: "" });
  }

  private agEdit(event) {
    debugger
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
    if (temp === 0) {
      this.selectedRows.push(event.node.data);
      this.selectedRow = event.node.data;
      this.master.machineInfoId = event.node.data.machineInfoId;

      // this.hrmmasterService.getGender(this.master.chargeHeadId).subscribe((data: any) => {
      //   if (data.success) {
      //     this.master = data.data[0];
      //   }
      // });

      this.productionProcessService.GetMachineInfoById(this.master.machineInfoId).subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0];
        }
      })
      this.ngOnInit();
    }
  }

  //////////////////////////////////End of Ag Grid Data Load/////////////////////////////////

  @Output() myEvent = new EventEmitter();

  public deleteRow(state, action) {
    const nodeIdToRemove = action.payload;
    const filteredData = state.rowData.filter(
      (node) => node.id !== nodeIdToRemove
    );
    return {
      ...state,
      rowData: [...filteredData],
    };
  }

  private showToast(type: NbComponentStatus, title: string, body: string) {
    const config = {
      status: type,
      destroyByClick: this.destroyByClick,
      duration: this.duration,
      hasIcon: this.hasIcon,
      position: this.position,
      preventDuplicates: this.preventDuplicates,
    };
    const titleContent = title ? `. ${title}` : "";

    this.index += 1;
    this.toastrService.show(body, `Toast ${this.index}${titleContent}`, config);
  }

  //////////// Open Modal ////////////////
  public meridiemList = [];
  public loadMeridiemList() {
    this.meridiemList = [
      {
        id: 0,
        name: "PM"

      },
      {
        id: 0,
        name: "AM"
      }
    ]
  }



}


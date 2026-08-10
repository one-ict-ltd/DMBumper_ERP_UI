
import {
  //ChangeDetectorRef,
  Component,
  //EventEmitter,
  OnInit,
  //Output,
} from "@angular/core";
import {
  NbComponentStatus,
  //NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
// import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
// import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
// import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
// import { FormGroup } from "@angular/forms";
import { HrmmasterService } from "app/services/hrm/hrmmaster.service";
import { BonusIncentivePolicyService } from "app/services/sales/bonus-incentive-policy.service";

@Component({
  selector: 'ngx-mango-customer-bonus-policy',
  templateUrl: './mango-customer-bonus-policy.component.html',
  styleUrls: ['./mango-customer-bonus-policy.component.scss']
})
export class MangoCustomerBonusPolicyComponent implements OnInit {

  public pageNavigation = "Mango Customer Bonus Policy";
  //public buttons = this.commonService.btnList;
  show: boolean = true;
  disabled: boolean = false;
  fDate: Date;
  tDate: Date;

  name: string;
  description: string;
  selectedRow: any;

  public selectdetailRows = [];
  private gridApi;
  private gridColumnApi;
  //public modules: Module[] = AllCommunityModules;
  public columnDefs;
  public defaultColDef;
  public rowData: [];

  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };


  master: {
    mangoPolicyId: number;
    fromMonth: number;
    toMonth: number;
    paymentDate: Date;
    percentValue: number;
    isActive: true;
  };

  constructor(
    private commonService: CommonService,
    private toastrService: NbToastrService,
    //private hrmmasterService: HrmmasterService,
    private PolicyService: BonusIncentivePolicyService,
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
        headerName: "ID",
        field: "mangoPolicyId",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 100,
      },
      {
        headerName: "From Month",
        field: "fMonthName",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 180,
      },
      {
        headerName: "To Month",
        field: "tMonthName",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 180,
      },
      {
        headerName: "Payment Date",
        field: "paymentDate",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 180,
      },
      {
        headerName: "Percent Value",
        field: "percentValue",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 180,
      },
      {
        headerName: "Is Active",
        field: "isActive",
        width: 180,
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
    this.PolicyService.GetMangoCustomerBonusPolicy(0).subscribe((data: any) => {
      if (data.success) {
        this.rowData = data.data;
      }
    });
  }

  ngOnInit() {
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }


  // protected options: {};
  // protected cd: ChangeDetectorRef;
  // showMessages: any = {};
  // errors: string[];

  // types: NbComponentStatus[] = [
  //   "primary",
  //   "success",
  //   "info",
  //   "warning",
  //   "danger",
  // ];
  // positions: string[] = [
  //   NbGlobalPhysicalPosition.TOP_RIGHT,
  //   NbGlobalPhysicalPosition.TOP_LEFT,
  //   NbGlobalPhysicalPosition.BOTTOM_LEFT,
  //   NbGlobalPhysicalPosition.BOTTOM_RIGHT,
  //   NbGlobalLogicalPosition.TOP_END,
  //   NbGlobalLogicalPosition.TOP_START,
  //   NbGlobalLogicalPosition.BOTTOM_END,
  //   NbGlobalLogicalPosition.BOTTOM_START,
  // ];

  // //vlucherForm: FormGroup;
  // submitted: boolean;
  // saveupdate: string = "Save";
  // gridbutton: string = "";


  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
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
      mangoPolicyId: 0,
      fromMonth: 0,
      toMonth: 0,
      paymentDate: new Date(),
      percentValue: 0,
      isActive: true,
    };
    this.fDate = this.commonService.GetAnyMonthAndDateOfYear(-6);
    this.tDate = new Date();

    this.GetAllMonths();
    this.fMonthSelected = null;
    this.tMonthSelected = null;
  }

  monthList = [];
  fMonthSelected = {};
  tMonthSelected = {};
  GetAllMonths() {
    this.monthList = this.commonService.GetAllMonths();
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
    //this.saveupdate = "Update";
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


  private save() {
    console.log('save()', this.master);
    if (this.master.fromMonth == 0) {
      this.toastrService.danger("Pleae fill up required field", "Message");
      this.commonService.valueSet("create");
    }
    else {

      this.show = true;
      var button = this.commonService.buttonClicked;


      this.PolicyService.SaveMangoCustomerBonusPolicy(this.master).subscribe((returns: any) => {
        if (returns.success) {
          if (button == "update") {
            this.toastrService.success(this.commonService.updatedmsg, "Message");
          }
          else {
            this.toastrService.success(this.commonService.successmsg, "Message");
          }
          //////////////Grid Refresh ///////////////////
          this.getMaster();
          this.PolicyService.GetMangoCustomerBonusPolicy(0).subscribe((data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          });
          //////////////Grid Refresh ///////////////////
          //
        }
      });
    }

  }


  private agEdit(event) {
    debugger;
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
      let mangoPolicyId = event.node.data.mangoPolicyId;

      this.PolicyService.GetMangoCustomerBonusPolicy(mangoPolicyId).subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0];
          this.fMonthSelected = {
            id: this.master.fromMonth, name: data.data[0].fMonthName
          }
          this.tMonthSelected = {
            id: this.master.toMonth, name: data.data[0].tMonthName
          }
        }
      });
      this.ngOnInit();
    }
  }


  private agDelete(event) {
    let mangoPolicyId = event.node.data.mangoPolicyId;
    this.PolicyService.DeleteMangoCustomerBonusPolicy(mangoPolicyId).subscribe((returns: any) => {
      if (returns.success) {
        this.toastrService.success(this.commonService.deletedmsg, "Message");

        //////////////Grid Refresh ///////////////////
        this.PolicyService.GetMangoCustomerBonusPolicy(0).subscribe((data: any) => {
          if (data.success) {
            this.rowData = data.data;
          }
        });
        //////////////Grid Refresh ///////////////////
      }
    });
  }


  private agReport(event) {
    //this.generateStockInReport(event.data.stockMasterId);
  }


  // @Output() myEvent = new EventEmitter();

  // public deleteRow(state, action) {
  //   const nodeIdToRemove = action.payload;
  //   const filteredData = state.rowData.filter(
  //     (node) => node.id !== nodeIdToRemove
  //   );
  //   return {
  //     ...state,
  //     rowData: [...filteredData],
  //   };
  // }




  config: NbToastrConfig;
  index = 1;
  destroyByClick = true;
  duration = 2000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  preventDuplicates = false;
  status: NbComponentStatus = "primary";

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



}







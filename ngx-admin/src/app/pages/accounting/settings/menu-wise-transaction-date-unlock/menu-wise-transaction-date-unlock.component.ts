import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
} from "@angular/core";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup } from "@angular/forms";
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
import { UserregisterService } from "app/services/erpsetting/userregister.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { BtnCellWithoutPrint } from "app/pages/common/btn-cell-withoutPrint.component";
import { VoucherService } from "app/services/voucher.service";

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: 'ngx-menu-wise-transaction-date-unlock',
  templateUrl: './menu-wise-transaction-date-unlock.component.html',
  styleUrls: ['./menu-wise-transaction-date-unlock.component.scss']
})
export class MenuWiseTransactionDateUnlockComponent implements OnInit {


  master: {
    unlockId: number;
    menuName: string;
    uptoDate: string;
    backDays: number;
    forwardDays: number;

    employeeId: number;
    employeeSelected: {};
    companyId: number;
    companySelected: {};

    menuSelected: {};
    lstDetailsData: [];
  };

  public getMaster() {
    this.master = {
      unlockId: 0,
      menuName: "",
      uptoDate: "",
      backDays: 0,
      forwardDays: 0,

      employeeId: 0,
      employeeSelected: null,
      companyId: 0,
      companySelected: null,

      menuSelected: null,
      lstDetailsData: []
    };
  }


  protected options: {};
  protected cd: ChangeDetectorRef;
  showMessages: any = {};
  errors: string[];
  isedit: boolean = false;
  disabled: boolean = false;
  config: NbToastrConfig;
  index = 1;
  destroyByClick = true;
  duration = 2000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  preventDuplicates = false;
  status: NbComponentStatus = "primary";

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

  ngOnInit() {
    //debugger;
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;

    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Menu Wise Back Date Unlock Setup";
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

  public companyItems = [];
  public employeeItems = [];

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
    var button = this.commonService.buttonClicked;
    debugger;
    console.log(this.master);
    if (this.master.menuName == null || this.master.menuName == '') {
      this.toastrService.danger("Please select a menu name", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    // else if (this.master.uptoDate == null || this.master.uptoDate == '') {
    //   this.toastrService.danger("Please entry Email", "Message");
    //   this.commonService.valueSet("create");
    //   return false;
    // }
    // else if (this.master.backDays == null || this.master.backDays == 0) {
    //   this.toastrService.danger("Please entry Password", "Message");
    //   this.commonService.valueSet("create");
    //   return false;
    // }
    else if (this.master.companyId == 0 || this.master.employeeId == 0) {
      this.toastrService.danger("Please fill up required field", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    // else if (this.master.userId == null || this.master.userId == '') {
    //   this.toastrService.danger("Please entry userId", "Message");
    //   this.commonService.valueSet("create");
    //   return false;
    // }
    debugger;
    this.voucherService.SaveMenuWiseTransactionDateUnlock(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(
            this.commonService.updatedmsg,
            "Message"
          );
        } else {
          this.toastrService.success(
            this.commonService.successmsg,
            "Message"
          );
        }
        this.getMaster();
        this.getUsersList();
        this.show = true;
      }
      else {
        this.toastrService.warning(
          this.commonService.failedmsg,
          "Message"
        );
      }
    });
  }
  private reset() {
    this.getMaster();
  }
  private getUsersList() {
    this.voucherService.GetMenuWiseTransactionDateUnlockList(0).subscribe((data: any) => {
      if (data.success) {
        this.rowData = data.data;
      }
    });
  }
  //////////////////////////////// End CRUD /////////////////////////////////////////

  onRefesh() {
    this.selectedRow = "";
    this.ngOnInit();
    //this.onGridReady;
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
    btnCellRenderer: typeof BtnCellWithoutPrint;
  };

  constructor(
    // private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    // private userregisterService: UserregisterService,

    private voucherService: VoucherService,
    private comboService: CommoncomboService
  ) {

    this.getCompany();
    this.GetMenuListForTransactionDateUnlock();

    this.commonService.valueSet('showlist');
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
        headerName: "Emp. Code",
        field: "employeeNo",
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "Emp. Name",
        field: "fullName",
        filter: "agTextColumnFilter",
        editable: false,
        width: 250,
      },
      {
        headerName: "Menu Name",
        field: "menuName",
        filter: "agTextColumnFilter",
        width: 200,
      },
      {
        headerName: "Allow Back Days",
        field: "backDays",
        filter: "agTextColumnFilter",
        width: 120,
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
      btnCellRenderer: BtnCellWithoutPrint,
    };
    this.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: true,
    };
    this.getMaster();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getUsersList();
  }

  // getSelectedRowData() {
  //   let selectedNodes = this.gridApi.getSelectedNodes();
  //   let selectedData = selectedNodes.map((node) => node.data);
  //   alert(`${JSON.stringify(selectedData)}`);
  //   this.name = selectedData[0].currencyName;
  //   return selectedData;
  // }

  ////////////////////////////////// Ag Grid Data Load/////////////////////////////////
  private selectedRows = [];
  public onRowClicked(event) {
    this.selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked;
    if (data == "edit") {
      // this.agEdit(event);
      // this.show = false;
      // this.isedit = true;
      this.toastrService.info("Not Allowed", "Message");
    } else if (data == "view") {
      // this.agEdit(event);
      // this.show = false;
      // this.disabled = true;
      this.toastrService.info("Not Allowed", "Message");
    } else if (data == "transectionreport") {
      // this.agReport(event);
      this.toastrService.info("Not Allowed", "Message");
    } else if (data == "delete") {
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
    if (temp === 0) {
      this.selectedRows.push(event.node.data);
      this.selectedRow = event.node.data;
      var userId = event.node.data.userId;

      this.voucherService.GetMenuWiseTransactionDateUnlockList(userId).subscribe((data: any) => {
        if (data.success) {
          //debugger;
          this.master = data.data[0];

          this.master.companySelected = {
            id: data.data[0].companyId,
            name: data.data[0].companyName,
          };

          this.getEmployees();

          this.master.employeeSelected = {
            id: data.data[0].employeeId,
            name: data.data[0].fullName,
          };

        }
      });
      this.ngOnInit();
    }
  }
  private agReport(event) {
    this.toastrService.info("Print button clicked", "Message");
  }
  private agDelete(event) {
    var result = confirm("Are you sure to delete?");
    if (result) {
      let unlockId = event.node.data.unlockId;
      this.voucherService.DeleteMenuWiseTransactionDateUnlock(unlockId).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");
          this.getUsersList();
        }
      });
    }
  }
  //////////////////////////////////End of Ag Grid Data Load/////////////////////////////////

  @Output() myEvent = new EventEmitter();

  public deleteRow(state, action) {
    //debugger;
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

  // data: Country[] = [
  //   {
  //     name: "Russia",
  //     flag: "f/f3/Flag_of_Russia.svg",
  //     area: 17075200,
  //     population: 146989754,
  //   },
  //   {
  //     name: "Canada",
  //     flag: "c/cf/Flag_of_Canada.svg",
  //     area: 9976140,
  //     population: 36624199,
  //   },
  //   {
  //     name: "United States",
  //     flag: "a/a4/Flag_of_the_United_States.svg",
  //     area: 9629091,
  //     population: 324459463,
  //   },
  //   {
  //     name: "China",
  //     flag: "f/fa/Flag_of_the_People%27s_Republic_of_China.svg",
  //     area: 9596960,
  //     population: 1409517397,
  //   },
  // ];

  // names: any;
  // openWithDataObjModel(dialog: TemplateRef<any>) {
  //   this.dialogService.open(dialog, {
  //     context: this.data,
  //   });
  // }
  // openWithDataModel() {
  //   this.dialogService
  //     .open(DialogNamePromptComponent)
  //     .onClose.subscribe((name) => name && this.names.push(name));
  // }
  /////////////////////////////

  public getCompany() {
    this.comboService.getCompany().subscribe((returns: any) => {
      this.companyItems = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
    });
  }

  public getEmployees() {
    this.master.employeeSelected = null;
    this.employeeItems = null;
    this.comboService.getEmployee(this.master.companyId, 0).subscribe((returns: any) => {
      this.employeeItems = returns.data.map((val) => ({
        id: val.employeeId,
        name: val.fullName,
      }));
    });
  }

  menuItems: any = [];
  public GetMenuListForTransactionDateUnlock() {
    this.menuItems = [];
    //this.master.menuSelected = null;

    this.voucherService.GetMenuListForTransactionDateUnlock().subscribe((returns: any) => {
      this.menuItems = returns.data.map((val) => ({
        id: val.id,
        name: val.name,
      }));
    });
  }

  public getEmployeeDetails() {
    this.comboService.getEmployee(this.master.companyId, this.master.employeeId).subscribe((returns: any) => {
      this.master.menuName = returns.data[0].emailId;
      this.master.uptoDate = returns.data[0].emailId;
    });
  }
}

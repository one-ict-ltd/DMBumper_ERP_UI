import {
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
import { CommoncomboService } from "app/services/commoncombo.service";

import { HttpClient } from "@angular/common/http";
import { EmployeeinformationService } from "app/services/hrm/employeeinformation.service";
import { LeaveService } from "app/services/hrm/leave.service";
import { HrmmasterService } from "app/services/hrm/hrmmaster.service";
import { ProductService } from "app/services/inventory/product.service";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";

@Component({
  selector: 'ngx-executive-team',
  templateUrl: './executive-team.component.html',
  styleUrls: ['./executive-team.component.scss']
})
export class ExecutiveTeamComponent implements OnInit {

  selectedTeamLead: any;
  selectedTeamMember: any;
  master: {
    employeeId: number;
    employeeName: string;
    employeeCode: string;
    departmentId: number;
    departmentName: string;
    productId: number;
    productName: string;
    lstDetails: any[];
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
  showEmp: boolean = true;
  showDpt: boolean = true;
  vlucherForm: FormGroup;
  submitted: boolean;
  saveupdate: string = "Save";
  gridbutton: string = "";
  name: string;
  sequenceNo: string;
  selectedRow: any;
  //showtd: boolean = true;

  ngOnInit() {
    localStorage.setItem("button", "");
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Executive Team Members";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
      this.disabled = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      //this.openConfirmPopup("");
      this.save();
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
      this.show = true;
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
      employeeId: 0,
      employeeName: '',
      employeeCode: '',
      departmentId: 0,
      departmentName: '',
      productId: 0,
      productName: '',
      lstDetails: [],
    };
    this.selectedTeamLead = { id: 0, name: '' };
    this.selectedTeamMember = { id: 0, name: '' };
    this.selectedRow = null;
  }

  public companyItems = [];
  public sbuItems = [];
  public approvalTypeItems = [];
  public approverItems = [];

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

  public addDetails(dialog: TemplateRef<any>) {

    var RowCount = this.master.lstDetails.length;
    for (let i = 0; i < RowCount; i++) {
      let _teamLeadId = this.master.lstDetails[i].teamLeaderId;
      let _teamMemberId = this.master.lstDetails[i].teamMemberId;
      // if (_teamLeadId == this.selectedTeamLead.id) {
      //   this.toastrService.danger("You have already added this Team Lead", "Message");
      //   return;
      // }
      if (_teamMemberId == this.selectedTeamMember.id) {
        this.toastrService.danger("You have already added this Team Member", "Message");
        return;
      }
    }
    var gridRowCount = this.rowData.length;
    for (let i = 0; i < gridRowCount; i++) {
      let _teamLeadId = this.rowData[i].teamLeaderId;
      let _teamMemberId = this.rowData[i].teamMemberId;
      //insert
      // if (_teamLeadId == this.selectedTeamLead.id && this.action !== "edit") {
      //   this.toastrService.danger("You have already mapped this Team Lead", "Message");
      //   return;
      // }
      if (_teamMemberId == this.selectedTeamMember.id && this.action !== "edit") {
        this.toastrService.danger("You have already mapped this Team Member", "Message");
        return;
      }

      //edit
      // if (_teamLeadId == this.selectedTeamLead.id && _teamMemberId !== this.selectedTeamMember.id && this.action == "edit") {
      //   this.toastrService.danger("You have already mapped this Team Lead", "Message");
      //   return;
      // }
      // if (_teamMemberId == this.selectedTeamMember.id && _teamLeadId !== this.selectedTeamLead.id && this.action == "edit") {
      //   this.toastrService.danger("You have already mapped this Team Member", "Message");
      //   return;
      // }
    }

    let detail = {
      teamLeaderId: this.selectedTeamLead.id,
      teamLeaderName: this.selectedTeamLead.name,
      teamMemberId: this.selectedTeamMember.id,
      teamMemberName: this.selectedTeamMember.name,
      executiveTeamId: this.selectedRow ? this.selectedRow.executiveTeamId : 0,
    };
    this.master.lstDetails.push(detail);
  }
  //(click)="deleteDetail(rowIndex)"
  public deleteDetail(index: any) {
    debugger;
    this.selectedRow = this.master.lstDetails[index];
    this.master.lstDetails.splice(index, 1);

    // var index1 = this.master.lstDetails.findIndex(x => x.employeeId == this.master.approverId);
    // if (index1 > -1) {
    //   this.master.lstDetails.splice(index1, 1);
    // }
    this.toastrService.danger(this.commonService.deletedmsg, "Message");
  }

  private save() {
    if (this.master.lstDetails.length == 0) {
      this.commonService.valueSet('create');
      this.toastrService.danger("Please add executive wise product", "Message");
      return;
    }

    var button = this.commonService.buttonClicked;
    this.commonService.postApiData("SalesExecutiveMember/saveExecutiveMember", this.master.lstDetails).subscribe((returns: any) => {
      if (returns.success) {
        this.show = true;
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        this.GetExecutiveMember();
      }
      else {
        this.show = false;
        this.toastrService.danger(returns.message, "Message");
      }
    });
  }
  private reset() {
    this.getMaster();
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
  public rowData: any[] = [];
  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };

  constructor(
    private http: HttpClient,
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private comboService: CommoncomboService,
    private leaveService: LeaveService,
    private productService: ProductService,
    private productRequisitionService: ProductrequisitionService,
    private hrmmasterService: HrmmasterService,
    private employeeinformationService: EmployeeinformationService,
  ) {

    this.commonService.valueSet('showlist');
    this.columnDefs = [
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.rowIndex + 1",
        pinned: "left",
        filter: false,
        width: 60,
      },
      {
        headerName: "Team Lead Name",
        field: "teamLeaderName",
        width: 190,
      },
      {
        headerName: "Team Member Name",
        field: "teamMemberName",
        width: 200,
      },
      {
        field: "action",
        cellRenderer: "btnCellRenderer",
        cellRendererParams: {
          clicked: function (field: any) {

          },
        },
        minWidth: 250,
        editable: false,
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
    this.getEmployee();
    // this.getFinishedProducts();
  }

  currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${formatted}`;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.GetExecutiveMember();
  }

  GetExecutiveMember() {
    let apiUrl = `SalesExecutiveMember/GetExecutiveMember`;
    this.commonService.getApiData(apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.rowData = returns.data;
      }
    });
  }

  getSelectedRowData() {
    let selectedNodes = this.gridApi.getSelectedNodes();
    let selectedData = selectedNodes.map((node) => node.data);
    alert(`${JSON.stringify(selectedData)}`);
    this.name = selectedData[0].currencyName;
    return selectedData;
  }

  private selectedRows = [];
  action: string = "";
  onRowClicked(event) {
    this.selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked; //localStorage.getItem("button");
    this.action = data;
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

  private agEdit(event) {
    this.disabled = false;
    // for (let i = 0; i < this.selectedRows.length; i++) {
    //   if (this.selectedRows[i] == event.node.data) {
    //     this.selectedRows.splice(i, 1);
    //     this.selectedRow = event.node.data;
    //   }
    // }
    this.master.lstDetails = [];
    this.selectedTeamLead = this.employeeList.find(x => x.id == this.selectedRow.teamLeaderId);
    this.selectedTeamMember = this.employeeList.find(x => x.id == this.selectedRow.teamMemberId);
    this.ngOnInit();

  }
  private agReport(event) {
    this.toastrService.info("Print button clicked", "Message");
  }
  private agDelete(event) {
    var result = confirm("Are you sure you want to delete that?");
    if (result) {
      debugger;
      let executiveTeamId = event.node.data.executiveTeamId;

      let apiUrl = `SalesExecutiveMember/DeleteExecutiveMember?executiveTeamId=${executiveTeamId}`;
      this.commonService.getApiData(apiUrl).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          //////////////Grid Refresh ///////////////////

          this.GetExecutiveMember();
          //////////////Grid Refresh ///////////////////
        }
        else {
          this.toastrService.danger(returns.message, "Message");
        }
      });
    }
  }
  //////////////////////////////////End of Ag Grid Data Load/////////////////////////////////

  @Output() myEvent = new EventEmitter();

  public deleteRow(state, action) {
    debugger;
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

  names: any;
  openWithDataObjModel(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
      context: this.master,
    });
  }

  openWithDataModel() {
    this.dialogService
      .open(DialogNamePromptComponent)
      .onClose.subscribe((name) => name && this.names.push(name));
  }

  public employeeList = [];
  public getEmployee() {
    this.employeeinformationService.GetEmployeeInfoLoadByIdOptimized(0).subscribe((retuns: any) => {
      if (retuns.success) {
        this.employeeList = retuns.data.map((val: any) => ({
          id: val.employeeId,
          name: val.fullName,
        }));
        //console.log(this.LeaveTypeList);
      }
    })
  }
  // products: any[] = [];
  // getFinishedProducts() {
  //   this.products = [];
  //   this.productService.getFinishedProduct().subscribe((returns: any) => {
  //     if (returns.success) {
  //       this.products = returns.data;
  //     }
  //   });
  // }

}

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

@Component({
  selector: 'ngx-purchase-approval-matrix',
  templateUrl: './purchase-approval-matrix.component.html',
  styleUrls: ['./purchase-approval-matrix.component.scss']
})
export class PurchaseApprovalMatrixComponent implements OnInit {


  master: {
    approvalMatrixId: number;
    seqNo: number;
    isActive: number;
    employeeId: number;
    employeeName: string;
    employeeCode: string;
    approverId: number;
    approverName: string;
    approverCode: string;
    isFinalApproval: number;
    typeId: number;
    departmentId: number;
    departmentName: string;

    EmployeeInfoSelected: any;
    DepartmentInfoSelected: any;
    approverSelected: any;
    TypeSelected: any;
    lstDetails: any[];
    index: number;


    //approvalMatrixId: number;
    sequenceNo: number;
    approvalTypeId: number;
    approvalTypeSelected: any;
    approverTypeId: number;
    companyId: number;
    companySelected: any;
    sbuId: number;
    sbuSelected: any;
    productTypeId: number;
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
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.sequenceNo = this.selectedRow.aliasName;
    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Purchase Req. Approval Matrix";
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
      approvalMatrixId: 0,
      seqNo: 0,
      isActive: 1,
      employeeId: 0,
      employeeName: '',
      employeeCode: '',
      approverId: 0,
      approverName: '',
      approverCode: '',
      isFinalApproval: 0,
      typeId: 0,
      departmentId: 0,
      departmentName: '',

      EmployeeInfoSelected: null,
      DepartmentInfoSelected: null,
      approverSelected: null,
      TypeSelected: null,
      lstDetails: [],
      index: -1,

      //approvalMatrixId: 0,
      sequenceNo: 0,
      approvalTypeId: 0,
      approvalTypeSelected: null,
      approverTypeId: 0,
      companyId: 0,
      companySelected: null,
      sbuId: 0,
      sbuSelected: null,
      productTypeId: 0,
    };
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
    // debugger;
    if (this.master.approverId == 0) {
      this.toastrService.danger("Please select approver", "Message");
      return;
    }

    var RowCount = this.master.lstDetails.length;
    for (let i = 0; i < RowCount; i++) {
      debugger;
      var _approverTypeId = this.master.lstDetails[i].approverId;
      if (_approverTypeId == this.master.approverId) {
        this.toastrService.danger("You have already added this", "Message");
        return;
      }
    }

    let detail = {
      approvalMatrixId: null,//this.master.approvalMatrixId,
      productTypeId: this.master.productTypeId,

      employeeId: this.master.employeeId,
      departmentId: this.master.departmentId,
      approverId: this.master.approverId,
      approverName: this.master.approverSelected["name"],
      seqNo: this.master.seqNo,
      isFinalApproval: this.master.isFinalApproval,
      isActive: this.master.isActive,
      //showtd: true
    };
    this.master.lstDetails.push(detail);
  }
  //(click)="deleteDetail(rowIndex)"
  public deleteDetail(index: any) {
    debugger;
    this.selectedRow = this.master.lstDetails[index];
    this.master.lstDetails.splice(index, 1);

    var index1 = this.master.lstDetails.findIndex(x => x.approverId == this.master.approverId);
    if (index1 > -1) {
      this.master.lstDetails.splice(index1, 1);
    }
    this.toastrService.danger(this.commonService.deletedmsg, "Message");
  }

  private save() {
    if (this.master.lstDetails.length == 0) {
      this.commonService.valueSet('create');
      this.toastrService.danger("Please add approver", "Message");
      return;
    }



    var button = this.commonService.buttonClicked;
    let apiUrl = `PurchaseRequisition/SavePurchaseApprovalMatrix`;
    this.commonService.postApiData(apiUrl, this.master).subscribe((returns: any) => {
      if (returns.success) {
        this.show = true;
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        this.GetPurchaseApprovalMatrix();
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
  public rowData: [];
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
        headerName: "Company",
        field: "companyName",
        width: 190,
      },
      {
        headerName: "Product Type",
        field: "productTypeName",
        width: 200,
      },
      {
        headerName: "Emp ID",
        field: "employeeCode",
        width: 120,
      },
      {
        headerName: "Employee Name",
        field: "employeeName",
        width: 250,
      },
      {
        headerName: "Approver ID",
        field: "approverCode",
        width: 120,
      },
      {
        headerName: "Approvar Name",
        field: "approverName",
        width: 250,
      },
      {
        headerName: "Seq. No",
        field: "seqNo",
        width: 120,
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
    this.getType();
    this.getEmployee();
    this.getDepartment();
    this.getProductType();
  }

  currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${formatted}`;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.GetPurchaseApprovalMatrix();
  }

  GetPurchaseApprovalMatrix() {
    let apiUrl = `PurchaseRequisition/GetPurchaseApprovalMatrix`;
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

  onRowClicked(event) {
    this.selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked; //localStorage.getItem("button");
    if (data == "edit") {
      //this.agEdit(event);
      // this.show = false;
      this.show = true;
    } else if (data == "view") {
      //this.agEdit(event);
      //this.show = false;
      //this.disabled = true;
      this.show = true;
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
      var employeeId = event.node.data.employeeId;

      this.leaveService.getLeaveApprovalMatrixByemployeeId(employeeId).subscribe((data: any) => {
        if (data.success) {
          debugger;
          this.master = data.data[0];

          this.master.TypeSelected = {
            id: 0,
            name: "Individual",
          };

          this.showEmp = false;
          this.showDpt = true;

          this.master.EmployeeInfoSelected = {
            id: data.data[0].employeeId,
            name: data.data[0].employeeName,
          };

          this.master.DepartmentInfoSelected = {
            id: data.data[0].departmentId,
            name: data.data[0].departmentName,
          };


          this.GetPurchaseApprovalMatrix();

        }
      });
      this.ngOnInit();
    }
  }
  private agReport(event) {
    this.toastrService.info("Print button clicked", "Message");
  }
  private agDelete(event) {
    var result = confirm("Are you sure you want to delete that?");
    if (result) {
      debugger;
      let employeeId = event.node.data.employeeId;
      let productTypeId = event.node.data.productTypeId;

      let apiUrl = `PurchaseRequisition/DeletePurchaseApprovalMatrixByemployeeId?employeeId=${employeeId}&productTypeId=${productTypeId}`;
      this.commonService.getApiData(apiUrl).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          //////////////Grid Refresh ///////////////////

          this.GetPurchaseApprovalMatrix();
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

  public ChnageType() {
    if (this.master.typeId == 0) {
      this.showEmp = false;
      this.showDpt = true;
    } else {

      this.showEmp = true;
      this.showDpt = false;
    }
  }

  public getCompany() {
    this.comboService.getCompany().subscribe((returns: any) => {
      this.companyItems = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
    });
  }



  public EmployeeList = [];
  public getEmployee() {
    this.master.EmployeeInfoSelected = null;
    this.employeeinformationService.GetEmployeeInfoLoadByIdOptimized(0).subscribe((retuns: any) => {
      if (retuns.success) {
        this.EmployeeList = retuns.data.map((val: any) => ({
          id: val.employeeId,
          name: val.fullName,
        }));
        //console.log(this.LeaveTypeList);
      }
    })
  }


  public DepartmentList = [];
  public getDepartment() {
    this.master.DepartmentInfoSelected = null;
    this.hrmmasterService.getDepartment(0).subscribe((returns: any) => {
      this.DepartmentList = returns.data.map((val: any) => ({
        id: val.deptName,
        name: val.deptName,
      }))
    })
  }


  public TypeList = [];
  public getType() {
    this.master.TypeSelected = null;
    this.TypeList = [
      {
        id: 0,
        name: "Individual"
      }, {
        id: 1,
        name: "Department wise"
      }
    ]
  }
  productTypeList: any[] = [];
  productTypeSelected: any = {};
  public getProductType() {
    this.productTypeList = [];
    this.productTypeSelected = null;

    this.productService.getProductType().subscribe((retuns: any) => {
      if (retuns.success) {
        this.productTypeList = retuns.data.map((val: any) => ({
          id: val.productTypeId,
          name: val.productTypeName,
        }))
      }
    })
  }

}
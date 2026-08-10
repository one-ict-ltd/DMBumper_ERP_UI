import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup, NgForm } from "@angular/forms";
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
import { EmployeeotherinfoService } from "app/services/hrm/employeeotherinfo.service";
import { ActivatedRoute } from "@angular/router";
import { EmployeeinformationService } from "app/services/hrm/employeeinformation.service";
import { BtnCellWithoutPrint } from "app/pages/common/btn-cell-withoutPrint.component";

@Component({
  selector: 'ngx-empaddress',
  templateUrl: './empaddress.component.html',
  styleUrls: ['./empaddress.component.scss']
})
export class EmpaddressComponent implements OnInit {

  master: {
    employeeAddressId: number;
    employeeId: number;
    addressTypeId: number;
    divisionId: number;
    districtId: number;
    thanaId: number;
    address: string;
    isActive: boolean;

    addressTypeSelected: {};
    divisionSelected: {};
    districtSelected: {};
    thanaSelected: {};
    countData: number;
  };

  employeeId = 0;
  employeeName = '';
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
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "";
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
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
    } else if (this.commonService.buttonClicked == "view") {
      this.show = false;
    } else if (this.commonService.buttonClicked == "reset") {
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      this.show = false;
    }
  }
  public getMaster() {

    this.activatedRoute.queryParams.subscribe(params => {
      this.employeeId = params['employeeId'];
      this.employeeinformationService.GetEmployeeBasicInfoById(this.employeeId).subscribe((data: any) => {
        if (data.success) {
          this.employeeName = data.data[0].fullName;
          this.pageNavigation = this.employeeName + "'s Address";
        }
      });
    });

    this.master = {
      employeeAddressId: 0,
      employeeId: this.employeeId,
      addressTypeId: 0,
      divisionId: null,
      districtId: null,
      thanaId: null,
      address: '',
      isActive: true,

      addressTypeSelected: null,
      divisionSelected: null,
      districtSelected: null,
      thanaSelected: null,
      countData: 0,
    };
  }



  public addressTypeItems = [];
  public divisionItems = [];
  public districtItems = [];
  public thanaItems = [];

  public getDropdownData() {

    this.comboService.getAddressType().subscribe((returns: any) => {
      this.addressTypeItems = returns.data.map((val) => ({
        id: val.addressTypeId,
        name: val.Name,
      }));
    });

    this.comboService.getDivision().subscribe((returns: any) => {
      this.divisionItems = returns.data.map((val) => ({
        id: val.divisionsId,
        name: val.divisionName,
      }));
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

  public getDuplicate() {
    this.employeeotherinfoService.GetDuplicateEmployeeAddress(this.master.employeeAddressId, this.master.employeeId, this.master.addressTypeId)
      .subscribe((returns: any) => {
        this.master.countData = returns.data[0].countData;
      });
  }

  private save() {
    var button = this.commonService.buttonClicked;
    if (this.master.addressTypeId == 0 || this.master.addressTypeId == null) {
      this.toastrService.danger("Please select address type", "Message");
      this.commonService.valueSet("create");
      return false;
    } else if (this.master.employeeId == 0 || this.master.employeeId == null) {
      this.toastrService.danger("Please select employee", "Message");
      this.commonService.valueSet("create");
      return false;
    } else if (this.master.countData != 0 && this.master.addressTypeId!=3) {
      this.toastrService.danger("Duplicate address under the same employee", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    this.employeeotherinfoService.SaveEmployeeAddress(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        this.show = true;
        //////////////Grid Refresh ///////////////////
        this.employeeotherinfoService.GetEmployeeAddressById(0, this.master.employeeId).subscribe((data: any) => {
          if (data.status) {
            this.rowData = data.data;
          }
        });

        //////////////Grid Refresh ///////////////////
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
    private http: HttpClient,
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private employeeotherinfoService: EmployeeotherinfoService,
    private employeeinformationService: EmployeeinformationService,
    private comboService: CommoncomboService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.commonService.valueSet("showlist");

    this.getDropdownData();


    this.columnDefs = [
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.rowIndex + 1",
        pinned: "left",
        filter: false,
        width: 70,
      }, /// Dont Change      
      {
        headerName: "Address Type",
        field: "Name",
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "Division",
        field: "divisionName",
        filter: "agTextColumnFilter",
        width: 130,
      },
      {
        headerName: "District",
        field: "districtName",
        filter: "agTextColumnFilter",
        width: 130,
      },
      {
        headerName: "Thana",
        field: "thanaName",
        filter: "agTextColumnFilter",
        width: 170,
      },
      {
        headerName: "Address",
        field: "address",
        filter: "agTextColumnFilter",
        width: 350,
      },
      {
        headerName: "Is Active?",
        field: "isActive",
        width: 120,
      },
      {
        field: "action",
        cellRenderer: "btnCellRenderer",
        cellRendererParams: {
          clicked: function (field: any) { },
        },
        minWidth: 250,
        editable: false,
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
      editable: true,
    };
    this.getMaster();
  }

  public getDistrict(divisionId) {
    this.master.districtSelected = null;
    this.comboService.getDistrict(divisionId).subscribe((returns: any) => {
      this.districtItems = returns.data.map((val) => ({
        id: val.districtsId,
        name: val.districtName,
      }));
    });
  }

  public getThana(districtsId) {
    this.master.thanaSelected = null;
    this.comboService.getThana(districtsId).subscribe((returns: any) => {
      this.thanaItems = returns.data.map((val) => ({
        id: val.thanasId,
        name: val.thanaName,
      }));
    });
  }

  currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

  onGridReady(params) {
    debugger
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.employeeotherinfoService.GetEmployeeAddressById(0, this.master.employeeId).subscribe((data: any) => {
      if (data.status) {
        this.rowData = data.data;
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
      var employeeAddressId = event.node.data.employeeAddressId;
      var employeeId = event.node.data.employeeId;

      this.employeeotherinfoService.GetEmployeeAddressById(employeeAddressId, employeeId).subscribe((data: any) => {
        if (data.status) {
          this.master = data.data[0];

          this.master.addressTypeSelected = {
            id: data.data[0].addressTypeId,
            name: data.data[0].Name,
          };
          this.master.divisionSelected = {
            id: data.data[0].divisionId,
            name: data.data[0].divisionName,
          };

          this.getDistrict(data.data[0].divisionId);
          this.master.districtSelected = {
            id: data.data[0].districtId,
            name: data.data[0].districtName,
          };

          this.getThana(data.data[0].districtId);
          this.master.thanaSelected = {
            id: data.data[0].thanaId,
            name: data.data[0].thanaName,
          };

          this.getDuplicate();
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
      this.master.employeeAddressId = event.node.data.employeeAddressId;
      this.employeeotherinfoService.DeleteEmployeeAddressById(this.master.employeeAddressId)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.toastrService.success(
              this.commonService.deletedmsg,
              "Message"
            );

            //////////////Grid Refresh ///////////////////
            this.employeeotherinfoService.GetEmployeeAddressById(0, this.master.employeeId).subscribe((data: any) => {
              if (data.status) {
                this.rowData = data.data;
              }
            });
            //////////////Grid Refresh ///////////////////
          }
        });
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

}

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
  selector: 'ngx-empjobdescription',
  templateUrl: './empjobdescription.component.html',
  styleUrls: ['./empjobdescription.component.scss']
})
export class EmpjobdescriptionComponent implements OnInit {

  master: {
    employeeJobDescriptionId: number;
    employeeId: number;
    jobDescription: string;
    slNo: number;
    isActive: boolean;
    lstDetails: any[];
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
          this.pageNavigation = this.employeeName + "'s Job Description";
        }
      });
    });

    this.master = {
      employeeJobDescriptionId: 0,
      employeeId: this.employeeId,
      slNo: 0,
      jobDescription: '',
      isActive: true,
      lstDetails: [],
    };
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

  
public addDetails(dialog: TemplateRef<any>) {
    // debugger;
    if (this.master.jobDescription == "" || this.master.jobDescription == null) {
      this.toastrService.danger("Please enter job description", "Message");
      return;
    }

    var RowCount = this.master.lstDetails.length;
    for (let i = 0; i < RowCount; i++) {
      debugger;
      var _slNo = this.master.lstDetails[i].slNo;
      var _jobDescription = this.master.lstDetails[i].jobDescription;
      if (_slNo == this.master.slNo) {
        this.toastrService.danger("You have already added this Sequence No!", "Message");
        return;
      }
      if (_jobDescription == this.master.jobDescription) {
        this.toastrService.danger("You have already added this Job Description!", "Message");
        return;
      }
    }

    let detail = {
      employeeJobDescriptionId: this.master.employeeJobDescriptionId, 
      slNo: this.master.slNo,
      
      isActive: this.master.isActive,
      employeeId: this.master.employeeId,
      jobDescription: this.master.jobDescription,
      //showtd: true
    };
      this.master.lstDetails.push(detail);
      this.master.jobDescription = '';
      this.master.slNo = 0;
  }
  //(click)="deleteDetail(rowIndex)"
  public deleteDetail(index: any) {
    debugger;
    this.selectedRow = this.master.lstDetails[index];
    this.master.lstDetails.splice(index, 1);
    this.toastrService.danger(this.commonService.deletedmsg, "Message");
  }
  private save() {
    debugger;
    var button = this.commonService.buttonClicked;
    if (this.master.lstDetails.length == 0 ) {
      this.toastrService.danger("Please add job description", "Message");
      this.commonService.valueSet("create");
      return false;
    } else if (this.master.employeeId == 0 || this.master.employeeId == null) {
      this.toastrService.danger("Please select employee", "Message");
      this.commonService.valueSet("create");
      return false;
    } 

    this.employeeotherinfoService.SaveEmployeeJobDescription(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        this.show = true;
        //////////////Grid Refresh ///////////////////
        this.employeeotherinfoService.GetEmployeeJobDescriptionById(0, this.master.employeeId).subscribe((data: any) => {
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
        headerName: "Job Description",
        field: "jobDescription",
        filter: "agTextColumnFilter",
        width: 950,
      },
      {
        headerName: "Sequence No",
        field: "slNo",
        filter: "agTextColumnFilter",
        width: 130,
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

  
  currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

  onGridReady(params) {
    debugger
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.employeeotherinfoService.GetEmployeeJobDescriptionById(0, this.master.employeeId).subscribe((data: any) => {
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

      this.employeeotherinfoService.GetEmployeeJobDescriptionById(0, employeeId).subscribe((data: any) => {
        if (data.status) {
          this.master.lstDetails = data.data;
          
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
      this.master.employeeJobDescriptionId = event.node.data.employeeJobDescriptionId;
      this.employeeotherinfoService.DeleteEmployeeJobDescriptionById(this.master.employeeJobDescriptionId)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.toastrService.success(
              this.commonService.deletedmsg,
              "Message"
            );

            //////////////Grid Refresh ///////////////////
            this.employeeotherinfoService.GetEmployeeJobDescriptionById(0, this.master.employeeId).subscribe((data: any) => {
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

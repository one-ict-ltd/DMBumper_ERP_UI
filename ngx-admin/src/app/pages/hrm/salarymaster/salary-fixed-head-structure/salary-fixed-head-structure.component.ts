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
import { SalarygradeService } from "app/services/salary/salarymaster/salarygrade.service";
import { SalaryslabService } from "app/services/salary/salarymaster/salaryslab.service";
import { SalarystructureService } from "app/services/salary/salarymaster/salarystructure.service";
import { EmployeeinformationService } from "app/services/hrm/employeeinformation.service";
import { SalaryperiodService } from "app/services/salary/salarymaster/salaryperiod.service";
import { SalaryheadService } from "app/services/salary/salarymaster/salaryhead.service";
import { SalaryFixedHeadStructureService } from "app/services/salary/salarymaster/salary-fixed-head-structure.service";
import { debug } from "node:console";

@Component({
  selector: 'ngx-salary-fixed-head-structure',
  templateUrl: './salary-fixed-head-structure.component.html',
  styleUrls: ['./salary-fixed-head-structure.component.scss']
})
export class SalaryFixedHeadStructureComponent implements OnInit {

  master: {
    EmpFixedHeadStructureId: number;
    loadFromDateShow: Date;
    loadToDateShow: Date;
    employeeId: number;
    salaryPeriodId: number;
    salaryPeriodLoadId: number;
    salaryHeadId: number;
    structureAmount: number;
    isActive: boolean;
    lstMaster: any[];
    statusId: number;
    Amount: number;
    days: number;
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

  title = "Hi there!";
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
    { title: null, body: "Toaster rock!" },
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

  public pageNavigation = "Employee's Salary Fixed Head Amount Entry";//"Employee's Salary Fixed Head Structure";
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
    this.master = {
      EmpFixedHeadStructureId: 0,
      loadFromDateShow: new Date(),
      loadToDateShow: new Date(),
      employeeId: 0,
      salaryPeriodId: 0,
      salaryPeriodLoadId: 0,
      salaryHeadId: 0,
      structureAmount: 0,
      isActive: false,
      lstMaster: [],
      statusId: 0,
      Amount: 0,
      days: 0,
    };
    this.master.loadFromDateShow.setDate(this.master.loadFromDateShow.getDate() - 60);
    this.salaryHeadSelected = {};
    this.salaryPeriodSelected = {};
    this.salaryPeriodLoadSelected = {};
    this.employeeSelected = {};
  }



  public employeeItems: [];
  public salaryGradeItems: [];
  public salarySlabItems: [];


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


  statusShow = false;
  public getDuplicate(id) {
    // this.salarystructureService.GetDuplicateSalaryEmployeeStructure(this.master.employeeId)
    //   .subscribe((returns: any) => {
    //     //this.master.countData = returns.data[0].countData;
    //   });
    debugger;
    if (id === 19) {
      this.statusShow = true;
    } else {
      this.statusShow = false;
    }
  }

  private save() {
    debugger;
    var button = this.commonService.buttonClicked;
    if (this.master.lstMaster.length == 0) {
      this.toastrService.danger("No data found for save! Please add one.", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    this.SalaryFixedHeadStructureService.SaveSalaryEmployeeFixedHeadStructure(this.master.lstMaster).subscribe((data: any) => {
      debugger;
      if (data.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        this.show = true;
      }
      else this.commonService.valueSet("create");
    });


    //////////////Grid Refresh ///////////////////
    this.SalaryFixedHeadStructureService.GetSalaryEmployeeFixedHeadStructureById(0, 0).subscribe((data: any) => {
      if (data.success) {
        this.rowData = data.data;
      }
    });

    //////////////Grid Refresh ///////////////////

  }

  private reset() {
    window.location.reload();
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
    //private http: HttpClient,
    //private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private salarystructureService: SalarystructureService,
    // private salarygradeService: SalarygradeService,
    // private salaryslabService: SalaryslabService,
    private comboService: CommoncomboService,
    private salaryperiodService: SalaryperiodService,
    //private employeeinformationService: EmployeeinformationService,
    private salaryheadService: SalaryheadService,
    private SalaryFixedHeadStructureService: SalaryFixedHeadStructureService,
  ) {
    this.commonService.valueSet("showlist");

    this.LoadEmployees();
    this.LoadSalaryPeriod();
    this.getSalaryHead();
    this.loadStatusList();


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
        headerName: "Employee's Code",
        field: "employeeNo",
        filter: "agTextColumnFilter",
        width: 200,
      },
      {
        headerName: "Employee's Name",
        field: "fullName",
        filter: "agTextColumnFilter",
        width: 350,
      },
      {
        headerName: "Salary Period",
        field: "periodName",
        filter: "agTextColumnFilter",
        width: 250,
      },
      {
        headerName: "Head Name",
        field: "salaryHeadName",
        filter: "agTextColumnFilter",
        width: 250,
      },
      {
        headerName: "Amount",
        field: "structureAmount",
        filter: "agNumberColumnFilter",
        valueFormatter: (params) => this.currencyFormatter(params.data.structureAmount),
        type: "rightAligned",
        width: 150,
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

  currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.SalaryFixedHeadStructureService.GetSalaryEmployeeFixedHeadStructureById(0, 0).subscribe((data: any) => {
      debugger;
      if (data.success) {
        this.rowData = data.data;
      }
    });
  }

  public getSalaryHeadAmount() {
    let salaryPeriodLoad = this.salaryPeriodLoadSelected["id"];
    this.SalaryFixedHeadStructureService.GetSalaryEmployeeFixedHeadStructureById(0, this.master.salaryPeriodLoadId).subscribe((data: any) => {
      debugger;
      if (data.success) {
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
      //this.toastrService.info("Please Click Any Button", "Message");
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
    debugger;
    if (temp === 0) {
      this.selectedRows.push(event.node.data);
      this.selectedRow = event.node.data;
      var EmpFixedHeadStructureId = event.node.data.EmpFixedHeadStructureId;
      var salaryperiodId = event.node.data.salaryPeriodId;

      this.SalaryFixedHeadStructureService.GetSalaryEmployeeFixedHeadStructureById(EmpFixedHeadStructureId, salaryperiodId).subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0];
          this.master.lstMaster = [];
          this.GetSalaryFixedHeadByEmpId();

          this.salaryPeriodSelected = {
            id: data.data[0].salaryPeriodId,
            name: data.data[0].periodName,
          }
          this.salaryHeadSelected = {
            id: data.data[0].salaryHeadId,
            name: data.data[0].salaryHeadName,
          }
          this.employeeSelected = {
            id: data.data[0].employeeId,
            name: data.data[0].fullName + ' - ' + data.data[0].employeeNo,
          }
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
      let EmpFixedHeadStructureId = event.node.data.EmpFixedHeadStructureId;
      this.SalaryFixedHeadStructureService.DeleteSalaryEmployeeFixedHeadStructure(EmpFixedHeadStructureId)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.toastrService.success(
              this.commonService.deletedmsg,
              "Message"
            );

            //////////////Grid Refresh ///////////////////
            this.SalaryFixedHeadStructureService.GetSalaryEmployeeFixedHeadStructureById(0, 0).subscribe((data: any) => {
              if (data.success) {
                this.rowData = data.data;
              }
            });
            //////////////Grid Refresh ///////////////////
          }
        });
    }
  }


  salaryPeriodItems = [];
  salaryPeriodSelected = {};//{ id: 0, name: 'select a period' };
  salaryPeriodLoadSelected = {};//{ id: 0, name: 'select a period' };
  public LoadSalaryPeriod() {
    this.salaryperiodService.GetSalaryPeriodById(0).subscribe((returns: any) => {
      this.salaryPeriodItems = returns.data.map((val) => ({
        id: val.salaryPeriodId,
        name: val.periodName,
        workingDays: val.workingDays,
      }));
    });
  }
  salaryHeadItems = [];
  salaryHeadSelected = {};// { id: 0, name: 'select a head name' };
  public getSalaryHead() {

    // this.salaryheadService.GetSalaryHeadById(0).subscribe((returns: any) => {
    //   this.salaryHeadItems = returns.data.map((val) => ({
    //     id: val.salaryHeadId,
    //     name: val.salaryHeadName,
    //   }));
    // });

    //this.GetSalaryFixedHeadByEmpId();
  }
  public GetSalaryFixedHeadByEmpId() {
    this.salaryHeadItems = [];
    this.salaryHeadSelected = {};
    this.SalaryFixedHeadStructureService.GetSalaryFixedHeadByEmpId(this.master.employeeId).subscribe((returns: any) => {
      this.salaryHeadItems = returns.data.map((val) => ({
        id: val.salaryHeadId,
        name: val.salaryHeadName,
      }));
    });
  }
  employeeSelected = {};//{ id: 0, name: 'select an employee' };
  public LoadEmployees() {
    this.comboService.GetPayrollEmployeeById(0, 0).subscribe((returns: any) => {
      this.employeeItems = returns.data.map((val) => ({
        id: val.employeeId,
        name: val.fullName,
        Gross: val.Gross,
        Basic: val.Basic,
      }));
    });
  }

  LoadSalary(id) {
    //console.log(this.employeeSelected);
    debugger;
    if (id === 1) {
      this.master.Amount = this.employeeSelected['Gross'];
    } else {
      this.master.Amount = this.employeeSelected['Basic'];
    }
  }



  public addToDetailsGrid() {
    debugger;
    if (this.salaryPeriodSelected["name"] == null) {
      this.toastrService.danger("Please select a salary period !", "Message");
      return;
    }
    if (this.employeeSelected["name"] == null) {
      this.toastrService.danger("Please select an employee !", "Message");
      return;
    }
    if (this.salaryHeadSelected["name"] == null) {
      this.toastrService.danger("Please select a salary head !", "Message");
      return;
    }
    if (this.master.structureAmount == null || this.master.structureAmount <= 0) {
      this.toastrService.danger("Please input valid amount !", "Message");
      return;
    }


    let elements = {
      EmpFixedHeadStructureId: this.master.EmpFixedHeadStructureId,
      employeeId: this.master.employeeId,
      salaryHeadId: this.master.salaryHeadId,
      salaryPeriodId: this.master.salaryPeriodId,
      structureAmount: this.master.structureAmount,
      isActive: 1,

      employeeName: this.employeeSelected["name"],
      salaryHead: this.salaryHeadSelected["name"],
      salaryPeriod: this.salaryPeriodSelected["name"],
    };
    this.master.lstMaster.push(elements);

    this.master.structureAmount = 0;
    //this.employeeSelected = {};
    this.salaryHeadSelected = {};
    this.StatusSelected = {};
    //this.salaryHeadItems = [];
  }

  public deleteDetails(index: any) {
    debugger;
    if (confirm("Are you sure to delete?")) {
      this.SalaryFixedHeadStructureService
        .DeleteSalaryEmployeeFixedHeadStructure(
          this.master.lstMaster[index].EmpFixedHeadStructureId
        )
        .subscribe((returns: any) => {
          if (returns.success) {
            this.toastrService.success(this.commonService.deletedmsg, "Message");
          }
        });

      this.selectedRow = this.master.lstMaster[index];
      this.master.lstMaster.splice(index, 1);
      if (this.selectedRow.helpDetailId > 0) {
      }
      this.toastrService.danger(this.commonService.deletedmsg, "Message");
    }
  }

  StatusList: {};
  StatusSelected: {};
  loadStatusList() {
    this.StatusList = [
      {
        id: 1,
        name: "Gross Salary",
      },
      {
        id: 2,
        name: "Basic Salary",
      },
    ];
  }
  calculateTotal() {
    let days = this.salaryPeriodSelected['workingDays'];
    let amount = this.master.Amount / days;
    let total = amount * this.master.days;
    this.master.structureAmount = Math.round(total);
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

}

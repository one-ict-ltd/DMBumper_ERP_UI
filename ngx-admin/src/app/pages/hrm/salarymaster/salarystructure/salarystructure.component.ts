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
import { HrmmasterService } from "app/services/hrm/hrmmaster.service";

@Component({
  selector: 'ngx-salarystructure',
  templateUrl: './salarystructure.component.html',
  styleUrls: ['./salarystructure.component.scss']
})
export class SalarystructureComponent implements OnInit {

  master: {
    employeeStructureId: number;
    employeeId: number;
    salaryGradeId: number;
    salarySlabId: number;
    slabAmount: number;
    structureAmount: number;
    effectiveDateShow: Date;
    effectiveDate: string;
    isActive: boolean;

    employeeSelected: {};
    salaryGradeSelected: {};
    salarySlabSelected: {};
    designationSelected: {};
    departmentSelected: {};

    designation: string;
    department: string;
    countData: number;

    lstAddtion: any[];
    lstDeduction: any[];
    bankAmount: number;
    cashAmount: number;
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
  netAmount: number = 0;

  public salaryGradeItems: [];
  public salarySlabItems: [];

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

  public pageNavigation = "Salary Structure of Employee's";
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
      employeeStructureId: 0,
      employeeId: 0,
      salaryGradeId: 0,
      salarySlabId: 0,
      slabAmount: 0,
      structureAmount: 0,
      effectiveDateShow: new Date(),
      effectiveDate: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
      isActive: true,

      employeeSelected: null,
      salaryGradeSelected: null,
      salarySlabSelected: null,
      designationSelected: null,
      departmentSelected: null,

      designation: '',
      department: '',
      countData: 0,

      lstAddtion: [],
      lstDeduction: [],
      cashAmount: 0,
      bankAmount: 0
    };
  }

  public employeeItems: [];



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

  public getActualDate(event: any) {
    var dateCon = event.toLocaleDateString() + " " + event.toLocaleTimeString();
    if (dateCon != "") {
      this.master.effectiveDate = dateCon;
    }
  }

  public getDuplicate() {
    this.salarystructureService.GetDuplicateSalaryEmployeeStructure(this.master.employeeId)
      .subscribe((returns: any) => {
        this.master.countData = returns.data[0].countData;
      });
  }

  private save() {
    var button = this.commonService.buttonClicked;
    if (this.master.employeeId == 0 || this.master.employeeId == null) {
      this.toastrService.danger("Please select employee", "Message");
      this.commonService.valueSet("create");
      return false;
    } else if (this.master.salaryGradeId == 0 || this.master.salaryGradeId == null) {
      this.toastrService.danger("Please select grade", "Message");
      this.commonService.valueSet("create");
      return false;
    } else if (this.master.salarySlabId == 0 || this.master.salarySlabId == null) {
      this.toastrService.danger("Please select slab", "Message");
      this.commonService.valueSet("create");
      return false;
    } else if (this.master.slabAmount == 0 || this.master.slabAmount == null) {
      this.toastrService.danger("Please insert slab amount", "Message");
      this.commonService.valueSet("create");
      return false;
    } else if (this.master.lstAddtion.length == 0 || this.master.lstAddtion == null) {
      this.toastrService.danger("Please calculate structure", "Message");
      this.commonService.valueSet("create");
      return false;
    }


    if (button == "update") {
      this.toastrService.success(this.commonService.updatedmsg, "Message");
    } else {
      this.toastrService.success(this.commonService.successmsg, "Message");
    }
    this.show = true;
    //////////////Grid Refresh ///////////////////
    this.salarystructureService.GetSalaryAllEmployeeStructure().subscribe((data: any) => {
      if (data.status) {
        this.rowData = data.data;
      }
    });

    //////////////Grid Refresh ///////////////////

  }

  private CalculateStructure() {
    if (this.master.employeeId == 0 || this.master.employeeId == null) {
      this.toastrService.danger("Please select employee", "Message");
      this.commonService.valueSet("create");
      return false;
    } else if (this.master.salaryGradeId == 0 || this.master.salaryGradeId == null) {
      this.toastrService.danger("Please select grade", "Message");
      this.commonService.valueSet("create");
      return false;
    } else if (this.master.salarySlabId == 0 || this.master.salarySlabId == null) {
      this.toastrService.danger("Please select slab", "Message");
      this.commonService.valueSet("create");
      return false;
    } else if (this.master.slabAmount == 0 || this.master.slabAmount == null) {
      this.toastrService.danger("Please insert slab amount", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    // else if (this.master.countData != 0) {
    //   this.toastrService.danger("Duplicate structure", "Message");
    //   this.commonService.valueSet("create");
    //   return false;
    // }

    this.salarystructureService.SaveSalaryEmployeeStructure(this.master).subscribe((returns: any) => {
      if (returns.success) {

        this.toastrService.success(this.commonService.successmsg, "Message");
        this.netAmount = 0;
        //////////////Details Grid Refresh ///////////////////
        this.salarystructureService.GetSalaryEmployeeStructureByEmpId(this.master.employeeId, 'Addition').subscribe((data: any) => {
          if (data.status) {
            this.master.lstAddtion = data.data;
            this.additionAmount = data.data[0].additionAmount;
            if (data.data[0].bankAmount === 0 && data.data[0].cashAmount === 0) {
              this.netAmount += this.additionAmount;
              this.dividedBankCash();
            } else {
              this.master.bankAmount = data.data[0].bankAmount;
              this.master.cashAmount = data.data[0].cashAmount;
            }
          }
        });

        this.salarystructureService.GetSalaryEmployeeStructureByEmpId(this.master.employeeId, 'Deduction').subscribe((data: any) => {
          if (data.status) {
            this.master.lstDeduction = data.data;
            this.deductionAmount = data.data[0].deductionAmount;
            if (data.data[0].bankAmount === 0 && data.data[0].cashAmount === 0) {
              this.netAmount -= this.deductionAmount;
              this.dividedBankCash();
            } else {
              this.master.bankAmount = data.data[0].bankAmount;
              this.master.cashAmount = data.data[0].cashAmount;
            }
          }
        });

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
    private salarystructureService: SalarystructureService,
    private salarygradeService: SalarygradeService,
    private salaryslabService: SalaryslabService,
    private comboService: CommoncomboService,
    private employeeinformationService: EmployeeinformationService,
    private hrmmasterService: HrmmasterService
  ) {
    this.commonService.valueSet("showlist");

    this.LoadEmployees();
    this.LoadSalaryGrade();
    this.GetDepartment();

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
        width: 250,
      },
      {
        headerName: "Employee's Name",
        field: "fullName",
        filter: "agTextColumnFilter",
        width: 250,
      },
      {
        headerName: "Grade Name",
        field: "gradeName",
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "Slab Name",
        field: "slabName",
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "Effective Date",
        field: "effectiveDate",
        filter: "agTextColumnFilter",
        width: 200,
      },
      {
        headerName: "Net Amount",
        field: "netAmount",
        filter: "agNumberColumnFilter",
        valueFormatter: (params) => this.currencyFormatter(params.data.netAmount),
        type: "rightAligned",
        width: 150,
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
    this.salarystructureService.GetSalaryAllEmployeeStructure().subscribe((data: any) => {
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
      var employeeId = event.node.data.employeeId;

      this.salarystructureService.GetSalaryEmployeeStructureByEmpId(employeeId, '').subscribe((data: any) => {
        if (data.status) {
          debugger
          this.master = data.data[0];

          this.master.employeeSelected = {
            id: data.data[0].employeeId,
            name: data.data[0].fullName,
          };
          this.master.salaryGradeSelected = {
            id: data.data[0].salaryGradeId,
            name: data.data[0].gradeName,
          };
          this.LoadSalarySlab();
          this.master.salarySlabSelected = {
            id: data.data[0].salarySlabId,
            name: data.data[0].slabName,
          };
          this.master.designationSelected = {
            id: data.data[0].designationId,
            name: data.data[0].designationName,
          };
          this.master.departmentSelected = {
            id: data.data[0].departmentId,
            name: data.data[0].deptName,
          };
          this.GetSlabAmount();
          this.GetDesignation();

          this.getDuplicate();
          this.netAmount = 0;
          this.salarystructureService.GetSalaryEmployeeStructureByEmpId(employeeId, 'Addition').subscribe((data: any) => {
            if (data.status) {
              this.master.lstAddtion = data.data;
              this.additionAmount = data.data[0].additionAmount;
              if (data.data[0].bankAmount === 0 && data.data[0].cashAmount === 0) {
                this.netAmount += this.additionAmount;
                this.dividedBankCash();
              } else {
                this.master.bankAmount = data.data[0].bankAmount;
                this.master.cashAmount = data.data[0].cashAmount;
              }
            }
          });

          this.salarystructureService.GetSalaryEmployeeStructureByEmpId(employeeId, 'Deduction').subscribe((data: any) => {
            if (data.status) {
              this.master.lstDeduction = data.data;
              this.deductionAmount = data.data[0].deductionAmount;
              if (data.data[0].bankAmount === 0 && data.data[0].cashAmount === 0) {
                this.netAmount -= this.deductionAmount;
                this.dividedBankCash();
              } else {
                this.master.bankAmount = data.data[0].bankAmount;
                this.master.cashAmount = data.data[0].cashAmount;
              }
            }
          });

        }
      });
      this.ngOnInit();
    }
  }
  dividedBankCash(): void {
    this.master.bankAmount = this.netAmount * 0.75;
    this.master.cashAmount = this.netAmount * 0.25;
  }


  private agReport(event) {
    this.toastrService.info("Print button clicked", "Message");
  }
  private agDelete(event) {
    var result = confirm("Are you sure you want to delete that?");
    if (result) {
      this.master.employeeId = event.node.data.employeeId;
      this.salarystructureService.DeleteSalaryEmployeeStructureByEmpId(this.master.employeeId)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.toastrService.success(
              this.commonService.deletedmsg,
              "Message"
            );

            //////////////Grid Refresh ///////////////////
            this.salarystructureService.GetSalaryAllEmployeeStructure().subscribe((data: any) => {
              if (data.status) {
                this.rowData = data.data;
              }
            });
            //////////////Grid Refresh ///////////////////
          }
        });
    }
  }

  public LoadEmployees() {
    this.employeeinformationService.GetEmployeeBasicInfoByCompanyId(0).subscribe((returns: any) => {
      this.employeeItems = returns.data.map((val) => ({
        id: val.employeeId,
        name: val.fullName,
      }));
    });
  }

  public LoadSalaryGrade() {
    this.salarygradeService.GetSalaryGradeById(0).subscribe((returns: any) => {
      this.salaryGradeItems = returns.data.map((val) => ({
        id: val.salaryGradeId,
        name: val.gradeName,
      }));
    });
  }

  public LoadSalarySlab() {
    this.salaryslabService.GetSalarySlabById(0, this.master.salaryGradeId).subscribe((returns: any) => {
      this.salarySlabItems = returns.data.map((val) => ({
        id: val.salarySlabId,
        name: val.slabName,
      }));
    });
  }
  public DesignationList = [];
  public GetDesignation() {
    let slabId = this.master.salarySlabSelected['id'] ?? 0;
    this.hrmmasterService.getDesignationBySalarySlabId(slabId).subscribe((returns: any) => {
      this.DesignationList = returns.data.map((val: any) => ({
        id: val.designationName,
        name: val.designationName,
      }))
    })
  }
  public DepartmentList = [];
  public GetDepartment() {
    this.hrmmasterService.getDepartment(0).subscribe((returns: any) => {
      this.DepartmentList = returns.data.map((val: any) => ({
        id: val.deptName,
        name: val.deptName,
      }))
    })
  }

  public GetSlabAmount() {
    // this.master.slabAmount = 0;
    this.salaryslabService.GetSalarySlabById(this.master.salarySlabId, this.master.salaryGradeId)
      .subscribe((returns: any) => {
        this.master.slabAmount = returns.data[0].slabAmount;
      });
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

  public salaryHeadName = "";
  public additionAmount = 0;
  public deductionAmount = 0;

  public openWithDataObjModel(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
    });
  }

  public editStructure(dialog: TemplateRef<any>, employeeStructureId, salaryHeadName, structureAmount, isActive) {
    this.openWithDataObjModel(dialog);

    this.master.employeeStructureId = employeeStructureId;
    this.master.structureAmount = structureAmount;
    this.master.isActive = isActive;
    this.salaryHeadName = salaryHeadName;
  }

  private UpdateStructure() {

    this.salarystructureService.UpdateSalaryEmployeeStructure(this.master).subscribe((returns: any) => {
      if (returns.success) {

        this.toastrService.success(this.commonService.updatedmsg, "Message");
        this.netAmount = 0;
        //////////////Details Grid Refresh ///////////////////
        this.salarystructureService.GetSalaryEmployeeStructureByEmpId(this.master.employeeId, 'Addition').subscribe((data: any) => {
          if (data.status) {
            this.master.lstAddtion = data.data;
            this.additionAmount = data.data[0].additionAmount;
            if (data.data[0].bankAmount === 0 && data.data[0].cashAmount === 0) {
              this.netAmount += this.additionAmount;
              this.dividedBankCash();
            } else {
              this.master.bankAmount = data.data[0].bankAmount;
              this.master.cashAmount = data.data[0].cashAmount;
            }
          }
        });

        this.salarystructureService.GetSalaryEmployeeStructureByEmpId(this.master.employeeId, 'Deduction').subscribe((data: any) => {
          if (data.status) {
            this.master.lstDeduction = data.data;
            this.deductionAmount = data.data[0].deductionAmount;
            if (data.data[0].bankAmount === 0 && data.data[0].cashAmount === 0) {
              this.netAmount -= this.deductionAmount;
              this.dividedBankCash();
            } else {
              this.master.bankAmount = data.data[0].bankAmount;
              this.master.cashAmount = data.data[0].cashAmount;
            }
          }
        });
      }
    });
  }

  calculateBankAmount(event) {
    const cashAmount = event.target.value;
    this.master.bankAmount = this.netAmount - cashAmount;
    this.master.cashAmount = cashAmount;
  }

}

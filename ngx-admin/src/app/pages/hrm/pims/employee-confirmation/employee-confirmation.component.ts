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
  selector: 'ngx-employee-confirmation',
  templateUrl: './employee-confirmation.component.html',
  styleUrls: ['./employee-confirmation.component.scss']
})
export class EmployeeConfirmationComponent implements OnInit {

  master: {

    employeePromotionId: number;
    employeeId: number;
    employeeSelected: {};


    joiningDate: string;
    previousDesignation: string;
    currentDesignation: string;
    previousDepartment: string;
    currentDepartment: string;
    PreviousGrossSalary: number;
    NewGrossSalary: number;
    incrementSalary: number;
    prevSalaryLocation: string;
    type: string;
    countData: number;

    lstAddtion: any[];
    lstDeduction: any[];


    prevSlab: string;
    prevSalarySlabId: null;
    NewSalarySlabId: null;

    prevGrade: string;
    prevSalaryGradeId: null;
    NewGradeId: null;


    salaryGradeSelected: {};
    salarySlabSelected: {};
    DepartmentSelected: {}
    DesignationSelected: {}

    salaryLocation: string;
    salaryLocationSelected: {};
    HrmSalaryLocationId: null,
    HrmNewSalaryLocationId: null,
    remarks: string;
    promotionDate: Date;
  };

  element = { id: 0, name: "All" };
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

  public pageNavigation = "Employee Confirmation";
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
      employeePromotionId: 0,
      employeeId: 0,
      employeeSelected: null,

      joiningDate: '',
      previousDesignation: '',
      currentDesignation: '',
      previousDepartment: '',
      currentDepartment: '',
      type: 'Confirmation',
      PreviousGrossSalary: 0,
      NewGrossSalary: 0,
      incrementSalary: 0,

      countData: 0,

      lstAddtion: [],
      lstDeduction: [],

      NewGradeId: null,
      prevGrade: '',
      prevSalaryGradeId: null,


      prevSlab: '',
      prevSalarySlabId: null,
      NewSalarySlabId: null,

      salaryGradeSelected: null,
      salarySlabSelected: null,
      DepartmentSelected: null,
      DesignationSelected: null,

      salaryLocation: '',
      salaryLocationSelected: null,
      prevSalaryLocation: '',
      HrmSalaryLocationId: null,

      HrmNewSalaryLocationId: null,
      remarks: '',
      promotionDate: new Date(),

    };
    this.GetSalaryLocationJson();
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

  //////////////////////////////////////////////CRUD////////////////////////////  

  // public getActualDate(event: any) {
  //   var dateCon = event.toLocaleDateString() + " " + event.toLocaleTimeString();
  //   if (dateCon != "") {
  //     this.master.effectiveDate = dateCon;
  //   }
  // }

  // public getDuplicate() {
  //   this.salarystructureService.GetDuplicateSalaryEmployeeStructure(this.master.employeeId)
  //     .subscribe((returns: any) => {
  //       this.master.countData = returns.data[0].countData;
  //     });
  // }

  initEmployeeInfo(empId: any) {
    let employeeInfo = null;
    this.master.previousDesignation = ""
    this.master.previousDepartment = ""
    this.master.joiningDate = ""
    this.master.PreviousGrossSalary = 0
    this.master.NewGrossSalary = 0
    this.master.prevSalaryLocation = ""
    this.master.HrmSalaryLocationId = null
    this.master.prevGrade = ''
    this.master.prevSalaryGradeId = null
    this.master.prevSlab = ''
    this.master.prevSalarySlabId = null
    this.employeeinformationService.GetEmployeeInfoLoadById(empId).subscribe((returns: any) => {
      this.master.previousDesignation = returns.data[0].currentDesignation
      this.master.previousDepartment = returns.data[0].currentDepartment
      this.master.joiningDate = returns.data[0].joiningDate
      this.master.PreviousGrossSalary = returns.data[0].grossSalary
      this.master.NewGrossSalary = returns.data[0].grossSalary
      this.master.prevSalaryLocation = returns.data[0].salaryLocation
      this.master.HrmSalaryLocationId = returns.data[0].HrmSalaryLocationId
      this.master.prevGrade = returns.data[0].gradeName
      this.master.prevSalaryGradeId = returns.data[0].salaryGradeId
      this.master.prevSlab = returns.data[0].slabName
      this.master.prevSalarySlabId = returns.data[0].salarySlabId
    });

    this.getIncrementSalary();
    //  if(data){
    //   this.master.previousDesignation = data.currentDesignation
    //   this.master.previousDepartment = data.currentDepartment
    //   this.master.joiningDate = data.joiningDate
    //   this.master.grossSalary = data.grossSalary
    //   this.master.prevSalaryLocation = data.salaryLocation
    //   this.master.HrmSalaryLocationId = data.HrmSalaryLocationId
    //  }else{
    //   this.master.previousDesignation = ""
    //   this.master.previousDepartment = ""
    //   this.master.joiningDate = ""
    //   this.master.grossSalary = 0
    //   this.master.prevSalaryLocation = ""
    //   this.master.HrmSalaryLocationId = null
    //  }
  }

  private save() {
    var button = this.commonService.buttonClicked;
    if (this.master.employeeId == 0 || this.master.employeeId == null) {
      this.toastrService.danger("Please select employee", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    if (this.master.HrmNewSalaryLocationId == 0 || this.master.HrmNewSalaryLocationId == null) {
      this.toastrService.danger("Please select Salary Location", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    if (this.master.promotionDate == null) {
      this.toastrService.danger("Please select Promotion Date", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    this.master.promotionDate = this.commonService.DateFormat(this.master.promotionDate);

    this.employeeinformationService.SaveEmployeePromotion(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        this.show = true;
        //////////////Grid Refresh ///////////////////
        this.employeeinformationService.GetEmployeeConfirmationById(0).subscribe((data: any) => {
          if (data.success) {
            this.rowData = data.data;
          }
        });
        //////////////Grid Refresh ///////////////////
      }
    });


    // if (button == "update") {
    //   this.toastrService.success(this.commonService.updatedmsg, "Message");
    // } else {
    //   this.toastrService.success(this.commonService.successmsg, "Message");
    // }
    // this.show = true;
    // //////////////Grid Refresh ///////////////////
    // this.salarystructureService.GetSalaryAllEmployeeStructure().subscribe((data: any) => {
    //   if (data.status) {
    //     this.rowData = data.data;
    //   }
    // });

    //////////////Grid Refresh ///////////////////

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
    private hrmmasterService: HrmmasterService,
  ) {
    this.commonService.valueSet("showlist");
    this.GetDepartment();
    this.LoadEmployees(0);
    this.GetDesignation();
    this.LoadSalaryGrade();
    //this.LoadSalarySlab();
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
        headerName: "Employee's Name",
        field: "fullNameCode",
        filter: "agTextColumnFilter",
        width: 250,
      },
      {
        headerName: "New Salary Location",
        field: "salaryLocation",
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "New Slab Name",
        field: "NewSlab",
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "New Gross Salary",
        field: "NewGrossSalary",
        filter: "agTextColumnFilter",
        valueFormatter: (params) => this.currencyFormatter(params.data.NewGrossSalary),
        type: "rightAligned",
        width: 150,
      },
      {
        headerName: "Confirmation Date",
        field: "promotionDate",
        filter: "agTextColumnFilter",
        width: 200,
      },
      {
        headerName: "Remarks",
        field: "remarks",
        filter: "agTextColumnFilter",
        // valueFormatter: (params) => this.currencyFormatter(params.data.netAmount),
        // type: "rightAligned",
        width: 200,
      },
      // {
      //   headerName: "Is Active?",
      //   field: "isActive",
      //   width: 120,
      // },
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
    this.rowData = []
    this.employeeinformationService.GetEmployeeConfirmationById(0).subscribe((data: any) => {
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
      var employeePromotionId = event.node.data.employeePromotionId;

      this.master.promotionDate = this.commonService.DateFormat(this.master.promotionDate);

      this.employeeinformationService.GetEmployeeConfirmationById(employeePromotionId).subscribe((data: any) => {
        if (data.status) {
          this.master = data.data[0];
          this.employeeinformationService.GetEmployeeInfoLoadById(data.data[0].employeeId).subscribe((returns: any) => {
            // this.master.previousDesignation = returns.data[0].currentDesignation
            //this.master.previousDepartment = returns.data[0].currentDepartment
            this.master.joiningDate = returns.data[0].joiningDate
            // this.master.PreviousGrossSalary = returns.data[0].grossSalary
          });

          this.master.employeeSelected = {
            id: data.data[0].employeeId,
            name: data.data[0].fullName,
          };

          this.master.salaryLocationSelected = {
            id: data.data[0].HrmNewSalaryLocationId,
            name: data.data[0].salaryLocation,
          };

          this.master.prevSalaryLocation = data.data[0].prevSalaryLocation
          this.master.HrmSalaryLocationId = data.data[0].HrmSalaryLocationId

          this.master.salaryGradeSelected = {
            id: data.data[0].newSalaryGradeId,
            name: data.data[0].newGradeName,
          };

          this.master.salarySlabSelected = {
            id: data.data[0].newSalaryGradeId,
            name: data.data[0].NewSlab,
          };

          this.master.DepartmentSelected = {
            id: data.data[0].currentDepartment,
            name: data.data[0].currentDepartment,
          };

          this.master.DesignationSelected = {
            id: data.data[0].currentDesignation,
            name: data.data[0].currentDesignation,
          };


          this.master.prevGrade = data.data[0].prevGradeName
          this.master.prevSalaryGradeId = data.data[0].prevSalaryGradeId

          this.master.prevSlab = data.data[0].prevSlab
          this.master.prevSalarySlabId = data.data[0].prevSalarySlabId

          this.master.PreviousGrossSalary = data.data[0].PreviousGrossSalary
          this.master.NewGrossSalary = data.data[0].NewGrossSalary
          this.master.incrementSalary = data.data[0].incrementSalary


          this.master.previousDesignation = data.data[0].previousDesignation
          this.master.previousDepartment = data.data[0].previousDepartment




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
      this.master.employeePromotionId = event.node.data.employeePromotionId;
      this.employeeinformationService.deleteEmployeePromotion(this.master.employeePromotionId)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.toastrService.success(
              this.commonService.deletedmsg,
              "Message"
            );

            //////////////Grid Refresh ///////////////////
            this.employeeinformationService.GetEmployeeConfirmationById(0).subscribe((data: any) => {
              if (data.status) {
                this.rowData = data.data;
              }
            });
            //////////////Grid Refresh ///////////////////
          }
        });
    }
  }

  public LoadEmployees(empId) {
    this.employeeinformationService.GetEmployeeInfoLoadById(empId).subscribe((returns: any) => {
      this.employeeItems = returns.data.map((val) => ({
        id: val.employeeId,
        name: val.fullName
      }));
    });
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

  public DesignationList = [];
  public GetDesignation() {
    this.hrmmasterService.getDesignation(0).subscribe((returns: any) => {
      this.DesignationList = returns.data.map((val: any) => ({
        id: val.designationName,
        name: val.designationName,
      }))
    })
  }

  public SalaryLocationList = [];
  public GetSalaryLocationJson() {
    this.master.salaryLocationSelected = null;
    this.comboService.GetSalaryLocationJson().subscribe((returns: any) => {
      this.SalaryLocationList = returns.data.map((val) => ({
        id: val.salaryLocationId,
        name: val.Name,
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
    this.master.salarySlabSelected = {}

    this.salaryslabService.GetSalarySlabById(0, this.master.NewGradeId).subscribe((returns: any) => {
      this.salarySlabItems = returns.data.map((val) => ({
        id: val.salarySlabId,
        name: val.slabName,
      }));
    });
  }


  public getIncrementSalary() {
    //debugger;
    var prevGrossAmount = 0;
    var currentGrossAmount = 0;

    prevGrossAmount = this.master.PreviousGrossSalary;
    currentGrossAmount = this.master.NewGrossSalary;
    this.master.incrementSalary = currentGrossAmount - prevGrossAmount;
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

    //this.master.employeeStructureId = employeeStructureId;
    // this.master.structureAmount = structureAmount;
    // this.master.isActive = isActive;
    this.salaryHeadName = salaryHeadName;
  }

  private UpdateStructure() {

    this.salarystructureService.UpdateSalaryEmployeeStructure(this.master).subscribe((returns: any) => {
      if (returns.success) {

        this.toastrService.success(this.commonService.updatedmsg, "Message");

        //////////////Details Grid Refresh ///////////////////
        this.salarystructureService.GetSalaryEmployeeStructureByEmpId(this.master.employeeId, 'Addition').subscribe((data: any) => {
          if (data.status) {
            this.master.lstAddtion = data.data;
            this.additionAmount = data.data[0].additionAmount;
          }
        });

        this.salarystructureService.GetSalaryEmployeeStructureByEmpId(this.master.employeeId, 'Deduction').subscribe((data: any) => {
          if (data.status) {
            this.master.lstDeduction = data.data;
            this.deductionAmount = data.data[0].deductionAmount;
          }
        });
      }
    });
  }

}
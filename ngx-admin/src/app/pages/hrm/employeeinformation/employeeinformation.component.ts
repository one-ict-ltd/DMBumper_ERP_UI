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
import { CommoncomboService } from "app/services/commoncombo.service";
import { HrmmasterService } from "app/services/hrm/hrmmaster.service";
import { EmployeeinformationService } from "app/services/hrm/employeeinformation.service";
import { Router } from '@angular/router';
import { FieldforcemasterService } from "app/services/fieldforcetracking/fieldforcemaster.service";
import { DatePipe } from "@angular/common";
import { SalarygradeService } from "app/services/salary/salarymaster/salarygrade.service";
import { SalaryslabService } from "app/services/salary/salarymaster/salaryslab.service";

@Component({
  selector: 'ngx-employeeinformation',
  templateUrl: './employeeinformation.component.html',
  styleUrls: ['./employeeinformation.component.scss']
})
export class EmployeeinformationComponent implements OnInit {
  public company: { name: string; address: string; custom_footer: boolean; phone: string; fax: string; email: string; website: string; vat: string; tin: string; };
  showMIO: boolean = false;
  showZone: boolean = false;
  showDepo: boolean = false;
  showRegion: boolean = false;
  showArea: boolean = false;
  showTerritory: boolean = false;

  master: {
    employeeId: number;
    employeeNo: string;
    employeeTypeId: number;
    probationPeriodId: number;
    confirmationDate: Date;
    ProbationPeriodSelected: {};
    firstName: string;
    middleName: string;
    lastName: string;
    fullName: string;
    emailId: string;
    skypeId: string;
    facebookId: string;
    whatsApp: string;
    viber: string;
    linkedIN: string;
    fathersName: string;
    mothersName: string;
    employeeStatusId: number;
    bloodGroupId: number;
    religionId: number;
    mobileNo: string;
    phoneNo: string;
    uniqueIdentityId: number;
    height: number;
    DOB: Date;
    passportNO: string;
    NID: string;
    binNo: string;
    officeId: string;
    genderId: number;
    effectiveDate: Date;
    companyId: number;
    salaryGradeId: number;
    salarySlabId: number;


    joiningDate: Date;
    maritalStatus: string;
    drivingLicense: string;
    tinNo: string;
    sbuId: number;
    isTopManagement: number;
    currentDesignation: string;
    currentDepartment: string;
    nationality: string;
    isSalaryActive: boolean;
    haveVehicle: boolean;
    actionCheckbox: boolean;
    companyBankId: number;
    EmployeeTypeSelected: {};
    EmployeeReligionSelected: {};
    EmployeeUniqueIdentitySelected: {};
    EmployeeGenderSelected: {};
    EmployeeBloodGroupSelected: {};
    EmployeeStatusSelected: {};
    EmployeeCompanySelected: {};
    MartialStatusSelected: {};
    SbuSelected: {};
    DesignationSelected: {};
    DepartmentSelected: {};
    NationalitySelected: {};
    CompanyBankSelected: {};
    salaryDepotId: string;
    SalaryDepotSelected: {};
    salaryGradeSelected: {};
    salarySlabSelected: {};

    zoneId: string;
    depoId: string;
    regionId: string;
    areaId: string;
    territoryId: string;
    postingLocation: string;
    salaryLocation: string;
    salaryLocationSelected: {};
    isTopManagementSelected: {};
    zoneSelected: {};
    depotSelected: {};
    regionSelected: {};
    areaSelected: {};
    territorySelected: {};
    postingLocationSelected: {};
    countData: number;
    separationTypeId: number;
    separationEffectiveDate: Date
    separationTypeSelected: {};
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

  public pageNavigation = "Employee's Basic Information";
  public buttons = this.commonService.btnList;

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
      employeeId: 0,
      employeeNo: '',
      employeeTypeId: null,
      firstName: '',
      middleName: '',
      lastName: '',
      fullName: '',
      emailId: '',
      skypeId: '',
      facebookId: '',
      whatsApp: '',
      viber: '',
      linkedIN: '',
      fathersName: '',
      mothersName: '',
      employeeStatusId: null,
      bloodGroupId: null,
      religionId: null,
      mobileNo: '',
      phoneNo: '',
      uniqueIdentityId: null,
      height: null,
      DOB: null,
      passportNO: '',
      NID: '',
      binNo: '',
      officeId: '',
      genderId: null,
      effectiveDate: null,
      companyId: 0,
      salaryGradeId: null,
      salarySlabId: null,
      companyBankId: null,
      CompanyBankSelected: null,
      salaryDepotId: '',
      SalaryDepotSelected: null,


      joiningDate: null,
      maritalStatus: '',
      drivingLicense: '',
      tinNo: '',
      sbuId: null,
      isTopManagement: 0,
      currentDesignation: '',
      currentDepartment: '',
      nationality: '',
      isSalaryActive: true,
      haveVehicle: false,
      actionCheckbox: false,

      EmployeeTypeSelected: null,
      EmployeeReligionSelected: null,
      EmployeeUniqueIdentitySelected: null,
      EmployeeGenderSelected: null,
      EmployeeBloodGroupSelected: null,
      EmployeeStatusSelected: null,
      EmployeeCompanySelected: null,
      MartialStatusSelected: null,
      SbuSelected: null,
      DesignationSelected: null,
      DepartmentSelected: null,
      NationalitySelected: null,
      probationPeriodId: null,
      confirmationDate: null,
      ProbationPeriodSelected: null,
      zoneId: '',
      depoId: '',
      regionId: '',
      areaId: '',
      territoryId: '',
      postingLocation: '',
      salaryLocation: '',
      salaryLocationSelected: null,
      isTopManagementSelected: null,
      zoneSelected: null,
      depotSelected: null,
      regionSelected: null,
      areaSelected: null,
      territorySelected: null,
      postingLocationSelected: null,
      countData: 0,
      separationTypeId: null,
      separationEffectiveDate: null,
      separationTypeSelected: null,
      salaryGradeSelected: this.commonService.getCurrentCompany() == '1' ? { id: 9, name: 'General (HHD)' } : { id: 8, name: 'General (AHD)' },
      salarySlabSelected: null
    };
    this.getMaxEmployeeNo();
    this.TopMStatusList();
    this.GetSalaryLocationJson();
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

  /////////////////////////////// CRUD ///////////////////////////////////////////

  public onCheckboxChange(e) {
    if (e.target.checked) {
      this.showMIO = true;
    } else {
      this.showMIO = false;
    }
  }

  public showHideDdl() {
    //this.ddlReportNameSelected = null;
    if (this.master.postingLocationSelected['id'] == "T") {
      this.showZone = true;
      this.showDepo = true;
      this.showRegion = true;
      this.showArea = true;
      this.showTerritory = true;
    } else if (this.master.postingLocationSelected['id'] == "A") {
      this.showZone = true;
      this.showDepo = true;
      this.showRegion = true;
      this.showArea = true;
      this.showTerritory = false;
      this.master.territorySelected = null;
      this.master.territoryId = null;
    } else if (this.master.postingLocationSelected['id'] == "R") {
      this.showZone = true;
      this.showDepo = true;
      this.showRegion = true;
      this.showArea = false;
      this.showTerritory = false;
      this.master.areaSelected = null;
      this.master.areaId = null;
      this.master.territorySelected = null;
      this.master.territoryId = null;
    } else if (this.master.postingLocationSelected['id'] == "D") {
      this.showZone = true;
      this.showDepo = true;
      this.showRegion = false;
      this.showArea = false;
      this.showTerritory = false;
      this.master.regionSelected = null;
      this.master.regionId = null;
      this.master.areaSelected = null;
      this.master.areaId = null;
      this.master.territorySelected = null;
      this.master.territoryId = null;
    } else if (this.master.postingLocationSelected['id'] == "Z") {
      this.showZone = true;
      this.showDepo = false;
      this.showRegion = false;
      this.showArea = false;
      this.showTerritory = false;
      this.master.depotSelected = null;
      this.master.depoId = null;
      this.master.regionSelected = null;
      this.master.regionId = null;
      this.master.areaSelected = null;
      this.master.areaId = null;
      this.master.territorySelected = null;
      this.master.territoryId = null;
    } else {
      this.showZone = false;
      this.showDepo = false;
      this.showRegion = false;
      this.showArea = false;
      this.showTerritory = false;
      this.master.zoneSelected = null;
      this.master.zoneId = null;
      this.master.depotSelected = null;
      this.master.depoId = null;
      this.master.regionSelected = null;
      this.master.regionId = null;
      this.master.areaSelected = null;
      this.master.areaId = null;
      this.master.territorySelected = null;
      this.master.territoryId = null;
    }
  }

  public getDuplicate() {
    this.employeeinformationService.GetDuplicateEmployeeNo(this.master.employeeId, this.master.employeeNo)
      .subscribe((returns: any) => {
        this.master.countData = returns.data[0].countData;
        if (this.master.countData > 0) {
          this.toastrService.warning('Duplicate Employee No. !', 'Warning');
          return;
        }
      });
  }

  public getDuplicateTerritoty(PostingLocation, Code) {
    if (PostingLocation == this.master.postingLocation) {
      this.employeeinformationService.getDuplicateTerritoty(this.master.employeeId, PostingLocation, Code)
        .subscribe((returns: any) => {
          if (returns.data[0].countData > 0) {
            this.toastrService.warning('Already A Officer in This Location', 'Warning');
            if (PostingLocation == 'T') {
              this.master.territoryId = '';
              this.master.territorySelected = [];
            } else if (PostingLocation == 'A') {
              this.master.areaId = '';
              this.master.areaSelected = [];
            } else {
              this.master.regionId = '';
              this.master.regionSelected = [];
            }
            return;
          }
        });
    }
  }



  private save() {
    debugger
    const popularDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "aol.com", "onepharmaltd.com"];
    const emailRegex = new RegExp(`^[\\w.-]+@(${popularDomains.join('|').replace(/\./g, '\\.')})$`);
    this.getDuplicate();
    if (this.master.employeeNo == "" || this.master.fullName == ""
      || this.master.genderId == null || this.master.companyId == 0 || this.master.employeeStatusId == 0 || this.master.currentDesignation == '' || this.master.currentDepartment == '') {
      this.toastrService.danger("Pleae fill up required field", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.countData != 0) {
      this.toastrService.danger("Duplicate employee no", "Message");
      this.commonService.valueSet("create");
      return false;
    } else if (this.master.joiningDate == null) {
      this.toastrService.danger("Please entry joining Date", "Message");
      this.commonService.valueSet("create");
      return false;
    } else if (this.master.salaryDepotId == null || this.master.salaryDepotId == "") {
      this.toastrService.danger("Please select Salary Depot", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.NID && this.master.NID !== "" && this.master.NID.length !== 10 && this.master.NID.length !== 13 && this.master.NID.length !== 17) {
      this.toastrService.danger("NID must be 10, 13 or 17 digits", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    // if (this.master.binNo && this.master.binNo !== "" && this.master.binNo.length !== 17) {
    //   this.toastrService.danger("Birth Certificate Number must be 17 digits", "Message");
    //   this.commonService.valueSet("create");
    //   return false;
    // }
    if (this.master.tinNo && this.master.tinNo !== "" && this.master.tinNo.length !== 12) {
      this.toastrService.danger("eTin Number must be 12 digits", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.emailId && this.master.emailId !== "" && !emailRegex.test(this.master.emailId)) {
      this.toastrService.danger("Email must be a valid address with a popular domain (e.g., @gmail.com, @yahoo.com, @outlook.com, @hotmail.com, @aol.com)", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.skypeId && this.master.skypeId !== "" && !emailRegex.test(this.master.skypeId)) {
      this.toastrService.danger("Email must be a valid address with a popular domain (e.g., @gmail.com, @yahoo.com, @outlook.com, @hotmail.com, @aol.com)", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.salaryGradeSelected == null || this.master.salaryGradeSelected == undefined) {
      this.toastrService.danger("Pleae select a employment type", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.salaryGradeSelected['id'] > 0) {
      this.master.salaryGradeId = this.master.salaryGradeSelected['id'];
    }

    if (this.master.salarySlabId == null || this.master.salarySlabId == 0) {
      this.toastrService.danger("Pleae select a salary grade", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.currentDesignation == null || this.master.currentDesignation == "") {
      this.toastrService.danger("Pleae select a designation", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    else {
      this.show = true;
      this.showMIO = false;
      var button = this.commonService.buttonClicked;

      //debugger;
      this.master.joiningDate = this.commonService.DateFormat(this.master.joiningDate);
      this.master.DOB = this.commonService.DateFormat(this.master.DOB);

      if (this.master.separationEffectiveDate != null || this.master.separationEffectiveDate != undefined)
        this.master.separationEffectiveDate = this.commonService.DateFormat(this.master.separationEffectiveDate);

      this.employeeinformationService.SaveEmployeeBasicInfo(this.master).subscribe((returns: any) => {
        if (returns.success) {
          if (button == "update") {
            this.toastrService.success(this.commonService.updatedmsg, "Message");
          }
          else {
            this.toastrService.success(this.commonService.successmsg, "Message");
          }
          //////////////Grid Refresh ///////////////////
          this.getMaster();
          this.employeeinformationService.GetEmployeeBasicInfoById(0).subscribe((data: any) => {
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
    //private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private hrmmasterService: HrmmasterService,
    private comboService: CommoncomboService,
    private employeeinformationService: EmployeeinformationService,
    private fieldforcemasterService: FieldforcemasterService,
    private salarygradeService: SalarygradeService,
    private salaryslabService: SalaryslabService,
    private router: Router,
    //private datePipe: DatePipe
  ) {
    this.commonService.valueSet('showlist');
    this.columnDefs = [
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.rowIndex + 1",
        pinned: "left",
        filter: false,
        width: 70,
      },
      {
        headerName: "Employee ID",
        field: "employeeNo",
        filter: "agTextColumnFilter",
        editable: false,
        width: 145,
      },
      {
        headerName: "Employee Name",
        field: "fullName",
        filter: "agTextColumnFilter",
        editable: false,
        width: 250,
      },
      {
        headerName: "Designation",
        field: "currentDesignation",
        filter: "agTextColumnFilter",
        editable: false,
        width: 200,
      },
      {
        headerName: "Department",
        field: "currentDepartment",
        filter: "agTextColumnFilter",
        editable: false,
        width: 140,
      },
      {
        headerName: "Grade",
        field: "gradeName",
        filter: "agTextColumnFilter",
        editable: false,
        width: 140,
      },
      {
        headerName: "Date of Joining",
        field: "joiningDate",
        filter: "agTextColumnFilter",
        editable: false,
        width: 180,
      },
      {
        headerName: "Type",
        field: "empType",
        editable: false,
        width: 120,
      },
      {
        headerName: "Status",
        field: "statusName",
        editable: false,
        width: 120,
      },
      {
        headerName: "Held Up Date",
        field: "heldupDate",
        filter: "agTextColumnFilter",
        editable: false,
        width: 180,
      },
      {
        headerName: "Job Duration",
        field: "jobDuration",
        filter: "agTextColumnFilter",
        editable: false,
        width: 180,
      },
      {
        headerName: "Probationary Period",
        field: "ProbationaryPeriod",
        filter: "agTextColumnFilter",
        editable: false,
        width: 180,
      },
      {
        headerName: "Confirmation Due Date",
        field: "confirmationDate",
        filter: "agTextColumnFilter",
        editable: false,
        width: 180,
      },
      {
        headerName: "Salary Location",
        field: "salaryLocation",
        filter: "agTextColumnFilter",
        editable: false,
        width: 180,
      },
      {
        headerName: "Region Code",
        field: "regionId",
        filter: "agTextColumnFilter",
        editable: false,
        width: 180,
      },
      {
        headerName: "Area Code",
        field: "areaId",
        filter: "agTextColumnFilter",
        editable: false,
        width: 180,
      },
      {
        headerName: "Territory Code",
        field: "territoryId",
        filter: "agTextColumnFilter",
        editable: false,
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
        //filter: false,
        //shorable: false,
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
    this.getMaxEmployeeNo();
    this.getEmployeeType();
    this.getReligion();
    this.getCompanyBank();
    this.getSalaryDepot();
    this.GetCompany();
    this.GetBloodGroup();
    this.GetGender();
    this.GetUniqueIdentity();
    this.GetEmployeeStatus();
    this.GetMaritalStatus();
    this.GetNationality();
    //this.GetDesignation();
    this.GetDepartment();
    this.getzone();
    this.GetAllDepo();
    this.GetpostingLocation();
    this.GetProbationPeriod();
    this.GetSeparationType();
    this.LoadSalaryGrade();
    this.LoadSalarySlab();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.employeeinformationService.GetEmployeeBasicInfoByIdOptimized().subscribe((data: any) => {
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
      //this.toastrService.info("Please Click Any Button", "Message");
    }
  }

  private agDelete(event) {
    var result = confirm("Are you sure you want to delete that?");
    if (result) {
      this.master.employeeId = event.node.data.employeeId;
      this.employeeinformationService.deleteEmployee(this.master.employeeId).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          //////////////Grid Refresh ///////////////////
          this.employeeinformationService.GetEmployeeBasicInfoById(0).subscribe((data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          });
          //////////////Grid Refresh ///////////////////
        }
      });
    }
  }

  public tableHeader = ['#', 'Product Name', 'Store Name', 'Current Stock']
  private agReport(event) {
    //this.generateStockInReport(event.data.stockMasterId);
    this.generateCrReport(event, 'pdf');

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
    var employeeId = event.node.data.employeeId;
    this.router.navigateByUrl(`/pages/hrm/empallinfo?employeeId=${employeeId}`)
  }

  public getMaxEmployeeNo() {
    this.employeeinformationService.GetMaxEmployeeNo(1).subscribe((returns: any) => {
      if (returns.success) {
        this.master.employeeNo = returns.data[0].MaxNo;
      }
    });
  }
  onProbationPeriodChange(event: any) {
    debugger;
    if (this.master.joiningDate) {
      let probationMonths = 0;
      if (event.id === 1) {
        probationMonths = 3;
      } else if (event.id === 2) {
        probationMonths = 6;
      } else if (event.id === 3) {
        // Not applicable
        this.master.confirmationDate = null;
        return;
      }

      // Calculate confirmation due date
      this.calculateConfirmationDueDate(probationMonths);
    }
  }

  onJoiningDateChange(event: any) {
    if (this.master.ProbationPeriodSelected) {
      debugger;
      let probationMonths = 0;
      if (this.master.probationPeriodId === 1) {
        probationMonths = 3;
      } else if (this.master.probationPeriodId === 2) {
        probationMonths = 6;
      }

      if (probationMonths > 0) {
        this.calculateConfirmationDueDate(probationMonths);
      }
    }
  }

  calculateConfirmationDueDate(months: number) {

    const joiningDate = new Date(this.master.joiningDate);
    joiningDate.setMonth(joiningDate.getMonth() + months);
    this.master.confirmationDate = joiningDate;
  }

  public ProbetionaryList = [];
  public GetProbationPeriod() {
    this.comboService.getProbationPeriod().subscribe((retuns: any) => {
      if (retuns.success) {
        debugger;
        this.ProbetionaryList = retuns.data.map((val: any) => ({
          id: val.probationPeriodId,
          name: val.probationPeriodName,
        }))
      }
    })
  }

  public SeparationTypeList = [];
  public GetSeparationType() {
    this.comboService.getSeparationType().subscribe((retuns: any) => {
      if (retuns.success) {
        debugger;
        this.SeparationTypeList = retuns.data.map((val: any) => ({
          id: val.separationTypeId,
          name: val.separationTypeName,
        }))
      }
    })
  }

  public EmployeeTypeList = [];
  public getEmployeeType() {
    this.employeeinformationService.GetEmployeeType(0).subscribe((retuns: any) => {
      if (retuns.success) {
        this.EmployeeTypeList = retuns.data.map((val: any) => ({
          id: val.employeeTypeId,
          name: val.empType,
        }))
      }
    })
  }

  public ReligionList = [];
  public getReligion() {
    this.employeeinformationService.GetReligion(0).subscribe((retuns: any) => {
      if (retuns.success) {
        this.ReligionList = retuns.data.map((val: any) => ({
          id: val.religionId,
          name: val.name,
        }))
      }
    })
  }

  public CompanyList = [];
  public GetCompany() {
    this.comboService.getCompany().subscribe((retuns: any) => {
      if (retuns.success) {
        this.CompanyList = retuns.data.map((val: any) => ({
          id: val.companyId,
          name: val.companyName,
        }))
      }
    })
  }

  public BloodGroupList = [];
  public GetBloodGroup() {
    this.employeeinformationService.getBloodGroup(0).subscribe((retuns: any) => {
      if (retuns.success) {
        this.BloodGroupList = retuns.data.map((val: any) => ({
          id: val.bloodGroupId,
          name: val.Name,
        }))
      }
    })
  }

  public GenderList = [];
  public GetGender() {
    this.employeeinformationService.getGender(0).subscribe((retuns: any) => {
      if (retuns.success) {
        this.GenderList = retuns.data.map((val: any) => ({
          id: val.genderId,
          name: val.Name,
        }))
      }
    })
  }

  public UniqueIdentityList = [];
  public GetUniqueIdentity() {
    this.employeeinformationService.getUniqueIdentity(0).subscribe((retuns: any) => {
      if (retuns.success) {
        this.UniqueIdentityList = retuns.data.map((val: any) => ({
          id: val.uniqueIdentityId,
          name: val.Name,
        }))
      }
    })
  }

  public EmployeeStatusList = [];
  public GetEmployeeStatus() {
    this.employeeinformationService.getEmployeeStatus(0).subscribe((retuns: any) => {
      if (retuns.success) {
        this.EmployeeStatusList = retuns.data.map((val: any) => ({
          id: val.employeeStatusId,
          name: val.statusName,
        }))
      }
    })
  }

  public MaritalStatusList = [];
  public GetMaritalStatus() {
    this.comboService.getCmnDropDown(0, "Marital Status").subscribe((returns: any) => {
      this.MaritalStatusList = returns.data.map((val: any) => ({
        id: val.dropDownValue,
        name: val.dropDownText,
      }))
    })
  }

  public NationalityList = [];
  public GetNationality() {
    this.comboService.getCmnDropDown(0, "Nationality").subscribe((returns: any) => {
      this.NationalityList = returns.data.map((val: any) => ({
        id: val.dropDownValue,
        name: val.dropDownText,
      }))
    })
  }

  public SbuList = [];
  public getSBU(companyId) {
    this.master.SbuSelected = null;
    this.comboService.getSBUALL(companyId).subscribe((returns: any) => {
      this.SbuList = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
    });
  }

  public SalaryLocationList = [];
  public GetSalaryLocationJson() {
    this.master.salaryLocationSelected = null;
    this.comboService.GetSalaryLocationJson().subscribe((returns: any) => {
      this.SalaryLocationList = returns.data.map((val) => ({
        id: val.Name,
        name: val.Name,
      }));
    });
  }

  TopMList: {};
  TopMStatusList() {
    this.master.isTopManagementSelected = null;
    this.TopMList = [
      {
        id: 1,
        name: "Top Management",
      },
      {
        id: 0,
        name: "General",
      }
    ];
  }

  // public DesignationList = [];
  // public GetDesignation() {
  //   this.hrmmasterService.getDesignation(0).subscribe((returns: any) => {
  //     this.DesignationList = returns.data.map((val: any) => ({
  //       id: val.designationName,
  //       name: val.designationName,
  //     }))
  //   })
  // }

  public DepartmentList = [];
  public GetDepartment() {
    this.hrmmasterService.getDepartment(0).subscribe((returns: any) => {
      this.DepartmentList = returns.data.map((val: any) => ({
        id: val.deptName,
        name: val.deptName,
      }))
    })
  }

  public zoneList = [];
  public getzone() {
    this.fieldforcemasterService.getZone(0).subscribe((retuns: any) => {
      if (retuns.length) {
        this.zoneList = retuns.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }
  public depotList = [];
  // public getdepot() {
  //   var zoneId = 0;
  //   this.fieldforcemasterService.getZone(0).subscribe((retuns: any) => {
  //     if (retuns.length) {
  //       zoneId = retuns[0].ZoneID
  //     }
  //   })
  //   this.fieldforcemasterService.getDepo(zoneId).subscribe((retuns: any) => {
  //     if (retuns.success) {
  //       this.depotList = retuns.data.map((val: any) => ({
  //         id: val.Code,
  //         name: val.Name,
  //       }))
  //     }
  //   })
  // }
  // public getdepotbyCode(zoneCode) {
  //   this.master.depotSelected = {};
  //   this.fieldforcemasterService.getDepoByZoneCode(zoneCode).subscribe((retuns: any) => {
  //     if (retuns.success) {
  //       this.depotList = retuns.data.map((val: any) => ({
  //         id: val.Code,
  //         name: val.Name,
  //       }))
  //     }
  //   })
  // }
  public AreaList = [];
  public getareabyregionCode(ZoneCode) {
    this.master.areaSelected = {};
    this.fieldforcemasterService.getAreabyregioncode(ZoneCode).subscribe((retuns: any) => {
      if (retuns.success) {
        this.AreaList = retuns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }

  public bankList = [];
  public getCompanyBank() {
    this.employeeinformationService.GetCompanyBank(0).subscribe((retuns: any) => {
      if (retuns.success) {
        debugger;
        this.bankList = retuns.data.map((val: any) => ({
          id: val.companyBankId,
          name: val.bankName,
        }))
      }
    })
  }

  public salaryDepotList = [];
  public getSalaryDepot() {
    this.employeeinformationService.GetSalaryDepot(0).subscribe((retuns: any) => {
      if (retuns.success) {
        debugger;
        this.salaryDepotList = retuns.data.map((val: any) => ({
          id: val.salaryDepotId,
          name: val.salaryDepotName,
        }))
      }
    })
  }
  public RegionList = [];
  public getregionbydepoCode(ZoneCode) {
    this.master.regionSelected = {};
    this.fieldforcemasterService.getRegionbydepocode(ZoneCode).subscribe((retuns: any) => {
      if (retuns.success) {
        this.RegionList = retuns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }

  /*
GetRegionByZoneCode( ZoneCode);
GetDepoByRegionCode( RegionCode)
GetAreaByDepoCode(DepoCode);
  */
  public zoneChange(ZoneCode) {
    this.master.regionSelected = {};
    this.fieldforcemasterService.GetRegionByZoneCode(ZoneCode).subscribe((retuns: any) => {
      if (retuns.success) {
        this.RegionList = retuns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }
  public GetAllDepo() {
    this.master.depotSelected = {};
    this.fieldforcemasterService.GetAllDepo('').subscribe((retuns: any) => {
      if (retuns.success) {
        this.depotList = retuns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }

  // public regionChange_BAK(RegionCode) {
  //   this.master.depotSelected = {};
  //   this.fieldforcemasterService.GetDepoByRegionCode(RegionCode).subscribe((retuns: any) => {
  //     if (retuns.success) {
  //       this.depotList = retuns.data.map((val: any) => ({
  //         id: val.Code,
  //         name: val.Name,
  //       }))
  //     }
  //   })
  // }

  public regionChange(RegionCode) {
    debugger;
    this.master.areaSelected = {};
    this.fieldforcemasterService.GetAreaByRegionCode(RegionCode).subscribe((retuns: any) => {
      if (retuns.success) {
        this.AreaList = retuns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }

  public depoChange(DepoCode) {
    this.master.areaSelected = {};
    this.fieldforcemasterService.GetAreaByDepoCode(DepoCode).subscribe((retuns: any) => {
      if (retuns.success) {
        this.AreaList = retuns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }
  generateCrReport(event: any, reportFormat: any) {
    var employeeId = event.node.data.employeeId;
    let apiUrl = `Pims/GetEmployeePersonalInfoById?employeeId=${employeeId}&reportFormat=${reportFormat}`;
    this.commonService.GetCrystalReportData(apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }



  public TerritoryList = [];
  public getterritorybyareaCode(ZoneCode) {
    this.master.territorySelected = null;
    this.fieldforcemasterService.getTerritorybyAreacode(ZoneCode).subscribe((retuns: any) => {
      if (retuns.success) {
        this.TerritoryList = retuns.data.map((val: any) => ({
          id: val.TerritoryCode,
          name: val.TerritoryName,
        }))
      }
    })
  }

  public PostingLocationList = [];
  public GetpostingLocation() {
    this.comboService.getCmnDropDown(0, "PostingLocation").subscribe((returns: any) => {
      this.PostingLocationList = returns.data.map((val: any) => ({
        id: val.dropDownValue,
        name: val.dropDownText,
      }))
    })
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

  salaryGradeItems: [];
  public LoadSalaryGrade() {
    debugger
    this.salaryGradeItems = null;
    this.salarySlabItems = null;
    this.DesignationList = null;
    this.salarygradeService.GetSalaryGradeById(0).subscribe((returns: any) => {
      this.salaryGradeItems = returns.data.map((val) => ({
        id: val.salaryGradeId,
        name: val.gradeName,
      }));
    });
  }
  public DesignationList = [];
  public GetDesignation() {
    debugger
    this.DesignationList = [];
    this.master.DesignationSelected = null;
    this.master.currentDesignation = null;
    let slabId = this.master.salarySlabSelected['id'] ?? 0;
    this.hrmmasterService.getDesignationBySalarySlabId(slabId).subscribe((returns: any) => {
      this.DesignationList = returns.data.map((val: any) => ({
        id: val.designationName,
        name: val.designationName,
      }))
    })
  }
  salarySlabItems: [];
  public LoadSalarySlab() {
    debugger
    this.salarySlabItems = [];
    this.master.salarySlabSelected = null;
    this.master.salarySlabId = null;
    this.master.DesignationSelected = null;
    this.DesignationList = [];
    this.salaryslabService.GetSalarySlabById(0, this.master.salaryGradeSelected['id']).subscribe((returns: any) => {
      this.salarySlabItems = returns.data.map((val) => ({
        id: val.salarySlabId,
        name: val.slabName,
      }));
    });
  }
}


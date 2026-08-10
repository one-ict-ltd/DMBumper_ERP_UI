import { AllCommunityModules, Module } from '@ag-grid-community/all-modules';
import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { CommonService } from 'app/@core/mock/common.service';
import { ProcessattendanceService } from 'app/services/attendance/processattendance.service';
import { CommoncomboService } from 'app/services/commoncombo.service';
import { EmployeeinformationService } from 'app/services/hrm/employeeinformation.service';
import { LeaveService } from 'app/services/hrm/leave.service';
import { SalaryperiodService } from 'app/services/salary/salarymaster/salaryperiod.service';
import { SalaryreportService } from 'app/services/salary/salaryprocess/salaryreport.service';
import { CelebrationModalComponent } from '../celebration-modal/celebration-modal.component';
import { ModalService } from 'app/services/transaction/modal.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { EmployeeotherinfoService } from 'app/services/hrm/employeeotherinfo.service';


@Component({
  selector: 'ngx-ess-portal',
  templateUrl: './ess-portal.component.html',
  styleUrls: ['./ess-portal.component.scss']
})
export class EssPortalComponent implements OnInit {
  master: {
    employeeId: number;
    employeeNo: number;
    fullName: string;
    currentDesignation: string;
    department: string;
    joinDate: string;
    mobile: string;
    salaryLocation: string;
    salaryHeadSelected: {};
    empSelected: {};
    salaryPeriodSelected: {};
    salaryPeriodId: number;
    imageUrl: string;
  };

  imageChangedEvent: any = '';
  croppedImage: any = '';

  public modules: Module[] = AllCommunityModules;
  public columnDefs;
  public defaultColDef;
  @ViewChild('dialogFiles') dialogFiles: TemplateRef<any>;
  CelebrateModalData: any[] = [];
  public getMaster() {
    this.master = {
      employeeId: 0,
      employeeNo: 0,
      fullName: "",
      currentDesignation: "",
      department: "",
      joinDate: "",
      mobile: "",
      salaryLocation: "",
      salaryHeadSelected: null,
      empSelected: null,
      salaryPeriodSelected: null,
      salaryPeriodId: 0,
      imageUrl: ''
    };
  }
  constructor(
    private router: Router,
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private dp: DatePipe,
    private processattendanceService: ProcessattendanceService,
    private salaryperiodService: SalaryperiodService,
    private salaryreportService: SalaryreportService,
    private activatedRoute: ActivatedRoute,
    private employeeinformationService: EmployeeinformationService,
    private leaveService: LeaveService,
    private modalService: ModalService,
    private dialogService: NbDialogService,
    private employeeRelatedOthersInfo: EmployeeotherinfoService
  ) {
    this.LoadCompany();
    this.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: true,
      editable: true,
    };
    this.getMaster();
    this.LoadSalaryPeriod();
    this.getGridData();
    this.commonService.valueSet('showlist');
    this.columnDefs = [
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.rowIndex + 1",
        pinned: "left",
        filter: false,
        width: 25,
      },
      {
        headerName: "Code",
        field: "employeeCode",
        filter: "agTextColumnFilter",
        width: 50,
      },
      {
        headerName: "Name",
        field: "employeeName",
        filter: "agTextColumnFilter",
        width: 100,

      },
      {
        headerName: "Type",
        field: "typeName",
        filter: "agTextColumnFilter",
        width: 100,
      },
      // {
      //   headerName: "Leave Reason",
      //   field: "remarks",
      //   filter: "agTextColumnFilter",

      // },
      {
        headerName: "From",
        field: "startDate",
        filter: "agTextColumnFilter",
        width: 100,
      },
      {
        headerName: "To",
        field: "endDate",
        filter: "agTextColumnFilter",
        width: 100,
      },
      {
        headerName: "Day",
        field: "leaveDay",
        filter: "agTextColumnFilter",
        width: 50,
      },
      {
        headerName: "contact",
        field: "emergencyContact",
        filter: "agTextColumnFilter",
        width: 100,
      },
      {
        headerName: "Status",
        field: "leaveStatus",
        filter: "agTextColumnFilter",
        width: 100,
      },
      {
        headerName: "Substitute",
        field: "substituteEmployeeName",
        filter: "agTextColumnFilter",

      },
      {
        headerName: "Location",
        field: "leaveLocation",
        filter: "agTextColumnFilter",

      },
      // {
      //   field: "action",
      //   cellRenderer: "btnCellRenderer",
      //   cellRendererParams: {
      //     clicked: function (field: any) {
      //       localStorage.setItem("button", field);
      //     },
      //   },
      //   minWidth: 250,
      //   editable: false,
      //   pinned: "right",
      // },
    ];
  }
  public pageNavigation = "ESS Portal";
  public tableHeader = [
    "#",
    "Att. Date",
    "Check In",
    "Check Out",
    "Working Time",
    "Late Time",
    "Status",
  ];
  public tableHeader1 = [
    "Type",
    "Balance",
  ];
  public bodyDataLeave: any = [];
  private gridApi;
  private gridColumnApi;
  public rowData: [];
  apiUrl = "";
  bodyData: any = [];
  showbody: boolean = false;
  totalDays: number = 0;
  attendanceDate = "";
  params = [];
  ttlWeeklyOff: number = 0;
  ttlHoliday: number = 0;
  ttlLeave: number = 0;
  ttlPresent: number = 0;
  ttlAbsent: number = 0;
  ttlLate: number = 0;
  summaryData = [];
  public salaryPeriodItems = [];
  public typeload: boolean = true;

  ngOnInit(): void {

    //let userInfo = this.commonService.GetUserProfileJson();
    this.activatedRoute.queryParams.subscribe(params => {
      this.employeeinformationService.GetEmployeeBasicInfoByIdForESS().subscribe((data: any) => {
        if (data.success) {
          debugger
          this.master.employeeNo = data.data[0].employeeNo;
          this.master.employeeId = data.data[0].employeeId;
          this.master.fullName = data.data[0].fullName;
          this.master.currentDesignation = data.data[0].currentDesignation;
          this.master.department = data.data[0].currentDepartment;
          this.master.joinDate = this.dp.transform(data.data[0].joiningDate, 'dd-MMM-yyyy');
          this.master.mobile = data.data[0].mobileNo;
          this.master.salaryLocation = data.data[0].salaryLocation;
          this.master.imageUrl = "http://103.106.236.93:9115" + data.data[0].imageUrl; //URL for server
          //this.master.imageUrl = "http://localhost:8099" + data.data[0].imageUrl;  //URL for local

          if (this.master.imageUrl === 'http://localhost:8099' || this.master.imageUrl === 'http://103.106.236.93:9115') {
            this.master.imageUrl = '';
          }
        }
      });
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.employeeinformationService.GetLeaveSummaryForESSJson().subscribe((data: any) => {
        if (data.success) {
          this.bodyDataLeave = data.data
        }
      });
    });

  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.leaveService.GetLeaveRegisterByemployeeIdJson().subscribe((data: any) => {
      //debugger;
      if (data.success) {
        this.rowData = data.data;
      }
    });
  }
  public RptButtonAction() {
  }

  public applyLeave() {
    this.router.navigateByUrl('/pages/hrm/leaveregister');
  }

  public ApproveLeave() {
    this.router.navigateByUrl('/pages/hrm/leaveApprove');
  }

  public companyItems = [];
  public LoadCompany() {
    this.comboService.getCompany().subscribe((returns: any) => {
      this.companyItems = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
    });
  }
  public LoadSalaryPeriod() {
    this.salaryperiodService
      .GetSalaryPeriodById(0)
      .subscribe((returns: any) => {
        this.salaryPeriodItems = returns.data
          .filter((x) => x.salaryTypeId == 1)
          .map((val) => ({
            id: val.salaryPeriodId,
            name: val.periodName,
            typeId: val.salaryTypeId,
          }));
      });
  }
  names: any;
  data: any;
  public OpenModal() {
    this.data = {
      title: 'Employee Information',
      name: 'John Doe',
      designation: 'Software Engineer',
      department: 'Engineering',
    };

    this.dialogService.open(CelebrationModalComponent, {
      context: this.data,
    });
  }


  // openWithDataObjModel(dialog: TemplateRef<any>) {
  //   this.dialogService.open(dialog, {
  //     context: this.data,
  //   });
  // }
  openWithDataModel() {
    this.dialogService
      .open(CelebrationModalComponent)
      .onClose.subscribe((name) => name && this.names.push(name));
  }
  public applySalaryPeriod() {
    debugger;
    let userInfo = this.commonService.GetUserProfileJson();
    this.GetRptPayslip(userInfo[0].employeeid, this.master.salaryPeriodId);
  }
  public GetRptPayslip(employeeId, salaryPeriodId) {
    this.salaryreportService
      .RptPayslip(1, 1, employeeId, salaryPeriodId, "Pdf")
      .subscribe((returns: any) => {
        this.commonService.GenerateBase64ToReport(returns);
      });
  }
  private onEmail() {

  }
  private onRefresh() {

  }
  private onExportCSV() {

  }
  LoadType() {
    if (this.master.salaryPeriodSelected["typeId"] == 2) {
      this.typeload = false;
    } else {
      this.typeload = true;
    }
  }
  private getGridData() {
    debugger;
    let userInfo = this.commonService.GetUserProfileJson();

    const today = new Date(); // Get the current date
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.attendanceDate = `${this.dp.transform(firstDayOfMonth, "yyyy-MM-dd")} To ${this.dp.transform(lastDayOfMonth, "yyyy-MM-dd")}`;


    this.processattendanceService
      .GetEmpWiseAttendanceReportForESS()
      .subscribe((data: any) => {
        debugger
        if (data.status) {
          this.bodyData = data.data;
          this.totalDays = this.bodyData.length;

          this.params = [];
          this.params.push({
            leftLabel: "Employee Name",
            leftValue: `${this.bodyData[0].fullName} (${this.bodyData[0].employeeNo})`,
            rightLabel: "Designation",
            rightValue: this.bodyData[0].currentDesignation,
          });

          this.params.push({
            leftLabel: "Department",
            leftValue: this.bodyData[0].currentDepartment,
            rightLabel: "Attendance For",
            rightValue: this.attendanceDate,
          });
          console.log("param", this.params);

          const objPropName = 'status';
          this.ttlWeeklyOff = this.commonService.GetValueCountOfObjArray(this.bodyData, objPropName, 'Weekend');
          this.ttlHoliday = this.commonService.GetValueCountOfObjArray(this.bodyData, objPropName, 'Holiday');
          let present = this.commonService.GetValueCountOfObjArray(this.bodyData, objPropName, 'Present');
          this.ttlAbsent = this.commonService.GetValueCountOfObjArray(this.bodyData, objPropName, 'Absent');
          this.ttlLate = this.commonService.GetValueCountOfObjArray(this.bodyData, objPropName, 'Late');
          this.ttlPresent = present + this.ttlLate;

          this.ttlLeave = this.totalDays - (this.ttlWeeklyOff + this.ttlHoliday + this.ttlPresent + this.ttlAbsent);


          this.showbody = true;

          this.summaryData.push(this.bodyData[0]);
        }
      });
  }
  private generateReport(rptFormat: any) {

  }
  attandanceClarification: {
    attandanceClarificationId: number;
    attandanceClarificationDate: Date
    attandanceClarificationTime: string;
    narration: string
    attandanceClarificationTypeId: number
    isApproved: boolean;
  };
  lateAttandanDate: any;
  lateTime: any;
  narration: string = null;
  public OpenModalForClarify(dialog: TemplateRef<any>, attandanceDate: any, lateTime: any) {
    debugger
    this.lateAttandanDate = attandanceDate;
    this.lateTime = lateTime;
    this.dialogService.open(dialog, {
      context: [], //this.data,
    });
  }
  SubmitClarification() {
    debugger
    this.attandanceClarification = {
      attandanceClarificationDate: this.lateAttandanDate,
      attandanceClarificationId: 0,
      attandanceClarificationTime: this.lateTime,
      isApproved: false,
      attandanceClarificationTypeId: 1, //for late Attandance
      narration: this.narration

    };
    let apiUrl = 'Attendance/SaveAttandanceClarification';
    this.commonService.postApiData(apiUrl, this.attandanceClarification).subscribe((returns: any) => {
      if (returns.success) {
        this.toastrService.success('Attandance Clarification Saved Successfully!', 'Message');
        this.getGridData();

      }
      else {
        this.toastrService.danger('Attandance Clarification has not Saved Successfully!', 'Message');
      }
    })
  }

  // Open the ng-template modal
  openDialog(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
      context: [], //this.data,
    });
  }

  fileChangeEvent(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.imageChangedEvent = event;  // must assign the file input event
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  saveCroppedImage(ref: NbDialogRef<any>) {
    if (this.croppedImage) {
      this.master.imageUrl = this.croppedImage; // update preview immediately
      //ref.close();

      // OPTIONAL: upload cropped image to backend
      this.uploadImage(ref);
    }
  }

  public uploadImage(ref) {
    let obj = {
      employeeId: this.master.employeeId,
      tempImageUrl: this.master.imageUrl,
      extension: this.master.imageUrl.substring("data:image/".length, this.master.imageUrl.indexOf(";base64")),
    }
    if (!obj.tempImageUrl) {
      this.toastrService.info("Please select an image to upload.", "Info");
      return;
    }
    this.employeeRelatedOthersInfo.SaveEmployeeAttachment(obj).subscribe((res) => {
      if (res.success) {
        this.toastrService.success("Message", "Photo uploaded successfully!");
        ref.close();
      }
      else {
        this.toastrService.warning("Message", "Photo was not uploaded successfully!");
      }

    })
  }

}

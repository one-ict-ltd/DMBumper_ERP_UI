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
import { LeaveService } from "app/services/hrm/leave.service";
import { EmployeeinformationService } from "app/services/hrm/employeeinformation.service";

@Component({
  selector: 'ngx-leaveapplylist',
  templateUrl: './leaveapplylist.component.html',
  styleUrls: ['./leaveapplylist.component.scss']
})
export class LeaveapplylistComponent implements OnInit {

  loadFromDateShow: Date = new Date();
  loadToDateShow: Date = new Date();
  private gridApi;
  private Balance = 0;
  private gridColumnApi;

  public modules: Module[] = AllCommunityModules;
  public columnDefs;
  public defaultColDef;
  public rowData: [];
  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };

  constructor(private commonService: CommonService,
    private toastrService: NbToastrService,
    private leaveService: LeaveService,
    private employeeinformationService: EmployeeinformationService,) {
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
        headerName: "Employee Code",
        field: "employeeCode",
        filter: "agTextColumnFilter",
        width: 100,
      },
      {
        headerName: "Employee Name",
        field: "employeeName",
        filter: "agTextColumnFilter",
        width: 200,
      },
      {
        headerName: "Leave Type",
        field: "typeName",
        filter: "agTextColumnFilter",
        width: 117,
      },
      {
        headerName: "Leave Reason",
        field: "remarks",
        filter: "agTextColumnFilter",
        width: 200,
      },
      {
        headerName: "Start Date",
        field: "startDate",
        filter: "agTextColumnFilter",
        width: 117,
      },
      {
        headerName: "End Date",
        field: "endDate",
        filter: "agTextColumnFilter",
        width: 117,
      },
      {
        headerName: "Leave Day",
        field: "leaveDay",
        filter: "agTextColumnFilter",
        width: 100,
      },
      {
        headerName: "Emergency contact",
        field: "emergencyContact",
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "Leave Status",
        field: "leaveStatusText",
        filter: "agTextColumnFilter",
        width: 100,
      },
      {
        headerName: "Substitute Employee",
        field: "substituteEmployeeName",
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "Leave Location",
        field: "leaveLocation",
        filter: "agTextColumnFilter",
        width: 150,
      },
      // {
      //   field: "action",
      //   cellRenderer: "btnCellRenderer",
      //   cellRendererParams: {
      //     clicked: function (field: any) {
      //       //localStorage.setItem("Token", user.auth_token);
      //       localStorage.setItem("button", field);
      //     },
      //   },
      //   minWidth: 250,
      //   editable: false,
      //   pinned: "right",
      // },
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
    this.loadFromDateShow.setDate(this.loadFromDateShow.getDate() - 30);
  }

  show: boolean = true;
  ngOnInit(): void {
  }
  public pageNavigation = "Leave Apply List";

  master: {
    employeeId: number;
    EmployeeInfoSelected: {};
  };
  public getMaster() {
    this.master = {
      employeeId: 0,
      EmployeeInfoSelected: null
    };

  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.GetGridData();
    this.getEmployee();
  }
  public EmployeeList = [];
  public getEmployee() {
    this.master.EmployeeInfoSelected = null;
    this.employeeinformationService.GetEmployeeInfoWhoHasLeaveById(0).subscribe((retuns: any) => {
      if (retuns.success) {
        this.EmployeeList = retuns.data.map((val: any) => ({
          id: val.employeeId,
          name: val.fullName,
        }));
        //console.log(this.LeaveTypeList);
      }
    })
  }
  GetGridData() {
    // this.productionServiceService.GetIssueMasterByIdDate(this.commonService.DateFormat(this.loadFromDateShow), this.commonService.DateFormat(this.loadToDateShow),
    //   0, this.master.typeOfIssue).subscribe((data: any) => {
    //     if (data.success) {
    //       this.rowData = data.data;
    //     }
    //   });
    debugger;
    this.leaveService.GetLeaveRegisterListByemployeeIdJson(this.commonService.DateFormat(this.loadFromDateShow), this.commonService.DateFormat(this.loadToDateShow), this.master.employeeId).subscribe((data: any) => {

      if (data.success) {
        this.rowData = data.data;
      }
    });
  }
}

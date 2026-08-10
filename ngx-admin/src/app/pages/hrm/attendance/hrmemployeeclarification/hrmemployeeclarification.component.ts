import { Component, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { ProcessattendanceService } from "app/services/attendance/processattendance.service";

import { DatePipe } from "@angular/common";
import { CommonService } from "app/@core/mock/common.service";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
@Component({
  selector: 'ngx-hrmemployeeclarification',
  templateUrl: './hrmemployeeclarification.component.html',
  styleUrls: ['./hrmemployeeclarification.component.scss']
})
export class HrmemployeeclarificationComponent implements OnInit {

  master: {
    employeecClarificationId: number;
    companyId: number;
    empId: number;
    attendanceDate: Date;
    clarification: string;

  };
  companySelected = {};
  empSelected = {};
  public getMaster() {
    this.master = {
      employeecClarificationId: 0,
      companyId: 0,
      empId: 0,
      attendanceDate: new Date(),
      clarification: ''

    };
  }
  public selectdetailRows = [];
  private gridApi;
  private gridColumnApi;

  public columnDefs;
  public defaultColDef;
  public rowData: [];

  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };

  constructor(private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private processattendanceService: ProcessattendanceService,
    private dp: DatePipe) {
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
        headerName: "Employee Name",
        field: "fullName",
        filter: "agTextColumnFilter",
        editable: false,
        width: 145,
      },
      {
        headerName: "Attendance Date",
        field: "AttendanceDate",
        filter: "agTextColumnFilter",
        editable: false,
        width: 250,
      },
      {
        headerName: "Clarification",
        field: "clarification",
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
    this.LoadCompany();
    this.getMaster();
  }
  show: boolean = true;
  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      debugger
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
  ngOnInit(): void {
  }
  pageNavigation = "Employee Attendance Clarification";
  public companyItems = [];
  public LoadCompany() {
    this.companySelected = null;
    this.comboService.getCompany().subscribe((returns: any) => {
      this.companyItems = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
    });
  }
  empItems = [];
  LoadEmployee(): void {
    this.empSelected = null;
    this.comboService.getEmployee(this.master.companyId, 0).subscribe((returns: any) => {
      this.empItems = returns.data.map((val) => ({
        id: val.employeeId,
        name: val.fullName,
      }));
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    debugger
    this.processattendanceService.GetEmployeeAttnClarificationById(0).subscribe((data: any) => {
      if (data.success) {
        this.rowData = data.data;
      }
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

  private save() {
    if (this.master.empId == 0 || this.master.companyId == 0 || this.master.clarification == null) {
      this.toastrService.danger("Pleae fill up required field", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else {
      this.show = true;
      var button = this.commonService.buttonClicked;

      //debugger;
      this.master.attendanceDate = this.commonService.DateFormat(this.master.attendanceDate);

      this.processattendanceService.getDuplicateAttendanceDate(this.master.employeecClarificationId, this.master.attendanceDate, this.master.empId).subscribe((returns: any) => {
        //debugger;

        if (returns.data[0].countData > 0) {
          this.toastrService.danger("Already Had a Attendance Clarification on following day", "Message");
          this.master.attendanceDate = null;
          return;
        }
        else {
          this.processattendanceService.SaveEmployeeAttnClarification(this.master).subscribe((returns: any) => {
            if (returns.success) {
              if (button == "update") {
                this.toastrService.success(this.commonService.updatedmsg, "Message");
              }
              else {
                this.toastrService.success(this.commonService.successmsg, "Message");
              }
              //////////////Grid Refresh ///////////////////
              this.getMaster();
              this.processattendanceService.GetEmployeeAttnClarificationById(0).subscribe((data: any) => {
                if (data.success) {
                  this.rowData = data.data;
                }
              });
              //////////////Grid Refresh ///////////////////
              //
            }
          });
        }
      });

    }
  }
  selectedRow: any;
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
    } else if (data == "transectionreport") {
      //this.agReport(event);
    } else if (data == "delete") {
      //this.agDelete(event);
    } else {
      //this.toastrService.info("Please Click Any Button", "Message");
    }
  }
  private agEdit(event) {
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
      this.master.employeecClarificationId = event.node.data.employeecClarificationId;

      this.processattendanceService.GetEmployeeAttnClarificationById(this.master.employeecClarificationId).subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0],
            this.empSelected = data.data[0].fullName,
            this.companySelected = data.data[0].companyName,
            this.master.attendanceDate = data.data[0].AttendanceDate,
            this.master.empId = data.data[0].employeeId,
            this.master.employeecClarificationId = data.data[0].employeecClarificationId
        }
      })
      this.ngOnInit();


    }
  }
  private reset() {
    this.getMaster();
  }
}

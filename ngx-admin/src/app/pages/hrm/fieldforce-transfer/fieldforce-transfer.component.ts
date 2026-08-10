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
import { CommoncomboService } from "app/services/commoncombo.service";
import { FieldforcemasterService } from "app/services/fieldforcetracking/fieldforcemaster.service";
interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: 'ngx-fieldforce-transfer',
  templateUrl: './fieldforce-transfer.component.html',
  styleUrls: ['./fieldforce-transfer.component.scss']
})
export class FieldforceTransferComponent implements OnInit {
  showZone: boolean = true;
  showDepo: boolean = true;
  showRegion: boolean = true;
  showArea: boolean = true;
  showTerritory: boolean = true;
  master: {
    emergencyContact: string;
    employeeId: number;
    employeeName: string;
    employeeCode: string;
    zoneId: string;
    depoId: string;
    regionId: string;
    areaId: string;
    territoryId: string;
    postingLocation: string;
    salaryLocation: string;
    employeeSelected: {};
    LeaveTypeSelected: {};
    LeaveYearSelected: {};
    TypeSelected: {};
    substituteEmployeeSelected: {};
  
    territorySelected: {};
    areaSelected: {};
    depotSelected: {};
    regionSelected: {};
    depotList: {};
    postingLocationSelected: {};
    zoneSelected: {};
    locationtxt: string;
    zonetxt: string;
    regiontxt: string;
    depottxt: string;
    areatxt: string;
    territorytxt: string;
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

  show: boolean = false;
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

  public pageNavigation = "Field Force Transfer";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = false;
    } else if (this.commonService.buttonClicked == "save") {
      //this.openConfirmPopup("");
      this.save();
      //this.show = true;
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
      //this.show = true;
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
      employeeId: 0,
      employeeName: "",
      employeeCode: "",
      emergencyContact: "",
      zoneId: "",
      depoId: "",
      regionId: "",
      areaId: "",
      territoryId: "",
      postingLocation: "",
      salaryLocation: "",
      employeeSelected: null,
      LeaveTypeSelected: null,
      LeaveYearSelected: null,
      TypeSelected: null,
      substituteEmployeeSelected: null,
      territorySelected: null,
      areaSelected: null,
      depotSelected: null,
      regionSelected: null,
      depotList: null,
      postingLocationSelected: null,
      zoneSelected: null,
      locationtxt: "",
      zonetxt: "",
      regiontxt: "",
      depottxt: "",
      areatxt: "",
      territorytxt: "",
    };
    this.getType();
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
  // public getDuplicate() {
  //   //debugger;
  //   this.master.startDate = this.commonService.DateFormat(this.master.startDate);
  //   this.master.endDate = this.commonService.DateFormat(this.master.endDate);

  //   this.leaveService.getDuplicateleaveRegister(this.master.leaveRegisterId, this.master.startDate, this.master.endDate, this.master.employeeId).subscribe((returns: any) => {
  //     //debugger;
  //     //this.master.countData = returns.data[0].countData;
  //     if (returns.data[0].countData > 0) {
  //       this.toastrService.danger("Already Had a leave on following day", "Message");
  //       this.master.startDate = null;
  //       this.master.endDate = null;
  //       this.master.leaveDay = 0;
  //       return;
  //     }
  //   });
  // }

   save() {
    debugger;
    //var button = this.commonService.buttonClicked;
    this.employeeinformationService.UpdatePostingLocation(this.master).subscribe((returns: any) => {
      if (returns.success) {
        this.toastrService.success(this.commonService.successmsg, "Message");
        //this.show = false;
        this.getMaster();
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
  private Balance = 0;
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
    private leaveService: LeaveService,
    private employeeinformationService: EmployeeinformationService,
    private comboService: CommoncomboService,
    private fieldforcemasterService: FieldforcemasterService,
  ) {
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
        width: 50,
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
        width: 200,
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
        width: 150,
      },
      {
        headerName: "End Date",
        field: "endDate",
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "Leave Day",
        field: "leaveDay",
        filter: "agTextColumnFilter",
        width: 50,
      },
      {
        headerName: "Emergency contact",
        field: "emergencyContact",
        filter: "agTextColumnFilter",
        width: 200,
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
        width: 200,
      },
      {
        headerName: "Leave Location",
        field: "leaveLocation",
        filter: "agTextColumnFilter",
        width: 200,
      },
      {
        field: "action",
        cellRenderer: "btnCellRenderer",
        cellRendererParams: {
          clicked: function (field: any) {
            //localStorage.setItem("Token", user.auth_token);
            localStorage.setItem("button", field);
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
    //this.getLeaveType();
    //this.getLeaveYear();
    this.getEmployee();
    this.getzone();
    this.GetAllDepo();
    this.GetpostingLocation();
    //debugger;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // this.leaveService.GetLeaveRegisterByemployeeIdJson().subscribe((data: any) => {
    //   //debugger;
    //   if (data.success) {
    //     this.rowData = data.data;
    //   }
    // });
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
      if (event.node.data.leaveStatus != 0) {
        this.toastrService.danger("You Can't Edit Leave!!", "Message");
        return;
      } else {
        this.agEdit(event);
        this.show = false;
      }
    } else if (data == "view") {
      this.agEdit(event);
      this.show = false;
      this.disabled = true;
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
      if (event.node.data.leaveStatus != 0) {
        this.toastrService.danger("You Can't Delete Leave!!", "Message");
        return;
      } else {
        this.agDelete(event);
      }
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
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
  public LeaveTypeList = [];
  public getLeaveType() {
    this.master.LeaveTypeSelected = null;
    this.leaveService.getLeaveType().subscribe((retuns: any) => {
      if (retuns.success) {
        this.LeaveTypeList = retuns.data.map((val: any) => ({
          id: val.leaveTypeId,
          name: val.typeName,
        }));
        //console.log(this.LeaveTypeList);
      }
    })
  }

  public LeaveYearList = [];
  public getLeaveYear() {
    this.master.LeaveYearSelected = null;
    this.leaveService.getLeaveYear().subscribe((retuns: any) => {
      if (retuns.success) {
        this.LeaveYearList = retuns.data.map((val: any) => ({
          id: val.leaveYearId,
          name: val.yearName,
        }));
        //console.log(this.LeaveTypeList);
      }
    })
  }

  public EmployeeList = [];
  public getEmployee() {
    debugger;
    this.master.employeeSelected = null;
    this.employeeinformationService.GetEmployeeInfoByPosting(0).subscribe((retuns: any) => {
      if (retuns.success) {
        this.EmployeeList = retuns.data.map((val: any) => ({
          id: val.employeeId,
          name: val.fullNameCode,
        }));
        //console.log(this.LeaveTypeList);
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
  public RegionList = [];
  public AreaList = [];
  public depotList = [];
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
      var leaveRegisterId = event.node.data.leaveRegisterId;

      this.leaveService.GetLeaveRegisterByIdJson(leaveRegisterId).subscribe((data: any) => {
        if (data.success) {
          //debugger;
          this.master = data.data[0];

          // this.master.startDate = new Date(data.data[0].startDate);
          // this.master.endDate = new Date(data.data[0].endDate);

          // this.master.LeaveTypeSelected = {
          //   id: this.master.leaveTypeId,
          //   name: this.master.typeName
          // };
          // this.master.LeaveYearSelected = {
          //   id: this.master.yearId,
          //   name: this.master.yearName
          // };
          // this.master.TypeSelected = {
          //   id: this.master.type,
          //   name: data.data[0].CategoryName
          // };

          // this.GetLeaveBalance();

          // this.master.substituteEmployeeSelected = {
          //   id: this.master.substituteEmployeeId,
          //   name: this.master.substituteEmployeeName + '-' + this.master.substituteEmployeeCode
          // };
          // this.getDuplicate();
        }
      });
      this.ngOnInit();
    }
  }
  employeeDetails(){
    debugger;
    this.employeeinformationService.GetEmployeeBasicInfoById(this.master.employeeId).subscribe((data: any) => {
      if (data.success) {
        debugger;
        //this.master = data.data[0];
        this.master.regionId = data.data[0].regionId;
        this.master.zoneId = data.data[0].zoneId;
        this.master.areaId = data.data[0].areaId;
        this.master.depoId = data.data[0].depoId;
        this.master.territoryId = data.data[0].territoryId;
        this.master.postingLocation = data.data[0].postingLocation;
        this.zoneChange(data.data[0].zoneId);

        this.master.regionSelected = {
          id: data.data[0].regionId,
          name: data.data[0].RegionName
        }
        this.master.regiontxt = data.data[0].RegionName;
        this.regionChange(data.data[0].regionId);
        this.master.areaSelected = {
          id: data.data[0].areaId,
          name: data.data[0].AreaName
        }
        this.master.areatxt = data.data[0].AreaName;
        this.master.zoneSelected = {
          id: data.data[0].zoneId,
          name: data.data[0].ZoneName
        }
        this.master.zonetxt = data.data[0].ZoneName;
        this.master.depotSelected = {
          id: data.data[0].depoId,
          name: data.data[0].DepotName
        }
        this.master.depottxt = data.data[0].DepotName;
        this.master.postingLocationSelected = {
          id: data.data[0].postingLocation,
          name: data.data[0].postingLocationName
        }
        this.master.locationtxt = data.data[0].postingLocationName;
        this.getterritorybyareaCode(data.data[0].areaId);

        this.master.territorySelected = {
          id: data.data[0].territoryId,
          name: data.data[0].TerritoryName
        }
        this.master.territorytxt = data.data[0].TerritoryName;
      }
    });
  }
  private agReport(event) {
    //this.toastrService.info("Print button clicked", "Message");
    this.generateReport(event.node.data.leaveRegisterId);
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
  private agDelete(event) {
    let leaveStatus = event.node.data.leaveStatus;
    if (leaveStatus == 0) {
      var result = confirm("Are you sure you want to delete that?");
      if (result) {
        // this.master.leaveRegisterId = event.node.data.leaveRegisterId;
        this.leaveService.deleteleaveRegister(this.master).subscribe((returns: any) => {
          if (returns.success) {
            this.toastrService.success(this.commonService.deletedmsg, "Message");

            //////////////Grid Refresh ///////////////////
            this.leaveService.GetLeaveRegisterByemployeeIdJson().subscribe((data: any) => {
              if (data.success) {
                this.rowData = data.data;
              }
            });
            //////////////Grid Refresh ///////////////////
          }
        });

      }
    } else {
      this.toastrService.danger("You Can't Delete Leave", "Message");
    }

  }
  //////////////////////////////////End of Ag Grid Data Load/////////////////////////////////

  @Output() myEvent = new EventEmitter();

  public deleteRow(state, action) {
    //debugger;
    const nodeIdToRemove = action.payload;
    const filteredData = state.rowData.filter(
      (node) => node.id !== nodeIdToRemove
    );
    return {
      ...state,
      rowData: [...filteredData],
    };
  }

  public TypeList = [];
  public getType() {
    this.master.TypeSelected = null;
    this.TypeList = [
      {
        id: 1,
        name: "Pre Leave"
      }, {
        id: 2,
        name: "Post Leave"
      }
    ]
  }

  // calculateDiff() {
  //   if (this.master.startDate == null || this.master.endDate == null) {
  //     return;
  //   }
  //   let date = new Date(this.master.startDate);
  //   let currentDate = new Date(this.master.endDate);

  //   let days = Math.floor((currentDate.getTime() - date.getTime()) / 1000 / 60 / 60 / 24) + 1;
  //   this.getDuplicate();
  //   this.master.leaveDay = days;
  // }

  // GetLeaveBalance() {
  //   if (this.master.leaveTypeId > 0 && this.master.yearId > 0) {
  //     this.leaveService.GetLeaveBalance(this.master.yearId, this.master.leaveTypeId).subscribe((data: any) => {
  //       if (data.success) {
  //         this.Balance = data.data[0].leaveBalance;
  //       }
  //     });
  //   }
  // }

  public generateReport(leaveRegisterId) {

    this.getCrReport(leaveRegisterId);
  }
  apiUrl = '';
  private getCrReport(leaveRegisterId: any, reportFormat: any = 'pdf') {
    this.apiUrl = `Leave/RptGetEmployeeRegisterInfo?leaveRegisterId=${leaveRegisterId}&reportFormat=${reportFormat}`;
    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
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

  data: Country[] = [
    {
      name: "Russia",
      flag: "f/f3/Flag_of_Russia.svg",
      area: 17075200,
      population: 146989754,
    },
    {
      name: "Canada",
      flag: "c/cf/Flag_of_Canada.svg",
      area: 9976140,
      population: 36624199,
    },
    {
      name: "United States",
      flag: "a/a4/Flag_of_the_United_States.svg",
      area: 9629091,
      population: 324459463,
    },
    {
      name: "China",
      flag: "f/fa/Flag_of_the_People%27s_Republic_of_China.svg",
      area: 9596960,
      population: 1409517397,
    },
  ];

  names: any;
  openWithDataObjModel(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
      context: this.data,
    });
  }
  openWithDataModel() {
    this.dialogService
      .open(DialogNamePromptComponent)
      .onClose.subscribe((name) => name && this.names.push(name));
  }
  /////////////////////////////
}
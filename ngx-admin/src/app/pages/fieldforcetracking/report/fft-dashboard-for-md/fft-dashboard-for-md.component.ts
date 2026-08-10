import { I } from '@angular/cdk/keycodes';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { NbDialogService, NbSidebarService, NbToastrService } from "@nebular/theme";
import { CommonService } from "app/@core/mock/common.service";
import { LayoutService } from 'app/@core/utils';
import { NavigationStart, Router } from "@angular/router";
//import { FieldforcemasterService } from "app/services/fieldforcetracking/fieldforcemaster.service";

@Component({
  selector: 'ngx-fft-dashboard-for-md',
  templateUrl: './fft-dashboard-for-md.component.html',
  styleUrls: ['./fft-dashboard-for-md.component.scss']
})
export class FftDashboardForMdComponent implements OnInit {

  constructor(
    private router: Router,
    private toastrService: NbToastrService,
    private commonService: CommonService,
    //private fieldforcemasterService: FieldforcemasterService,
    private dialogService: NbDialogService,
    private sidebarService: NbSidebarService,
    private layoutService: LayoutService,

  ) {
    debugger;

    // this.attDetailsData = null;
    // this.empData = null;
    // this.doctorData = null;
    // this.itemDataHeader = null;
    // this.itemData = null;
    // this.ZoneList = null;
    // this.RegionList = null;
    // this.AreaList = null;


    this.userName = this.commonService.GetUserInfo('user_name');
    if (this.userName == null || this.userName == undefined || this.userName == "")
      this.userName = "100000";

    console.log("ua ", this.userName);
    this.getMaster();
    //this.GetZone();
  }


  public pageNavigation = "Field Forces Management Dashboard";
  showAttModal: boolean = false;
  userName = "";

  attendanceBodyData: any[];
  thAttendance: any = [
    "Title",
    "Total",
    "Active",
    "Absent",
    "Absent %"
  ];

  dailyActivityBodyData: any[];
  thDailyActivity: any = [
    "Activity Name",
    "Plan",
    "Done",
  ];

  monthlyTABodyData: any[];
  thMonthlyTA: any = [
    "Activity Name",
    "Target",
    "Achievement",
    "Achievement %",
  ];

  totalRecords: number = 0;
  AttModalHeader: string = "";
  attDetailsData: any[];
  empData: any[];
  doctorData: any[];
  itemDataHeader: any[];
  itemData: any[];

  ZoneList: any[];
  RegionList: any[];
  AreaList: any[];

  ZoneCodeSelected: {};
  RegionCodeSelected: {};
  AreaCodeSelected: {};

  master: {
    ZoneId: string;
    RegionId: string;
    AreaId: string;
    Date: Date;
  };


  ngOnInit(): void {
    debugger;
    this.GetDashboardData();
  }

  RptButtonAction() {

  }


  getMaster() {
    this.master = {
      ZoneId: "",
      RegionId: "",
      AreaId: "",
      Date: new Date(),
    }
  }

  GetZone() {

    let apiUrl = `GetALLParameter_V2?userName=${this.userName}`;
    this.commonService.GetFfmApiData(apiUrl).subscribe((returns: any) => {
      if (returns.status) {
        this.ZoneList = null;
        this.ZoneList = returns.zones.map((val: any) => ({
          id: val.ZONE_CODE,
          name: val.ZoneName,
          list: val.Regions,
        }));
      }
    });
  }

  ZoneChange(zoneCode: any) {
    debugger;

    this.RegionList = [];
    this.master.RegionId = "";
    this.RegionCodeSelected = {};

    this.AreaList = [];
    this.master.AreaId = "";
    this.AreaCodeSelected = {};

    let obj = this.ZoneCodeSelected['list'];
    this.RegionList = obj.map((val: any) => ({
      id: val.REGION_CODE,
      name: val.RegionName,
      list: val.Areas,
    }));
    this.GetDashboardData();
  }

  RegionChange(regionCode: any) {
    debugger;

    this.AreaList = [];
    this.master.AreaId = "";
    this.AreaCodeSelected = {};

    let obj = this.RegionCodeSelected['list'];
    this.AreaList = obj.map((val: any) => ({
      id: val.AREA_CODE,
      name: val.AreaName,
      list: val.Territories,
    }));
    this.GetDashboardData();
  }

  AreaChange(areaCode: any) {
    this.GetDashboardData();
  }

  count: number = 0;
  GetDashboardData() {
    //debugger;
    let apiUrl = `Schedule/getDashboardReportApp_V2?date=${this.commonService.DateFormat(this.master.Date)
      }&ZoneCode=${this.master.ZoneId}&RegionCode=${this.master.RegionId}&AreaCode=${this.master.AreaId}&userName=${this.userName}`;

    this.commonService.getReportData(apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        debugger;
        //console.log("returns.data", returns);
        this.attendanceBodyData = returns.attndence;
        this.dailyActivityBodyData = [];
        this.monthlyTABodyData = [];
        returns.data.forEach(element => {
          if (element.Period == 'Day')
            this.dailyActivityBodyData.push(element);
          else
            this.monthlyTABodyData.push(element);
        });

        if (this.count == 0) {
          this.toggleSidebar();
          this.count = 1;
        }
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }

  GetDashboardAttendanceDetails(_modal: TemplateRef<any>, usertype: any, type: any) {
    //console.log(usertype, type);
    let apiUrl = `Schedule/getDashboardAttendanceDetails_V2?usertype=${usertype}&type=${type}&ZoneCode=${this.master.ZoneId}&RegionCode=${this.master.RegionId}&AreaCode=${this.master.AreaId}&date=${this.commonService.DateFormat(this.master.Date)}&userName=${this.userName}`;

    this.commonService.getReportData(apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        //console.log("GetDashboardAttendanceDetails", returns.data);
        this.attDetailsData = returns.data;
        this.totalRecords = this.attDetailsData.length;
        let mHead: any = this.attendanceBodyData.find(t => t.Flag == usertype).POSTING_LOCATION;
        //console.log(`Attendance Details Of ${type} ${mHead}(s)`)
        this.AttModalHeader = (mHead == "" || mHead == undefined) ? "Attendance Details" : `Attendance Details Of ${type} ${mHead}`;

        this.dialogService.open(_modal, {
          context: [],
        });
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }


  GetRxDetails(_modal: TemplateRef<any>, flag: any, type: any) {
    let fDate: any;
    let tDate: any;
    this.empData = [];
    this.doctorData = [];
    this.itemData = [];
    this.totalRecords = 0;

    if (type == "Monthly") {
      this.AttModalHeader = "Monthly RX Details"
      fDate = this.commonService.DateFormat(this.commonService.GetFirstDateOfMonth(this.master.Date));
      tDate = this.commonService.DateFormat(this.commonService.GetLastDateOfMonth(this.master.Date));
    } else {
      this.AttModalHeader = "Daily RX Details"
      fDate = this.commonService.DateFormat(this.master.Date);
      tDate = this.commonService.DateFormat(this.master.Date);
    }

    if (flag == "Rx") {
      let apiUrl = `GetRXDetails_V2?fDate=${fDate}&tDate=${tDate}&zoneCode=${this.master.ZoneId}&regionCode=${this.master.RegionId}&areaCode=${this.master.AreaId}&flag=${flag}&userName=${this.userName}`;
      console.log('GetRxDetailsApiUrl', apiUrl);

      this.commonService.GetFfmApiData(apiUrl).subscribe((returns: any) => {
        if (returns.status) {
          //console.log('returns', returns);

          this.empData = returns.empData;
          this.totalRecords = this.empData.length;

          this.doctorData = returns.doctorData;

          this.itemData = returns.itemData;
          this.itemDataHeader = Object.keys(returns.itemData[0]);
          //console.log('itemDataHeader', Object.keys(returns.itemData[0]));
        }
      });
    }

    this.dialogService.open(_modal, {
      context: [],
    });
  }

  ModalTabChange(event) {

    if (event.tabTitle == "Employee Wise") {
      this.totalRecords = this.empData.length;
    } else if (event.tabTitle == "Doctor Wise") {
      this.totalRecords = this.doctorData.length;
    } else {
      this.totalRecords = this.itemData.length;
    }
  }


  public toggleSidebar(): boolean {
    this.sidebarService.toggle(true, "menu-sidebar");
    this.layoutService.changeLayoutSize();
    return false;
  }
}

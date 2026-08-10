import { Component, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { CommonService } from "app/@core/mock/common.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { FftReportService } from "app/services/fieldforcetracking/fft-report.service";
import { FieldforcemasterService } from "app/services/fieldforcetracking/fieldforcemaster.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DatePipe } from "@angular/common";

@Component({
  selector: "ngx-punch-in-out-report",
  templateUrl: "./punch-in-out-report.component.html",
  styleUrls: ["./punch-in-out-report.component.scss"],
})
export class PunchInOutReportComponent implements OnInit {
  public pageNavigation = "Attendance Report";
  public tableHeader = [
    "#",
    "Emp. Code",
    "Employee Name",
    "Zone Code",
    "Zone Name",
    // "DepotCode",
    // "Depot Name",
    "Region Code",
    "Region Name",
    "Area Code",
    "Area Name",
    "Territory Code",
    "Territory Name",
    "Date",
    "Punch In",
    "Punch Out",
    "Duration",
    "punch in Location",
    "punch out Location",
    "Status",
    "Late Time",
  ];
  public apiUrl = "";
  public bodyData: any = [];
  public bodyDatashow: any = [];
  public companies = [];
  public companyId: number = 0;
  public hide: boolean = false;
  public showbody: boolean = false;
  disabled: boolean = false;
  public company: {
    name: string;
    address: string;
    custom_footer: boolean;
    phone: string;
    fax: string;
    email: string;
    website: string;
    vat: string;
    tin: string;
  };
  master: {
    ZoneId: string;
    DepoId: string;
    RegionId: string;
    AreaId: string;
    TerritoryID: string;
    MIOName: string;
    fromDate: Date;
    toDate: Date;

    ZoneCodeSelected: {};
    DepoCodeSelected: {};
    RegionCodeSelected: {};
    AreaCodeSelected: {};
    TerritoryCodeSelected: {};
    MIOSelected: {};

    stockDetailsList: any[];
  };

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private fieldforcemasterService: FieldforcemasterService,
    private fftReportService: FftReportService,
    private DatePipe: DatePipe
  ) {
    this.GetZone();
    this.getMaster();
    this.GetEmployeeforAllEmployeeCT("", "");
  }

  ngOnInit(): void { }
  public RptButtonAction() {
    const clicked = this.commonService.buttonClicked;
    if (clicked == "preview") {
      this.onPreview();
    } else if (clicked == "pdf") {
      this.GenerateReport("pdf");
    } else if (clicked == "print") {
      this.GenerateReport("print");
    } else if (clicked == "csv") {
      this.onExportCSV();
    } else if (clicked == "refresh") {
      this.onRefresh();
    } else if (clicked == "email") {
      this.onEmail();
    } else {
      this.toastrService.warning("Message", "please clicked any button");
    }
  }

  public index = 0;
  public ZoneName: string = "";
  public DepotName: string = "";
  public RegionName: string = "";
  public AreaName: string = "";
  public TerritoryName: string = "";
  public MioName: string = "";
  public FromDate: string = "";
  public ToDate: string = "";

  private getReportData() {
    this.fftReportService
      .GetTSOAttendenceReportData(
        this.master.ZoneId,
        this.master.DepoId,
        this.master.RegionId,
        this.master.AreaId,
        this.master.TerritoryID,
        this.master.MIOName,
        this.DatePipe.transform(this.master.fromDate, "yyyy-MM-dd"),
        this.DatePipe.transform(this.master.toDate, "yyyy-MM-dd")
      )
      .subscribe((returns: any) => {
        if (returns.success) {
          debugger;
          this.bodyData = returns.data;
          console.log(this.bodyData);

          this.ZoneName =
            this.master.ZoneCodeSelected == null
              ? "All"
              : this.master.ZoneCodeSelected["name"];
          this.DepotName =
            this.master.DepoCodeSelected == null
              ? "All"
              : this.master.DepoCodeSelected["name"];
          this.RegionName =
            this.master.RegionCodeSelected == null
              ? "All"
              : this.master.RegionCodeSelected["name"];
          this.AreaName =
            this.master.AreaCodeSelected == null
              ? "All"
              : this.master.AreaCodeSelected["name"];
          this.TerritoryName =
            this.master.TerritoryCodeSelected == null
              ? "All"
              : this.master.TerritoryCodeSelected["name"];
          this.MioName =
            this.master.MIOSelected == null
              ? "All"
              : this.master.MIOSelected["name"];
          this.FromDate = this.master.fromDate.toString().substring(3, 15);
          this.ToDate = this.master.toDate.toString().substring(3, 15);
        } else {
          this.toastrService.danger("Message", this.commonService.nodatafound);
        }
      });
  }

  private onRefresh() {
    this.companyId = 0;
    this.bodyData = [];
    this.showbody = false;
  }
  private onPreview() {
    const fromDate = this.master.fromDate;
    const toDate = this.master.toDate;
    if (this.commonService.validateDates(fromDate, toDate)) {
      this.getReportData();
      this.showbody = true;
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
  }
  private onExportCSV() {
    const fromDate = this.master.fromDate;
    const toDate = this.master.toDate;
    if (this.commonService.validateDates(fromDate, toDate)) {
      this.getReportData();
      var fileName = this.pageNavigation + ".xlsx";
      let data = this.bodyData.map((item, index) => {
        return [
          index + 1,
          item.Code,
          item.Name,
          item.ZoneCode,
          item.ZoneName,
          item.RegionCode,
          item.RegionName,
          item.AreaCode,
          item.AreaName,
          item.TerritoryCode,
          item.TerritoryName,
          item.DateTime,
          item.PunchIn,
          item.PunchOut,
          item.Duration,
          item.punchinLocation,
          item.punchoutLocation,
          item.Status,
          item.LateTime,
        ];
      });

      this.commonService.GenerateExcelSheet(data, this.tableHeader, fileName);
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
  }
  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  public GenerateReport(buttonAction: any) {
    const fromDate = this.master.fromDate;
    const toDate = this.master.toDate;
    if (this.commonService.validateDates(fromDate, toDate)) {
      var fileName = this.pageNavigation + ".pdf";
      this.getReportData();
      const content = document.getElementById("reportHeader");
      this.generateReport(buttonAction, fileName, content, 11, 0, this.bodyData);
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
  }

  public getMaster() {
    this.master = {
      ZoneId: "",
      DepoId: "",
      RegionId: "",
      AreaId: "",
      TerritoryID: "",
      MIOName: "",
      fromDate: new Date(),
      toDate: new Date(),

      ZoneCodeSelected: null,
      DepoCodeSelected: null,
      RegionCodeSelected: null,
      AreaCodeSelected: null,
      TerritoryCodeSelected: null,
      MIOSelected: null,

      stockDetailsList: [],
    };
  }

  public ZoneList = [];
  public GetZone() {
    this.fieldforcemasterService.getZone(0).subscribe((retuns: any) => {
      if (retuns.length > 0) {
        this.ZoneList = retuns.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }));
      }
    });
  }

  public DepoList = [];
  public GetDepo(ZoneCode) {
    this.master.DepoCodeSelected = {};
    this.fieldforcemasterService
      .getDepoByZoneCode(ZoneCode)
      .subscribe((retuns: any) => {
        if (retuns.success) {
          this.DepoList = retuns.data.map((val: any) => ({
            id: val.Code,
            name: val.Name,
          }));
        }
      });
    this.GetRegionByZoneOrDepoCode(ZoneCode, "");
    this.GetEmployeeforAllEmployeeCT(ZoneCode, "Z");
  }

  public RegionList = [];
  public GetRegion(ZoneCode) {
    this.master.RegionCodeSelected = {};
    this.fieldforcemasterService
      .getRegionbydepocode(ZoneCode)
      .subscribe((retuns: any) => {
        if (retuns.success) {
          this.RegionList = retuns.data.map((val: any) => ({
            id: val.Code,
            name: val.Name,
          }));
        }
      });
    this.GetEmployeeforAllEmployeeCT(ZoneCode, "Z");
  }

  public GetRegionByZoneOrDepoCode(zoneCode, depoCode) {
    this.master.RegionCodeSelected = {};
    this.fieldforcemasterService
      .GetRegionByZoneOrDepoCode(zoneCode, depoCode)
      .subscribe((retuns: any) => {
        if (retuns.success) {
          debugger;
          this.RegionList = retuns.data.map((val: any) => ({
            id: val.Code,
            name: val.Name,
          }));
        }
      });
  }

  public AreaList = [];
  public GetArea(RegionCode) {
    this.master.AreaCodeSelected = {};
    this.fieldforcemasterService
      .getAreabyRegopmcode(RegionCode)
      .subscribe((retuns: any) => {
        if (retuns.success) {
          this.AreaList = retuns.data.map((val: any) => ({
            id: val.Code,
            name: val.Name,
          }));
        }
      });
    this.GetEmployeeforAllEmployeeCT(RegionCode, "R");
  }

  public TerritoryList = [];
  public GetTerritory(AreaId) {
    this.master.TerritoryCodeSelected = {};
    this.fieldforcemasterService
      .getTerritorybyAreacode(AreaId)
      .subscribe((retuns: any) => {
        if (retuns.success) {
          this.TerritoryList = retuns.data.map((val: any) => ({
            id: val.TerritoryCode,
            name: val.TerritoryName,
          }));
        }
      });
    this.GetEmployeeforAllEmployeeCT(AreaId, "A");
  }

  public MIOList = [];
  public GetMIO(TerritoryCode) {
    // this.master.MIOSelected = {};
    // this.fieldforcemasterService
    //   .getMIO(TerritoryCode)
    //   .subscribe((retuns: any) => {
    //     if (retuns.success) {
    //       this.MIOList = retuns.data.map((val: any) => ({
    //         id: val.EMP_ID,
    //         name: val.EMPLOYEE_NAME,
    //       }));
    //     }
    //   });
    this.GetEmployeeforAllEmployeeCT(TerritoryCode, "T");
  }
  public GetEmployeeforAllEmployeeCT(Code, Type) {
    this.master.MIOSelected = {};
    this.fieldforcemasterService
      .GetEmployeeforAllEmployeeCT(Code, Type)
      .subscribe((retuns: any) => {
        //debugger;
        if (retuns.status) {
          //console.log(retuns.data);
          this.MIOList = retuns.data.map((val: any) => ({
            id: val.employeeNo, //EMP_ID,
            name: val.fullName, //EMPLOYEE_NAME,
          }));
        }
      });
  }

  public generateReport(
    buttonAction: any,
    fileName: string,
    content: any,
    columnIndex: any,
    imageIndex: number,
    bodyData: any[]
  ) {
    console.log(bodyData);
    const doc = new jsPDF("l", "pt", "a4");
    doc.setFontSize(1); //optional
    doc.setTextColor(40); //optional
    const legend = {
      height: 100,
    };
    const addFooters = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      for (var i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(
          "Page " + String(i) + " of " + String(pageCount),
          doc.internal.pageSize.width / 1.2,
          doc.internal.pageSize.height - 20
        );
        doc.text(
          "Powered by : ONE ERP",
          doc.internal.pageSize.width / 2.3,
          doc.internal.pageSize.height - 20
        );
        doc.text(
          "Printed Date: " +
          new Date().toLocaleDateString() +
          " " +
          new Date().toLocaleTimeString(),
          20,
          doc.internal.pageSize.height - 20
        );
      }
    };

    //////////// TABLE DATA ////////////

    doc.html(content, {
      callback: function (doc) {
        autoTable(doc, {
          html: "#header_table_top",
          startY: legend.height + 20,
          styles: { font: "Meta", fontSize: 15, halign: "center" },
        });

        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 60,
          styles: { font: "Meta" },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 140,
          theme: "grid",
          // tableLineColor: [0, 0, 0],
          // tableLineWidth: 0.75,
          styles: {
            font: "Times New Roman",
            lineColor: [44, 62, 80],
            lineWidth: 0.55,
          },
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontSize: 8,
            halign: "center",
            valign: "middle",
            fontStyle: "bold",
          },
          bodyStyles: {
            //fillColor: [216, 216, 216],
            fontSize: 7,
            textColor: 50,
            valign: "middle",
          },
          columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 30 }, //Code
            2: { cellWidth: 55 }, //Name
            3: { cellWidth: 35 }, //ZoneCode
            4: { cellWidth: 45 }, //ZoneName
            5: { cellWidth: 35 }, //RegionCode
            6: { cellWidth: 45 }, //RegionName
            7: { cellWidth: 35 }, //AreaCode
            8: { cellWidth: 45 }, //AreaName
            9: { cellWidth: 35 }, //TerritoryCode
            10: { cellWidth: 55 }, //TerritoryName
            11: { cellWidth: 45 }, //DateTime
            12: { cellWidth: 38 }, //PunchIn}
            13: { cellWidth: 38 }, //PunchOut
            14: { cellWidth: 30 }, //Duration
            15: { cellWidth: 55 }, //punchinLocation
            16: { cellWidth: 55 }, //punchoutLocation
            17: { cellWidth: 35 }, //Status
            18: { cellWidth: 35 }, //LateTime
          },
          alternateRowStyles: {
            fillColor: [250, 250, 250],
          },

          // didDrawCell: (data) => {
          //   if (
          //     data.column.index === columnIndex &&
          //     data.cell.section === "body"
          //   ) {
          //     debugger;
          //     console.log(data);
          //     var td = data.cell.raw;
          //     console.log(td);

          //     console.log(imageIndex);
          //     if (bodyData.length > 0) {
          //       if (bodyData[imageIndex].imageFile != "") {
          //         var img = bodyData[imageIndex].imageFile;
          //         console.log(img);
          //         doc.addImage(img, data.cell.x + 1, data.cell.y + 2, 30, 30);
          //       }
          //     }
          //     imageIndex++;
          //     console.log(imageIndex);
          //   }
          // },
        });

        addFooters(doc);

        ////////////PRINT ////////////
        if (buttonAction == "pdf") {
          doc.save(fileName);
        } else {
          window.open(URL.createObjectURL(doc.output("blob")), "_blank"); //doc.output("dataurlnewwindow");
          doc.close();
        }
      },
    });
  }
}

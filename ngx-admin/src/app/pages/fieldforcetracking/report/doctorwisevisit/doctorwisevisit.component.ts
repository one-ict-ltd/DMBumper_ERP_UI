import { Component, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { CommonService } from "app/@core/mock/common.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { FieldforcemasterService } from "app/services/fieldforcetracking/fieldforcemaster.service";
import { MiovisitService } from "app/services/fieldforcetracking/miovisit.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
@Component({
  selector: "ngx-doctorwisevisit",
  templateUrl: "./doctorwisevisit.component.html",
  styleUrls: ["./doctorwisevisit.component.scss"],
})
export class DoctorwisevisitComponent implements OnInit {
  public pageNavigation = "Doctor Wise Visit Report";
  public tableHeader = [
    "#",
    "MIO Name",
    "Mobile",
    "Visit Plan Time",
    "Period",
    "Execution Time",
    "Remarks",
    "Image",
    "Visited Place",
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
    DoctorId: number;
    MarketName: string;
    fromDate: Date;
    toDate: Date;

    ZoneCodeSelected: {};
    DepoCodeSelected: {};
    RegionCodeSelected: {};
    AreaCodeSelected: {};
    TerritoryCodeSelected: {};
    MIOSelected: {};
    DoctorSelected: {};
    MarketSelected: {};

    stockDetailsList: any[];
  };

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private fieldforcemasterService: FieldforcemasterService,
    private miovisitService: MiovisitService
  ) {
    this.GetZone();
    this.getMaster();
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
  public MarketName: string = "";
  public DoctorName: string = "";
  public FromDate: string = "";
  public ToDate: string = "";

  private getReportData() {
    var DoctorId = 0;
    if (this.master.DoctorSelected != null) {
      DoctorId = this.master.DoctorSelected["id"];
    }

    this.apiUrl = `Report/getDoctorWiseVisitReport?ZoneId=${this.master.ZoneId
      }&DepoId=${this.master.DepoId}&RegionId=${this.master.RegionId}&AreaId=${this.master.AreaId
      }&TerritoryID=${this.master.TerritoryID}&MarketName=${this.master.MarketName
      }&DoctorId=${DoctorId}&fromDate=${this.master.fromDate
        .toDateString()
        .substring(4, 15)}&toDate=${this.master.toDate
          .toDateString()
          .substring(4, 15)}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.bodyData = returns.data;

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
        this.DoctorName =
          this.master.DoctorId == 0
            ? "All"
            : this.master.DoctorSelected["name"];
        this.MarketName =
          this.master.MarketSelected == null
            ? "All"
            : this.master.MarketSelected["name"];
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
      this.commonService.generateExcel(this.bodyData, this.tableHeader, fileName);
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
      this.generateReport(buttonAction, fileName, content, 7, 0, this.bodyData);
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
      MarketName: "",
      DoctorId: 0,
      fromDate: new Date(),
      toDate: new Date(),

      ZoneCodeSelected: null,
      DepoCodeSelected: null,
      RegionCodeSelected: null,
      AreaCodeSelected: null,
      TerritoryCodeSelected: null,
      MIOSelected: null,
      DoctorSelected: null,
      MarketSelected: null,

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
  }

  public MarketList = [];
  public GetMarket(AreaId) {
    this.master.MarketSelected = {};
    this.fieldforcemasterService
      .getMarketbyTerritorycode(AreaId)
      .subscribe((retuns: any) => {
        if (retuns.success) {
          this.MarketList = retuns.data.map((val: any) => ({
            id: val.Code,
            name: val.Name,
          }));
        }
      });
  }

  public DoctorList = [];
  public GetDoctorbyMarket() {
    this.master.DoctorSelected = {};
    this.miovisitService
      .GetDoctorByTerritoryMarket(
        this.master.MarketName,
        this.master.TerritoryID
      )
      .subscribe((retuns: any) => {
        if (retuns.success) {
          this.DoctorList = retuns.data.map((val: any) => ({
            id: val.DoctorID,
            name: val.DoctorName,
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
    const doc = new jsPDF("l", "pt", "a4");
    doc.setFontSize(1); //optional
    doc.setTextColor(40); //optional
    const legend = {
      height: 100,
    };
    const addFooters = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(3);
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
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.75,
          styles: {
            font: "Meta",
            lineColor: [44, 62, 80],
            lineWidth: 0.55,
          },
          headStyles: {
            fillColor: [105, 105, 105],
            fontSize: 11,
          },
          bodyStyles: {
            fillColor: [216, 216, 216],
            textColor: 50,
          },
          columnStyles: {},
          alternateRowStyles: {
            fillColor: [250, 250, 250],
          },

          didDrawCell: (data) => {
            if (
              data.column.index === columnIndex &&
              data.cell.section === "body"
            ) {
              debugger;
              console.log(data);
              var td = data.cell.raw;
              console.log(td);

              console.log(imageIndex);
              if (bodyData.length > 0) {
                if (bodyData[imageIndex].imageFile != "") {
                  var img = bodyData[imageIndex].imageFile;
                  console.log(img);
                  doc.addImage(img, data.cell.x + 1, data.cell.y + 2, 30, 30);
                }
              }
              imageIndex++;
              console.log(imageIndex);
            }
          },
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

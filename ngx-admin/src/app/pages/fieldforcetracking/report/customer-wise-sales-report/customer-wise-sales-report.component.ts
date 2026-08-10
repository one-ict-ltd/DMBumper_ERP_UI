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
  selector: "ngx-customer-wise-sales-report",
  templateUrl: "./customer-wise-sales-report.component.html",
  styleUrls: ["./customer-wise-sales-report.component.scss"],
})
export class CustomerWiseSalesReportComponent implements OnInit {
  public pageNavigation = "customer-wise-sales-report ( Under Construction !)";
  public tableHeader = [
    "#",
    "Emp. Code",
    "Employee Name",
    "Zone Name",
    "Depot Name",
    "Region Name",
    "Area Name",
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
    ChemistId: string;
    fromDate: Date;
    toDate: Date;
    BrandId: string;

    ZoneCodeSelected: {};
    DepoCodeSelected: {};
    RegionCodeSelected: {};
    AreaCodeSelected: {};
    TerritoryCodeSelected: {};
    CustomerSelected: {};
    BrandSelected: {};

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
  }

  ngOnInit(): void {}
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
        this.master.ChemistId,
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
            this.master.CustomerSelected == null
              ? "All"
              : this.master.CustomerSelected["name"];
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
    this.getReportData();
    this.showbody = true;
  }
  private onExportCSV() {
    this.getReportData();
    var fileName = this.pageNavigation + ".xlsx";
    this.commonService.generateExcel(this.bodyData, this.tableHeader, fileName);
  }
  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  public GenerateReport(buttonAction: any) {
    var fileName = this.pageNavigation + ".pdf";
    this.getReportData();
    const content = document.getElementById("reportHeader");
    this.generateReport(buttonAction, fileName, content, 11, 0, this.bodyData);
  }

  public getMaster() {
    this.master = {
      ZoneId: "",
      BrandId: "",
      DepoId: "",
      RegionId: "",
      AreaId: "",
      TerritoryID: "",
      ChemistId: "",
      fromDate: new Date(),
      toDate: new Date(),

      ZoneCodeSelected: null,
      DepoCodeSelected: null,
      RegionCodeSelected: null,
      AreaCodeSelected: null,
      TerritoryCodeSelected: null,
      CustomerSelected: null,
      BrandSelected: null,

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

  public CustomerList = [];
  public GetCustomer(TerritoryCode) {
    this.master.CustomerSelected = {};
    this.fieldforcemasterService
      .getCustomer(TerritoryCode)
      .subscribe((retuns: any) => {
        if (retuns.success) {
          this.CustomerList = retuns.data.map((val: any) => ({
            id: val.EMP_ID,
            name: val.EMPLOYEE_NAME,
          }));
        }
      });
  }

  public BrandList = [];
  public GetCustomer2(TerritoryCode) {
    this.master.BrandSelected = {};
    this.fieldforcemasterService
      .getCustomer(TerritoryCode)
      .subscribe((retuns: any) => {
        if (retuns.success) {
          this.BrandList = retuns.data.map((val: any) => ({
            id: val.EMP_ID,
            name: val.EMPLOYEE_NAME,
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
            fontSize: 11,
            halign: "center",
            valign: "middle",
            fontStyle: "bold",
          },
          bodyStyles: {
            //fillColor: [216, 216, 216],
            textColor: 50,
            valign: "middle",
          },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 40 },
            2: { cellWidth: 70 },
            3: { cellWidth: 35 },
            4: { cellWidth: 45 },
            5: { cellWidth: 50 },
            6: { cellWidth: 50 },
            //7: { cellWidth: 75 },
            8: { cellWidth: 60 },
            9: { cellWidth: 50 },
            10: { cellWidth: 40 },
            11: { cellWidth: 40 },
            12: { cellWidth: 40 },
            13: { cellWidth: 50 },
            14: { cellWidth: 50 },
            15: { cellWidth: 40 },
            16: { cellWidth: 40 },
          },
          alternateRowStyles: {
            fillColor: [250, 250, 250],
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

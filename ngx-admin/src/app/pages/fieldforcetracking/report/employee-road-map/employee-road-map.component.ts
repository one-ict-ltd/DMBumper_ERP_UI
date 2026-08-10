import { Component, OnInit } from "@angular/core";

import { NbToastrService } from "@nebular/theme";
import { CommonService } from "app/@core/mock/common.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { FieldforcemasterService } from "app/services/fieldforcetracking/fieldforcemaster.service";
import { MiovisitService } from "app/services/fieldforcetracking/miovisit.service";
import { FftReportService } from "app/services/fieldforcetracking/fft-report.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DatePipe } from "@angular/common";
import { NumberWithCommasPipe } from "../../../../@theme/pipes/number-with-commas.pipe";
import * as Mapboxgl from "mapbox-gl";
import { FftDashboardService } from "app/services/fieldforcetracking/fft-dashboard.service";

import * as ExcelJS from "exceljs/dist/exceljs.min.js";
const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
import * as FileSaver from "file-saver";

@Component({
  selector: "ngx-employee-road-map",
  templateUrl: "./employee-road-map.component.html",
  styleUrls: ["./employee-road-map.component.scss"],
})
export class EmployeeRoadMapComponent implements OnInit {
  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private fieldforcemasterService: FieldforcemasterService,
    private miovisitService: MiovisitService,
    private fftReportService: FftReportService,
    private datePipe: DatePipe,
    private FftDashboardService: FftDashboardService
  ) {
    this.GetSearchFor();
    this.GetZone();
    this.getMaster();
    this.getCompany();
    this.getCompanyAddress();
    this.GetMIO("");
  }

  ngOnInit(): void { }

  public pageNavigation = "Employee Road Map";

  public tableHeader = [
    "#",
    "Code",
    "Name",
    "Date Time",
    "Location",
    "View Map",
  ];
  public apiUrl = "";
  public bodyData: any = [];
  public bodyDatashow: any = [];
  public companies = [];
  public companyId: number = 0;
  public hide: boolean = false;
  public showbody: boolean = false;
  public showMapBody: boolean = false;
  disabled: boolean = false;
  company: {
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
  getCompany() {
    this.company = {
      name: "",
      address: "",
      custom_footer: false,
      phone: "",
      fax: "",
      email: "",
      website: "",
      vat: "",
      tin: "",
    };
  }

  companyData;
  companyName;
  addressLine;
  officeTelephone;
  companyEmail;
  website;

  private getCompanyAddress() {
    this.comboService.getCompanybyId().subscribe((returns: any) => {
      this.companyData = returns.data;
      this.companyName = this.companyData[0].companyName;
      this.addressLine = this.companyData[0].addressLine;
      this.officeTelephone = this.companyData[0].officeTelephone;
      this.companyEmail = this.companyData[0].companyEmail;
      this.website = this.companyData[0].website;
    });
  }
  // getCompanyAddress() {
  //   this.comboService.getCompanybyId().subscribe((returns: any) => {
  //     let companyData = [];
  //     companyData = returns.data;
  //     debugger;

  //     this.company[0].name = returns.data[0].companyName;
  //     this.company[0].address = returns.data[0].addressLine;
  //     this.company[0].phone = returns.data[0].officeTelephone;
  //     this.company[0].email = returns.data.dataanyData[0].companyEmail;
  //     this.company[0].website = returns.data[0].website;

  //     console.log("this.company");
  //     console.log(this.company);
  //   });
  // }
  master: {
    Date: Date;
    SearchForValue: string;
    ZoneId: string;
    DepoId: string;
    RegionId: string;
    AreaId: string;
    TerritoryID: string;
    MIOCode: string;
    fromDate: Date;
    toDate: Date;
    ttlEmployee: number;
    SearchForSelected: {};
    ZoneCodeSelected: {};
    DepoCodeSelected: {};
    RegionCodeSelected: {};
    AreaCodeSelected: {};
    TerritoryCodeSelected: {};
    MIOSelected: {};

    stockDetailsList: any[];
  };

  public getMaster() {
    this.master = {
      Date: new Date(),
      SearchForValue: "",
      ZoneId: "",
      DepoId: "",
      RegionId: "",
      AreaId: "",
      TerritoryID: "",
      MIOCode: "",
      fromDate: new Date(),
      toDate: new Date(),
      ttlEmployee: 0,

      SearchForSelected: null,
      ZoneCodeSelected: null,
      DepoCodeSelected: null,
      RegionCodeSelected: null,
      AreaCodeSelected: null,
      TerritoryCodeSelected: null,
      MIOSelected: null,

      stockDetailsList: [],
    };
  }

  public RptButtonAction() {
    const clicked = this.commonService.buttonClicked;
    if (clicked == "preview") {
      this.onPreview();
    } else if (clicked == "pdf") {
      this.GenerateReport("pdf");
    } else if (clicked == "print") {
      this.GenerateReport("print");
    } else if (clicked == "excel") {
      this.onExportCSV();
    } else if (clicked == "refresh") {
      this.onRefresh();
    } else if (clicked == "viewmap") {
      this.onMapView();
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
  public SearchForName: string = "";

  private onRefresh() {
    // this.companyId = 0;
    // this.bodyData = [];

    // this.showbody = false;
    // this.showMapBody = false;
    window.location.reload();
  }
  private onPreview() {
    this.GetLocationDataForReport();
    this.showbody = true;
    this.showMapBody = false;
  }

  private onExportCSV() {
    this.GetLocationDataForReport();
    var fileName = this.pageNavigation + ".xlsx";
    this.generateExcel(this.bodyData, this.tableHeader, fileName);
  }

  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  onMapView() {
    this.showMapBody = true;
    this.showbody = false;
    this.GetLocationDataForMap();
  }

  public GenerateReport(buttonAction: any) {
    this.GetLocationDataForReport();
    var fileName = this.pageNavigation + ".pdf";
    const content = document.getElementById("reportHeader");
    this.generateReport(buttonAction, fileName, content);
  }

  public SearchForList = [];
  public GetSearchFor() {
    this.SearchForList = [
      { id: "Z", name: "Zone" },
      { id: "D", name: "Depot" },
      { id: "R", name: "Region" },
      { id: "A", name: "Area" },
      { id: "T", name: "Territory" },
    ];
    //console.log(this.SearchForList);
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

  public MIOList = [];
  public GetMIO(TerritoryCode) {
    this.master.MIOSelected = {};
    this.miovisitService.getMIO(TerritoryCode).subscribe((retuns: any) => {
      if (retuns.success) {
        this.master.ttlEmployee = retuns.data.length;
        this.MIOList = retuns.data.map((val: any) => ({
          id: val.EMP_ID,
          name: `${val.EMPLOYEE_NAME} (${val.EMP_ID})`, //val.EMPLOYEE_NAME,
        }));
      }
    });
  }

  public LoadEmployees(code, Type, SType) {
    this.master.MIOCode = "";
    this.master.MIOSelected = {};
    this.FftDashboardService.GetEmployees(code, Type, SType).subscribe(
      (retuns: any) => {
        if (retuns.success) {
          this.master.ttlEmployee = retuns.data.length;
          this.MIOList = retuns.data.map((val: any) => ({
            id: val.employeeNo,
            name: `${val.fullName} (${val.employeeNo})`,
          }));
        }
      }
    );
  }

  DropdownChange(ddlName: any) {
    //debugger;

    let sType = this.master.SearchForValue;
    switch (ddlName) {
      case "Z": {
        //Zone
        let code = this.master.ZoneId;
        this.LoadEmployees(code, "Z", sType);
        this.GetDepo(code);
        this.GetRegionByZoneOrDepoCode(code, "");
        break;
      }
      case "D": {
        //Depot
        let code = this.master.DepoId;
        this.LoadEmployees(code, "D", sType);
        this.GetRegion(code);
        break;
      }
      case "R": {
        //Region
        let code = this.master.RegionId;
        this.LoadEmployees(code, "R", sType);
        this.GetArea(code);
        break;
      }
      case "A": {
        //Area
        let code = this.master.AreaId;
        this.LoadEmployees(code, "A", sType);
        this.GetTerritory(code);
        break;
      }
      case "T": {
        //Territory
        let code = this.master.TerritoryID;
        this.LoadEmployees(code, "T", sType);
        break;
      }
      default: {
        this.LoadEmployees("", "", sType);
        break;
      }
    }
    // if (sType == "T") this.LoadSumData();
    // else this.LoadAllLocationData();
  }

  private GetLocationDataForReport() {
    this.fftReportService
      .GetLocationMIO(
        this.master.SearchForValue,
        this.master.ZoneId,
        this.master.DepoId,
        this.master.RegionId,
        this.master.AreaId,
        this.master.TerritoryID,
        this.master.MIOCode,
        this.datePipe.transform(this.master.Date, "yyyy-MM-dd")
      )
      .subscribe((returns: any) => {
        if (returns.success) {
          debugger;
          this.bodyData = returns.data;
          //this.master.ttlEmployee = returns.data.length;

          this.SearchForName =
            this.master.SearchForSelected == null
              ? "N/A"
              : this.master.SearchForSelected["name"];
          this.ZoneName =
            this.master.ZoneCodeSelected == null
              ? "N/A"
              : this.master.ZoneCodeSelected["name"];
          this.DepotName =
            this.master.DepoCodeSelected == null
              ? "N/A"
              : this.master.DepoCodeSelected["name"];
          this.RegionName =
            this.master.RegionCodeSelected == null
              ? "N/A"
              : this.master.RegionCodeSelected["name"];
          this.AreaName =
            this.master.AreaCodeSelected == null
              ? "N/A"
              : this.master.AreaCodeSelected["name"];
          this.TerritoryName =
            this.master.TerritoryCodeSelected == null
              ? "N/A"
              : this.master.TerritoryCodeSelected["name"];
          this.MioName =
            this.master.MIOSelected == null
              ? "N/A"
              : this.master.MIOSelected["name"];
        } else {
          this.toastrService.danger("Message", this.commonService.nodatafound);
        }
      });
  }

  public generateReport(buttonAction: any, fileName: string, content: any) {
    const doc = new jsPDF("l", "pt", "a4");
    doc.setFontSize(1); //optional
    doc.setTextColor(40); //optional
    const legend = {
      height: 100,
    };
    const addFooters = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(9);
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
          alternateRowStyles: {
            fillColor: [250, 250, 250],
          },
        });

        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 60,
          styles: { font: "Meta" },
          alternateRowStyles: {
            fillColor: [250, 250, 250],
          },
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
            textColor: 50,
            fillColor: [250, 250, 250],
            fontSize: 11,
          },
          bodyStyles: {
            textColor: 50,
            fillColor: [250, 250, 250],
            valign: "middle",
          },
          columnStyles: {},
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

  workbook: ExcelJS.Workbook;
  worksheet: any;
  public generateExcel(objArray: any, header: any, fileName: string) {
    debugger;
    //console.log(objArray);
    let data = objArray.map((item, index) => {
      return [
        index + 1,
        item.MIOCode,
        item.MIOName,
        item.DateTime,
        item.Location,
        item.ViewMap,
      ];
    });
    var alphabet = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ];
    var count = header.length;
    var endColumn = alphabet[count - 1];
    this.workbook = new ExcelJS.Workbook();

    // Set Workbook Properties
    this.workbook.creator = "Web";
    this.workbook.lastModifiedBy = "Web";
    this.workbook.created = new Date();
    this.workbook.modified = new Date();
    this.workbook.lastPrinted = new Date();

    // Add a Worksheet
    this.worksheet = this.workbook.addWorksheet(fileName);

    //Add Header Row
    let headerName = this.worksheet.addRow([this.companyName]);
    debugger;
    headerName.font = { size: 16, underline: "double", bold: true };
    headerName.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };

    this.worksheet.mergeCells(
      `A${headerName.number}:${endColumn + headerName.number}`
    );

    let headerAddress = this.worksheet.addRow([this.addressLine]);
    headerAddress.font = { size: 10 };
    headerAddress.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    this.worksheet.mergeCells(
      `A${headerAddress.number}:${endColumn + headerAddress.number}`
    );

    let headerPhone = this.worksheet.addRow([
      // this.company.phone + "; " + this.company.fax,
      this.officeTelephone,
    ]);
    headerPhone.font = { size: 10 };
    headerPhone.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    this.worksheet.mergeCells(
      `A${headerPhone.number}:${endColumn + headerPhone.number}`
    );

    let headerWebsite = this.worksheet.addRow([
      this.companyEmail + "; " + this.website,
    ]);
    headerWebsite.font = { size: 10 };
    headerWebsite.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    this.worksheet.mergeCells(
      `A${headerWebsite.number}:${endColumn + headerWebsite.number}`
    );

    headerName.getCell(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFCCFFE5" },
    };
    headerName.getCell(1).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    this.worksheet.addRow([]);
    var tableHeaderRow = this.worksheet.addRow(header);
    header.map((item, index) => {
      tableHeaderRow.getCell(index + 1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "696969" },
      };
      tableHeaderRow.getCell(index + 1).font = {
        bold: true,
        size: 12,
        family: 4,
        color: { argb: "FFFFFF" },
      };
    });

    //this.worksheet.addRows(objArray);
    this.worksheet.addRows(data);

    // Add Data and Conditional Formatting
    // data.forEach((d) => {
    //   let row = this.worksheet.addRow(d);
    //   let qty = row.getCell(5);
    //   let color = "FF99FF99";
    //   if (+qty.value < 500) { color = "FF9999"; }
    //   qty.fill = { type: "pattern",  pattern: "solid", fgColor: { argb: color }};
    // });
    // this.worksheet.getColumn(3).width = 30;
    // this.worksheet.getColumn(4).width = 30;
    this.worksheet.addRow([]);
    //Footer Row
    let footerRow = this.worksheet.addRow([
      "This excel sheet is generated by ONE ERP.",
    ]);
    footerRow.getCell(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFCCFFE5" },
    };
    footerRow.getCell(1).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    //Merge Cells
    footerRow.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    this.worksheet.mergeCells(
      `A${footerRow.number}:${endColumn + footerRow.number}`
    );
    // Generate Excel File
    this.workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: EXCEL_TYPE });
      // Given name
      FileSaver.saveAs(blob, fileName);
    });
  }

  Locationdata: any;
  GetLocationDataForMap() {
    var i = 0;
    this.fftReportService
      .GetLocationMIO_Map(
        this.master.SearchForValue,
        this.master.ZoneId,
        this.master.DepoId,
        this.master.RegionId,
        this.master.AreaId,
        this.master.TerritoryID,
        this.master.MIOCode,
        this.datePipe.transform(this.master.Date, "yyyy-MM-dd")
      )
      .subscribe((returns: any) => {
        if (returns.success) {
          // console.log(returns);
          console.log(returns.data);
          this.Locationdata = returns.data;
          //this.master.ttlEmployee = returns.data.length;
          if (i = 0) {
            setLocationOnMap1(this.Locationdata);

          }
          else {
            setLocationOnMap(this.Locationdata);
          }
          i++;

        }
      });
  }
}

function setLocationOnMap(Locationdata: any) {
  debugger;

  var count = Locationdata.length;
  var lats = Locationdata[0].Latitude;
  var logs = Locationdata[0].Longitude;
  var late = Locationdata[count - 1].Latitude;
  var loge = Locationdata[count - 1].Longitude;

  var featuresData = [];
  var coordinatesData = [];

  Locationdata.forEach((rc) => {
    var properties = {
      description: `<strong>Details:<br>----------------------------</strong><br><strong>Code</strong>: ${rc.MIOCode}<br><strong>Name</strong>: ${rc.MIOName}<br><strong>Designation</strong>: ${rc.Designation}<br><strong>Posting</strong>: ${rc.Location}<br><strong>Location</strong>: ${rc.LLAddress}<br><strong>Date Time</strong>: ${rc.DateTime}`,
    };
    var geomertry = {
      type: "Point",
      coordinates: [rc.Longitude, rc.Latitude], //[rc.Latitude, rc.Longitude],
    };
    var object = {
      type: "Feature",
      properties: properties,
      geometry: geomertry,
    };
    featuresData.push(object);

    var coordinates = [rc.Longitude, rc.Latitude]; //[rc.Latitude, rc.Longitude];
    coordinatesData.push(coordinates);
  });
  //console.log(featuresData);

  Mapboxgl.accessToken =
    "pk.eyJ1IjoiYmFzaGFybmFpbSIsImEiOiJja2ZrbGlieDMwNHRqMnJwamxmZmVxeDFxIn0.oB7ArqzMqQEcPnD69k_wyQ";
  var map = new Mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [90.3893259, 23.7573822],
    zoom: 9.0,
  });

  map.on("load", function () {
    debugger;
    map.loadImage(
      "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
      // Add an image to use as a custom marker
      function (error, image) {
        if (error) throw error;
        map.addImage("custom-marker", image);

        //featuresData
        map.addSource("places", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: featuresData,
          },
        });

        //coordinatesData
        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: coordinatesData,
            },
          },
        });

        map.addLayer({
          id: "places",
          type: "symbol",
          source: "places",
          layout: {
            "icon-image": "custom-marker",
            "icon-allow-overlap": true,
          },
        });

        //#region for Addition Marker

        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#007FFF",
            "line-width": 4,
          },
        });

        //#endregion
      }
    );
    var firstLocation = coordinatesData[0];
    map.flyTo({
      center: firstLocation,
      zoom: 12, // Adjust zoom level as needed
    });

    // Create a popup, but don't add it to the map yet.
    var popup = new Mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    map.on("mouseenter", "places", function (e) {
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = "pointer";

      var coordinates = e.features[0].geometry.coordinates.slice();
      var description = e.features[0].properties.description;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      popup.setLngLat(coordinates).setHTML(description).addTo(map);
    });
    map.on("mouseleave", "places", function () {
      map.getCanvas().style.cursor = "";
      popup.remove();
    });
  });
}
// function setLocationOnMap1(Locationdata: any) {
//   debugger;

//   var count = Locationdata.length;
//   var lats = Locationdata[0].Latitude;
//   var logs = Locationdata[0].Longitude;
//   var late = Locationdata[count - 1].Latitude;
//   var loge = Locationdata[count - 1].Longitude;

//   var featuresData = [];
//   var coordinatesData = [];

//   Locationdata.forEach((rc) => {
//     var properties = {
//       description: `<strong>Details:<br>----------------------------</strong><br><strong>Code</strong>: ${rc.MIOCode}<br><strong>Name</strong>: ${rc.MIOName}<br><strong>Designation</strong>: ${rc.Designation}<br><strong>Posting</strong>: ${rc.Location}<br><strong>Location</strong>: ${rc.LLAddress}<br><strong>Date Time</strong>: ${rc.DateTime}`,
//     };
//     var geomertry = {
//       type: "Point",
//       coordinates: [rc.Longitude, rc.Latitude], //[rc.Latitude, rc.Longitude],
//     };
//     var object = {
//       type: "Feature",
//       properties: properties,
//       geometry: geomertry,
//     };
//     featuresData.push(object);

//     var coordinates = [rc.Longitude, rc.Latitude]; //[rc.Latitude, rc.Longitude];
//     coordinatesData.push(coordinates);
//   });
//   //console.log(featuresData);

//   Mapboxgl.accessToken =
//     "pk.eyJ1IjoiYmFzaGFybmFpbSIsImEiOiJja2ZrbGlieDMwNHRqMnJwamxmZmVxeDFxIn0.oB7ArqzMqQEcPnD69k_wyQ";
//   var map = new Mapboxgl.Map({
//     container: "map",
//     style: "mapbox://styles/mapbox/streets-v11",
//     //center: [90.3893259, 23.7573822],
//     center: [90.3893259, 23.7573822],
//     zoom: 6.0,
//   });

//   map.on("load", function () {
//     debugger;
//     map.loadImage(
//       "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
//       // Add an image to use as a custom marker
//       function (error, image) {
//         if (error) throw error;
//         map.addImage("custom-marker", image);

//         //featuresData
//         map.addSource("places", {
//           type: "geojson",
//           data: {
//             type: "FeatureCollection",
//             features: featuresData,
//           },
//         });

//         //coordinatesData
//         map.addSource("route", {
//           type: "geojson",
//           data: {
//             type: "Feature",
//             properties: {},
//             geometry: {
//               type: "LineString",
//               coordinates: coordinatesData,
//             },
//           },
//         });

//         map.addLayer({
//           id: "places",
//           type: "symbol",
//           source: "places",
//           layout: {
//             "icon-image": "custom-marker",
//             "icon-allow-overlap": true,
//           },
//           paint: {
//             "line-color": "#a1dab4",
//             "line-width": 4,
//           },
//         });

//         //#region for Addition Marker

//         map.addLayer({
//           id: "route",
//           type: "line",
//           source: "route",
//           layout: {
//             "line-join": "round",
//             "line-cap": "round",
//           },
//           paint: {
//             "line-color": "#007FFF",
//             "line-width": 4,
//           },
//         });

//         //#endregion
//       }
//     );

//     // Create a popup, but don't add it to the map yet.
//     var popup = new Mapboxgl.Popup({
//       closeButton: false,
//       closeOnClick: false,
//     });

//     map.on("mouseenter", "places", function (e) {
//       // Change the cursor style as a UI indicator.
//       map.getCanvas().style.cursor = "pointer";

//       var coordinates = e.features[0].geometry.coordinates.slice();
//       var description = e.features[0].properties.description;

//       // Ensure that if the map is zoomed out such that multiple
//       // copies of the feature are visible, the popup appears
//       // over the copy being pointed to.
//       while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
//         coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
//       }

//       // Populate the popup and set its coordinates
//       // based on the feature found.
//       popup.setLngLat(coordinates).setHTML(description).addTo(map);
//     });
//     map.on("mouseleave", "places", function () {
//       map.getCanvas().style.cursor = "";
//       popup.remove();
//     });
//   });
// }

function setLocationOnMap1(Locationdata: any) {
  debugger;

  var count = Locationdata.length;
  var featuresData = [];
  var coordinatesData = [];

  Locationdata.forEach((rc) => {
    var properties = {
      description: `<strong>Details:<br>----------------------------</strong><br><strong>Code</strong>: ${rc.MIOCode}<br><strong>Name</strong>: ${rc.MIOName}<br><strong>Designation</strong>: ${rc.Designation}<br><strong>Posting</strong>: ${rc.Location}<br><strong>Location</strong>: ${rc.LLAddress}<br><strong>Date Time</strong>: ${rc.DateTime}`,
    };
    var geometry = {
      type: "Point",
      coordinates: [rc.Longitude, rc.Latitude],
    };
    var object = {
      type: "Feature",
      properties: properties,
      geometry: geometry,
    };
    featuresData.push(object);

    var coordinates = [rc.Longitude, rc.Latitude];
    coordinatesData.push(coordinates);
  });

  Mapboxgl.accessToken = "pk.eyJ1IjoiYmFzaGFybmFpbSIsImEiOiJja2ZrbGlieDMwNHRqMnJwamxmZmVxeDFxIn0.oB7ArqzMqQEcPnD69k_wyQ";
  var map = new Mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    //center: [80.3893259, 30.7573822], // Default center
    center: [90.3893259, 23.7573822],
    zoom: 12.0, // Default zoom
  });

  map.on("load", function () {
    debugger;

    map.loadImage(
      "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
      function (error, image) {
        if (error) throw error;
        map.addImage("custom-marker", image);

        // Add places data
        map.addSource("places", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: featuresData,
          },
        });

        // Add route data (for line connecting points)
        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: coordinatesData,
            },
          },
        });

        map.addLayer({
          id: "places",
          type: "symbol",
          source: "places",
          layout: {
            "icon-image": "custom-marker",
            "icon-allow-overlap": true,
          },
        });

        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#007FFF",
            "line-width": 4,
          },
        });

        // Fit bounds to show all points in view
        var bounds = new Mapboxgl.LngLatBounds();
        coordinatesData.forEach((coord) => bounds.extend(coord));
        map.fitBounds(bounds, {
          padding: 50, // Add padding to avoid markers being too close to edges
        });
      }
    );
    var firstLocation = coordinatesData[0];
    map.flyTo({
      center: firstLocation,
      zoom: 12, // Adjust zoom level as needed
    });

    // Popup and interactivity
    var popup = new Mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    map.on("mouseenter", "places", function (e) {
      map.getCanvas().style.cursor = "pointer";

      var coordinates = e.features[0].geometry.coordinates.slice();
      var description = e.features[0].properties.description;

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      popup.setLngLat(coordinates).setHTML(description).addTo(map);
    });

    map.on("mouseleave", "places", function () {
      map.getCanvas().style.cursor = "";
      popup.remove();
    });
  });
}


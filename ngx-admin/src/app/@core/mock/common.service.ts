import { Injectable } from "@angular/core";
import {
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrService,
} from "@nebular/theme";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable, forkJoin } from "rxjs";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
// import { NONE_TYPE } from "@angular/compiler";
// import { KeyObject } from "node:crypto";
// import { debug } from "node:console";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as ExcelJS from "exceljs/dist/exceljs.min.js";
import * as FileSaver from "file-saver";
const EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

@Injectable({
  providedIn: "root",
})

export class CommonService {
  private readonly bdLocalRegex = /^01[3-9]\d{8}$/;
  private HostName: any = {
    // OneIct_8201: 'OneIct_8201', // One ICT
    // OneErp_Demo_4200: 'OneErp_Demo_4200',
    // One_Pharma_AH_9155: 'One_Pharma_AH_9155', // OPL-DEMO

    Development: 'Development',
    DMBumper_9246: 'DMBumper_9246', // DMBumper
  }

  constructor(
    //private router: Router,
    private toastrService: NbToastrService,
    private http: HttpClient,
    private dp: DatePipe,
  ) {
    this.GetConnectionString(this.HostName.DMBumper_9246);
  }

  baseUrl: string = "";
  baseReportUrl: string = "";
  fieldForceGlobalUrl: string = "";

  successmsg: string = "Data Saved Successfully";
  failedmsg: string = "Data Saved Process Failed !";
  updatedmsg: string = "Data Updated Successfully";
  selectdata: string = "Please select data for update";
  warningmsg: string = "Data Refreshed";
  deletedmsg: string = "Data Deleted";
  deleteFailedMsg: string = "Data Deleted Process Failed !";
  processmsg: string = "Data Processed Successfully";
  procesFailed: string = "Data Processed Failed";
  nodatafound: string = "Data Not Found";
  errorInReport: string = "Something went wrong!";
  invaliduser: string = "User Name or Password may be invalid";
  serverDate: any[] = [];

  // public company = {
  //   name: "EVERGREEN TRADING INTERNATIONAL LTD.",
  //   address: "RH Home Center (6th Floor), 74/B/1, Green Road, Dhaka-1215",
  //   custom_footer: true,
  //   phone: "+88-02-44815031, +88-02-44815032, +88-02-44815033",
  //   fax: "+88-02-44815034",
  //   email: "info@evergreen-bd.com",
  //   website: "www.evergreen-bd.com",
  //   vat: "",
  //   tin: "",
  // };

  public company = {
    name: "ONE PHARMA LTD.",
    address: "One Tower, 9/4, Free School Street, Kathalbagan, Dhaka-1205",
    custom_footer: true,
    phone: "01711000000",
    fax: "+88 02 9660530",
    email: "opl.bd@onepharmaltd.com",
    website: "http://www.onepharmaltd.com/",
    vat: "13145664564",
    tin: "00000000000",
  };


  // public company = {
  //   name: "Baktabali Travels",
  //   address: "Motalib Shopping Complex, Baktabali Bazar, Fatullah, Narayanganj-1421",
  //   custom_footer: true,
  //   phone: "01777-777777",
  //   fax: "02-98765432",
  //   email: "info@com",
  //   website: "www.Baktabali.com",
  //   vat: "13145664",
  //   tin: "00000000",
  // };

  // public company = {
  //   name: "Dahmashi Corporation Ltd.",
  //   address: "Dahmashi Centre, House No. 33/A, Road No. 12, Block-H, Banani, Dhaka-1213",
  //   custom_footer: true,
  //   phone: "02-55042777",
  //   fax: "",
  //   email: "info@dahmashigroup.com",
  //   website: "https://www.dahmashigroup.com/",
  //   vat: "",
  //   tin: "",
  // };

  // public company = {
  //   name: "Madina Group",
  //   address: "Madina Square, 64/A, Dhanmondi, Dhaka 1205",
  //   custom_footer: true,
  //   phone: "+880-2-9663706,9663714",
  //   fax: "+88-02-9663721",
  //   email: "helpdesk@madina.co",
  //   website: "https://www.madina.co/",
  //   vat: "",
  //   tin: "",
  // };

  button: string = "";
  buttonClicked: any;
  headers: HttpHeaders;
  agButtonClicked: any;
  data: any;
  dataall: any;

  workbook: ExcelJS.Workbook;
  worksheet: any;
  userMenu = [{ title: "ESS Portal" }, { title: "Change Password" }, { title: "Logout" }];
  voucherMasterId: number = 0;
  currentCompany: any;


  public btnList = [
    {
      class: "btn-primary btn-sm",
      container: "success-container",
      containerTitle: "Create",
      title: "far fa-plus-square",
      value: "create",
      default: "#00d977",
      status: true,
    }, //0
    {
      class: "btn-danger btn-sm",
      container: "danger-container",
      containerTitle: "Reset",
      title: "fas fa-redo",
      value: "reset",
      default: "#ff386a",
      status: false,
    }, //1
    {
      class: "btn-success btn-sm",
      container: "danger-container",
      containerTitle: "Save",
      title: "fas fa-save",
      value: "save",
      default: "#ff386a",
      status: false,
    }, //2
    {
      class: "btn-warning btn-sm",
      container: "danger-container",
      containerTitle: "Update",
      title: "fa fa-list",
      value: "update",
      default: "#ff386a",
      status: false,
    }, //3
    {
      class: "btn-success btn-sm",
      container: "danger-container",
      containerTitle: "Approve",
      title: "fa fa-list",
      value: "approve",
      default: "#ff386a",
      status: false,
    }, //4
    {
      class: "btn-secondary btn-sm",
      container: "danger-container",
      containerTitle: "Decline",
      title: "fa fa-list",
      value: "decline",
      default: "#ff386a",
      status: false,
    }, //5
    {
      class: "btn-info btn-sm",
      container: "info-container",
      containerTitle: "Show List",
      title: "fa fa-list",
      value: "showlist",
      default: "#0088ff",
      status: false,
    }, //6
    {
      class: "btn-dark btn-sm",
      container: "info-container",
      containerTitle: "Report",
      title: "fas fa-print",
      value: "report",
      default: "#0088ff",
      status: true,
    }, //7
    {
      class: "btn-danger btn-sm",
      container: "info-container",
      containerTitle: "Info Button",
      title: "fa fa-trash",
      value: "delete",
      default: "#0088ff",
      status: true,
    }, //8
    {
      class: "btn-secondary btn-sm",
      container: "danger-container",
      containerTitle: "Danger Button",
      title: "fa fa-print",
      value: "transectionreport",
      default: "#ff386a",
      status: true,
    }, //9
    {
      class: "btn-info btn-sm",
      container: "info-container",
      containerTitle: "Info Button",
      title: "fa fa-paint-brush",
      value: "edit",
      default: "#0088ff",
      status: true,
    }, //10
    {
      class: "btn-success btn-sm",
      container: "danger-container",
      containerTitle: "Danger Button",
      title: "fa fa-eye",
      value: "view",
      default: "#ff386a",
      status: true,
    }, //11
    {
      // class: "btn-info btn-sm",
      // container: "danger-container",
      // containerTitle: "Pin Column",
      // title: "fas fa-thumbtack",
      // value: "pin",
      // default: "#ff386a",
      // status: true,
    }, //12
    {
      // class: "btn-primary btn-sm",
      // container: "danger-container",
      // containerTitle: "Unpin Column",
      // title: "fab fa-openid",
      // value: "unpin",
      // default: "#ff386a",
      // status: true,
    }, //13
    {
      class: "btn-warning btn-sm",
      container: "danger-container",
      containerTitle: "Refresh",
      title: "fas fa-redo",
      value: "refresh",
      default: "#ff386a",
      status: true,
    }, //14
    {
      class: "btn-success btn-sm",
      container: "danger-container",
      containerTitle: "Excel",//"CSV",
      title: "far fa-file-excel",
      value: "csv",
      default: "#ff386a",
      status: true,
    }, //15
    {
      class: "btn-success btn-sm",
      container: "danger-container",
      containerTitle: "Yes",
      title: "fas fa-save",
      value: "save",
      default: "#ff386a",
      status: false,
    }, //16
    {
      class: "btn-primary btn-sm",
      container: "danger-container",
      containerTitle: "Preview",
      title: "fa fa-eye",
      value: "preview",
      default: "#ff386a",
      status: false,
    }, //17 // Report Section ///
    {
      class: "btn-warning btn-sm",
      container: "danger-container",
      containerTitle: "Print",
      title: "fas fa-print",
      value: "print",
      default: "#ff386a",
      status: false,
    }, //18
    {
      class: "btn-danger btn-sm",
      container: "danger-container",
      containerTitle: "PDF",
      title: "fa fa-file",
      value: "pdf",
      default: "#ff386a",
      status: false,
    }, //19
    {
      class: "btn-info btn-sm",
      container: "danger-container",
      containerTitle: "Email",
      title: "fa fa-envelope",
      value: "email",
      default: "#ff386a",
      status: true,
    }, //20
    {
      class: "btn-warning btn-sm",
      container: "danger-container",
      containerTitle: "View Map",
      title: "fas fa-globe-asia",
      value: "viewmap",
      default: "#ff386a",
      status: true,
    }, //21
    {
      class: "btn-success btn-sm",
      container: "danger-container",
      containerTitle: "Excel",
      title: "far fa-file-excel",
      value: "excel",
      default: "#ff386a",
      status: true,
    }, //22
    {
      class: "btn-success btn-sm",
      container: "danger-container",
      containerTitle: "Files",
      title: "far fa-file",
      value: "viewfiles",
      default: "#ff386a",
      status: true,
    }, //23
  ];

  public statusAndUserRole = {
    status: ["Active", "Inactive"],
    userRole: ["Supper Admin", "Admin", "Staff"],
    transectionType: [
      {
        id: 1,
        name: "Deposite",
      },
      {
        id: 2,
        name: "Withdrow",
      },
    ],
  };

  public voucherUploadSupportedExt: string[] = [
    'pdf',
    'xlsx',
    'csv',
    'xls',
    'doc',
    'docx',
    'png',
    'jpeg',
    'jpg'
  ];

  public b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  index = 1;
  destroyByClick = true;
  duration = 5000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  preventDuplicates = false;
  types: ["primary", "success", "info", "warning", "danger"];
  title = "HI there!";
  content = `I'm cool toaster!`;

  public getUser(): any {
    this.userMenu = [];
    this.userMenu = [{ title: "Profile" }, { title: "Logout" }];
  }

  public showToast(title: string, body: string) {
    const config = {
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
  ///////////////////////////////
  public onClear(gridColumnApi: any) {
    //gridColumnApi.applyColumnState({ defaultState: { pinned: null } });
    gridColumnApi.applyColumnState({
      state: [
        {
          colId: "rowNum",
          pinned: "left",
        },
        {
          colId: "action",
          pinned: "right",
        },
      ],
      defaultState: { pinned: null },
    });
  }
  public onPin(gridColumnApi: any) {
    gridColumnApi.applyColumnState({
      state: [
        {
          colId: "rowNum",
          pinned: "left",
        },
        ,
        {
          colId: "action",
          pinned: "right",
        },
      ],
      defaultState: { pinned: null },
    });
  }
  ////////// Create For ag-grid /////////////////
  public onExportCSV(gridApi: any, pageNavigation: any) {
    var data: any = document;
    var params = {
      suppressQuotes: data.all,
      columnSeparator: data.all,
      customHeader: "One ERP\n " + pageNavigation + "\n",
      customFooter: data.all,
    };
    gridApi.exportDataAsCsv(params);
  }
  ////////// Create For ag-grid /////////////////

  //////////////////////////////
  //apiUrl: string = this.baseUrl;
  auth_token = localStorage.getItem("auth_token");

  public getHttpOptions() {
    return {
      headers: new HttpHeaders({
        // "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        auth_token: localStorage.getItem("auth_token"),
      }),
    };
  }

  public valueSet(value: any) {
    //debugger;
    if (value == "create") {
      this.btnList[0].status = false; // create
      this.btnList[1].status = true; // reset
      this.btnList[2].status = true; // save
      this.btnList[3].status = false; // update
      this.btnList[4].status = false; // approve
      this.btnList[5].status = false; // decline
      this.btnList[6].status = true; // showlist
      this.btnList[7].status = false; // report
    } else if (value == "showlist") {
      this.btnList[0].status = true; // create
      this.btnList[1].status = false; // reset
      this.btnList[2].status = false; // save
      this.btnList[3].status = false; // update
      this.btnList[4].status = false; // approve
      this.btnList[5].status = false; // decline
      this.btnList[6].status = false; // showlist
      this.btnList[7].status = true; // report
    } else if (value == "save") {
      this.btnList[0].status = true; // create
      this.btnList[1].status = false; // reset
      this.btnList[2].status = false; // save
      this.btnList[3].status = false; // update
      this.btnList[4].status = false; // approve
      this.btnList[5].status = false; // decline
      this.btnList[6].status = false; // showlist
      this.btnList[7].status = true; // report
    } else if (value == "update") {
      this.btnList[0].status = true; // create
      this.btnList[1].status = false; // reset
      this.btnList[2].status = false; // save
      this.btnList[3].status = false; // update
      this.btnList[4].status = false; // approve
      this.btnList[5].status = false; // decline
      this.btnList[6].status = false; // showlist
      this.btnList[7].status = true; // report
    } else if (value == "approve") {
      this.btnList[0].status = true; // create
      this.btnList[1].status = false; // reset
      this.btnList[2].status = false; // save
      this.btnList[3].status = false; // update
      this.btnList[4].status = false; // approve
      this.btnList[5].status = false; // decline
      this.btnList[6].status = false; // showlist
      this.btnList[7].status = true; // report
    } else if (value == "decline") {
      this.btnList[0].status = true; // create
      this.btnList[1].status = false; // reset
      this.btnList[2].status = false; // save
      this.btnList[3].status = false; // update
      this.btnList[4].status = false; // approve
      this.btnList[5].status = false; // decline
      this.btnList[6].status = false; // showlist
      this.btnList[7].status = true; // report
    } else if (value == "edit") {
      this.btnList[0].status = false; // create
      this.btnList[1].status = true; // reset
      this.btnList[2].status = false; // save
      this.btnList[3].status = true; // update
      this.btnList[4].status = false; // approve
      this.btnList[5].status = false; // decline
      this.btnList[6].status = true; // showlist
      this.btnList[7].status = false; // report
    } else if (value == "view") {
      this.btnList[0].status = false; // create
      this.btnList[1].status = false; // reset
      this.btnList[2].status = false; // save
      this.btnList[3].status = false; // update
      this.btnList[4].status = false; // approve
      this.btnList[5].status = false; // decline
      this.btnList[6].status = true; // showlist
      this.btnList[7].status = false; // report
    } else if (value == "reset") {
      this.btnList[0].status = false; // create
      this.btnList[1].status = true; // reset
      this.btnList[2].status = true; // save
      this.btnList[3].status = false; // update
      this.btnList[4].status = false; // approve
      this.btnList[5].status = false; // decline
      this.btnList[6].status = true; // showlist
      this.btnList[7].status = false; // report
    } else if (value == "rpt") {
      this.btnList[1].status = true; // reset
      this.btnList[15].status = true; // csv
      this.btnList[17].status = true; // preview
      this.btnList[18].status = true; // print
      this.btnList[19].status = true; // pdf
      this.btnList[20].status = false; // email
    } else if (value == "modalrpt") {
      this.btnList[1].status = true; // reset
      this.btnList[15].status = true; // csv
      this.btnList[17].status = false; // preview
      this.btnList[18].status = true; // print
      this.btnList[19].status = true; // pdf
      this.btnList[20].status = false; // email
    }
  }
  //////////// Excel FILE CREATE ///////////////////
  public GenerateExcelSheet(data: any, header: any, fileName: string) {
    // let data = objArray.map((item, index) => {
    //   return [index + 1, item.groupNatureId, item.natureName, item.printOrder];
    // });
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
    let headerName = this.worksheet.addRow([this.company.name]);
    headerName.font = { size: 16, underline: "double", bold: true };
    headerName.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    this.worksheet.mergeCells(
      `A${headerName.number}:${endColumn + headerName.number}`
    );

    let headerAddress = this.worksheet.addRow([this.company.address]);
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
      this.company.phone + "; " + this.company.fax,
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
      this.company.email + "; " + this.company.website,
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
  //////////// Excel FILE CREATE ///////////////////
  //////////// Excel FILE CREATE ///////////////////
  public generateExcel(objArray: any, header: any, fileName: string) {
    let data = objArray.map((item, index) => {
      return [index + 1, item.groupNatureId, item.natureName, item.printOrder];
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
    let headerName = this.worksheet.addRow([this.company.name]);
    headerName.font = { size: 16, underline: "double", bold: true };
    headerName.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    this.worksheet.mergeCells(
      `A${headerName.number}:${endColumn + headerName.number}`
    );

    let headerAddress = this.worksheet.addRow([this.company.address]);
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
      this.company.phone + "; " + this.company.fax,
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
      this.company.email + "; " + this.company.website,
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


  public GetExcel(data: any, header: any, fileName: string) {
    // let data = objArray.map((item, index) => {
    //   return [index + 1, item.productCode, item.productName, item.packSize, item.batchNo, item.mfgDate, item.expDate, item.CurrentStock, item.ttlValue];
    // });
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
    let headerName = this.worksheet.addRow([this.company.name]);
    headerName.font = { size: 16, underline: "double", bold: true };
    headerName.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    this.worksheet.mergeCells(
      `A${headerName.number}:${endColumn + headerName.number}`
    );

    let headerAddress = this.worksheet.addRow([this.company.address]);
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
      this.company.phone + "; " + this.company.fax,
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
      this.company.email + "; " + this.company.website,
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

  public currencyFormatter(currency: number = 0) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }
  public currencyFormatterAccStandard(currency: number = 0) {
    if (currency > 0) {
      var sansDec = currency.toFixed(2);
      var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return `${formatted}`;
    }
    else {
      return '-';
    }
  }
  public roundWithDecimalPoint(currency: number = 0, decimalPoint: number = 0): number {
    var res = Number(currency.toFixed(decimalPoint));
    return res;
  }


  public round(amount: number = 0): number {
    var res = Number(amount.toFixed());
    return res;
  }
  /////////////////// GET Report Data///////////////////////

  private httpOptions = this.getHttpOptions();
  public getReportData(apiUrl: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + apiUrl, this.httpOptions);
  }
  public getReportDataForDirectFile(apiUrl: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + apiUrl, {
      ...this.httpOptions,
      responseType: 'blob' as 'json' // Ensure 'blob' is specified here
    });
  }
  public getApiData(apiUrl: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + apiUrl, this.httpOptions);
  }
  public postApiData(apiUrl: string, body: any): Observable<any> {
    this.httpOptions = this.getHttpOptions();
    return this.http.post<any>(this.baseUrl + apiUrl, body, this.httpOptions);
  }
  public getEmployeeWiseLeaveReportData(apiUrl: string): Observable<any> {
    return this.http.get<any>(this.baseReportUrl + apiUrl, this.getHttpOptions());
  }
  public GetFfmApiData(apiUrl: string): Observable<any> {
    return this.http.get<any>(this.fieldForceGlobalUrl + apiUrl, this.httpOptions);
  }
  public GetCrystalReportData(apiUrl: string): Observable<any> {
    return this.http.get<any>(this.baseReportUrl + apiUrl, this.httpOptions);
  }
  public GetCrystalReportDataByPost(apiUrl: string, bodyData: any): Observable<string> {
    return this.http.post<string>(
      `${this.baseReportUrl}${apiUrl}`, bodyData,
      this.httpOptions
    );
  }
  public GetCrystalReportJsonResponse(apiUrl: string): Observable<any> {
    return this.http.get<any>(this.baseReportUrl + apiUrl, this.httpOptions);
  }
  /////////////////// END OF GET Report Data///////////////////////

  //////////// PDF FILE CREATE OR DOWNLOAD ///////////////////
  public generateReport(buttonAction: any, fileName: string, content: any) {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(5); //optional
    doc.setTextColor(40); //optional
    const legend = {
      height: 100,
    };
    const addFooters = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      //var a = doc.internal.setFont("helvetica", "italic");
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
    //debugger;
    doc.html(content, {
      callback: function (doc) {
        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 20,
          styles: { font: "Meta" },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 150,
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
            valign: "middle",
          },
          alternateRowStyles: {
            fillColor: [250, 250, 250],
          },
        });
        //debugger;
        autoTable(doc, {
          html: "#bodyvoucher_table",
          startY: legend.height + 50,
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
  getImages(imagePaths: string[]): Observable<Blob[]> {
    debugger;
    var a = this.baseUrl + imagePaths[0];
    return forkJoin(imagePaths.map(imagePath =>
      this.http.get("http://localhost:8099/api/" + imagePath, { responseType: 'blob' })
    ));
  }
  public generateCurrentStockReport(buttonAction: any, fileName: string, content: any) {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(5); //optional
    doc.setTextColor(40); //optional
    const legend = {
      height: 100,
    };
    const addFooters = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      //var a = doc.internal.setFont("helvetica", "italic");
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
    //debugger;
    doc.html(content, {
      callback: function (doc) {
        autoTable(doc, {
          html: "#header_table_top",
          startY: legend.height + 20,
          styles: { font: "Meta", fontSize: 15, halign: "center" },
          bodyStyles: {
            fillColor: [250, 250, 250],
            textColor: 0,
          },
          alternateRowStyles: {
            fillColor: [250, 250, 250],
            textColor: 0,
          },
        });
        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 70,
          styles: { font: "Meta" },
          bodyStyles: {
            fillColor: [250, 250, 250],
            textColor: 0,
          },
          alternateRowStyles: {
            fillColor: [250, 250, 250],
            textColor: 0,
          },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 150,
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
            fontSize: 11,
            fillColor: [250, 250, 250],
          },
          bodyStyles: {
            fillColor: [250, 250, 250],
            textColor: 0,
            valign: "middle",
          },
          alternateRowStyles: {
            fillColor: [250, 250, 250],
            textColor: 0,
            valign: "middle",
          },
          columnStyles: {
            7: { halign: "right" },
            8: { halign: "right" },

          },
        });
        //debugger;
        autoTable(doc, {
          html: "#bodyvoucher_table",
          startY: legend.height + 50,
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
  public generatePurchaeSummaryReport(
    buttonAction: any,
    fileName: string,
    content: any
    //,address: []
  ) {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(5); //optional
    doc.setTextColor(50); //optional
    const legend = {
      height: 100,
    };
    const addFooters = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      //var a = doc.internal.setFont("helvetica", "italic");
      doc.setFontSize(8);
      //debugger;
      for (var i = 1; i <= pageCount; i++) {
        // let addressLength = address.length;
        // for (var i = 1; i <= addressLength; i++) {
        //   console.log(address[i]["branchAddress"]);
        // }

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
    //debugger;
    doc.html(content, {
      callback: function (doc) {
        autoTable(doc, {
          html: "#header_tableSummary",
          startY: legend.height + 20,
          styles: { font: "Meta" },
          headStyles: {
            halign: "center",
            valign: "top",
            fontStyle: "bold",
            textColor: 50,
            fontSize: 20,
            fillColor: [255, 255, 255],
          },
        });

        autoTable(doc, {
          html: "#body_tableSummary",
          startY: legend.height + 130,
          theme: "grid",
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.75,
          styles: {
            font: "Meta",
            lineColor: [44, 62, 80],
            lineWidth: 0.55,
          },
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
            fontSize: 11,
          },
          bodyStyles: {
            //fillColor: [216, 216, 216],
            textColor: 50,
            valign: "middle",
          },
          columnStyles: {
            6: { halign: "right" },
          },
          alternateRowStyles: {
            //fillColor: [250, 250, 250],
          },
        });

        addFooters(doc);

        ////////////PRINT ////////////
        if (buttonAction == "pdf") {
          doc.save(fileName);
        } else {
          doc.setProperties({
            title: fileName,
          });
          window.open(URL.createObjectURL(doc.output("blob")), "_blank"); //doc.output("dataurlnewwindow");
          doc.close();
        }
      },
    });
  }

  public generateSalesReport(
    buttonAction: any,
    fileName: string,
    content: any
    //,address: []
  ) {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(5); //optional
    doc.setTextColor(50); //optional
    const legend = {
      height: 100,
    };
    const addFooters = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      //var a = doc.internal.setFont("helvetica", "italic");
      doc.setFontSize(8);
      //debugger;
      for (var i = 1; i <= pageCount; i++) {
        // let addressLength = address.length;
        // for (var i = 1; i <= addressLength; i++) {
        //   console.log(address[i]["branchAddress"]);
        // }

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
    //debugger;
    doc.html(content, {
      callback: function (doc) {
        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 20,
          styles: { font: "Meta" },
          headStyles: {
            halign: "center",
            valign: "top",
            fontStyle: "bold",
            textColor: 50,
            fontSize: 16,
            fillColor: [255, 255, 255],
          },
          alternateRowStyles: {
            //fillColor: [250, 250, 250],
          },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 130,
          theme: "grid",
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.75,
          styles: {
            font: "Meta",
            lineColor: [44, 62, 80],
            lineWidth: 0.55,
          },
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
            fontSize: 11,
          },
          bodyStyles: {
            //fillColor: [216, 216, 216],
            textColor: 50,
            valign: "middle",
          },
          columnStyles: {
            2: { halign: "center" },
            4: { halign: "center" },
            5: { halign: "right" },
            6: { halign: "right" },
            7: { halign: "right" },
            8: { halign: "right" },
            9: { halign: "right" },
            10: { halign: "right" },
          },
          alternateRowStyles: {
            //fillColor: [250, 250, 250],
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
  public generateSalesSerialNoReport(
    buttonAction: any,
    fileName: string,
    content: any
  ) {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(5); //optional
    doc.setTextColor(40); //optional
    const legend = {
      height: 100,
    };
    const addFooters = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      //var a = doc.internal.setFont("helvetica", "italic");
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
    //debugger;
    doc.html(content, {
      callback: function (doc) {
        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 20,
          styles: { font: "Meta" },
          headStyles: {
            halign: "center",
            valign: "top",
            fontStyle: "bold",
            textColor: 50,
            fontSize: 20,
            fillColor: [250, 250, 250],
          },
          alternateRowStyles: {
            fillColor: [250, 250, 250],
          },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 130,
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
          columnStyles: {
            2: { halign: "center" },
            4: { halign: "right" },
            5: { halign: "center" },
            6: { halign: "right" },
            7: { halign: "right" },
            8: { halign: "right" },
            9: { halign: "right" },
            10: { halign: "right" },
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

  public generateChallanReport(
    buttonAction: any,
    fileName: string,
    content: any
  ) {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(5); //optional
    doc.setTextColor(40); //optional
    const legend = {
      height: 100,
    };
    const addFooters = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      //var a = doc.internal.setFont("helvetica", "italic");
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
    //debugger;
    doc.html(content, {
      callback: function (doc) {
        autoTable(doc, {
          html: "#header_table_challan",
          startY: legend.height + 20,
          styles: { font: "Meta" },
          headStyles: {
            halign: "center",
            valign: "top",
            fontStyle: "bold",
            textColor: 50,
            fontSize: 20,
            fillColor: [250, 250, 250],
          },
          alternateRowStyles: {
            fillColor: [250, 250, 250],
          },
        });

        autoTable(doc, {
          html: "#body_table_challan",
          startY: legend.height + 130,
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
            fillColor: [250, 250, 250],
            textColor: 50,
            valign: "middle",
          },
          columnStyles: {
            3: { halign: "center" },
            4: { halign: "center" },
            5: { halign: "center" },
          },
          alternateRowStyles: {
            fillColor: [250, 250, 250],
          },
        });

        autoTable(doc, {
          html: "#footer_table",
          startY: legend.height + 450,
          theme: "grid",
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.75,
          styles: {
            font: "Meta",
            //lineColor: [44, 62, 80],
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

          columnStyles: {
            1: { halign: "right" },
          },

          alternateRowStyles: {
            fillColor: [250, 250, 250],
          },
        });

        autoTable(doc, {
          html: "#footer_table_2",
          startY: legend.height + 550,
          theme: "grid",
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.75,
          styles: {
            font: "Meta",
            //lineColor: [44, 62, 80],
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

          columnStyles: {
            0: { halign: "center" },
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

  public generatePadSalesReport(
    buttonAction: any,
    fileName: string,
    content: any
  ) {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(5); //optional
    doc.setTextColor(40); //optional
    const legend = {
      height: 100,
    };
    const addFooters = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      //var a = doc.internal.setFont("helvetica", "italic");
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
    //debugger;
    doc.html(content, {
      callback: function (doc) {
        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 20,
          styles: { font: "Meta" },
          headStyles: {
            halign: "center",
            valign: "top",
            fontStyle: "bold",
            textColor: 50,
            fontSize: 20,
            fillColor: [250, 250, 250],
          },
          alternateRowStyles: {
            fillColor: [250, 250, 250],
          },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 130,
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
            fillColor: [250, 250, 250],
            textColor: 50,
            valign: "middle",
          },
          columnStyles: {
            2: { halign: "center" },
            4: { halign: "right" },
            5: { halign: "center" },
            6: { halign: "right" },
            7: { halign: "right" },
            8: { halign: "right" },
            9: { halign: "right" },
            10: { halign: "right" },
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

  //imageIndex: number;
  public generateSalesReportWithImage(
    buttonAction: any,
    fileName: string,
    content: any,
    columnIndex: any,
    bodyData: any
  ) {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(5); //optional
    doc.setTextColor(40); //optional
    const legend = {
      height: 100,
    };
    const addFooters = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      //var a = doc.internal.setFont("helvetica", "italic");
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
    var imageIndex: Number = 0;
    doc.html(content, {
      callback: function (doc) {
        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 20,
          styles: { font: "Meta" },
          headStyles: {
            halign: "center",
            valign: "top",
            fontStyle: "bold",
            textColor: 50,
            fontSize: 20,
            fillColor: [216, 216, 216],
          },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 130,
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
            valign: "middle",
          },
          alternateRowStyles: {
            fillColor: [250, 250, 250],
          },

          // didDrawCell: function (data) {

          //   console.log(doc);
          //   console.log(document.getElementsByName("#body_table"));
          //   if (data.column.index === columnIndex && data.cell.section === 'body') {
          //     // var td = data.cell.raw;
          //     //// var list = document.getElementsByTagName("img")[0];
          //     // var img = td.getElementsByTagName('img')[0];
          //     // console.log(list);
          //     // console.log(img);
          //     // //var img = td[]
          //     // var dim = data.cell.height - data.cell.padding('vertical');
          //     // var textPos = data.cell.getTextPos;
          //     // //doc.addImage(img.src, textPos.x, textPos.y, dim, dim);
          //   }
          // }

          didDrawCell: (data) => {
            //console.log(data);
            //let run: boolean;
            //this.run = true;
            if (
              data.column.index === columnIndex &&
              data.cell.section === "body"
            ) {
              //debugger;
              // console.log(data);
              var td = data.cell.raw;
              console.log(td.valueOf());
              // Array.from(td.toString()).forEach((row, idx) => {
              //   console.log(row);
              // });

              // const table: HTMLTableElement = document.querySelector('#tableID');

              //var img = imgElements[data.row.index];

              // for (let i = 0; i < bodyData.length; i++) {
              //   const id = "#imageFile" + i;
              //   console.log(id);
              //   var res = document.getElementById(id).innerHTML;
              //   console.log(res);
              // };

              //let vv: string;
              //this.vv = td.valueOf();
              //console.log(this.vv.replace("<td _ngcontent-dqv-c452><img _ngcontent-dqv-c452 id=\"imageFile\" style=\"height: 100px;\" src=\"", "").replace("></td>", "").toString());
              // var img = bodyData[0].imageFile;
              // doc.addImage(img, data.cell.x + 1, data.cell.y + 2, 30, 30);
              // var img2 = bodyData[1].imageFile;
              // doc.addImage(img2, data.cell.x + 1, data.cell.y + 2, 30, 30);
              //this.i++;

              //console.log(td.valueOf().toString().replace("<td _ngcontent-dqv-c452><img _ngcontent-dqv-c452 id=\"imageFile\" style=\"height: 100px;\" src=\"", "").replace("></td>", "").toString());

              //const img2 = document.getElementById('#imageFile')[0];

              // img1: String;
              // this.img1 = td.valueOf().toString().replace("<td _ngcontent-dqv-c452><img _ngcontent-dqv-c452 id=\"imageFile\" style=\"height: 100px;\" src=\"", "").replace("></td>", "").toString();

              // console.log(this.img1);

              // let td3 = td;
              // const img1 = td3.
              // let td2 = document.querySelectorAll("#body_table td");
              // //debugger;
              // for (let i = 0; i < td2.length; i++) {
              //   if (td2[i].hasChildNodes() === true && (i == 2 || i == 12)) {

              //     if (td2[i].childNodes[0] !== undefined)
              //       console.log(td2[i].childNodes[0]);
              //     doc.addImage(td2[i].innerHTML, data.cell.x + 1, data.cell.y + 2, 30, 30);

              //   }
              // }

              //console.log(td);

              // @ViewChild('img') element;
              // var getChecked = () => {
              //   console.log(this.elem.nativeElement.getElementsByTagName('input'));
              //   console.log(this.elem.nativeElement.querySelectorAll('input'));
              // }

              // const img1 = td;
              // console.log(td);

              //const td2 = data.cell.raw;

              // //console.log(data.cell);
              // //if (this.run == true) {
              // bodyData.forEach(element => {
              //   var img = element.imageFile;
              //   doc.addImage(img, data.cell.x + 1, data.cell.y + 2, 30, 30);
              // });
              // this.run = false;
              //}

              // const img1 = document.getElementsByTagName('img')[1];

              // //const img0 = document.getElementsByTagName('img')[0];
              // //const img2 = document.getElementsByTagName('img')[2];

              // //let dim = data.cell.height - data.cell.padding('vertical');
              // //let textPos = data.cell.textPos;

              //doc.addImage(img2, data.cell.x + 1, data.cell.y + 2, 30, 30);
              // console.log(this.i);
              // this.i++;
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

  //MOSTAFA
  public generateSalesReportWithImage2(
    buttonAction: any,
    fileName: string,
    content: any,
    columnIndex: any,
    imageIndex: number,
    bodyData: any[]
  ) {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(5); //optional
    doc.setTextColor(40); //optional
    const legend = {
      height: 100,
    };
    const addFooters = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      //var a = doc.internal.setFont("helvetica", "italic");
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
          html: "#header_table",
          startY: legend.height + 20,
          styles: { font: "Meta" },
          headStyles: {
            halign: "center",
            valign: "top",
            fontStyle: "bold",
            textColor: 50,
            fontSize: 20,
            fillColor: [216, 216, 216],
          },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 160,
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
            valign: "middle",
          },
          columnStyles: {
            4: { halign: "right" },
            5: { halign: "right" },
            6: { halign: "right" },
            7: { halign: "right" },
            8: { halign: "right" },
            9: { halign: "right" },
          },
          alternateRowStyles: {
            fillColor: [250, 250, 250],
          },

          didDrawCell: (data) => {
            if (
              data.column.index === columnIndex &&
              data.cell.section === "body"
            ) {
              ////debugger;
              // console.log(data);
              var td = data.cell.raw;
              console.log(td);

              //console.log(imageIndex);
              if (bodyData.length > 0) {
                if (bodyData[imageIndex].imageFile != "") {
                  var img = bodyData[imageIndex].imageFile;
                  //console.log(img);
                  doc.addImage(img, data.cell.x + 1, data.cell.y + 2, 30, 30);
                }
              }
              imageIndex++;
              // console.log(imageIndex);
            }
          },
        });

        autoTable(doc, {
          html: "#footer_table",
          startY: legend.height + 450,
          theme: "grid",
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.75,
          styles: {
            font: "Meta",
            //lineColor: [44, 62, 80],
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

          columnStyles: {
            0: { halign: "left" },
          },

          alternateRowStyles: {
            fillColor: [250, 250, 250],
          },
        });

        autoTable(doc, {
          html: "#footer_table_2",
          startY: legend.height + 500,
          theme: "grid",
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.75,
          styles: {
            font: "Meta",
            //lineColor: [44, 62, 80],
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

          columnStyles: {
            0: { halign: "left" },
          },

          alternateRowStyles: {
            fillColor: [250, 250, 250],
          },
        });

        autoTable(doc, {
          html: "#footer_table_3",
          startY: legend.height + 550,
          theme: "grid",
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.75,
          styles: {
            font: "Meta",
            //lineColor: [44, 62, 80],
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

          columnStyles: {
            0: { halign: "left" },
          },

          alternateRowStyles: {
            fillColor: [250, 250, 250],
          },
        });

        autoTable(doc, {
          html: "#footer_table_4",
          startY: legend.height + 600,
          theme: "grid",
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.75,
          styles: {
            font: "Meta",
            //lineColor: [44, 62, 80],
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

          columnStyles: {
            0: { halign: "left" },
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


  //#region MOSTAFA

  public GenerateBase64ToReport(base64string: string, fileType: any = 'pdf') {
    //debugger;

    var blob = this.convertBase64ToBlob(base64string);
    window.open(URL.createObjectURL(blob), "_blank"); //doc.output("dataurlnewwindow");

    // if (fileType != '') {
    //   var blob = this.convertBase64ToBlob(base64string);
    //   blob.name = "";
    //   window.open(URL.createObjectURL(blob), "_blank", "Report"); //doc.output("dataurlnewwindow");
    // }
    // else {
    //   var blob = this.convertBase64ToBlob(base64string);
    //   window.open(URL.createObjectURL(blob), "_blank"); //doc.output("dataurlnewwindow");
    // }

  }

  private convertBase64ToBlob(base64Image: string) {
    // Split into two parts
    const parts = base64Image.split(";base64,");
    // Hold the content type
    const contentType = parts[0].split(":")[1];
    // Decode Base64 string
    const decodedData = window.atob(parts[1]);
    // Create UNIT8ARRAY of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length);
    // Insert all character code into uInt8Array
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }
    // Return BLOB image after conversion
    return new Blob([uInt8Array], { type: contentType });
  }

  // GetCount(objData: Object, key: KeyObject, character) {

  //   return objData.filter(obj => obj.key === character).length;
  // }


  public ConvertObjectToAnArray(obj: []) {
    // need some change
    let dataArray = obj.map((row, ri) => {
      let datax = [];
      let dataxx = [];
      //debugger;
      datax = Object.values(row);
      let i = datax.length;
      let j = 0;
      while (j < i) {
        if (j == 0) {
          dataxx.push(datax[j]);
        }
        else {
          let amount = datax[j];
          dataxx.push(this.currencyFormatter(amount));
        }
        j = j + 1;
      }
      return dataxx;
    });
    return dataArray
  }

  // public GenerateByteArrayToReport(byteArray: any, contentType:string) {
  //   var blob = new Blob([byteArray], { type: contentType });
  //   window.open(URL.createObjectURL(blob), "_blank"); //doc.output("dataurlnewwindow");
  // }

  // Base64ToBlob = (base64string, contentType = "application/pdf") => {
  //   const byteCharacters = atob(base64string);
  //   const byteNumbers = new Array(byteCharacters.length);
  //   for (let i = 0; i < byteCharacters.length; i++) {
  //     byteNumbers[i] = byteCharacters.charCodeAt(i);
  //   }
  //   const byteArray = new Uint8Array(byteNumbers);
  //   const blob = new Blob([byteArray], { type: "audio/mp3" });
  // };



  public GenerateReport(
    fileName: string,
    reportFormat: any,
    orientation: any,
    content: any
  ) {
    const doc = new jsPDF(orientation, "pt", "a4");
    doc.setFontSize(5); //optional
    doc.setTextColor(50); //optional
    const legend = {
      height: 100,
    };
    const addFooters = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      //var a = doc.internal.setFont("helvetica", "italic");
      doc.setFontSize(8);
      //debugger;
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
          this.DateFormat(new Date(), 'dd-MMM-yyyy') +// new Date().toLocaleDateString() +
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
          html: "#header_table",
          startY: legend.height + 50,
          styles: { font: "Meta", fontSize: 11 },
          headStyles: {
            halign: "center",
            valign: "top",
            fontStyle: "bold",
            textColor: 50,
            //fontSize: 20,
            fillColor: [255, 255, 255],
          },
          bodyStyles: {
            //fillColor: [216, 216, 216],
            textColor: 50,
            valign: "middle",
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 75,
          theme: "grid",
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.75,

          styles: {
            font: "Meta",
            lineColor: [44, 62, 80],
            lineWidth: 0.55,
          },
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
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
          alternateRowStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
          //columnStyles: {
          // 4: { halign: "right" },
          // 5: { halign: "right" },
          // 6: { halign: "right" },
          // 7: { halign: "right" },
          // 8: { halign: "right" },
          // 9: { halign: "right" },
          //},
        });

        addFooters(doc);

        ////////////PRINT ////////////
        if (reportFormat == "pdf") {
          doc.save(fileName);
        } else {
          window.open(URL.createObjectURL(doc.output("blob")), "_blank");
          doc.close();
        }
      },
    });
  }

  public GenerateCSV(
    cellDataArray: any,
    cellHeaderList: any,
    fileName: string,
    headerParams: any = [],
    summaryData: any = []
  ) {
    //debugger;
    //console.log(objArray);
    let data = cellDataArray;
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
    var count = cellHeaderList.length;
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
    let headerName = this.worksheet.addRow([this.company.name]);
    headerName.font = { size: 16, underline: "double", bold: true };
    headerName.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    this.worksheet.mergeCells(
      `A${headerName.number}:${endColumn + headerName.number}`
    );

    let headerAddress = this.worksheet.addRow([this.company.address]);
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
      this.company.phone + "; " + this.company.fax,
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
      this.company.email + "; " + this.company.website,
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


    let rptName = this.worksheet.addRow([
      fileName,
    ]);
    rptName.font = { size: 13, bold: true };
    rptName.alignment = {
      vertical: "middle",
      horizontal: "center",
      //wrapText: true,
    };
    this.worksheet.mergeCells(
      `A${rptName.number}:${endColumn + rptName.number}`
    );

    //headerParams
    if (headerParams.length > 0) {
      this.worksheet.addRow([]);
      this.worksheet.addRows(headerParams);
    }

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
    var tableHeaderRow = this.worksheet.addRow(cellHeaderList);
    cellHeaderList.map((item, index) => {
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

    //summaryData
    if (summaryData.length > 0) {
      this.worksheet.addRows(summaryData);
      this.worksheet.addRow([]);
    }


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

  public GenerateCSVWithoutPhoneWebsite(
    cellDataArray: any,
    cellHeaderList: any,
    fileName: string,
    headerParams: any = [],
    summaryData: any = []
  ) {
    //debugger;
    //console.log(objArray);
    let data = cellDataArray;
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
    var count = cellHeaderList.length;
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
    let headerName = this.worksheet.addRow([this.company.name]);
    headerName.font = { size: 16, underline: "double", bold: true };
    headerName.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    this.worksheet.mergeCells(
      `A${headerName.number}:${endColumn + headerName.number}`
    );

    let headerAddress = this.worksheet.addRow([this.company.address]);
    headerAddress.font = { size: 10 };
    headerAddress.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    this.worksheet.mergeCells(
      `A${headerAddress.number}:${endColumn + headerAddress.number}`
    );

    // let headerPhone = this.worksheet.addRow([
    //   this.company.phone + "; " + this.company.fax,
    // ]);
    // headerPhone.font = { size: 10 };
    // headerPhone.alignment = {
    //   vertical: "middle",
    //   horizontal: "center",
    //   wrapText: true,
    // };
    // this.worksheet.mergeCells(
    //   `A${headerPhone.number}:${endColumn + headerPhone.number}`
    // );

    // let headerWebsite = this.worksheet.addRow([
    //   this.company.email + "; " + this.company.website,
    // ]);
    // headerWebsite.font = { size: 10 };
    // headerWebsite.alignment = {
    //   vertical: "middle",
    //   horizontal: "center",
    //   wrapText: true,
    // };
    // this.worksheet.mergeCells(
    //   `A${headerWebsite.number}:${endColumn + headerWebsite.number}`
    // );


    let rptName = this.worksheet.addRow([
      fileName,
    ]);
    rptName.font = { size: 13, bold: true };
    rptName.alignment = {
      vertical: "middle",
      horizontal: "center",
      //wrapText: true,
    };
    this.worksheet.mergeCells(
      `A${rptName.number}:${endColumn + rptName.number}`
    );

    //headerParams
    if (headerParams.length > 0) {
      this.worksheet.addRow([]);
      this.worksheet.addRows(headerParams);
    }

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
    var tableHeaderRow = this.worksheet.addRow(cellHeaderList);
    cellHeaderList.map((item, index) => {
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

    //summaryData
    if (summaryData.length > 0) {
      this.worksheet.addRows(summaryData);
      this.worksheet.addRow([]);
    }


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


  public generateGrosReturnReportPdf(
    buttonAction: any,
    fileName: string,
    content: any,
    datalength: number
  ) {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(5); //optional
    doc.setTextColor(40); //optional

    var legend = {
      height: 60,
      totalheight: 60 + datalength,
    };
    debugger;
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
          startY: legend.height + 40,
          styles: { font: "Meta", fontSize: 15, halign: "center" },
          bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });
        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 90,
          styles: { font: "Meta" },
          bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });
        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 170,
          theme: "grid",
          // tableLineColor: [0, 0, 0],
          // tableLineWidth: 0.75,
          styles: {
            font: "Meta",
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
            fillColor: [255, 255, 255],
            textColor: 50,
          },
          columnStyles: {
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });

        autoTable(doc, {
          html: "#body_table1",
          startY: legend.height + 380,
          theme: "grid",
          // tableLineColor: [0, 0, 0],
          // tableLineWidth: 0.75,
          styles: {
            font: "Meta",
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
            fillColor: [255, 255, 255],
            textColor: 50,
          },
          columnStyles: {
            3: { halign: "right" },
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });

        autoTable(doc, {
          html: "#table_signature",
          startY: legend.height + 520,
          styles: { font: "Meta", fontSize: 11, halign: "center" },
          bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });

        autoTable(doc, {
          html: "#footer_table",
          //startY: legend.totalheight + 300,
          theme: "grid",
          // tableLineColor: [0, 0, 0],
          // tableLineWidth: 0.75,
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
            fillColor: [255, 255, 255],
            textColor: 50,
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
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

  DateFormat(anyDate: Date, strFormat: string = 'yyyy-MM-dd'): any {
    const utcDate = this.dp.transform(anyDate, strFormat);
    return utcDate;
  }

  GetMonthAndYear(anyDate: Date, strFormat: string = 'MMM-yyyy'): any {
    const utcDate = this.dp.transform(anyDate, strFormat);
    return utcDate;
  }

  GetAnyMonthAndDateOfYear(month: number = 0, day: number = 1,): any {
    let date = new Date();
    let CustomDate = new Date();
    if (month >= 0)
      CustomDate = new Date(date.getFullYear(), date.getMonth() - month, day);
    else
      CustomDate = new Date(date.getFullYear(), date.getMonth() + month, day);
    return CustomDate;
  }

  GetFirstDateOfMonth(anyDate: Date): any {
    let date = new Date(anyDate);
    //var firstDay = new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    return firstDay;
  }

  GetLastDateOfMonth(anyDate: Date): any {
    let date = new Date(anyDate);
    //var lastDay = new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0));
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return lastDay;
  }

  GetValueCountOfObjArray(objArray: any = [], objPropertyName: any, valueToCount: any) {
    let count = objArray.filter(obj => obj[objPropertyName] === valueToCount).length;
    return count;
  }

  GetAllMonths(): any {
    let monthsList = [{ monthId: 1, monthName: 'January' }, { monthId: 2, monthName: 'February' }, { monthId: 3, monthName: 'March' }, { monthId: 4, monthName: 'April' }, { monthId: 5, monthName: 'May' }, { monthId: 6, monthName: 'Jun' }, { monthId: 7, monthName: 'July' }, { monthId: 8, monthName: 'August' }, { monthId: 9, monthName: 'September' }, { monthId: 10, monthName: 'October' }, { monthId: 11, monthName: 'November' }, { monthId: 12, monthName: 'December' },];

    let months = monthsList.map((val) => ({
      id: val.monthId,
      name: val.monthName,
    }));

    return months;
  }

  validateDates(fromDate: Date, toDate: Date): boolean {
    const fromDateTime = fromDate.setHours(0, 0, 0, 0);
    const toDateTime = toDate.setHours(0, 0, 0, 0);
    return !(toDateTime < fromDateTime);
  }

  ConnectionString: any = {
    baseUrl: "",
    baseReportUrl: "",
    fieldForceGlobalUrl: "",
  }
  isLocal = "";
  private GetConnectionString(hostName: any) {
    this.httpOptions = this.getHttpOptions();
    this.isLocal = "";
    let base_IP_Address = 'http://103.106.236.93';

    switch (hostName) {

      case 'Save_Pharma_9175': {
        this.ConnectionString = {
          baseUrl: base_IP_Address + ":9174/api/",
          fieldForceGlobalUrl: base_IP_Address + ":9174/global/api/",
          baseReportUrl: base_IP_Address + ":9173/api/",
        }
        break;
      }
      case 'All_IT_9104': {
        this.ConnectionString = {
          baseUrl: base_IP_Address + ":9103/api/",
          baseReportUrl: base_IP_Address + ":9117/api/",
          fieldForceGlobalUrl: base_IP_Address + ":9103/global/api/",
        }
        break;
      }
      case 'Dhamashi_8099': {
        this.ConnectionString = {
          baseUrl: "http://103.17.37.98:8099/api/",
          baseReportUrl: "http://103.17.37.98:55536/api/",
          fieldForceGlobalUrl: "http://103.17.37.98:8099/global/api/",
        }
        break;
      }
      case 'Development': {
        this.isLocal = "local";
        this.ConnectionString = {
          baseUrl: "http://localhost:8099/api/",
          baseReportUrl: "http://localhost:55536/api/",
          fieldForceGlobalUrl: "http://localhost:8099/global/api/",
        }
        break;
      }
      case 'Evergreen_9112': {
        this.ConnectionString = {
          baseUrl: base_IP_Address + ":9111/api/",
          baseReportUrl: base_IP_Address + ":9151/api/",
          fieldForceGlobalUrl: base_IP_Address + ":9111/global/api/",
        }
        break;
      }
      case 'Larsen_9102': {
        this.ConnectionString = {
          baseUrl: base_IP_Address + ":9101/api/",
          baseReportUrl: base_IP_Address + ":9120/api/",
          fieldForceGlobalUrl: base_IP_Address + ":9101/global/api/",

        }
        break;
      }
      case 'NACL_8090': {
        this.ConnectionString = {
          baseUrl: base_IP_Address + ":8091/api/",
          baseReportUrl: base_IP_Address + ":8092/api/",
          fieldForceGlobalUrl: base_IP_Address + ":8091/global/api/",
        }
        break;
      }
      case 'OneErp_Demo_4200': {
        this.ConnectionString = {
          baseUrl: base_IP_Address + ":8099/api/",
          baseReportUrl: base_IP_Address + ":9119/api/",
          fieldForceGlobalUrl: base_IP_Address + ":8099/global/api/",
        }
        break;
      }
      case 'OneIct_8201': {
        this.ConnectionString = {
          baseUrl: base_IP_Address + ":8200/api/",
          baseReportUrl: base_IP_Address + ":9153/api/",
          fieldForceGlobalUrl: base_IP_Address + ":8200/global/api/",
        }
        break;
      }
      case 'One_Pharma_9116': {
        this.ConnectionString = {
          baseUrl: base_IP_Address + ":9115/api/",
          baseReportUrl: base_IP_Address + ":9152/api/",
          fieldForceGlobalUrl: base_IP_Address + ":9115/global/api/",
        }
        break;
      }
      case 'DMBumper_9246': {
        this.ConnectionString = {
          baseUrl: base_IP_Address + ":9247/api/",
          baseReportUrl: base_IP_Address + ":9248/api/",
          fieldForceGlobalUrl: base_IP_Address + ":9247/global/api/",
        }
        break;
      }
      case 'One_Pharma_AH_9155': {
        this.ConnectionString = {
          baseUrl: base_IP_Address + ":9154/api/",
          baseReportUrl: base_IP_Address + ":9156/api/",
          fieldForceGlobalUrl: base_IP_Address + ":9154/global/api/",
        }
        break;
      }
      case 'No_Chinta_9108': {
        this.ConnectionString = {
          baseUrl: base_IP_Address + ":9107/api/",
          baseReportUrl: base_IP_Address + ":9150/api/",
          fieldForceGlobalUrl: base_IP_Address + ":9107/global/api/",
        }
        break;
      }
      case 'One_ERP_Demo_9205': {
        this.ConnectionString = {
          baseUrl: base_IP_Address + ":9204/api/",
          baseReportUrl: base_IP_Address + ":9206/api/",
          fieldForceGlobalUrl: base_IP_Address + ":9204/global/api/",
        }
        break;
      }
      default: {
        this.isLocal = "local";
        this.ConnectionString = {
          baseUrl: "http://localhost:8099/api/",
          baseReportUrl: "http://localhost:55536/api/",
          fieldForceGlobalUrl: "http://localhost:8099/global/api/",
        }
        break;
      }
    }
    this.baseUrl = this.ConnectionString.baseUrl;
    this.baseReportUrl = this.ConnectionString.baseReportUrl;
    this.fieldForceGlobalUrl = this.ConnectionString.fieldForceGlobalUrl;

    //this.getServerDateTime();
  }

  //#region MOSTAFA


  //////////// END OF PDF FILE CREATE OR DOWNLOAD ////////////

  //////////////// set Local Storage ////////////////////

  public setLocalStorage(returns: any) {
    localStorage.clear();
    var userName = returns.userName.split("@");
    localStorage.setItem("auth_token", returns.auth_token);
    localStorage.setItem("user_name", returns.userName);
    localStorage.setItem("userName", userName[0]);
    localStorage.setItem("isLogin", "true");
    localStorage.setItem("company", returns.profile.data);
    localStorage.setItem("profile", returns.profile.data);
    this.httpOptions = this.getHttpOptions();
  }

  public setCurrentCompany(companyId: string) {
    //debugger;
    localStorage.setItem("currentCompany", companyId);
  }
  public getCurrentCompany() {
    return localStorage.getItem("currentCompany");
  }
  public setCurrentTheme(themeName: string) {
    localStorage.setItem("currentTheme", themeName);
  }
  public getCurrentTheme() {
    return localStorage.getItem("currentTheme");
  }
  public setTempToken(tempToken: string) {
    localStorage.setItem("tat", tempToken);
  }
  public clearTempToken() {
    localStorage.removeItem("tat");
  }
  public setUserGroup(UserGroupId: string) {
    localStorage.setItem("gId", UserGroupId);
  }
  public getUserGroup() {
    return localStorage.getItem("gId");
  }
  public GetUserProfile() {
    return localStorage.getItem("profile");
  }
  public GetUserProfileJson() {
    return JSON.parse(localStorage.getItem("profile"));
  }
  public GetUserInfo(keyName: any) {
    return localStorage.getItem(`${keyName}`);
  }
  ///////////////// end of set Local Storage ///////////////////


  roundToDigit(num: number, places: number) {
    debugger
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };

  public ConsoleLog(param: any) {
    if (this.isLocal == "local")
      console.log(`${param}`, param)
  }
  IsValidNumber(item: number): boolean {
    return item != null || item != undefined || item != 0 ? true : false;
  }
  IsValidString(item: string): boolean {
    return item != null || item != undefined || item != '' ? true : false;
  }

  findDuplicates(array: any[], property: string) {
    return array.filter((item, index, self) =>
      self.findIndex(i => i[property] === item[property]) !== index
    );
  }

  isValidBdMobileLocal(input: string): boolean {
    // const clean = input.replace(/\s|-/g, ''); // remove spaces/dashes
    const clean = input.replace(/[\s,-]/g, '');
    return this.bdLocalRegex.test(clean);
  }

}

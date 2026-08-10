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
import { CommoncomboService } from "app/services/commoncombo.service";
import { VisasalesService } from "app/services/transaction/visasales.service";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";

@Component({
  selector: "ngx-visasales",
  templateUrl: "./visasales.component.html",
  styleUrls: ["./visasales.component.scss"],
})
export class VisasalesComponent implements OnInit {
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
    visaSaleId: number;
    salesDateShow: Date;
    salesDate: string;
    candidateId: number;
    candidateName: string;
    candidateCode: string;
    candidateStatus: string;
    passportNo: string;

    agentId: number;
    agentName: string;
    companyId: number;
    companyName: string;
    groupId: number;
    groupName: string;
    tradeId: number;
    tradeName: string;
    countryId: number;
    countryName: string;
    cityId: number;
    cityName: string;
    workOrderId: number;
    workOrderNo: string;

    visaNo: string;
    sponsorId: string;
    contact: string;
    reference: string;
    assignRemarks: string;
    unAssignRemarks: string;
    salesAmount: number;
    agentCommission: number;
    additionalCharge: number;
    netAmount: number;
    specialDiscount: number;

    allData: string;
    countData: number;
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

  show: boolean = true;
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

  public pageNavigation = "Visa Sales";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
      this.disabled = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
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
      visaSaleId: 0,
      salesDateShow: new Date(),
      salesDate:
        new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
      candidateId: 0,
      candidateName: "",
      candidateCode: "",
      candidateStatus: "",
      passportNo: "",

      agentId: 0,
      agentName: "",
      companyId: 0,
      companyName: "",
      groupId: 0,
      groupName: "",
      tradeId: 0,
      tradeName: "",
      countryId: 0,
      countryName: "",
      cityId: 0,
      cityName: "",
      workOrderId: 0,
      workOrderNo: "",

      visaNo: "",
      sponsorId: "",
      contact: "",
      reference: "",
      assignRemarks: "",
      unAssignRemarks: "",
      salesAmount: 0,
      agentCommission: 0,
      additionalCharge: 0,
      netAmount: 0,
      specialDiscount: 0,

      allData: "ALL",
      countData: 0,
    };
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

  public getPassengerInfo() {
    //debugger;
    // if (this.master.salesAmount == 0) {
    //   this.toastrService.danger("Please input sales amount", "Message");
    //   return;
    // }
    this.visasalesService
      .getPassengerInfoByPassport(this.master.passportNo)
      .subscribe((returns: any) => {
        this.master.candidateId = returns.data[0].candidate_id;
        this.master.candidateCode = returns.data[0].candidate_code;
        this.master.candidateName = returns.data[0].candidate_name;
        this.master.candidateStatus = returns.data[0].candidate_status;
        this.master.passportNo = returns.data[0].passport_number;

        this.master.agentId = returns.data[0].agent_id;
        this.master.agentName = returns.data[0].agent_name;
        this.master.companyId = returns.data[0].company_id;
        this.master.companyName = returns.data[0].company_name;
        this.master.groupId = returns.data[0].group_id;
        this.master.groupName = returns.data[0].group_name;
        this.master.tradeId = returns.data[0].trade_id;
        this.master.tradeName = returns.data[0].trade_name;
        this.master.countryId = returns.data[0].country_id;
        this.master.countryName = returns.data[0].country_name;
        this.master.cityId = returns.data[0].city_id;
        this.master.cityName = returns.data[0].city_name;

        this.master.workOrderId = returns.data[0].work_order_id;
        this.master.workOrderNo = returns.data[0].work_order_number;
        this.master.visaNo = returns.data[0].visa_number;
        this.master.sponsorId = returns.data[0].sponsor_id;

        this.master.contact = returns.data[0].contact;
        this.master.reference = returns.data[0].reference;
        this.master.assignRemarks = returns.data[0].visa_assign_remarks;
        this.master.unAssignRemarks = returns.data[0].visa_unassign_remarks;

      });
  }

  public addDetails(dialog: TemplateRef<any>) {
    //debugger;
    if (this.master.passportNo == "") {
      this.toastrService.danger("Please input passport no", "Message");
      return;
    }

    this.getPassengerInfo();
  }

  public getDuplicate() {
    //debugger;
    this.visasalesService
      .getDuplicateVisaSales(this.master.visaSaleId, this.master.passportNo)
      .subscribe((returns: any) => {
        //debugger;
        this.master.countData = returns.data[0].countData;
      });
  }

  private save() {
    var button = this.commonService.buttonClicked;

    if (this.master.countryName == "" || this.master.countryName == null) {
      this.toastrService.danger(
        "Please enter work order no and press search button",
        "Message"
      );
      this.commonService.valueSet("create");
      return false;
    } else if (this.master.countData != 0) {
      this.toastrService.danger("Duplicate passport no", "Message");
      this.commonService.valueSet("create");
      return false;
    } else if (this.master.salesAmount <= 0) {
      this.toastrService.danger("Please enter service charge", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    this.visasalesService
      .saveVisaSales(this.master)
      .subscribe((returns: any) => {
        //debugger;
        if (returns.success) {
          if (button == "update") {
            this.toastrService.success(
              this.commonService.updatedmsg,
              "Message"
            );
          } else {
            this.toastrService.success(
              this.commonService.successmsg,
              "Message"
            );
          }
          this.show = true;
          //////////////Grid Refresh ///////////////////
          this.visasalesService.getVisaSales("ALL").subscribe((data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          });
          //////////////Grid Refresh ///////////////////
        }
      });
  }

  private reset() {
    this.getMaster();
  }

  //////////////////////////////// End CRUD /////////////////////////////////////////

  public getNetAmount() {
    //debugger;
    var salesAmount = 0;
    var agentCommission = 0;
    var additionalCharge = 0;
    var specialDiscount = 0;

    salesAmount = this.master.salesAmount;
    agentCommission = this.master.agentCommission;
    additionalCharge = this.master.additionalCharge;
    specialDiscount = this.master.specialDiscount;
    this.master.netAmount =
      salesAmount + agentCommission + additionalCharge - specialDiscount;
  }

  public getActualDate(event: any) {
    //debugger;
    var dateCon = event.toLocaleDateString() + " " + event.toLocaleTimeString();
    if (dateCon != "") {
      this.master.salesDate = dateCon;
    }
  }

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
  public tableHeader = [
    "#",
    "Group Title",
    "Visa Number",
    "Visa Assigned",
    "Visa Unassigned",
    "Total Visa",
    "Trade",
    "Salary",
    "License",
    "Sponsor",
  ];

  private gridApi;
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
    private comboService: CommoncomboService,
    private visasalesService: VisasalesService
  ) {
    this.commonService.valueSet("showlist");

    this.company = {
      name: "Dahmashi Corporation Ltd.",
      address:
        "Dahmashi Centre, House No. 33/A, Road No. 12, Block-H, Banani, Dhaka-1213",
      custom_footer: true,
      phone: "02-55042777",
      fax: "",
      email: "info@dahmashigroup.com",
      website: "https://www.dahmashigroup.com/",
      vat: "",
      tin: "",
    };

    this.columnDefs = [
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.rowIndex + 1",
        pinned: "left",
        filter: false,
        width: 50,
      },
      {
        headerName: "Passport No",
        field: "passportNo",
        filter: "agTextColumnFilter",
        width: 160,
      },
      {
        headerName: "Sales Date",
        field: "salesDate",
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "Amount",
        field: "netAmount",
        filter: "agNumberColumnFilter",
        valueFormatter: (params) =>
          this.currencyFormatter(params.data.netAmount),
        type: "rightAligned",
        width: 140,
      },
      {
        headerName: "Agent Name",
        field: "agentName",
        filter: "agTextColumnFilter",
        width: 200,
      },
      {
        headerName: "Candidate Name",
        field: "candidateName",
        filter: "agTextColumnFilter",
        width: 200,
      },
      {
        headerName: "Candidate Code",
        field: "candidateCode",
        filter: "agTextColumnFilter",
        width: 160,
      },
      {
        headerName: "Candidate Status",
        field: "candidateStatus",
        filter: "agTextColumnFilter",
        width: 160,
      },

      {
        headerName: "Work Order No",
        field: "workOrderNo",
        filter: "agTextColumnFilter",
        width: 160,
      },
      {
        headerName: "Country Name",
        field: "countryName",
        filter: "agTextColumnFilter",
        width: 200,
      },
      {
        headerName: "City Name",
        field: "cityName",
        filter: "agTextColumnFilter",
        width: 200,
      },
      {
        headerName: "Company Name",
        field: "companyName",
        filter: "agTextColumnFilter",
        width: 200,
      },
      {
        headerName: "Is Processed?",
        field: "isProcessed",
        width: 140,
      },
      {
        headerName: "Is Active?",
        field: "isActive",
        width: 120,
      },
      {
        field: "action",
        cellRenderer: "btnCellRenderer",
        cellRendererParams: {
          clicked: function (field: any) { },
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
    //debugger;
  }

  currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.visasalesService.getVisaSales("ALL").subscribe((data: any) => {
      //debugger;
      if (data.success) {
        this.rowData = data.data;
      }
    });
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
      // if (event.node.data.isProcessed == true) {
      //   this.toastrService.danger("Voucher already posted. Cannot edit now.", "Message");
      //   return;
      // }

      this.agEdit(event);
      this.show = false;
    } else if (data == "view") {
      this.agEdit(event);
      this.show = false;
      this.disabled = true;
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
      if (event.node.data.isProcessed == true) {
        this.toastrService.danger(
          "Voucher already posted. Cannot delete now.",
          "Message"
        );
        return;
      } else {
        this.agDelete(event);
      }
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
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
      var visaSaleId = event.node.data.visaSaleId;

      this.visasalesService
        .getVisaSalesById(visaSaleId)
        .subscribe((data: any) => {
          if (data.success) {
            //debugger;
            this.master = data.data[0];

            this.getDuplicate();
          }
        });
      this.ngOnInit();
    }
  }

  private agDelete(event) {
    //debugger;
    var result = confirm("Are you sure you want to delete that?");
    if (result) {
      this.master.visaSaleId = event.node.data.visaSaleId;

      this.visasalesService
        .deleteVisaSales(this.master)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.toastrService.success(
              this.commonService.deletedmsg,
              "Message"
            );

            //////////////Grid Refresh ///////////////////
            this.visasalesService.getVisaSales("ALL").subscribe((data: any) => {
              if (data.success) {
                this.rowData = data.data;
              }
            });
            //////////////Grid Refresh ///////////////////
          }
        });
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

  names: any;
  openWithDataObjModel(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
      context: this.master,
    });
  }

  openWithDataModel() {
    this.dialogService
      .open(DialogNamePromptComponent)
      .onClose.subscribe((name) => name && this.names.push(name));
  }

  // Report

  private agReport(event) {
    this.generateSalesReport(event.data.visaId);
  }

  public generateSalesReport(visasaleId) {
    //debugger;
    this.getReportData(visasaleId);
  }

  public bodyData: any = [];
  public datalength: number;

  public candidateName = "";
  public candidateCode = "";
  public candidateStatus = "";
  public passportNo = "";
  public agentName = "";
  public companyName = "";
  public groupName = "";
  public tradeName = "";
  public countryName = "";
  public cityName = "";
  public workOrderNo = "";

  public visaNo = "";
  public sponsorId = "";
  public contact = "";
  public reference = "";
  public assignRemarks = "";
  public unAssignRemarks = "";
  public salesAmount = 0;
  public agentCommission = 0;
  public additionalCharge = 0;
  public specialDiscount = 0;
  public netAmount = 0;
  public salessDate = "";

  private getReportData(visasaleId) {
    //debugger;
    this.visasalesService
      .getVisaSalesById(visasaleId)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.bodyData = returns.data;
          this.datalength = returns.data.length * 50;
          //debugger;

          this.candidateName = this.bodyData[0].candidateName;
          this.candidateCode = this.bodyData[0].candidateCode;
          this.candidateStatus = this.bodyData[0].candidateStatus;
          this.passportNo = this.bodyData[0].passportNo;
          this.agentName = this.bodyData[0].agentName;
          this.companyName = this.bodyData[0].companyName;
          this.groupName = this.bodyData[0].groupName;
          this.tradeName = this.bodyData[0].tradeName;
          this.countryName = this.bodyData[0].countryName;
          this.cityName = this.bodyData[0].cityName;
          this.workOrderNo = this.bodyData[0].workOrderNo;

          this.visaNo = this.bodyData[0].visaNo;
          this.sponsorId = this.bodyData[0].sponsorId;
          this.contact = this.bodyData[0].contact;
          this.reference = this.bodyData[0].reference;
          this.assignRemarks = this.bodyData[0].assignRemarks;
          this.unAssignRemarks = this.bodyData[0].unAssignRemarks;
          this.salesAmount = this.bodyData[0].salesAmount;
          this.agentCommission = this.bodyData[0].agentCommission;
          this.additionalCharge = this.bodyData[0].additionalCharge;
          this.specialDiscount = this.bodyData[0].specialDiscount;
          this.netAmount = this.bodyData[0].netAmount;
          this.salessDate = this.bodyData[0].salesDate;

          var fileName = this.pageNavigation + ".pdf";
          const content = document.getElementById("reportHeader");
          this.generateReport("print", fileName, content, this.datalength);
        } else {
          this.toastrService.danger("Message", this.commonService.nodatafound);
        }
      });
  }

  public generateReport(
    buttonAction: any,
    fileName: string,
    content: any,
    datalength: number
  ) {
    const doc = new jsPDF("l", "pt", "a4");
    doc.setFontSize(5);
    doc.setTextColor(40);

    var legend = {
      height: 100,
      totalheight: 100 + datalength,
    };
    //debugger;
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
          html: "#header_table",
          startY: legend.height + 20,
          styles: { font: "Meta" },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 30,
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
            fontSize: 20,
            halign: "center",
            valign: "top",
            textColor: 50,
          },
          bodyStyles: {
            fillColor: [216, 216, 216],
            textColor: 50,
          },
          // columnStyles: {
          //   3: { halign: "right" },
          //   4: { halign: "right" },
          //   5: { halign: "right" },
          //   7: { halign: "right" },
          // },

          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });

        autoTable(doc, {
          html: "#footer_table",
          startY: legend.totalheight + 300,
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
}

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
import { FormGroup } from "@angular/forms";
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
import { WorkorderService } from "app/services/transaction/workorder.service";
import { ModalService } from "app/services/transaction/modal.service";
import { Router } from "@angular/router";

import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { ElementRef } from "@angular/core";

@Component({
  selector: "ngx-visaworkorder",
  templateUrl: "./visaworkorder.component.html",
  styleUrls: ["./visaworkorder.component.scss"],
})
export class VisaworkorderComponent implements OnInit {
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
    visaId: number;
    visaWorkOrderId: number;
    visa_WorkOrder_Id: number;
    workOrderNo: string;
    countryId: number;
    countryName: string;
    cityId: number;
    cityName: string;
    companyId: number;
    companyName: string;
    issueDate: string;
    expireDate: string;
    visaGroupQuantity: number;
    visaQuantity: number;
    visaAssigned: number;
    visaUnassigned: number;

    purchaseRate: number;
    purchaseAmount: number;
    serviceCharge: number;
    agentCommission: number;
    otherCharge: number;
    hadia: number;

    countData: number;
    lstVisaGroup: any[];
    lstAPI: any[];
    index: number;

    allData: string;
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

  public pageNavigation = "Visa Work Order";
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
      visaId: 0,
      visaWorkOrderId: 0,
      visa_WorkOrder_Id: 0,
      workOrderNo: "",
      countryId: 0,
      countryName: "",
      cityId: 0,
      cityName: "",
      companyId: 0,
      companyName: "",
      issueDate: "",
      expireDate: "",
      visaGroupQuantity: 0,
      visaQuantity: 0,
      visaAssigned: 0,
      visaUnassigned: 0,

      purchaseRate: 0,
      purchaseAmount: 0,
      serviceCharge: 0,
      agentCommission: 0,
      otherCharge: 0,
      hadia: 0,

      countData: 0,
      lstVisaGroup: [],
      lstAPI: [],
      index: -1,

      allData: "ALL",
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

  public getVisaInfo() {
    this.master.lstVisaGroup = [];
    //debugger;
    this.workorderService
      .getVisaInfoByWorkOrder(this.master.workOrderNo)
      .subscribe((returns: any) => {
        this.master.visaWorkOrderId = returns.data[0].id;
        this.master.countryId = returns.data[0].country_id;
        this.master.countryName = returns.data[0].country_name;
        this.master.cityId = returns.data[0].city_id;
        this.master.cityName = returns.data[0].city_name;
        this.master.companyId = returns.data[0].company_id;
        this.master.companyName = returns.data[0].company_name;

        this.master.issueDate = returns.data[0].issue_date;
        this.master.expireDate = returns.data[0].expire_date;
        this.master.visaGroupQuantity = returns.data[0].total_groups;
        this.master.visaQuantity = returns.data[0].total_visas;
        this.master.visaAssigned = returns.data[0].assigned_visas;
        this.master.visaUnassigned = returns.data[0].unassigned_visas;

        this.master.lstAPI = returns.data[0].groups;

        this.master.lstAPI.forEach((row) => {
          let detail = {
            visa_id: row.visa_id,
            visa_WorkOrder_Id: returns.data[0].id,
            visa_group_id: row.visa_group_id,
            group_title: row.group_title,
            visa_number: row.visa_number,
            sponsor_id: row.sponsor_id,
            total_visas: row.total_visas,
            assigned_visas: row.assigned_visas,
            unassigned_visas: row.unassigned_visas,
            trade_id: row.trade_id,
            trade: row.trade,
            purchaseVisa: row.total_visas,
            salary: row.salary,
            license_id: row.license_id,
            license: row.license,
          };
          this.master.lstVisaGroup.push(detail);
        });
      });
  }

  public addDetails(dialog: TemplateRef<any>) {
    //debugger;
    if (this.master.workOrderNo == "") {
      this.toastrService.danger("Please input work order no", "Message");
      return;
    }

    this.getVisaInfo();

    // let detail = {
    //   groupTitle: "TestTile",
    //   visaNumber: "121232323",
    // };
    // this.master.lstVisaGroup.push(detail);
  }

  public getDuplicate() {
    //debugger;
    this.workorderService
      .getDuplicateVisaWorkOrder(this.master.visaId, this.master.workOrderNo)
      .subscribe((returns: any) => {
        //debugger;
        this.master.countData = returns.data[0].countData;
      });
  }

  private save() {
    //debugger;
    var button = this.commonService.buttonClicked;

    if (this.master.countryName == "" || this.master.countryName == null) {
      this.toastrService.danger(
        "Please enter work order no and press search button",
        "Message"
      );
      this.commonService.valueSet("create");
      return false;
    } else if (this.master.countData != 0) {
      this.toastrService.danger("Duplicate work order no", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    this.workorderService
      .saveVisaWorkOrder(this.master)
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
          this.workorderService
            .getVisaWorkOrder("ALL")
            .subscribe((data: any) => {
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
    "Purchase Visa",
    "Trade",
    "Salary",
    "License",
    "Sponsor",
    "Purchase Date",
    "Rate",
    "Amount",
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
    private workorderService: WorkorderService
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
        headerName: "Work Order No",
        field: "workOrderNo",
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "Visa Quantity",
        field: "visaQuantity",
        filter: "agDateColumnFilter",
        width: 140,
      },
      {
        headerName: "Amount",
        field: "purchaseAmount",
        filter: "agDateColumnFilter",
        valueFormatter: (params) =>
          this.currencyFormatter(params.data.purchaseAmount),
        type: "rightAligned",
        width: 140,
      },
      {
        headerName: "Country Name",
        field: "countryName",
        filter: "agDateColumnFilter",
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
        width: 150,
      },
      {
        headerName: "Is Active?",
        field: "isActive",
        width: 150,
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
    this.workorderService.getVisaWorkOrder("ALL").subscribe((data: any) => {
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
    //debugger;
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
      var visaId = event.node.data.visaId;

      this.workorderService
        .getVisaWorkOrderById(visaId)
        .subscribe((data: any) => {
          if (data.success) {
            //debugger;
            this.master = data.data[0];

            this.getDuplicate();

            this.workorderService
              .getVisaGroupByWorkOrderId(visaId)
              .subscribe((data: any) => {
                //debugger;
                if (data.success) {
                  this.master.lstVisaGroup = data.data;
                }
              });
          }
        });
      this.ngOnInit();
    }
  }

  private agDelete(event) {
    //debugger;
    var result = confirm("Are you sure you want to delete that?");
    if (result) {
      this.master.visaId = event.node.data.visaId;

      this.workorderService
        .deleteVisaWorkOrder(this.master)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.toastrService.success(
              this.commonService.deletedmsg,
              "Message"
            );

            //////////////Grid Refresh ///////////////////
            this.workorderService
              .getVisaWorkOrder("ALL")
              .subscribe((data: any) => {
                if (data.success) {
                  this.rowData = data.data;
                }
              });
            //////////////Grid Refresh ///////////////////
          }
        });
    }
  }

  public getTotalAmount(rateee, totalVisa, index) {
    //debugger;
    var rate = 0;
    var quantity = 0;
    rate = rateee == null ? 0 : rateee;
    quantity = totalVisa == null ? 0 : totalVisa;
    this.master.lstVisaGroup[index].purchaseAmount = rate * quantity;

    let totalAmount = 0;
    this.master.lstVisaGroup.forEach((row) => {
      totalAmount +=
        row.purchaseAmount == "" ||
          row.purchaseAmount == null ||
          row.purchaseAmount == 0
          ? 0
          : row.purchaseAmount;
    });
    this.master.purchaseAmount = totalAmount;

    // rate = this.master.purchaseRate;
    // quantity = this.master.visaQuantity;
    // this.master.purchaseAmount = rate * quantity;
  }

  public getActualDate(event: any, index) {
    //debugger;
    // new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()
    var dateCon = event.toLocaleDateString() + " " + event.toLocaleTimeString();
    this.master.lstVisaGroup[index].purchaseDate = dateCon;
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
    this.generateWorkOrderReport(event.data.visaId);
  }

  public generateWorkOrderReport(visaId) {
    //debugger;
    this.getReportData(visaId);
  }

  public bodyData: any = [];
  public datalength: number;

  public workOrderNo = "";
  public countryName = "";
  public cityName = "";
  public companyName = "";
  public issueDate = "";
  public expireDate = "";
  public visaGroupQuantity = 0;
  public visaQuantity = 0;
  public visaAssigned = 0;
  public visaUnassigned = 0;
  public totalAmount = 0;

  private getReportData(visaId) {
    //debugger;
    this.workorderService
      .getRptVisaWorkOrder(visaId)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.bodyData = returns.data;
          this.datalength = returns.data.length * 50;
          //debugger;

          this.workOrderNo = this.bodyData[0].workOrderNo;
          this.countryName = this.bodyData[0].countryName;
          this.cityName = this.bodyData[0].cityName;
          this.companyName = this.bodyData[0].companyName;
          this.issueDate = this.bodyData[0].issueDate;
          this.expireDate = this.bodyData[0].expireDate;
          this.visaGroupQuantity = this.bodyData[0].visaGroupQuantity;
          this.visaQuantity = this.bodyData[0].visaQuantity;
          this.visaAssigned = this.bodyData[0].visaAssigned;
          this.visaUnassigned = this.bodyData[0].visaUnassigned;
          this.totalAmount = this.bodyData[0].totalAmount;

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
            // halign:"right"
          },
          columnStyles: {
            3: { halign: "right" },
            4: { halign: "right" },
            5: { halign: "right" },
            6: { halign: "right" },
            7: { halign: "right" },
            12: { halign: "right" },
            13: { halign: "right" },
          },

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
            // halign:"right"
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

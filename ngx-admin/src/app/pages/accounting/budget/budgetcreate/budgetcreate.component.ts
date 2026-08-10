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
import { BudgetcreateService } from "app/services/budget/budgetcreate.service";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";

@Component({
  selector: "ngx-budgetcreate",
  templateUrl: "./budgetcreate.component.html",
  styleUrls: ["./budgetcreate.component.scss"],
})
export class BudgetcreateComponent implements OnInit {
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
    budgetMasterId: number;
    budgetNo: string;
    budgetDate: Date;
    grandTotal: number;
    status: number;
    isActive: number;

    fiscalYearId: number;
    fiscalYearSelected: {};
    budgetHeadMasterId: number;
    budgetHeadMasterSelected: any;

    companyId: number;
    companySelected: any;
    sbuId: number;
    sbuSelected: any;

    lstdetailBudget: any[];
    index: number;
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
  details: any;
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

  public pageNavigation = "Budget Create";
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
      this.show = true;
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
      this.show = true;
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
      budgetMasterId: 0,
      budgetNo: "",
      budgetDate: new Date(),
      grandTotal: 0,
      status: 0,
      isActive: 1,

      fiscalYearId: 0,
      fiscalYearSelected: null,

      budgetHeadMasterId: 0,
      budgetHeadMasterSelected: null,
      companyId: 0,
      companySelected: null,
      sbuId: 0,
      sbuSelected: null,

      lstdetailBudget: [],
      index: -1,
    };
  }

  public companyItems = [];
  public sbuItems = [];
  public fiscalYearItems = [];
  public budgetHeadMasterItems = [];

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

  public addDetails(dialog: TemplateRef<any>) {
    //debugger;
    // if (this.master.budgetHeadMasterId == 0) {
    //   this.toastrService.danger("Please select budget head", "Message");
    //   return;
    // }

    // var RowCount = this.master.lstdetailBudget.length;
    // for (let i = 0; i < RowCount; i++) {
    //   //debugger;
    //   var _budgetHeadMasterId = this.master.lstdetailBudget[i].budgetHeadMasterId;
    //   if (_budgetHeadMasterId == this.master.budgetHeadMasterId) {
    //     this.toastrService.danger("You have already added this budget head", "Message");
    //     return;
    //   }
    // }

    let detail = {
      budgetHeadMasterId: 0,
      firstMonth: 0,
      secondMonth: 0,
      thirdMonth: 0,
      fourthMonth: 0,
      fifthMonth: 0,
      sixthMonth: 0,
      seventhMonth: 0,
      eighthMonth: 0,
      ninethMonth: 0,
      tenthMonth: 0,
      eleventhMonth: 0,
      twelvethMonth: 0,

      budgetHeadDdl: this.budgetHeadMasterItems,
    };
    this.master.lstdetailBudget.push(detail);
  }

  public deleteDetail(index: any) {
    //debugger;
    this.selectedRow = this.master.lstdetailBudget[index];
    this.master.lstdetailBudget.splice(index, 1);
    this.toastrService.danger(this.commonService.deletedmsg, "Message");
  }

  public refesh() {
    this.master.lstdetailBudget = [];
    this.toastrService.warning(this.commonService.warningmsg, "Message");
  }

  private save() {
    var button = this.commonService.buttonClicked;
    this.budgetcreateService
      .saveBudget(this.master)
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
          //////////////Grid Refresh ///////////////////
          this.budgetcreateService.getBudget().subscribe((data: any) => {
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
    "Budget Head",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  public selectdetailRows = [];
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
    private budgetcreateService: BudgetcreateService
  ) {
    this.commonService.valueSet("showlist");
    this.getCompany();

    this.company = {
      name: "One Information And Communications Technology Ltd",
      address: "14/A, Center Point Concord Unit-10A & B Tejgaon, Dhaka - 1215",
      custom_footer: true,
      phone: "01704-055668",
      fax: "02-98765432",
      email: "info@one-ict.com",
      website: "www.one-ict.com",
      vat: "13145664564",
      tin: "00000000000",
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
        headerName: "Id",
        field: "budgetMasterId",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 100,
      },
      {
        headerName: "Budget No",
        field: "budgetNo",
        filter: "agTextColumnFilter",
        width: 200,
      },
      {
        headerName: "Budget Date",
        field: "budgetDate",
        filter: "agDateColumnFilter",
        width: 200,
      },
      {
        headerName: "Fiscal Year",
        field: "yearName",
        filter: "agTextColumnFilter",
        width: 120,
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
    this.budgetcreateService.getBudget().subscribe((data: any) => {
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
      this.agEdit(event);
      this.show = false;
    } else if (data == "view") {
      this.agEdit(event);
      this.show = false;
      this.disabled = true;
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
      this.agDelete(event);
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
      var budgetMasterId = event.node.data.budgetMasterId;

      this.budgetcreateService
        .getBudgetById(budgetMasterId)
        .subscribe((data: any) => {
          if (data.success) {
            //debugger;
            this.master = data.data[0];

            this.master.companySelected = {
              id: data.data[0].companyId,
              name: data.data[0].companyName,
            };

            this.getSBU(data.data[0].companyId);

            this.master.sbuSelected = {
              id: data.data[0].sbuId,
              name: data.data[0].sbuName,
            };

            this.getFiscalYear();

            this.master.fiscalYearSelected = {
              id: data.data[0].fiscalYearId,
              name: data.data[0].yearName,
            };

            this.getBudgetHead();

            this.budgetcreateService
              .getBudgetDetailsByMasterId(budgetMasterId)
              .subscribe((data: any) => {
                //debugger;
                if (data.success) {
                  this.master.lstdetailBudget = data.data;

                  this.master.lstdetailBudget.map((detail) => {
                    return (detail.budgetHeadMasterSelected = {
                      id: detail.budgetHeadMasterId,
                      name: detail.headName,
                    });
                  });
                }
              });
          }
        });
      this.ngOnInit();
    }
  }
  private agReport(event) {
    this.generateVoucherReport(event.data.budgetMasterId);
  }

  public generateVoucherReport(budgetMasterId) {
    //debugger;
    this.getReportData(budgetMasterId);
  }

  public bodyData: any = [];
  public datalength: number;
  public budgetNo = "";
  public budgetDate = "";
  public yearName = "";
  public params = [];
  public Total1stMonth = 0;
  public Total2ndMonth = 0;
  public Total3rdMonth = 0;
  public Total4thMonth = 0;
  public Total5thMonth = 0;
  public Total6thMonth = 0;
  public Total7thMonth = 0;
  public Total8thMonth = 0;
  public Total9thMonth = 0;
  public Total10thMonth = 0;
  public Total11thMonth = 0;
  public Total12thMonth = 0;

  private getReportData(budgetMasterId) {
    //debugger;
    this.budgetcreateService
      .getBudgetDetailsByMasterId(budgetMasterId)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.bodyData = returns.data;
          this.datalength = returns.data.length * 50;
          //debugger;

          this.budgetNo = this.bodyData[0].budgetNo;
          this.budgetDate = this.bodyData[0].budgetDate;
          this.yearName = this.bodyData[0].yearName;

          this.Total1stMonth = 0;
          this.bodyData.forEach(
            (a) => (this.Total1stMonth += parseFloat(a.firstMonth))
          );
          this.Total2ndMonth = 0;
          this.bodyData.forEach(
            (a) => (this.Total2ndMonth += parseFloat(a.secondMonth))
          );
          this.Total3rdMonth = 0;
          this.bodyData.forEach(
            (a) => (this.Total3rdMonth += parseFloat(a.thirdMonth))
          );
          this.Total4thMonth = 0;
          this.bodyData.forEach(
            (a) => (this.Total4thMonth += parseFloat(a.fourthMonth))
          );
          this.Total5thMonth = 0;
          this.bodyData.forEach(
            (a) => (this.Total5thMonth += parseFloat(a.fifthMonth))
          );
          this.Total6thMonth = 0;
          this.bodyData.forEach(
            (a) => (this.Total6thMonth += parseFloat(a.sixthMonth))
          );
          this.Total7thMonth = 0;
          this.bodyData.forEach(
            (a) => (this.Total7thMonth += parseFloat(a.seventhMonth))
          );
          this.Total8thMonth = 0;
          this.bodyData.forEach(
            (a) => (this.Total8thMonth += parseFloat(a.eighthMonth))
          );
          this.Total9thMonth = 0;
          this.bodyData.forEach(
            (a) => (this.Total9thMonth += parseFloat(a.ninethMonth))
          );
          this.Total10thMonth = 0;
          this.bodyData.forEach(
            (a) => (this.Total10thMonth += parseFloat(a.tenthMonth))
          );
          this.Total11thMonth = 0;
          this.bodyData.forEach(
            (a) => (this.Total11thMonth += parseFloat(a.eleventhMonth))
          );
          this.Total12thMonth = 0;
          this.bodyData.forEach(
            (a) => (this.Total12thMonth += parseFloat(a.twelvethMonth))
          );

          this.setParam();
          var fileName = this.pageNavigation + ".pdf";
          const content = document.getElementById("reportHeader");
          this.generateReport("print", fileName, content, this.datalength);
        } else {
          this.toastrService.danger("Message", this.commonService.nodatafound);
        }
      });
  }

  public setParam() {
    this.params = [];
    this.params.push({
      leftLabel: "Budget No",
      leftValue: "",
      rightLabel: "Budget Date",
      rightValue: "",
    });
    this.params.push({ leftLabel: "Fiscal Year", leftValue: "" });
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
            // halign:"right"
          },
          columnStyles: {
            2: { halign: "right" },
            3: { halign: "right" },
            4: { halign: "right" },
            5: { halign: "right" },
            6: { halign: "right" },
            7: { halign: "right" },
            8: { halign: "right" },
            9: { halign: "right" },
            10: { halign: "right" },
            11: { halign: "right" },
            12: { halign: "right" },
            13: { halign: "right" },
          },

          alternateRowStyles: {
            fillColor: [250, 250, 250],
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

  private agDelete(event) {
    var result = confirm("Are you sure you want to delete that?");
    if (result) {
      //debugger;
      this.master.budgetMasterId = event.node.data.budgetMasterId;

      this.budgetcreateService
        .deleteBudget(this.master)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.toastrService.success(
              this.commonService.deletedmsg,
              "Message"
            );

            //////////////Grid Refresh ///////////////////
            this.budgetcreateService.getBudget().subscribe((data: any) => {
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

  public getCompany() {
    this.comboService.getCompany().subscribe((returns: any) => {
      this.companyItems = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
    });
  }

  public getSBU(companyId) {
    this.master.sbuSelected = null;
    this.comboService.getSBU(companyId).subscribe((returns: any) => {
      this.sbuItems = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
    });
  }

  public getFiscalYear() {
    this.comboService
      .getFiscalYear(this.master.companyId, this.master.sbuId, 0)
      .subscribe((returns: any) => {
        this.fiscalYearItems = returns.data.map((val) => ({
          id: val.fiscalYearId,
          name: val.yearName,
        }));
      });
  }

  public getBudgetHead() {
    this.comboService
      .getBudgetHead(
        this.master.companySelected.id,
        this.master.sbuSelected.id,
        0,
        0,
        0
      )
      .subscribe((returns: any) => {
        this.budgetHeadMasterItems = returns.data.map((val) => ({
          id: val.budgetHeadMasterId,
          name: val.headName,
        }));
      });
  }
}

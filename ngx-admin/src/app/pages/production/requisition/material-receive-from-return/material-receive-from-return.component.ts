import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
} from "@angular/core";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup } from "@angular/forms";
import { DatePipe } from "@angular/common";
import {
  NbComponentStatus,
  NbDialogService,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ProductionServiceService } from "app/services/production/production-service.service";

@Component({
  selector: 'ngx-material-receive-from-return',
  templateUrl: './material-receive-from-return.component.html',
  styleUrls: ['./material-receive-from-return.component.scss']
})



export class MaterialReceiveFromReturnComponent implements OnInit {
  loadFromDateShow: Date = new Date();
  loadToDateShow: Date = new Date();
  protected options: {};
  protected cd: ChangeDetectorRef;
  showMessages: any = {};
  errors: string[];

  disabled: boolean = false;
  config: NbToastrConfig;
  index = 1;
  destroyByClick = true;
  duration = 2000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  preventDuplicates = false;
  status: NbComponentStatus = "primary";

  title = "Hi there!";
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
    ////debugger;
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Material Return From Receive";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
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

  //
  companyList: [];
  companySelected: {};
  sbuList: [];
  sbuSelected: {};
  bomProductSpecList: {};
  bomProductSpecSelected: {};
  returnSelected: {};
  requisitionSelected: {};
  master: {
    ProductReceiveFromReturnMasterId: number;
    productReturnMasterId: number;
    ReturnNo: string;
    ReturnDate: Date;
    TypeofReturn: string;
    productIssueMasterId: number;

    Status: number;
    Remarks: string;

    issueDate: Date;
    typeOfIssue: string;
    requisitionId: number;
    issueQty: number;
    issueStatus: number;
    issueRemarks: string;

    rmRequisitonId: number;

    bomNo: string;
    bomName: string;
    productName: string;
    reqNo: string;
    reqDate: Date;
    uomName: string;
    bomProductWiseSpecificationId: number;
    bomDescription: string;
    bomTotalCost: number;
    companyId: number;
    sbuId: number;
    bomQty: number;
    lstDetailsViewModel: any[];
    typeId: number;
    returnSelected: {};

    status: number;
    type: string;
    requisitionMasterId: number;
    bomForId: number;
    bomForType: string;
    batchNo: string;
    TypeofReceive: string;
    ProductReceiveFromReturnDate: Date;
  };
  public getMaster() {
    this.master = {
      productReturnMasterId: 0,
      ProductReceiveFromReturnMasterId: 0,
      ReturnNo: "",
      ReturnDate: new Date(),
      TypeofReturn: "",
      productIssueMasterId: 0,

      Status: 1,
      issueDate: new Date(),
      typeOfIssue: "",
      requisitionId: 0,
      issueQty: 0,
      issueStatus: 1,
      issueRemarks: "",

      rmRequisitonId: 0,
      reqNo: "",
      reqDate: new Date(),
      bomQty: 1,
      Remarks: "",
      status: 1,
      type: "Raw",

      ProductReceiveFromReturnDate: new Date(),

      uomName: "",
      typeId: 0,

      bomNo: "",
      bomName: "",
      productName: "",

      bomProductWiseSpecificationId: 0,
      bomDescription: "",
      bomTotalCost: 0,

      companyId: null,
      sbuId: null,
      lstDetailsViewModel: [],
      returnSelected: null,
      requisitionMasterId: 0,
      bomForId: 0,
      bomForType: null,
      batchNo: "",
      TypeofReceive: ""
    };
    this.companySelected = null;
    this.sbuSelected = null;
    this.bomProductSpecSelected = null;
    this.returnSelected = null;
    this.requisitionSelected = null;
    this.detailsProductSpecSelected = null;
    this.requisitionList = null;

    this.qty = 1;
    this.price = 0;
    this.wastage = 0;
    this.grandTotalQty = 0;
    this.uomName = "";
    this.loadReturnList();
  }

  // bomDetails

  bomDetailsId: number = 0;

  productName: string = "";
  bomDetailsProductWiseSpecificationId: number = 0;
  qty: number = 0;
  uomName: string = "";
  price: number = 0.0;
  wastage: number = 0.0;
  totalPrice: number = 0.0;
  grandTotalQty: number = 0.0;
  totalQty: number = 0.0;
  detailsProductSpecList: {};
  detailsProductSpecSelected: {};

  // All Button Action

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

  /////////////////////////////// CRUD ///////////////////////////////////////////

  private save() {
    debugger;
    var button = this.commonService.buttonClicked;
    this.master.ReturnDate = this.commonService.DateFormat(this.master.ReturnDate);
    this.productionServiceService.SaveProductReceiveFromReturn(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }

        this.getMaster(); //////////////Grid Refresh ///////////////////

        this.productionServiceService.GetReturnFromReceiveByIdDate(this.commonService.DateFormat(this.loadFromDateShow), this.commonService.DateFormat(this.loadToDateShow)
          , 0).subscribe((data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          });
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
  private gridColumnApi;

  public modules: Module[] = AllCommunityModules;
  public columnDefs;
  public defaultColDef;
  public rowData: [];
  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };

  constructor(
    private commonService: CommonService,
    private toastrService: NbToastrService,

    private datePipe: DatePipe,
    private productionServiceService: ProductionServiceService
  ) {
    this.commonService.valueSet("showlist");
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
        headerName: "Return No",
        field: "ReturnNo",
        width: 200,
      },
      {
        headerName: "Receive Date",
        field: "ProductReceiveFromReturnDate",
        width: 150,
      },

      {
        headerName: "Product Name",
        field: "productName",
        width: 320,
      },
      {
        headerName: "Type of Receive",
        field: "TypeofReturn",
        width: 170,
      },
      {
        headerName: "BOM For",
        field: "bomForType",
        width: 200,
      },
      {
        headerName: "Issue No.",
        field: "issueNo",
        width: 200,
      },
      {
        field: "Action",
        cellRenderer: "btnCellRenderer",
        cellRendererParams: {
          clicked: function (field: any) { },
        },
        minWidth: 250,
        editable: false,
        filter: false,
        shorable: false,
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
    };
    this.getMaster();
    this.loadFromDateShow.setDate(this.loadFromDateShow.getDate() - 1);
  }


  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.GetGridData();
  }
  GetGridData() {
    this.productionServiceService.GetReturnFromReceiveByIdDate(this.commonService.DateFormat(this.loadFromDateShow), this.commonService.DateFormat(this.loadToDateShow)
      , 0).subscribe((data: any) => {
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

  ////////////////////////////////// Ag Grid Data Load/////////////////////////////////
  private selectedRows = [];
  public onRowClicked(event) {
    this.selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked;
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
    debugger
    this.disabled = false;

    this.selectedRows.push(event.node.data);
    this.selectedRow = event.node.data;

    if (event.node.data.TypeofReturn == 'raw') {
      this.returnSelected = {
        id: 1,
        name: "Raw Materials(RM)",
      }
    }
    else {
      this.returnSelected = {
        id: 2,
        name: "Packing Materials(PM)",
      }
    }
    this.requisitionSelected = {
      id: event.node.data.PrdRequisitionMasterId,
      name: event.node.data.requisitionNo,
    }
    this.master = event.node.data;
    if (event.node.data.TypeofReturn == 'raw') {
      this.TypeofReturn = "Raw Materials(RM)";

    }
    else {
      this.TypeofReturn = "Packing Materials(PM)";
    }
    this.master.TypeofReceive = event.node.data.TypeofReturn;
    this.master.productReturnMasterId = event.node.data.productReturnMasterId;
    this.productionServiceService.GetProductReceiveFromReturnDetails(event.node.data.ProductReceiveFromReturnMasterId
    ).subscribe((list: any) => {
      if (list.success) {
        this.master.lstDetailsViewModel = list.data;

      }
      else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }

    })


    this.ngOnInit();
    //}
  }

  public ReturnList = [];
  loadReturnList() {
    this.productionServiceService.GetReturnMasterByIdDate(this.commonService.DateFormat(this.loadFromDateShow), this.commonService.DateFormat(this.loadToDateShow)
      , 0).subscribe((data: any) => {
        debugger
        if (data.success) {
          this.ReturnList =
            data.data.map((val) => ({

              id: val.productReturnMasterId,
              name: val.ReturnNo

            }));
        }
      });

  }

  public listData = [];

  public getReturnDataById(event) {
    debugger;
    var productReturnMasterId = event.id;
    this.productionServiceService.GetReturnMasterByIdDate(this.commonService.DateFormat(this.loadFromDateShow), this.commonService.DateFormat(this.loadToDateShow)
      , productReturnMasterId).subscribe((data: any) => {
        debugger
        if (data.success) {
          this.master = data.data[0];
          this.master.ProductReceiveFromReturnDate = new Date();
          if (data.data[0].TypeofReturn == 'raw') {
            this.master.TypeofReturn = "Raw Materials(RM)";
            this.master.TypeofReceive = 'raw';
          }
          else {
            this.master.TypeofReturn = "Packing Materials(PM)";
            this.master.TypeofReceive = 'packing';
          }
          this.productionServiceService.GetReturnDetailsByReturnMasterId(productReturnMasterId
          ).subscribe((list: any) => {
            if (list.success) {
              this.master.lstDetailsViewModel = list.data;
            }
          });
        }
      });

  }
  private agReport(event) {
    this.getReportData(event);
  }

  private agDelete(event) {
    var ProductReceiveFromReturnMasterId = event.node.data.ProductReceiveFromReturnMasterId;
    if (confirm('Are you sure?')) {
      this.productionServiceService.DeleteProductReceiveFromReturnById(ProductReceiveFromReturnMasterId).subscribe((data: any) => {
        if (data.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          this.productionServiceService.GetReturnFromReceiveByIdDate(this.commonService.DateFormat(this.loadFromDateShow), this.commonService.DateFormat(this.loadToDateShow)
            , 0).subscribe((data: any) => {
              if (data.success) {
                this.rowData = data.data;
              }
            });
        }
        else {
          this.toastrService.warning(data.message, "Message");
        }
      })
    }
  }

  public validateQty() {
    if (this.qty == null ? 0 : this.qty < 0) this.master.bomQty = 0;
  }
  public roundToDigit(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };
  @Output() myEvent = new EventEmitter();


  //#region Report

  public rbomProductSpecName: string = "";
  public rbomDescription: string = "";
  public rbomNo: string = "";
  public rbomDate: Date = null;
  public rPaymentDate: string = "";

  public rtotalQty: number = 0;
  public rbomQty: number = 0;
  public rgrandTotal: number = 0;

  public rReportHeader = "Material Receive From Return Report";
  public tableHeader = [
    "#",
    "Details Product Name",
    "Requisition Qty",
    "Issued Qty",
    "Received Qty",
    "Waste (%)",
    "Return Qty",

  ];
  public apiUrl = "";
  public htmlBodyData: string = "";

  rptHeader = "Product Issue"
  datalength: number;
  requisitionNo: string = "";
  reuisitionDate: Date = new Date();
  quantity: number = 0;
  TypeofReturn: string = "";

  pmProductName: string = "";
  Remarks = "";
  ReturnNo: string = "";
  ReturnDate: Date = new Date();
  issueType: string = "";
  requisitionId: number = 0;
  bodyData = [];
  headerData = [];
  params = [];
  ReceivedBy: string = "";
  gTotal: number = 0.00;
  public pmRequisitinDetailsData = [];
  public productNameforReport: string = '';

  public bomForType: string = "";

  public getReportData(event) {
    debugger
    this.master = event.node.data.data;
    this.pmProductName = event.node.data.productName;
    this.requisitionNo = event.node.data.reqNo;
    this.reuisitionDate = event.node.data.reqDate;
    this.quantity = event.node.data.bomQty;
    this.ReturnNo = event.node.data.ReturnNo;
    this.ReturnDate = event.node.data.ReturnDate;
    this.bomForType = event.node.data.bomForType;
    this.ReceivedBy = event.node.data.ReceivedBy;

    this.requisitionId = event.node.data.rmRequisitonId;
    if (event.node.data.TypeofReturn == 'raw') {
      this.TypeofReturn = "Raw Materials(RM)";
    }
    else {
      this.TypeofReturn = "Packing Materials(PM)";
    }
    this.productionServiceService.GetProductReceiveFromReturnDetails(event.node.data.ProductReceiveFromReturnMasterId
    ).subscribe((list: any) => {
      if (list.success) {
        this.pmRequisitinDetailsData = list.data;
        var fileName = this.rptHeader + ".pdf";
        const content = document.getElementById("reportHeader");
        this.generateReport("print", fileName, content, this.datalength);
      }
      else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }

    })

  }
  /////////////////////////////report
  public generateReport(
    buttonAction: any,
    fileName: string,
    content: any,
    datalength: number
  ) {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(5); //optional
    doc.setTextColor(40); //optional

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
    // legend.totalheight=legend.height+this.datalength;
    doc.html(content, {
      callback: function (doc) {
        autoTable(doc, {
          html: "#header_table_top",
          startY: legend.height + 50,
          styles: { font: "Meta", fontSize: 15, halign: "center" },
        });

        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 80,
          styles: { font: "Meta" },
        });


        autoTable(doc, {
          html: "#body_table1",
          startY: legend.height + 200,
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

  //#endregion Report


  public requisitionList = [];
  public requisitionType: string = "";

}

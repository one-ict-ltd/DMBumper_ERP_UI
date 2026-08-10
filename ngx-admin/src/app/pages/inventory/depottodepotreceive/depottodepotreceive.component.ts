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
import {
  NbComponentStatus,
  NbDateService,
  NbDialogService,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
import { NavigationStart, Router } from "@angular/router";
import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { ProducttransferService } from "app/services/inventory/producttransfer.service";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
import { ProductService } from "app/services/inventory/product.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { StockinService } from "app/services/inventory/stockin.service";
import { BranchService } from "app/services/erpsetting/branch.service";
import { from } from "rxjs";
import { Console } from "node:console";
import { StockreceiveService } from "app/services/inventory/stockreceive.service";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { ElementRef } from "@angular/core";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";
import { color } from "d3-color";

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: 'ngx-depottodepotreceive',
  templateUrl: './depottodepotreceive.component.html',
  styleUrls: ['./depottodepotreceive.component.scss']
})
export class DepottodepotreceiveComponent implements OnInit {

  master: {
    stockReceiveDate: Date;
    stockReceiveNo: string;
    receiveType: string;
    SbuId: number;
    prodTrnfrId: number;
    stockReceiveId: number;
    prodTrnNo: string;
    sbuName: string;
    productTransferNoSelected: {};
    ReceiveSbuSelected: {};
    companyId: number;
    lstDetailsViewModel: any[];
  };
  protected options: {};
  protected cd: ChangeDetectorRef;
  showMessages: any = {};
  errors: string[];

  disabled: boolean = false;
  disabledDdl: boolean = false;
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

  public pageNavigation = "Product Received (TR) [Depot To Depot Receive]";
  public rptHeader = "Product Received (TR)";

  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
      if (this.ReceiveSBUList.length > 0) {
        debugger;
        this.master.SbuId = this.ReceiveSBUList[0].id;
        this.master.ReceiveSbuSelected = { id: this.ReceiveSBUList[0].id, name: this.ReceiveSBUList[0].name };
        this.GetAllProductReceiveNumber(this.master.SbuId);
      }

    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
      this.disabledDdl = false;
    } else if (this.commonService.buttonClicked == "save") {
      this.save();
      //this.show = true;
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
      // this.show = true;
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
      stockReceiveDate: new Date(),
      stockReceiveNo: "",
      receiveType: 'D2D',
      SbuId: 0,
      prodTrnfrId: 0,
      prodTrnNo: "",
      stockReceiveId: 0,
      productTransferNoSelected: null,
      sbuName: "",
      ReceiveSbuSelected: null,
      lstDetailsViewModel: null,
      companyId: 0,
    };
    this.getStockReceiveNo();
  }

  public employeeItems = [];
  public companyItems = [];

  public agButtonAction() {
    if (this.commonService.agButtonClicked == "pin") {
      this.commonService.onPin(this.gridColumnApi);
    } else if (this.commonService.agButtonClicked == "unpin") {
      this.commonService.onClear(this.gridColumnApi);
    } else if (this.commonService.agButtonClicked == "refresh") {
      window.location.reload();
    } else if (this.commonService.agButtonClicked == "csv") {
      this.commonService.onExportCSV(this.gridApi, this.rptHeader);
    } else {
      console.log("Click action button");
    }
  }
  /////End of Dynamic Button section (Do Not Edit)///////

  /////////////////////////////// CRUD ///////////////////////////////////////////

  private save() {
    var button = this.commonService.buttonClicked;
    if (this.master.ReceiveSbuSelected == null) {
      this.toastrService.danger("Please select  sbu.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.productTransferNoSelected == null) {
      this.toastrService.danger("Please select transfer number.", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    this.show = true;
    this.master.stockReceiveDate = this.commonService.DateFormat(this.master.stockReceiveDate);

    this.stockreceive
      .SaveStockTransferReceive(this.master)
      .subscribe((returns: any) => {
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
          this.disabledDdl = false;
          this.getMaster();
          this.GetGridData();
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
  serverDate = [];
  loadFromDateShow: Date = new Date();
  loadToDateShow: Date = new Date();
  constructor(
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private ProducttransferService: ProducttransferService,
    private productrequisitionService: ProductrequisitionService,
    private productService: ProductService,
    private comboService: CommoncomboService,
    private stockinService: StockinService,
    private salesinvoiceService: SalesinvoiceService,
    protected dateService: NbDateService<Date>,
    private stockreceive: StockreceiveService
  ) {
    this.loadFromDateShow.setDate(this.loadFromDateShow.getDate() - 1);
    this.commonService.valueSet("showlist");
    this.getServerDateTime();
    this.getSBU(0);

    // this.columnDefs = [
    //   {
    //     headerName: "#",
    //     colId: "rowNum",
    //     valueGetter: "node.rowIndex + 1",
    //     pinned: "left",
    //     filter: false,
    //     width: 50,
    //   },
    //   {
    //     headerName: "stock Receive No.",
    //     field: "stockReceiveNo",
    //     width: 150,
    //   },
    //   {
    //     headerName: "purpose",
    //     field: "purpose",
    //     width: 150,
    //   },
    //   {
    //     headerName: "stock Receive Date",
    //     field: "stockReceiveDate",
    //     width: 180,
    //   },
    //   {
    //     headerName: "sbu Name",
    //     field: "sbuName",
    //     width: 160,
    //   },
    //   {
    //     field: "Action",
    //     cellRenderer: "btnCellRenderer",
    //     cellRendererParams: {
    //       clicked: function (field: any) { },
    //     },
    //     minWidth: 250,
    //     editable: false,
    //     filter: false,
    //     shorable: false,
    //     pinned: "right",
    //   },
    // ];
    this.columnDefs = [
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.rowIndex + 1",
        pinned: "left",
        filter: false,
        width: 70,
      },
      {
        headerName: "Receive No.",
        field: "stockReceiveNo",
        width: 200,
      },
      {
        headerName: "Receive Date",
        field: "stockReceiveDate",
        width: 150,
      },
      {
        headerName: "Transfer No.",
        field: "prodTrnNo",
        width: 200,
      },
      {
        headerName: "Issue Date",
        field: "prodTrnDate",
        width: 150,
      },
      {
        headerName: "Amount",
        field: "totalAmount",
        width: 120,
      },
      {
        headerName: "From Depot",
        field: "fromSbuName",
        width: 160,
      },
      {
        headerName: "To Depot",
        field: "sbuName",
        width: 160,
      },
      {
        headerName: "Remarks",
        field: "purpose",
        width: 150,
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
    this.getStockReceiveNo();
  }

  minDate: Date = new Date();
  maxDate: Date = new Date();
  currentDate: Date = new Date();
  getServerDateTime() {
    let apiUrl = `menu/getServerDateTime`;
    this.commonService.getApiData(apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        //console.log(returns);
        this.currentDate = new Date(returns.data[0].currentDate);
        this.minDate = this.dateService.addDay(new Date(returns.data[0].minReceiveDate), 0);
        this.maxDate = this.dateService.addDay(new Date(returns.data[0].maxReceiveDate), 0);
      } else {
        this.currentDate = new Date();
        this.minDate = new Date();
        this.maxDate = new Date();
      }
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.GetGridData();
  }
  GetGridData() {
    this.stockreceive.GetStockReceiveById(0, this.master.receiveType, this.loadFromDateShow, this.loadToDateShow).subscribe((data: any) => {
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
    this.commonService.agButtonClicked = "";
    if (data == "edit") {
      this.getMaster();
      this.agEdit(event);
      this.disabledDdl = true;
      this.show = false;
    } else if (data == "view") {
      this.agEdit(event);
      this.show = false;
      this.disabled = true;
      //this.disabledDdl = true;
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
      if (this.commonService.getUserGroup() == '1') {
        this.agDelete(event);
      }
      else {
        this.toastrService.info("Access denied", "Message");
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
      var sRId = event.node.data.stockReceiveId;
      var sbuId = event.node.data.sbuId;
      this.stockreceive.GetStockReceiveById(sRId, this.master.receiveType).subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0];
          console.log(data.data[0]);

          this.master.stockReceiveDate = new Date(this.master.stockReceiveDate);

          this.GetAllProductReceiveNumber(sbuId);
          this.getStore(sbuId);
          //this.GetProductTransferDetailsByMasterId(sRId);
          this.getStockReceiveIdWiseInUpdate(sRId);
          this.master.ReceiveSbuSelected = {
            id: this.master.SbuId,
            name: this.master.sbuName,
          };
          this.master.productTransferNoSelected = {
            id: this.master.prodTrnfrId,
            name: this.master.prodTrnNo,
          };
          this.master.receiveType = 'D2D';
          //console.log(this.master);
        }
      });
      this.ngOnInit();
    }
  }

  public pageNavigationreport = "Stock Receive";
  public tableHeader = [
    "#",
    "Product Name",
    "Pack Size",
    "Batch No.",
    "UOM",
    "Current Stock",
    "Received Qty."

  ];

  private agReport(event) {
    // this.generateStockReceiveReport(event.data.stockReceiveId);
    this.generateCrReport("Pdf", event.data.stockReceiveId);
  }

  apiUrl: any = ""
  generateCrReport(reportFormat: any, stockReceiveId: any) {
    // debugger;

    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();


    //console.log("userInfo[0].employeeid", userInfo[0].employeeid);
    let reportHeaderName = "Depot To Depot Stock Receive"; //"Product Received (TR)"
    this.apiUrl = `SalesInvoiceReport/GetStockReceiveReport?reportFormat=${reportFormat}&userId=${userInfo[0].employeeid}&stockReceiveId=${stockReceiveId}&reportHeader=${reportHeaderName}`;

    //console.log(this.apiUrl);
    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }

  public params = [];
  public setParam() {
    this.params = [];
    this.params.push({
      leftLabel: "Voucher No",
      leftValue: "",
      rightLabel: "Voucher Date",
      rightValue: "",
    });
  }
  public datalength: number;
  public sbuName = "";
  public stockReceiveNo = "";
  public requisitionNo = "";
  public transferNo = "";
  public stockReceiveDate = "";
  public prodTrnDate = "";
  public driver = "";
  public vehicle = "";
  public bodyData = [];
  public generateStockReceiveReport(stockReceiveId) {
    this.stockreceive
      .getStockReceiveReportById(stockReceiveId)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.bodyData = returns.data;
          this.sbuName = this.bodyData[0].sbuName;
          this.stockReceiveNo = this.bodyData[0].stockReceiveNo;
          this.requisitionNo = this.bodyData[0].prodReqNo;
          this.transferNo = this.bodyData[0].prodTrnNo;

          this.stockReceiveDate = this.bodyData[0].stockReceiveDate;
          this.prodTrnDate = this.bodyData[0].prodTrnDate;
          this.driver = this.bodyData[0].driverName;
          this.vehicle = this.bodyData[0].vehicleNo;

          this.setParam();
          var fileName = this.rptHeader + ".pdf";
          const content = document.getElementById("reportHeader");
          this.generateReport("print", fileName, content, this.datalength);
        } else {
          this.toastrService.danger("Message", this.commonService.nodatafound);
        }
      });
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
          startY: legend.height + 30,
          styles: { font: "Meta", fontSize: 15, halign: "center" },
          bodyStyles: {
            //fillColor: [216, 216, 216],
            textColor: 50,
          },
          alternateRowStyles: {
            //fillColor: [250, 250, 250],
          },
        });
        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 80,
          styles: { font: "Meta" },
          bodyStyles: {
            fillColor: [250, 250, 250],
            textColor: 50,
          },
          alternateRowStyles: {
            fillColor: [250, 250, 250],
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
          columnStyles: {
            5: { halign: "right" },
            6: { halign: "right" },
            //5: { halign: "right" },
          },
          bodyStyles: {
            //fillColor: [216, 216, 216],
            textColor: 50,
          },
          alternateRowStyles: {
            //fillColor: [250, 250, 250],
          },
        });

        // autoTable(doc, {
        //   html: "#footer_table",
        //   startY: legend.totalheight + 300,
        //   theme: "grid",
        //   tableLineColor: [0, 0, 0],
        //   tableLineWidth: 0.75,
        //   styles: {
        //     font: "Meta",
        //     lineColor: [44, 62, 80],
        //     lineWidth: 0.55,
        //   },
        //   headStyles: {
        //     fillColor: [105, 105, 105],
        //     fontSize: 11,
        //   },
        //   bodyStyles: {
        //     fillColor: [216, 216, 216],
        //     textColor: 50,
        //   },
        //   alternateRowStyles: {
        //     fillColor: [250, 250, 250],
        //   },
        // });
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
    //console.log(event.node.data);
    if (confirm('Are sure to delete?')) {
      let masterId = event.node.data.stockReceiveId;
      // this.ProducttransferService.DeleteProductTransferById(
      this.stockreceive.DeleteStockTransferReceiveById(
        masterId
      ).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          //////////////Grid Refresh ///////////////////
          this.GetGridData();
          //////////////Grid Refresh ///////////////////
        }
      });
    }
  }

  public sbus = [];
  public ReceiveSBUList = [];
  //public tosbus = [];
  public getSBU(companyId) {
    this.productTransferList = [];
    this.comboService.getSBU(companyId).subscribe((returns: any) => {
      this.ReceiveSBUList = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
    });
  }

  public StoreList = [];
  public getStore(fromsbuId: number) {
    this.stockinService
      .getStore(fromsbuId, this.master.companyId)
      .subscribe((returns: any) => {
        this.StoreList = returns.data.map((val) => ({
          id: val.storeId,
          name: val.storeName,
        }));
      });
  }

  public getCurrentStock(index: number) {
    let productWiseSpecificationId = 0;
    let storeId = 0;
    let batchNo = '';
    let currentStock: number = 0;

    if (this.master.lstDetailsViewModel.length > 0) {
      productWiseSpecificationId =
        this.master.lstDetailsViewModel[index].productWiseSpecificationId;
      storeId = this.master.lstDetailsViewModel[index].storeId;
      this.master.lstDetailsViewModel[index].CurrentStock = currentStock;
      batchNo = this.master.lstDetailsViewModel[index].batchNo;

      this.salesinvoiceService.GetCurrentStock(storeId, productWiseSpecificationId, batchNo).subscribe((returns: any) => {
        if (returns.success) {
          currentStock =
            returns.data[0].length == 0 ? 0 : returns.data[0].currentStock;
          this.master.lstDetailsViewModel[index].CurrentStock = currentStock;
        }
      });
    }
  }

  public getStockReceiveNo() {
    if (this.master.stockReceiveDate == null) {
      this.master.stockReceiveDate = new Date();
    }
    this.stockreceive
      .GetMaxStockReceiveNumber(
        this.commonService.DateFormat(this.master.stockReceiveDate), this.master.receiveType
      )
      .subscribe((returns: any) => {
        if (returns.success) {
          this.master.stockReceiveNo = returns.data[0].MaxNo;
        }
      });
  }

  public productTransferList = [];
  public GetAllProductReceiveNumber(sbuId) {
    this.master.productTransferNoSelected = {};
    this.stockreceive
      .GetAllProductReceiveNumber(sbuId, this.master.receiveType)//'D2D')
      .subscribe((returns: any) => {
        this.productTransferList = returns.data.map((val: any) => ({
          id: val.prodTrnfrId,
          name: val.prodTrnNo,
        }));
      });

    this.getStore(sbuId);
  }

  public getProductTransferStockDetails(prodTrnfrId) {
    this.master.prodTrnfrId = prodTrnfrId;
    this.getPTDetails(this.master.prodTrnfrId);
  }

  public getPTDetails(prodTrnfrId) {
    //console.log("hit getProductTransferStockDetails");
    this.stockreceive
      .GetProductTransferDetailsById(prodTrnfrId)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.master.lstDetailsViewModel = returns.data;
          if (this.StoreList.length > 0) {

            for (let index = 0; index < this.master.lstDetailsViewModel.length; index++) {
              //const element = this.master.lstDetailsViewModel[index];
              this.master.lstDetailsViewModel[index].storeId = this.StoreList[0].id;

              this.master.lstDetailsViewModel[index].StoreSelected = {
                id: this.StoreList[0].id,
                name: this.StoreList[0].name,
              };

              this.salesinvoiceService.GetCurrentStock(this.master.lstDetailsViewModel[index].storeId, this.master.lstDetailsViewModel[index].productWiseSpecificationId, this.master.lstDetailsViewModel[index].batchNo).subscribe((returns: any) => {
                if (returns.success) {
                  let currentStock = returns.data[0].length == 0 ? 0 : returns.data[0].currentStock;
                  this.master.lstDetailsViewModel[index].CurrentStock = currentStock;
                }
              });
            }

            this.master.lstDetailsViewModel.forEach(detail => {
              detail.StoreSelected = {
                id: this.StoreList[0].id,
                name: this.StoreList[0].name,
              };
            });

          }
        } else this.master.lstDetailsViewModel = [];
      });


  }

  public getStockReceiveIdWiseInUpdate(stockReceiveId) {
    this.stockreceive
      .getStockReceiveIdWiseInUpdate(stockReceiveId)
      .subscribe((data: any) => {
        if (data.success) {
          console.log(this.master.lstDetailsViewModel);
          console.log(data.data);
          this.master.lstDetailsViewModel = data.data;
          this.getStore(0);
          this.master.lstDetailsViewModel.map((detail) => {
            return (detail.StoreSelected = {
              id: detail.storeId,
              name: detail.storeName,
            });
          });
        }
      });
  }

  public GetProductTransferDetailsByMasterId(stockReceiveId) {
    //debugger;
    this.ProducttransferService.GetProductTransferDetailsByMasterId(
      stockReceiveId
    ).subscribe((data: any) => {
      if (data.success) {
        this.master.lstDetailsViewModel = data.data;
        //console.log(this.master);
      }
    });
  }

  public refesh() {
    this.master.lstDetailsViewModel = [];
    this.toastrService.warning(this.commonService.warningmsg, "Message");
  }

  //////////////////////////////////End of Ag Grid Data Load/////////////////////////////////

  @Output() myEvent = new EventEmitter();
  public deleteRow(state, action) {
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

  data: Country[] = [
    {
      name: "Russia",
      flag: "f/f3/Flag_of_Russia.svg",
      area: 17075200,
      population: 146989754,
    },
    {
      name: "Canada",
      flag: "c/cf/Flag_of_Canada.svg",
      area: 9976140,
      population: 36624199,
    },
    {
      name: "United States",
      flag: "a/a4/Flag_of_the_United_States.svg",
      area: 9629091,
      population: 324459463,
    },
    {
      name: "China",
      flag: "f/fa/Flag_of_the_People%27s_Republic_of_China.svg",
      area: 9596960,
      population: 1409517397,
    },
  ];

  names: any;
  openWithDataObjModel(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
      context: this.data,
    });
  }
  openWithDataModel() {
    this.dialogService
      .open(DialogNamePromptComponent)
      .onClose.subscribe((name) => name && this.names.push(name));
  }
  /////////////////////////////
}
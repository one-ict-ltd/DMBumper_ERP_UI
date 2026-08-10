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
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";
import { SalesreturnService } from "app/services/sales/salesreturn.service";
import { PurchasereturnService } from "../purchasereturn.service";
import { PurchaseorderService } from "../purchaseorder.service";

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: "ngx-purchasereturn",
  templateUrl: "./purchasereturn.component.html",
  styleUrls: ["./purchasereturn.component.scss"],
})
export class PurchasereturnComponent implements OnInit {
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
    //debugger;
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Purchase Return";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      //this.openConfirmPopup("");
      this.save();
      // this.show = true;
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

  master: {
    purchaseReturnMasterId: number;
    purchaseOrderId: number;
    purchaseReturnNo: string;
    comments: string;
    purchaseReturnDate: Date;

    storeId: number;
    partyId: number;
    partyName: string;
    partySelected: {};
    purchaseOrderSelected: {};

    grossAmount: number;
    totalVatAmount: number;
    totalAitAmount: number;
    freightChargeAmount: number;
    totalDiscountAmount: number;
    netAmount: number;

    isActive: number;
    isDelete: number;

    uomName: string;
    productId: number;
    productWiseSpecificationId: number;
    purchaseOrderDetailsId: number;
    productName: string;
    productSpecSelected: {};

    price: number;
    returnQty: number;
    vat: number;
    ait: number;
    discountAmount: number;
    total: number;

    storeSlected: {};
    lstDetailsViewModel: any[];
    lstPODetails: any[];
  };

  public getMaster() {
    this.master = {
      purchaseReturnMasterId: 0,
      purchaseOrderId: 0,
      purchaseReturnNo: "",
      comments: "",
      purchaseReturnDate: new Date(),

      storeId: 0,
      partyId: 0,
      partyName: "",
      partySelected: null,
      purchaseOrderSelected: null,

      grossAmount: 0,
      totalVatAmount: 0,
      totalAitAmount: 0,
      totalDiscountAmount: 0,
      netAmount: 0,
      freightChargeAmount: 0,

      isActive: 1,
      isDelete: 0,

      uomName: "",

      productId: 0,
      productWiseSpecificationId: 0,
      purchaseOrderDetailsId: 0,
      productName: "",
      productSpecSelected: null,

      price: 0,
      returnQty: 0,
      vat: 0,
      ait: 0,
      discountAmount: 0,
      total: 0,

      storeSlected: null,
      lstDetailsViewModel: [],
      lstPODetails: [],
    };
    this.getMaxNo();
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

  /////////////////////////////// CRUD ///////////////////////////////////////////

  private save() {
    //debugger;
    var button = this.commonService.buttonClicked;

    if (this.master.purchaseReturnDate == null) {
      this.toastrService.danger("Please select return date.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    ////debugger;
    if (this.master.partySelected == null) {
      this.toastrService.danger("Please select supplier.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.storeSlected == null) {
      this.toastrService.danger("Please select store.", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    if (
      this.master.lstDetailsViewModel.length == 0 ||
      this.master.lstDetailsViewModel == null
    ) {
      this.toastrService.danger("Please select po.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    this.show = true;
    console.log(this.master);
    this.purchasereturnService
      .SavePurchaseReturnMaster(this.master)
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

          this.getMaster(); //////////////Grid Refresh ///////////////////
          //debugger;
          this.purchasereturnService
            .GetPurchaseReturnMasterByMasterId(0)
            .subscribe((data: any) => {
              //debugger;
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
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private ProducttransferService: ProducttransferService,
    private productrequisitionService: ProductrequisitionService,
    private productService: ProductService,
    private comboService: CommoncomboService,
    private stockinService: StockinService,
    private salesinvoiceService: SalesinvoiceService,
    private purchasereturnService: PurchasereturnService,
    private PurchaseorderService: PurchaseorderService,
    private datePipe: DatePipe
  ) {
    this.commonService.valueSet("showlist");
    this.GetAllPartysByTypeId(0);

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
        headerName: "Return No.",
        field: "purchaseReturnNo",
        width: 150,
      },
      {
        headerName: "Return Date",
        field: "purchaseReturnDate",
        width: 140,
      },
      {
        headerName: "PO No.",
        field: "purOrderNo",
        width: 150,
      },
      {
        headerName: "Supplier Name",
        field: "partyName",
        width: 180,
      },
      {
        headerName: "Gross Amount",
        field: "grossAmount",
        width: 150,
        valueFormatter: (params) =>
          this.currencyFormatter(params.data.grossAmount),
        type: "rightAligned",
      },
      {
        headerName: "Net Amount",
        field: "netAmount",
        width: 150,
        valueFormatter: (params) =>
          this.currencyFormatter(params.data.netAmount),
        type: "rightAligned",
      },
      {
        headerName: "Comments",
        field: "comments",
        width: 300,
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
    //debugger;
    this.getMaster();
    this.getMaxNo();
    this.getStore();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.purchasereturnService
      .GetPurchaseReturnMasterByMasterId(0)
      .subscribe((data: any) => {
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
      var purchaseReturnMasterId = event.node.data.purchaseReturnMasterId;
      //debugger;
      this.getStore();
      this.purchasereturnService
        .GetPurchaseReturnMasterByMasterId(purchaseReturnMasterId)
        .subscribe((data: any) => {
          if (data.success) {
            this.master = data.data[0];

            this.master.partySelected = {
              id: this.master.partyId,
              name: this.master.partyName,
            };

            this.GetPOListByCustomer(data.data[0].partyId);

            this.master.purchaseOrderSelected = {
              id: data.data[0].purchaseOrderId,
              name: data.data[0].purOrderNo,
            };

            this.master.storeSlected = {
              id: data.data[0].storeId,
              name: data.data[0].storeName,
            };

            this.purchasereturnService
              .GetPurchaseReturnDetailsByMasterId(purchaseReturnMasterId)
              .subscribe((data: any) => {
                if (data.success) {
                  this.master.lstDetailsViewModel = data.data;
                  console.log(this.master);
                }
                this.calculateGrandTotal();
              });
            console.log(this.master);
          }
        });
      this.ngOnInit();
    }
  }

  public currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

  private agReport(event) {
    this.generateReport(event.data.purchaseReturnMasterId);
  }

  private agDelete(event) {
    this.master.purchaseReturnMasterId = event.node.data.purchaseReturnMasterId;
    this.purchasereturnService
      .DeletePurchaseReturnMasterByMasterId(this.master.purchaseReturnMasterId)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          this.purchasereturnService
            .GetPurchaseReturnMasterByMasterId(0)
            .subscribe((data: any) => {
              if (data.success) {
                this.rowData = data.data;
              }
            });
        }
      });
  }

  public StoreList = [];
  public getStore() {
    this.stockinService.getStore(0, 0).subscribe((returns: any) => {
      this.StoreList = returns.data.map((val) => ({
        id: val.storeId,
        name: val.storeName,
      }));
    });
  }

  public getMaxNo() {
    this.purchasereturnService
      .GetMaxPurchaseReturnNumber(
        this.datePipe.transform(this.master.purchaseReturnDate, "yyyy-MM-dd")
      )
      .subscribe((returns: any) => {
        //debugger;
        if (returns.success) {
          this.master.purchaseReturnNo = returns.data[0].MaxNo;
        }
      });
  }

  public partyList = [];
  public GetAllPartysByTypeId(partyTypeId: any) {
    this.salesinvoiceService
      .GetAllPartysByTypeId(partyTypeId)
      .subscribe((returns: any) => {
        this.partyList = returns.data.map((val: any) => ({
          id: val.partyId,
          name: val.partyName,
        }));
      });
  }

  public ddlPOList = [];
  public GetPOListByCustomer(supplierId) {
    this.purchasereturnService
      .GetPOListBySupplierId(supplierId)
      .subscribe((returns: any) => {
        this.ddlPOList = returns.data.map((val: any) => ({
          id: val.purchaseOrderId,
          name: val.purOrderNo,
        }));
      });
  }

  private getPODetails(purchaseOrderId) {
    this.master.lstDetailsViewModel = [];
    this.PurchaseorderService.getPurchaseOrderDetailsInUpdate(
      purchaseOrderId
    ).subscribe((data: any) => {
      if (data.success) {
        //debugger;
        //this.master.lstDetailsViewModel = data.data;

        this.master.lstPODetails = data.data;
        this.master.lstPODetails.forEach((row) => {
          let details = {
            purchaseOrderDetailsId: row.purchaseOrderDetailsId,
            productId: row.productId,
            productWiseSpecificationId: row.productWiseSpecificationId,
            productName: row.productName,
            purchaseQty: row.reqQty,
            returnQty: 0,
            unitPrice: row.price,
            vatPercent: row.vatPercent,
            aitPercent: row.aitPercent,
            discountPercent: row.discountPercent,
            totalAmount: row.totalAmount,
          };
          this.master.lstDetailsViewModel.push(details);
        });
        this.calculateGrandTotal();
      }
    });
  }

  public calculateTotal(index: any) {
    let totalPrice = 0;
    let returnQty =
      this.master.lstDetailsViewModel[index].returnQty == ""
        ? 0
        : this.master.lstDetailsViewModel[index].returnQty;
    let price =
      this.master.lstDetailsViewModel[index].unitPrice == ""
        ? 0
        : this.master.lstDetailsViewModel[index].unitPrice;
    let vat =
      this.master.lstDetailsViewModel[index].vatPercent == ""
        ? 0
        : this.master.lstDetailsViewModel[index].vatPercent;
    let ait =
      this.master.lstDetailsViewModel[index].aitPercent == ""
        ? 0
        : this.master.lstDetailsViewModel[index].aitPercent;
    let discountAmount =
      this.master.lstDetailsViewModel[index].discountPercent == ""
        ? 0
        : this.master.lstDetailsViewModel[index].discountPercent;

    totalPrice = returnQty * price;
    vat = totalPrice * (vat / 100);
    ait = totalPrice * (ait / 100);
    discountAmount = totalPrice * (discountAmount / 100);

    this.master.lstDetailsViewModel[index].totalAmount =
      totalPrice + vat + ait - discountAmount;
    this.calculateGrandTotal();
  }

  calculateGrandTotal() {
    let totalGross = 0;
    this.master.lstDetailsViewModel.forEach((row) => {
      totalGross += row.totalAmount == "" ? 0 : row.totalAmount;
    });
    let totalVat =
      this.master.totalVatAmount == null ? 0 : this.master.totalVatAmount;
    let totalDiscountAmount =
      this.master.totalDiscountAmount == null
        ? 0
        : this.master.totalDiscountAmount;
    totalVat = totalVat - totalDiscountAmount;
    let totalAit =
      this.master.totalAitAmount == null ? 0 : this.master.totalAitAmount;
    let shippingCost =
      this.master.freightChargeAmount == null
        ? 0
        : this.master.freightChargeAmount;

    this.master.grossAmount = totalGross;
    this.master.netAmount = totalGross + totalVat + totalAit + shippingCost;
  }

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

  //#region Report

  public purchaseReturnNo = "";
  public comments = "";
  public purchaseReturnDate = "";
  public purOrderNo = "";
  public partyName = "";
  public contactNumber = "";
  public addressLine = "";

  public rtotalGross: number = 0;
  public rtotalVat: number = 0;
  public rtotalAit: number = 0;
  public rfreightcharge: number = 0;
  public rtotalDiscountAmount: number = 0;
  public rgrandTotal: number = 0;

  public tableHeader = [
    "#",
    "Product Name",
    "PO Qty",
    "Return Qty",
    "Price",
    "Total",
  ];
  public apiUrl = "";
  public htmlBodyData: string = "";

  public params = [];
  public bodyData: any = [];
  public bodyDatashow: any = [];
  public datalength: number;

  public generateReport(purchaseReturnMasterId) {
    this.purchasereturnService
      .GetPurchaseReturnDetailsByMasterId(purchaseReturnMasterId)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.bodyData = returns.data;

          this.purchaseReturnNo = this.bodyData[0].purchaseReturnNo;
          this.comments = this.bodyData[0].comments;
          this.purchaseReturnDate = this.bodyData[0].purchaseReturnDate;
          this.purOrderNo = this.bodyData[0].purOrderNo;
          this.partyName = this.bodyData[0].partyName;
          this.contactNumber = this.bodyData[0].contactNumber;
          this.addressLine = this.bodyData[0].addressLine;

          this.rtotalGross = this.bodyData[0]["grossAmount"];
          this.rtotalVat = this.bodyData[0]["totalVatAmount"];
          this.rtotalAit = this.bodyData[0]["totalAitAmount"];
          this.rfreightcharge = this.bodyData[0]["freightChargeAmount"];
          this.rtotalDiscountAmount = this.bodyData[0]["totalDiscountAmount"];
          this.rgrandTotal = this.bodyData[0]["netAmount"];

          var fileName = this.pageNavigation + ".pdf";
          const content = document.getElementById("reportHeader");
          this.generateReportPdf("print", fileName, content, this.datalength);
        } else {
          this.toastrService.danger("Message", this.commonService.nodatafound);
        }
      });
  }

  public generateReportPdf(
    buttonAction: any,
    fileName: string,
    content: any,
    datalength: number
  ) {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(5);
    doc.setTextColor(40);
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
          columnStyles: {
            2: { halign: "center" },
            3: { halign: "center" },
            4: { halign: "right" },
            5: { halign: "right" },
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

  //#endregion Report

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

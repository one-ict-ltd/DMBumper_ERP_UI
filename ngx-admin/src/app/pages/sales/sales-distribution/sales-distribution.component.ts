import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from "@angular/core";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
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
import { SalesDistributionService } from "app/services/sales/sales-distribution.service";
import { FieldforcemasterService } from "app/services/fieldforcetracking/fieldforcemaster.service";
import { DatePipe } from "@angular/common";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

@Component({
  selector: "ngx-sales-distribution",
  templateUrl: "./sales-distribution.component.html",
  styleUrls: ["./sales-distribution.component.scss"],
})
export class SalesDistributionComponent implements OnInit {
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

  public pageNavigation = "Sales Distribution";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      this.save();
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
    } else if (this.commonService.buttonClicked == "view") {
      this.show = false;
    } else if (this.commonService.buttonClicked == "reset") {
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      this.show = false;
    }
  }

  master: {
    distributionMasterId: number;
    distributionNumber: string;
    distributionDate: Date;
    deliveryManName: string;
    deliveryManMobile: string;
    deliveryAddress: string;
    vehicleNo: string;
    driverName: string;
    driverMobile: string;
    isActive: number;
    lstDetailsViewModel: any[];
  };

  public getMaster() {
    this.master = {
      distributionMasterId: 0,
      distributionNumber: "",
      distributionDate: new Date(),
      deliveryManName: "",
      deliveryManMobile: "",
      deliveryAddress: "",
      vehicleNo: "",
      driverName: "",
      driverMobile: "",
      isActive: 1,
      lstDetailsViewModel: [],
    };
    this.getMaxNo();
    this.zoneCode = 0;
    this.ZoneCodeSelected = {};
    this.depoCode = "";
    this.DepotSelected = {};
    this.salesInvoiceSelected = {};
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

  private CorrectDateFormat2(dateTimeValu: Date): string {
    let date = this.datePipe.transform(dateTimeValu, "yyyy-MMM-dd");
    return date;
  }

  private CorrectDateFormat(dateTimeValu: any): any {
    let date = this.datePipe.transform(dateTimeValu, "yyyy-MMM-dd");
    return new Date(date);
  }

  private save() {
    var button = this.commonService.buttonClicked;
    this.master.distributionDate = this.CorrectDateFormat(
      this.master.distributionDate
    );

    if (this.master.distributionDate == null) {
      this.toastrService.danger("Please select invoice date.", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    if (
      this.master.lstDetailsViewModel.length == 0 ||
      this.master.lstDetailsViewModel == null
    ) {
      this.toastrService.danger("Please entry product.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    this.show = true;

    //console.log(this.master);
    this.master.distributionDate = this.commonService.DateFormat(this.master.distributionDate);

    this.SalesDistributionService.SaveSalesDistribution(this.master).subscribe(
      (returns: any) => {
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
          this.SalesDistributionService.GetSalesDistributionById(0).subscribe(
            (data: any) => {
              if (data.success) {
                this.rowData = data.data;
              }
            }
          );
        }
      }
    );
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
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private SalesDistributionService: SalesDistributionService,
    private fieldforcemasterService: FieldforcemasterService,
    private datePipe: DatePipe
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
        headerName: "Distribution No.",
        field: "distributionNumber",
        width: 150,
      },
      {
        headerName: "Distribution Date",
        field: "distributionDate",
        width: 150,
      },
      {
        headerName: "Invoice Number",
        field: "salesInvoiceNo",
        width: 180,
      },
      {
        headerName: "Party Name",
        field: "partyName",
        width: 180,
      },
      {
        headerName: "Delivery Address",
        field: "deliveryAddress",
        width: 260,
      },
      {
        headerName: "Status",
        field: "approvalStatus",
        width: 120,
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
    this.LoadAllDropdown();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.SalesDistributionService.GetSalesDistributionById(0).subscribe(
      (data: any) => {
        if (data.success) {
          this.rowData = data.data;
        }
      }
    );
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
      var distributionMasterId = event.node.data.distributionMasterId;

      //this.getStore();
      this.SalesDistributionService.GetSalesDistributionById(
        distributionMasterId
      ).subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0];

          this.GetZone();

          this.SalesDistributionService.GetSalesDistributionDetailsByMasterId(
            distributionMasterId
          ).subscribe((data: any) => {
            if (data.success) {
              this.master.lstDetailsViewModel = data.data;
              console.log(this.master);

              this.ZoneCodeSelected = {
                id: data.data[0].zoneCode,
                name: data.data[0].zoneName,
              };

              this.GetDepo(data.data[0].zoneCode);

              this.DepotSelected = {
                id: data.data[0].depotCode,
                name: data.data[0].depotName,
              };
            }

            this.calculateGrandTotal();
          });
          this.master.distributionDate = new Date(this.master.distributionDate);
        }
      });
      this.ngOnInit();
    }
  }

  private agReport(event) {
    //this.toastrService.info("Print button clicked", "Message");
    this.generateReport("print", event.data.distributionMasterId);
  }
  private agDelete(event) {
    this.master.distributionMasterId = event.node.data.distributionMasterId;
    this.SalesDistributionService.DeleteSalesDistributionById(
      this.master.distributionMasterId
    ).subscribe((returns: any) => {
      if (returns.success) {
        this.toastrService.success(this.commonService.deletedmsg, "Message");

        this.SalesDistributionService.GetSalesDistributionById(0).subscribe(
          (data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          }
        );
      }
    });
  }

  public validateInvoiceQty() {
    // if (this.master.invoiceQty == null ? 0 : this.master.invoiceQty > this.master.currentStock)
    //   this.master.invoiceQty = 0;
  }

  public getMaxNo() {
    // console.log(this.master.distributionDate);
    // this.master.distributionDate = this.CorrectDateFormat(this.master.distributionDate);
    // console.log(this.master.distributionDate);

    let date = this.CorrectDateFormat2(this.master.distributionDate);
    this.SalesDistributionService.GetMaxSalesDistributionNumber(date).subscribe(
      (returns: any) => {
        //this.SalesDistributionService.GetMaxSalesDistributionNumber(this.datePipe.transform(this.master.distributionDate, "yyyy-MM-dd")).subscribe((returns: any) => {
        if (returns.success) {
          this.master.distributionNumber = returns.data[0].MaxNo;
        }
      }
    );
  }

  LoadAllDropdown() {
    this.GetZone();
    debugger;
    if (this.ZoneList.length <= 0) {
      this.GetInvoiceListWithoutDepot();
    }
  }

  zoneCode: number = 0;
  ZoneCodeSelected = {};
  ZoneList = [];
  GetZone() {
    this.fieldforcemasterService.getZone(0).subscribe((retuns: any) => {
      if (retuns.length > 0) {
        this.ZoneList = retuns.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }));
      }
    });
  }

  depoCode: string = "";
  DepotSelected = {};
  DepoList = [];
  GetDepo(ZoneCode) {
    this.DepotSelected = {};
    this.salesInvoiceList = [];
    this.salesInvoiceSelected = {};
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

  salesInvoiceId: number = 0;
  salesInvoiceList: [];
  salesInvoiceSelected: {};

  GetInvoiceList() {
    this.SalesDistributionService.GetDepoWiseSalesInvoiceList(
      this.depoCode
    ).subscribe((returns: any) => {
      this.salesInvoiceList = returns.data.map((val: any) => ({
        id: val.salesInvoiceId,
        name: val.salesInvoiceNo,
        storeId: val.storeId,
      }));
    });
  }

  GetInvoiceListWithoutDepot() {
    this.depoCode = "";
    this.GetInvoiceList();
  }

  getSalesInvoiceDetails() {
    this.SalesDistributionService.GetSalesDistributionDetailsByInvoiceId(
      this.salesInvoiceId
    ).subscribe((returns: any) => {
      if (returns.success) {
        this.master.lstDetailsViewModel = returns.data;
      }
    });
  }

  // public partyList = [];
  // public GetAllPartysByTypeId(partyTypeId: any) {
  //   this.SalesDistributionService.GetAllPartysByTypeId(partyTypeId).subscribe((returns: any) => {
  //     this.partyList = returns.data.map((val: any) => ({
  //       id: val.partyId,
  //       name: val.deliveryManName,
  //       deliveryAddress: val.deliveryAddress,
  //       deliveryManMobile: val.deliveryManMobile,
  //     }));
  //   });
  // }

  // public GetPartyDetails() {
  //   this.master.deliveryManMobile = this.master.partySelected["deliveryManMobile"];
  //   this.master.deliveryAddress = this.master.partySelected["deliveryAddress"];
  // }

  // public getProductSpecDetails() {
  //   this.master.productId = this.master.productSpecSelected["productId"];
  //   this.master.price = this.master.productSpecSelected["price"];
  //   this.master.uomName = this.master.productSpecSelected["uomName"];
  //   this.master.productName = this.master.productSpecSelected["name"];
  //   this.master.productWiseSpecificationId = this.master.productSpecSelected["id"];
  //   this.getCurrentStock();
  // }

  // public productSpecList = [];
  // public getAllProductForRequisition() {
  //   this.productrequisitionService.getAllProductForRequisition().subscribe((returns: any) => {
  //     this.productSpecList = returns.data.map((val: any) => ({
  //       id: val.productWiseSpecificationId,
  //       name: val.productName,
  //       uomId: val.uomId,
  //       uomName: val.uomName,
  //       productId: val.productId,
  //       price: val.price,
  //     }));
  //   });
  // }

  public calculateTotal(index: any) {
    // let totalPrice = 0;
    // let invoiceQty = this.master.lstDetailsViewModel[index].invoiceQty == "" ? 0 : this.master.lstDetailsViewModel[index].invoiceQty;
    // let price = this.master.lstDetailsViewModel[index].price == "" ? 0 : this.master.lstDetailsViewModel[index].price;
    // let vat = this.master.lstDetailsViewModel[index].vat == "" ? 0 : this.master.lstDetailsViewModel[index].vat;
    // let ait = this.master.lstDetailsViewModel[index].ait == "" ? 0 : this.master.lstDetailsViewModel[index].ait;
    // let discountAmount = this.master.lstDetailsViewModel[index].discountAmount == "" ? 0 : this.master.lstDetailsViewModel[index].discountAmount;
    // totalPrice = (invoiceQty * price);
    // vat = (totalPrice * (vat / 100));
    // ait = (totalPrice * (ait / 100));
    // discountAmount = (totalPrice * (discountAmount / 100));
    // this.master.lstDetailsViewModel[index].total = (totalPrice + vat + ait) - discountAmount;
    // this.calculateGrandTotal();
  }

  calculateGrandTotal() {
    // let totalGross = 0;
    // this.master.lstDetailsViewModel.forEach(row => {
    //   totalGross += row.total == "" ? 0 : row.total;
    // });
    // let totalVat = this.master.totalVat == null ? 0 : this.master.totalVat;
    // let totalDiscountAmount = this.master.totalDiscountAmount == null ? 0 : this.master.totalDiscountAmount;
    // totalVat = totalVat - totalDiscountAmount;
    // let totalAit = this.master.totalAit == null ? 0 : this.master.totalAit;
    // let shippingCost = this.master.shippingCost == null ? 0 : this.master.shippingCost;
    // this.master.totalGross = totalGross;
    // this.master.grandTotal = (totalGross + totalVat + totalAit + shippingCost);
  }

  public addToDetailsGrid() {
    // if (this.master.productSpecSelected == null) {
    //   this.toastrService.danger("Please select product.", "Message");
    //   return;
    // }
    // if (this.master.invoiceQty == 0) {
    //   this.toastrService.danger("Quantity is zero.", "Message");
    //   return;
    // }
    // if (this.master.price == 0) {
    //   this.toastrService.danger("Price is zero.", "Message");
    //   return;
    // }

    // let totalPrice = ((this.master.invoiceQty == null ? 0 : this.master.invoiceQty) * (this.master.price == null ? 0 : this.master.price));
    // totalPrice = totalPrice - (totalPrice * ((this.master.discountAmount == null ? 0 : this.master.discountAmount) / 100));
    // let vat = (totalPrice * (this.master.vat == null ? 0 : this.master.vat / 100));
    // let ait = (totalPrice * (this.master.vat == null ? 0 : this.master.vat / 100));
    // //let discountAmount = (totalPrice * (this.master.discountAmount / 100));

    //this.master.total = (totalPrice + vat + ait);
    return;
    let elements = {
      salesInvDetailsId: 0,
      distributionMasterId: this.master.distributionMasterId,
      // productWiseSpecificationId: this.master.productWiseSpecificationId,
      // productId: this.master.productId,
      // productName: this.master.productName,
      // uomId: this.master.uomId,
      // uomName: this.master.uomName,
      // invoiceQty: this.master.invoiceQty,

      // price: this.master.price,
      // vat: this.master.vat,
      // ait: this.master.ait,
      // discountAmount: this.master.discountAmount,
      // total: this.master.total,
      isActive: 1,
      isSelect: 1,
    };
    this.master.lstDetailsViewModel.push(elements);
    this.calculateGrandTotal();
  }

  public refeshDetails() {
    this.master.lstDetailsViewModel = [];
    this.toastrService.warning(this.commonService.warningmsg, "Message");
  }

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

  public deleteDetails(index: any) {
    this.SalesDistributionService.DeleteSalesDistributionDetailsById(
      this.master.lstDetailsViewModel[index].salesInvDetailsId
    ).subscribe((returns: any) => {
      if (returns.success) {
        this.toastrService.success(this.commonService.deletedmsg, "Message");
      }
    });

    this.selectedRow = this.master.lstDetailsViewModel[index];
    this.master.lstDetailsViewModel.splice(index, 1);
    if (this.selectedRow.helpDetailId > 0) {
    }
    this.toastrService.danger(this.commonService.deletedmsg, "Message");
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

  public rDistributionNumber: string = "";
  public rDistributionDate: string = "";

  public rDeliveryManName: string = "";
  public rDeliveryManMobile: string = "";

  public rInvoiceNumber: string = "";
  public rPartyName: string = "";

  public rDeliveryAddress: string = "";

  public rgrandTotal: number = 0;

  public rReportHeader = "Sales Distribution Report";
  public rApprovalStatus: string;
  public tableHeader = ["#", "Product Name", "Distribution Qty.", "UOM"];
  public apiUrl = "";
  public htmlBodyData: string = "";

  public params = [];
  public bodyData: any = [];
  public bodyDatashow: any = [];

  private getReportData(distributionMasterId: number) {
    try {
      this.SalesDistributionService.GetSalesDistributionReportDataById(
        distributionMasterId
      ).subscribe((returns: any) => {
        if (returns.success && returns.data.length > 0) {
          this.bodyData = [];
          this.bodyData = returns.data;
          // console.log(this.bodyData)

          this.rDistributionNumber = this.bodyData[0]["distributionNumber"];
          this.rDistributionDate = this.bodyData[0]["distributionDate"];
          this.rInvoiceNumber = this.bodyData[0]["salesInvoiceNo"];
          this.rPartyName = this.bodyData[0]["partyName"];

          this.rDeliveryManName = this.bodyData[0]["deliveryManName"];
          this.rDeliveryManMobile = this.bodyData[0]["deliveryManMobile"];
          this.rDeliveryAddress = this.bodyData[0]["deliveryAddress"];
          this.rApprovalStatus = this.bodyData[0]["approvalStatus"];
          this.rgrandTotal = 0;
          this.bodyData.forEach((element) => {
            this.rgrandTotal += element.distributionQty;
          });

          this.setParam();
        } else {
          this.toastrService.danger("Message", this.commonService.nodatafound);
        }
      });
    } catch (error) {
      this.toastrService.danger("Message", error);
    }
  }
  setParam() {
    this.params = [];
    this.params.push({
      leftLabel: "Distribution No.:",
      leftValue: this.rDistributionNumber,
      rightLabel: "Distribution Date:",
      rightValue: this.rDistributionDate,
    });
    this.params.push({
      leftLabel: "Invoice No.:",
      leftValue: this.rInvoiceNumber,
      rightLabel: "Party Name:",
      rightValue: this.rPartyName,
    });
    this.params.push({
      leftLabel: "Delivery Man:",
      leftValue: this.rDeliveryManName,
      rightLabel: "Delivery Man Mobile:",
      rightValue: this.rDeliveryManMobile,
    });
  }
  generateReport(buttonAction: any, distributionMasterId: number = 0) {
    var fileName = this.pageNavigation + "." + buttonAction;
    this.getReportData(distributionMasterId);
    const content = document.getElementById("reportHeader");
    this.generateSalesDistributionReport(buttonAction, fileName, content);
  }

  generateSalesDistributionReport(
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
            fillColor: [216, 216, 216],
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
            fillColor: [105, 105, 105],
            fontSize: 11,
          },
          bodyStyles: {
            //fillColor: [216, 216, 216],
            textColor: 50,
            valign: "middle",
          },
          columnStyles: {
            0: { halign: "right" },
            2: { halign: "right" },
          },
          // alternateRowStyles: {
          //   fillColor: [250, 250, 250],
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

  //#endregion Report

  //////////// Open Modal ////////////////

  // data: Country[] = [
  //   {
  //     name: "Russia",
  //     flag: "f/f3/Flag_of_Russia.svg",
  //     area: 17075200,
  //     population: 146989754,
  //   },
  //   {
  //     name: "Canada",
  //     flag: "c/cf/Flag_of_Canada.svg",
  //     area: 9976140,
  //     population: 36624199,
  //   },
  //   {
  //     name: "United States",
  //     flag: "a/a4/Flag_of_the_United_States.svg",
  //     area: 9629091,
  //     population: 324459463,
  //   },
  //   {
  //     name: "China",
  //     flag: "f/fa/Flag_of_the_People%27s_Republic_of_China.svg",
  //     area: 9596960,
  //     population: 1409517397,
  //   },
  // ];

  // names: any;
  // openWithDataObjModel(dialog: TemplateRef<any>) {
  //   this.dialogService.open(dialog, {
  //     context: this.data,
  //   });
  // }
  // openWithDataModel() {
  //   this.dialogService
  //     .open(DialogNamePromptComponent)
  //     .onClose.subscribe((name) => name && this.names.push(name));
  // }
  /////////////////////////////
}

import {
  ChangeDetectorRef,
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
import { NavigationStart, Router } from "@angular/router";
import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { PurchaseorderService } from "app/pages/purchase/settings/purchaseorder.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { ElementRef } from "@angular/core";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";
import { BillcollectionService } from "app/services/sales/billcollection.service";

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: "ngx-billcollection",
  templateUrl: "./billcollection.component.html",
  styleUrls: ["./billcollection.component.scss"],
})
export class BillcollectionComponent implements OnInit {
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

  /////////////////////////////
  master: {
    collectionMasterId: number;
    collectionAmount: number;
    mobileNo: string;
    address: string;
    radio: number;
    salesInvoiceId: number;
    partyId: number;
    paymentModeId: number;
    bankName: string;
    chequeNo: string;
    remarks: string;
    isActive: true;
    collectionDate: Date;
    salesInvoiceSelected: {};
    paymentModeSelected: {};
    partySelected: {};
    lstDetailsViewModel: any[];
  };

  public sbus = [];

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

  public pageNavigation = "Bill Collection";
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
      this.show = false;
    }
  }
  public radioGroupValue = "ByCustomer";
  public getMaster() {
    this.master = {
      collectionMasterId: 0,
      collectionAmount: 0,
      mobileNo: "",
      address: "",
      radio: null,
      salesInvoiceId: 0,
      partyId: null,
      paymentModeId: 0,
      bankName: "",
      chequeNo: "",
      remarks: "",
      isActive: true,
      collectionDate: new Date(),
      salesInvoiceSelected: null,
      paymentModeSelected: null,
      partySelected: null,
      lstDetailsViewModel: [],
    };
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
      this.commonService.onExportCSV(this.gridApi, this.pageNavigation);
    } else {
      console.log("Click action button");
    }
  }

  private reset() {
    this.getMaster();
  }

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
  public tableHeader = [
    "#",
    "Product Name",
    "Serial No",
    "Warranty",
    "UOM",
    "Quantity",
    "Price",
    "VAT(%)",
    "AIT(%)",
    "Discount(%)",
    "Total",
  ];
  public termsandcondition = ["Terms And Conditions"];
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
    private PurchaseorderService: PurchaseorderService,
    private salesinvoiceService: SalesinvoiceService,
    private billcollectionService: BillcollectionService,
    private comboService: CommoncomboService
  ) {
    this.commonService.valueSet("showlist");
    this.getPurchaseReq();
    this.GetAllPartysByTypeId(0);
    this.GetInvoiceNumber();

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
        headerName: "Bill Number",
        field: "collectionNumber",
        width: 160,
      },
      {
        headerName: "Amount",
        field: "collectionAmount",
        width: 160,
        valueFormatter: (params) =>
          this.currencyFormatter(params.data.collectionAmount),
        type: "rightAligned",
      },
      {
        headerName: "Invoice No",
        field: "salesInvoiceNo",
        width: 160,
      },
      {
        headerName: "Address",
        field: "address",
        width: 160,
      },
      {
        headerName: "Customer Name",
        field: "partyName",
        width: 200,
      },
      {
        headerName: "Contact Number",
        field: "contactNumber",
        width: 160,
      },
      {
        headerName: "Remarks",
        field: "remarks",
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
      editable: true,
    };
    this.getMaster();
    //this.getPaymentMode(0);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.billcollectionService.getBillCollection(0).subscribe((data: any) => {
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

  public collectionMasterId = 0;
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
      this.collectionMasterId = event.node.data.collectionMasterId;

      this.billcollectionService
        .getBillCollection(this.collectionMasterId)
        .subscribe((data: any) => {
          if (data.success) {
            this.master = data.data[0];
            this.GetAllPartysByTypeId(0);

            this.master.partySelected = {
              id: data.data[0].partyId,
              name: data.data[0].partyName,
            };
            this.GetInvoiceNumber();
            this.master.salesInvoiceSelected = {
              id: data.data[0].salesInvoiceId,
              name: data.data[0].salesInvoiceNo,
            };
          }
        });
      this.ngOnInit();
    }
  }

  private agDelete(event) {
    this.master.collectionMasterId = event.node.data.collectionMasterId;
    this.billcollectionService
      .deleteBillCollectionById(this.master.collectionMasterId)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          //////////////Grid Refresh ///////////////////
          this.billcollectionService
            .getBillCollection(this.master.collectionMasterId)
            .subscribe((data: any) => {
              if (data.success) {
                this.rowData = data.data;
              }
            });
          //////////////Grid Refresh ///////////////////
        }
      });
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
  public openWithDataObjModel(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
      context: this.data,
    });
  }

  public PurchaseReqNoList = [];
  public getPurchaseReq() {
    this.PurchaseorderService.getPurchaseReq().subscribe((retuns: any) => {
      if (retuns.success) {
        this.PurchaseReqNoList = retuns.data.map((val: any) => ({
          id: val.purchaseReqId,
          name: val.purReqNo,
        }));
      }
    });
  }

  private agReport(event) {
    this.generateBillCollectionReport(event.data.collectionMasterId);
  }

  public datalength: number;
  public bodyData = [];

  public collectionNumber = "";
  public collectionDate = "";
  public salesInvoiceNo = "";
  public partyName = "";
  public contactNumber = "";
  public addressLine = "";

  public rtotalQuantity: number = 0;
  public rtotalGross: number = 0;
  public rtotalVat: number = 0;
  public rtotalAit: number = 0;
  public rshippingCost: number = 0;
  public rtotalDiscountAmount: number = 0;
  public rgrandTotal: number = 0;

  public totalcollectionAmount: number = 0;
  public totalDueAmount: number = 0;
  public totalBalanceAmount: number = 0;

  public generateBillCollectionReport(collectionMasterId) {
    this.billcollectionService
      .getBillCollectionReportById(collectionMasterId)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.bodyData = returns.data;

          this.collectionDate = this.bodyData[0].collectionDate;
          this.salesInvoiceNo = this.bodyData[0].salesInvoiceNo;
          this.partyName = this.bodyData[0].partyName;
          this.contactNumber = this.bodyData[0].contactNumber;
          this.addressLine = this.bodyData[0].addressLine;

          this.rtotalQuantity = 0;
          this.bodyData.forEach(
            (a) => (this.rtotalQuantity += parseFloat(a.invoiceQty))
          );

          this.rtotalGross = this.bodyData[0]["totalGross"];
          this.rtotalVat = this.bodyData[0]["totalVat"];
          this.rtotalAit = this.bodyData[0]["totalAit"];
          this.rshippingCost = this.bodyData[0]["shippingCost"];
          this.rtotalDiscountAmount = this.bodyData[0]["totalDiscountAmount"];
          this.rgrandTotal = this.bodyData[0]["grandTotal"];

          this.totalcollectionAmount =
            this.bodyData[0]["totalcollectionAmount"];
          this.totalDueAmount = this.bodyData[0]["totalDueAmount"];

          var fileName = this.pageNavigation + ".pdf";
          const content = document.getElementById("reportHeader");
          this.generateReport("print", fileName, content, this.datalength);
        } else {
          this.toastrService.danger("Message", this.commonService.nodatafound);
        }
      });
  }

  public params = [];

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
    ////debugger;
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
            4: { halign: "center" },
            5: { halign: "right" },
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

  public partyList = [];
  public GetAllPartysByTypeId(partyTypeId: any) {
    this.salesinvoiceService
      .GetAllPartysByTypeId(partyTypeId)
      .subscribe((returns: any) => {
        //console.log('all party', returns.data)
        this.partyList = returns.data.map((val: any) => ({
          id: val.partyId,
          name: val.partyName,
          address: val.address,
          mobileNo: val.mobileNo,
        }));
      });
  }
  public InvoiceNumberList = [];
  public GetInvoiceNumber() {
    this.InvoiceNumberList = [];
    //this.master.salesInvoiceSelected = {};
    this.billcollectionService.getInvoiceNumber().subscribe((retuns: any) => {
      if (retuns.success) {
        this.InvoiceNumberList = retuns.data.map((val: any) => ({
          id: val.salesInvoiceId,
          name: val.salesInvoiceNo,
        }));
      }
    });
  }
  public getPaymentMode(collectionId: any) {
    //debugger;
    if (collectionId == 0 && this.master.collectionAmount == 0) {
      this.billcollectionService.getpaymentMode().subscribe((data: any) => {
        if (data.success) {
          var hide = true;
          var hideTRX = true;
          this.master.lstDetailsViewModel = [];
          data.data.map((element) => {
            if (element.paymenttypeId != 2) {
              hide = false;
            } else {
              hide = true;
            }
            if (element.paymenttypeId != 3) {
              hideTRX = false;
            } else {
              hideTRX = true;
            }

            this.master.lstDetailsViewModel.push({
              paymentModeId: element.paymentModeId,
              paymentMode: element.paymentMode,
              collectionAmount: 0,
              hide: hide,
              hideTRX: hideTRX,
            });
          });
        }
      });
    } else if (collectionId > 0) {
      this.billcollectionService
        .getCollectionDetailsData(this.collectionMasterId)
        .subscribe((data: any) => {
          if (data.success) {
            var hide = true;
            var hideTRX = true;
            this.master.lstDetailsViewModel = [];
            data.data.map((element) => {
              if (element.paymenttypeId != 2) {
                hide = false;
              } else {
                hide = true;
              }
              if (element.paymenttypeId != 3) {
                hideTRX = false;
              } else {
                hideTRX = true;
              }
              this.master.lstDetailsViewModel.push({
                paymentModeId: element.paymentModeId,
                paymentMode: element.paymentMode,
                bankName: element.bankName,
                chequeNo: element.chequeNo,
                trxNo: element.trxNo,
                collectionAmount: element.collectionAmount,
                collectionDetailId: element.collectionDetailId,
                hide: hide,
                hideTRX: hideTRX,
              });
            });
          }
        });
    }
  }

  public addDetails(dialog: TemplateRef<any>) {
    this.getPaymentMode(this.master.collectionMasterId);
    this.openWithDataObjModel(dialog);
  }

  public CalculateValue() {
    // var currentValue = this.master.collectionAmount;
    // if (amount > 0) {
    //   this.master.collectionAmount = currentValue + amount;
    // } else
    //   this.master.collectionAmount = currentValue;
    //debugger;
    let totalvalue = 0.0;
    for (let i = 0; i < this.master.lstDetailsViewModel.length; i++) {
      totalvalue =
        totalvalue + this.master.lstDetailsViewModel[i].collectionAmount;
    }
    this.master.collectionAmount = totalvalue;
  }

  private save() {
    var button = this.commonService.buttonClicked;
    this.billcollectionService
      .saveBillCollection(this.master)
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

          this.getMaster();
          this.billcollectionService
            .getBillCollection(0)
            .subscribe((data: any) => {
              if (data.success) {
                this.rowData = data.data;
              }
            });
          //////////////Grid Refresh ///////////////////
        }
        else {
          this.toastrService.warning(returns.message, "Message");
        }
      });
  }
  invoiceAmount = 0;
  GetSalesInvoiceAmountById() {
    this.invoiceAmount = 0;
    this.billcollectionService.GetSalesInvoiceAmountById(this.master.salesInvoiceId).subscribe((returns: any) => {
      if (returns.success) {
        this.invoiceAmount = returns.data.length > 0 ? returns.data[0].grandTotal : 0;
      }
    });
  }


  public GetPartyDetails(partyId: any) {
    debugger;
    if (this.isCustomerSelected == true) {
      this.InvoiceNumberList = [];
      this.master.salesInvoiceSelected = {};
      this.salesinvoiceService.GetSalesInvoicesByPartyId(this.master.partyId).subscribe((returns: any) => {
        if (returns.success) {
          this.InvoiceNumberList = returns.data.map((val: any) => ({
            id: val.salesInvoiceId,
            name: val.salesInvoiceNo,
          }));
        }
      });

      this.master.mobileNo = '';
      if (this.master.partySelected != null)
        this.master.mobileNo = this.master.partySelected["mobileNo"];
    }
    // else {
    //   this.GetInvoiceNumber();
    // }

  }

  isCustomerSelected = true;
  onRadioSelect(event, status) {
    debugger;
    if (status == 'ByCustomer')
      this.isCustomerSelected = true;
    else {
      this.master.partyId = null;
      this.master.partySelected = {};
      this.isCustomerSelected = false;
      this.GetInvoiceNumber();
    }
  }


  currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }
}

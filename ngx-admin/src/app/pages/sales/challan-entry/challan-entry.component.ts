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
  NbDateService
} from "@nebular/theme";
import { NavigationStart, Router } from "@angular/router";
import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { ProducttransferService } from "app/services/inventory/producttransfer.service";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
import { ProductService } from "app/services/inventory/product.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { StockinService } from "app/services/inventory/stockin.service";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";
import { SalesreturnService } from "app/services/sales/salesreturn.service";
import { isJSDocThisTag } from "typescript";
import { PurchaserequisitionService } from "app/pages/purchase/settings/purchaserequisition.service";
import { PurchaseorderService } from "app/pages/purchase/settings/purchaseorder.service";
import { VoucherService } from "app/services/transaction/voucher.service";

@Component({
  selector: 'ngx-challan-entry',
  templateUrl: './challan-entry.component.html',
  styleUrls: ['./challan-entry.component.scss']
})
export class ChallanEntryComponent implements OnInit {

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

  public pageNavigation = "Challan";
  public buttons = this.commonService.btnList;

  public ButtonAction() {

    if (this.commonService.buttonClicked == "create") {

      this.getMaster();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.getGridData();
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      //this.openConfirmPopup("");
      this.save();
      // this.show = true;
    } else if (this.commonService.buttonClicked == "update") {
      // this.save();
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

master: {
    challanMasterId: number;
    challanNo: string;
    batchNo: string;
    challanDate: string;
    challanDateShow: Date;
    
    quotationMasterId: number;
    quotationSelected: any;

    storeId: number;
    partyId: number;
    partyName: string;
    partySelected: any;
    address: string;
    mobileNo: string;
    alternateMobileNo: string;

    totalPrice: number;
    totalGross: number;
    totalVat: number;
    totalAit: number;
    shippingCost: number;
    totalDiscountAmount: number;
    grandTotal: number;
    approvalStatus: number;

    isActive: number;
    isDelete: number;
    refNo: string;
    isFinal: boolean;

    loadFromDateShow: Date;
    loadToDateShow: Date;

    lstDetailsViewModel: any[];
    finalChallanDetailsViewModel: any[];
    
  };

  public getMaster() {
    this.master = {
      challanMasterId: 0,
      challanNo: "",
      batchNo: "",
      challanDate: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
      challanDateShow: new Date(this.currentDate),

      quotationMasterId: 0,
      quotationSelected: null,

      storeId: 0,
      partyId: 0,
      partyName: "",
      partySelected: null,
      address: "",
      mobileNo: "",
      alternateMobileNo: "",

      totalPrice: 0,
      totalGross: 0,
      totalVat: 0,
      totalAit: 0,
      totalDiscountAmount: 0,
      grandTotal: 0,
      shippingCost: 0,

      approvalStatus: 0,
      isActive: 1,
      isDelete: 0,
      refNo: "",
      isFinal: false,
      
      loadFromDateShow: new Date(),
      loadToDateShow: new Date(),

      lstDetailsViewModel: [],
      finalChallanDetailsViewModel: []
    };
    // this.getMaxNo();
  
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
    if (this.master.challanNo==null || this.master.challanNo.trim() === "") {
      this.toastrService.warning("Please enter a Challan No.", "Warning");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.refNo==null || this.master.refNo.trim() === "") {
      this.toastrService.warning("Please enter a Ref No.", "Warning");
      this.commonService.valueSet("create");
      return false;
    }
    if (!this.master.lstDetailsViewModel || this.master.lstDetailsViewModel.length == 0) {
      this.toastrService.danger("Please select a Quotation!", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    let flag = false;
    if (this.master.lstDetailsViewModel.length > 0) {
      this.master.lstDetailsViewModel.forEach(element => {
        if (element.isSelect == 1 && element.challanQty == 0) {  // 1 is YES
          this.toastrService.danger("Please enter a Challan Quantity!", "Message");
          this.commonService.valueSet("create");
          return false;
        }
        else if (element.isSelect == 1  && element.challanQty > 0) {  // 1 is YES
          flag = true;
        }
        
      });
    }

    if (!flag) {
      this.toastrService.danger("No selected items found! ", "Message");
      this.commonService.valueSet("create");
      return false;
    }
   

    var button = this.commonService.buttonClicked;

    this.salesinvoiceService.SaveTenderChallan(this.master).subscribe((returns: any) => {
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
        this.getGridData();
        this.getMaster();

      }
      else {
        this.toastrService.warning(
          this.commonService.successmsg,
          "Message"
        );
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

  public getActualDate(event: any) {
    //debugger;
    let dateCon = event.toLocaleDateString() + " " + event.toLocaleTimeString();
    if (dateCon != "") {
      this.master.challanDate = dateCon;
    }
  }

  public partyList = [];
  public GetAllActivePartyByTypeId(partyTypeId: any) {
    this.partyList = [];
    this.salesinvoiceService.GetAllActivePartysForChallanByTypeId(partyTypeId, 0, '').subscribe((returns: any) => {
      if (returns && returns.data) {
        this.partyList = returns.data.map((val: any) => ({
          id: val.partyId,
          name: val.partyName,
          address: val.address,
          mobileNo: val.mobileNo,
        }));
      }
    }, (error) => {
      this.toastrService.danger('Failed to load customers.', 'Error');
    });
  }

  public GetPartyDetails() {
    if (!this.master.partySelected) return;
    this.master.partyId = this.master.partySelected["id"] || 0;
    this.master.address = this.master.partySelected["address"] || "";
    this.master.mobileNo = this.master.partySelected["mobileNo"] || "";
    this.master.lstDetailsViewModel = [];
    this.master.totalGross = 0;
    this.master.grandTotal = 0;
    this.GetQuotationForChallan(this.master.partyId);
  }

  public quotationList = [];
  public GetQuotationForChallan(partyId: any) {
    this.quotationList = [];
    this.salesinvoiceService.GetQuotationForChallan(partyId).subscribe((returns: any) => {
      if (returns && returns.data) {
        this.quotationList = returns.data.map((val: any) => ({
          id: val.quotationMasterId,
          name: val.quotationNo,
        }));
      }
    }, (error) => {
      this.toastrService.danger('Failed to load Quotations.', 'Error');
    });
  }

  
  GetTenderQuotationDetailsForChallanById(quotationMasterId: any) {
    this.master.lstDetailsViewModel = [];
    if (quotationMasterId > 0) {
      this.salesinvoiceService.GetTenderQuotationDetailsForChallanById(quotationMasterId).subscribe((returns: any) => {
        if (returns.success) {
          this.master.lstDetailsViewModel = returns.data; 
        }
      });
    }
  }

  GetTenderChallanDetailsForFinalChallanByQuotationMasterId() {
    this.master.finalChallanDetailsViewModel = [];
    if (this.master.quotationMasterId > 0) {
      this.salesinvoiceService.GetTenderChallanDetailsForFinalChallanByQuotationMasterId(this.master.quotationMasterId).subscribe((returns: any) => {
        if (returns.success) {
          this.master.finalChallanDetailsViewModel = returns.data; 
        }
      });
    }
  }

   
  public currencyFormatter(currency: any) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

 checkChangeFinalChallan(e: any, rowIndex: number) {
    // debugger;
    if (e.target.checked) {
      this.master.finalChallanDetailsViewModel[rowIndex].isSelect = 1;
      
    } else {
      this.master.finalChallanDetailsViewModel[rowIndex].isSelect = 0;
      
    }
  }
  
  checkChange(e: any, rowIndex: number) {
    // debugger;
    if (e.target.checked) {
      this.master.lstDetailsViewModel[rowIndex].isSelect = 1;
      
    } else {
      this.master.lstDetailsViewModel[rowIndex].isSelect = 0;
      
    }
   this.CalculateSummary();
  }
CalculateSummary() {
    this.master.totalGross = 0;
    this.master.grandTotal = 0;
    this.master.lstDetailsViewModel.forEach((element, i) => {
      if (element.isSelect) {
        this.master.totalGross += element.challanQty * element.price;
      }
    });
    this.master.totalGross = this.commonService.roundWithDecimalPoint(this.master.totalGross, 0);
    this.master.grandTotal = this.master.totalGross + this.master.totalVat + this.master.totalAit + this.master.shippingCost - this.master.totalDiscountAmount;
    
  }
  
  ValidateChallanQtys(rowIndex : number) {
    // debugger;
     if (this.master.lstDetailsViewModel[rowIndex].challanQty > this.master.lstDetailsViewModel[rowIndex].balanceQty) {
      this.master.lstDetailsViewModel[rowIndex].challanQty = this.master.lstDetailsViewModel[rowIndex].balanceQty;
      this.toastrService.danger("Challan Quantity can't exceed Balance Quantity!", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    this.master.lstDetailsViewModel[rowIndex].Total = this.master.lstDetailsViewModel[rowIndex].challanQty * this.master.lstDetailsViewModel[rowIndex].price;
    this.CalculateSummary();
  }
  
  minDate: Date = new Date();
  maxDate: Date = new Date();
  currentDate: Date = new Date();
  getServerDateTime() {
    let apiUrl = `menu/getServerDateTime`;
    this.commonService.getApiData(apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        debugger;
        this.currentDate = new Date(returns.data[0].currentDate);
        this.minDate = this.dateService.addDay(new Date(returns.data[0].minVoucherDatePV), 0);
        this.maxDate = this.dateService.addDay(new Date(returns.data[0].maxVoucherDatePV), 0);

      } else {
        this.currentDate = new Date();
        this.minDate = this.dateService.addDay(new Date(), -0);
        this.maxDate = this.dateService.addDay(new Date(), 0);
      }
    });
  }

  addDays = (date: Date, days: number): Date => {
    let result = new Date(date);
    console.log(result);
    result.setDate(result.getDate() + days);
    return result;
  };


  // Usage example:

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
    private salesreturnService: SalesreturnService,
    private purchaserequisitionService: PurchaserequisitionService,
    private PurchaseorderService: PurchaseorderService,
    private datePipe: DatePipe,
    private voucherService: VoucherService,
    protected dateService: NbDateService<Date>,
  ) {
    this.commonService.valueSet("showlist");

    // this.commonService.valueSet("showlist");
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
        headerName: "Challan No",
        field: "challanNo",
        filter: "agTextColumnFilter",
        width: 250,
      },
      {
        headerName: "Challan Date",
        field: "challanDate",
        filter: "agTextColumnFilter",
        width: 140,
      },
      {
        headerName: "Party Code",
        field: "partyCode",
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "Party Name",
        field: "partyName",
        filter: "agTextColumnFilter",
        width: 280,
      },
      {
        headerName: "Address",
        field: "address",
        filter: "agTextColumnFilter",
        width: 280,
      },
      {
        headerName: "Is Final",
        field: "finalStatus",
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "Net Total",
        field: "grandTotal",
        filter: "agNumberColumnFilter",
        valueFormatter: (params) =>
          this.currencyFormatter(params.data.grandTotal),
        type: "rightAligned",
        width: 130,
      },
      {
        field: "action",
        cellRenderer: "btnCellRenderer",
        cellRendererParams: {
          clicked: function (field: any) {
            //localStorage.setItem("Token", user.auth_token);
            localStorage.setItem("button", field);
          },
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
    };
    //debugger;
    this.getMaster();
    this.getServerDateTime();
    this.GetAllActivePartyByTypeId(0);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getGridData();
  }
public getGridData() {
    const fromDate = this.master.loadFromDateShow;
    const toDate = this.master.loadToDateShow;
    if (this.commonService.validateDates(fromDate, toDate)) {
      this.salesinvoiceService.GetTenderChallanById(0, this.commonService.DateFormat(this.master.loadFromDateShow), this.commonService.DateFormat(this.master.loadToDateShow)).subscribe((data: any) => {
        ////debugger;
        if (data.success) {
          this.rowData = data.data; 
        }
      });
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
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
      this.commonService.valueSet("showlist");
      this.toastrService.info('Not Allowed', 'Info')
      // this.agEdit(event);
      // this.show = false;
    } else if (data == "view") {
      this.commonService.valueSet("showlist");
      this.toastrService.info('Not Allowed', 'Info')
      // this.agEdit(event);
      // this.show = false;
      // this.disabled = true;
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "print") {
      this.agReport(event);
    } else if (data == "delete") {
      this.commonService.valueSet("showlist");
      this.toastrService.info('Not Allowed', 'Info')
      // this.agDelete(event);
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }

  private agEdit(event) {
    // debugger;
    
  }

  private agReport(event) {
    
    this.getCrReport(event.data.challanMasterId);
  }

  private getCrReport(challanMasterId: any, reportFormat: any = 'pdf') {
    this.apiUrl = `SalesInvoiceReport/GetTenderChallanReportById?challanMasterId=${challanMasterId}&reportFormat=${reportFormat}`;
    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      const res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        this.toastrService.warning(this.commonService.nodatafound, "Warning");
      }
    }, () => {
      this.toastrService.danger("Failed to generate report.", "Error");
    });
  }

  
  // private agDelete(event) {
  //   var result = confirm("Are you sure you want to delete that?");
  //   if (result) {
  //     this.master.challanMasterId = event.node.data.challanMasterId;
  //     this.salesinvoiceService
  //       .deleteTenderChallan(this.master)
  //       .subscribe((returns: any) => {
  //         if (returns.success) {
  //           this.toastrService.success(
  //             this.commonService.deletedmsg,
  //             "Message"
  //           );

  //           //////////////Grid Refresh ///////////////////
  //           this.getGridData();
  //           //////////////Grid Refresh ///////////////////
  //         }
  //       });
  //   }
  // }


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

  public apiUrl = "";

  
  public generateReportPdf(
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
          startY: legend.height + 20,
          styles: { font: "Meta", fontSize: 15, halign: "center" },
        });

        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 50,
          styles: { font: "Meta" },
        });


        autoTable(doc, {
          html: "#body_table1",
          startY: legend.height + 230,
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
}
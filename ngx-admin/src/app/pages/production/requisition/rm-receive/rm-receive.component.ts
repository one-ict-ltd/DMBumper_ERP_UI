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
// import { NavigationStart, Router } from "@angular/router";
import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { ProducttransferService } from "app/services/inventory/producttransfer.service";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
import { ProductService } from "app/services/inventory/product.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { StockinService } from "app/services/inventory/stockin.service";
// import { BranchService } from "app/services/erpsetting/branch.service";
// import { from } from "rxjs";
// import { Console } from "node:console";
import { BomService } from "app/services/production/bom.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ProductionServiceService } from "app/services/production/production-service.service";

@Component({
  selector: 'ngx-rm-receive',
  templateUrl: './rm-receive.component.html',
  styleUrls: ['./rm-receive.component.scss']
})
export class RmReceiveComponent implements OnInit {
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

  quotes = [
    { title: null, body: "We rock at Angular" },
    { title: null, body: "Titles are not always needed" },
    { title: null, body: "Toaster rock!" },
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

  public pageNavigation = "Receive for RM and PM Requisition";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      // if (this.validationForMasterSave() == false) {
      //   this.commonService.valueSet("create");
      //   return;
      // }
      this.save();
      this.show = true;
    } else if (this.commonService.buttonClicked == "update") {
      // if (this.validationForMasterSave() == false) {
      //   this.commonService.valueSet("edit");
      //   return;
      // }
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
  typeSelected: {};
  requisitionSelected: {};
  issueSelected: {};
  master: {
    productReceiveMasterId: number;
    receiveNo: string;
    receiveDate: Date;
    typeOfReceive: string;
    productIssueMasterId: number;
    receiveQty: number;
    receiveStatus: number;
    receiveRemarks: string;

    issueDate: Date;
    typeOfIssue: string;
    requisitionId: number;
    issueQty: number;
    issueStatus: number;
    issueRemarks: string;

    rmRequisitonId: number;
    bomId: number;
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
    // isActive: number;
    // isDelete: number;
    bomQty: number;
    //total: number;
    lstDetailsViewModel: any[];
    typeId: number;
    typeSelected: {};
    remarks: string;
    status: number;
    type: string;
    bomMasterProductWiseSpecificationId: number;
    requisitionMasterId: number;
    bomForId: number;
    bomForType: string;
  };
  public getMaster() {
    this.master = {
      productReceiveMasterId: 0,
      receiveNo: "",
      receiveDate: new Date(),
      typeOfReceive: "",
      productIssueMasterId: 0,
      receiveQty: 0,
      receiveStatus: 1,
      receiveRemarks: "",

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
      remarks: "",
      status: 1,
      type: "raw",
      bomId: 0,
      bomMasterProductWiseSpecificationId: 0,

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
      typeSelected: null,
      requisitionMasterId: 0,
      bomForId: 0,
      bomForType: null
    };
    this.companySelected = null;
    this.sbuSelected = null;
    this.bomProductSpecSelected = null;
    this.typeSelected = null;
    this.requisitionSelected = null;
    this.issueSelected = null;
    this.detailsProductSpecSelected = null;
    this.issueList = null;
    this.listData = [];

    this.qty = 1;
    this.price = 0;
    this.wastage = 0;
    this.grandTotalQty = 0;
    this.uomName = "";
    this.LoadDropdown();
    this.loadTypeList();
    //this.getMaxNo();
  }

  // bomDetails

  bomDetailsId: number = 0;
  bomId: number = 0;
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
    if (button == "save") {
      this.beforeSave();
    }

    //console.log(this.master);
    this.master.receiveDate = this.commonService.DateFormat(this.master.receiveDate);
    this.productionServiceService.SaveReceiveMaster(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }

        this.getMaster(); //////////////Grid Refresh ///////////////////

        this.productionServiceService.GetReceiveMasterByIdDate(this.commonService.DateFormat(this.loadFromDateShow), this.commonService.DateFormat(this.loadToDateShow)
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

  beforeSave() {
    this.listData.forEach((element) => {
      var obj = {
        productReceiveDetailId: 0,
        issueDetailId: element.productIssueDetailId,
        qty: element.totalQty,
        potency: element.potency,
        grnNo: element.grnNo
      }
      this.master.lstDetailsViewModel.push(obj);
    })
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
    private ProducttransferService: ProducttransferService,
    private productrequisitionService: ProductrequisitionService,
    private productService: ProductService,
    private comboService: CommoncomboService,
    private stockinService: StockinService,
    private bomService: BomService,
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
        headerName: "Receive No",
        field: "receiveNo",
        width: 200,
      },
      {
        headerName: "Receive Date",
        field: "receiveDate",
        width: 150,
      },
      {
        headerName: "Issue No.",
        field: "issueNo",
        width: 200,
      },
      {
        headerName: "Batch No.",
        field: "batchNo",
        width: 140,
      },
      {
        headerName: "Bom Product Name",
        field: "productName",
        width: 320,
      },
      {
        headerName: "Type of Receive",
        field: "typeOfReceive",
        width: 170,
      },
      {
        headerName: "BOM For",
        field: "bomForType",
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

  LoadDropdown() {
    // this.getCompany();
    this.getBomMasterProductSpec();
    //this.getBomDetailsProductSpec();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.GetGridData();
  }
  GetGridData() {
    this.productionServiceService.GetReceiveMasterByIdDate(this.commonService.DateFormat(this.loadFromDateShow), this.commonService.DateFormat(this.loadToDateShow)
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
      var receiveId = event.node.data.productReceiveMasterId;


      this.productionServiceService.GetReceiveMasterById(receiveId).subscribe((data: any) => {
        if (data.success) {
          console.log("master data for edit======================", data.data[0]);
          this.master = data.data[0];
          if (data.data[0].typeOfReceive == 'raw') {
            this.typeSelected = {
              id: 1,
              name: "Raw Materials(RM)",
            }
          }
          else {
            this.typeSelected = {
              id: 2,
              name: "Packing Materials(PM)",
            }
          }

          this.issueSelected = {
            id: data.data[0].productIssueMasterId,
            name: data.data[0].issueNo
          }
          this.productionServiceService.GetReceiveDetialsByMasterId(receiveId).subscribe((data: any) => {
            this.listData = data.data;
          })
        }

      });

      this.ngOnInit();
    }
  }

  private agReport(event) {
    //this.toastrService.info("Print button clicked", "Message");
    this.getReportData(event.data.productReceiveMasterId);
  }

  private agDelete(event) {
    var receiveId = event.node.data.productReceiveMasterId;
    if (confirm('Are you sure?')) {
      this.productionServiceService.DeleteReceiveById(receiveId).subscribe((data: any) => {
        if (data.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          this.productionServiceService.GetReceiveMasterByIdDate(this.commonService.DateFormat(this.loadFromDateShow), this.commonService.DateFormat(this.loadToDateShow)
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



  productImageFile: string;
  getProductImage(imageUrl: string) {
    this.productImageFile = "";
    // this.salesOfferService.getProductImage(imageUrl).subscribe((returns: any) => {
    //   if (returns.success) {
    //     this.productImageFile = returns.data[0].ImageFile;
    //   }
    // });
  }
  public listData = [];
  public initialListData = [];
  public getBomProductSpecDetails(id) {
    this.productionServiceService.GetProductSpecificationByBomIdFromBomDetails(id, this.master.bomForId).subscribe((returns: any) => {
      if (returns.success) {
        this.listData = returns.data;
      }
    });
    //this.getProductImage(this.master.productSpecSelected["imageUrl"]);
    this.master.uomName = this.bomProductSpecSelected["uomName"];
  }

  public getProductSpecDetails() {
    //this.getProductImage(this.master.productSpecSelected["imageUrl"]);
    this.price = this.detailsProductSpecSelected["price"];
    this.uomName = this.detailsProductSpecSelected["uomName"];
    this.productName = this.detailsProductSpecSelected["name"];
    //this.getCurrentStock();
  }

  public getBomDetailsProductSpec(id) {
    this.productrequisitionService
      .getAllProductForBOM(id)
      .subscribe((returns: any) => {
        this.detailsProductSpecList = returns.data.map((val: any) => ({
          id: val.productWiseSpecificationId,
          name: val.productName,
          uomId: val.uomId,
          uomName: val.uomName,
          productId: val.productId,
          price: val.price,
          imageUrl: val.imageUrl,
        }));
      });
  }
  public bomProductList: any = [];
  public getBomMasterProductSpec() {


    this.bomService.GetBomMasterById(0).subscribe((data: any) => {
      if (data.success) {
        console.log("get data:====================================", data.data);
        //this.rowData = data.data;
        this.bomProductList = data.data.map((val: any) => ({
          id: val.bomId,
          name: val.productName,

          sepecicationId: val.bomProductWiseSpecificationId,
          type: val.meterialsType,
        }));

      }
      console.log("Bom Product list:====================", this.bomProductList);
      this.bomProductList = this.bomProductList.filter(x => x.type == "raw");
      console.log("Bom Product list:====================", this.bomProductList);

    });

  }

  validationForMasterSave(): boolean {

    if (
      this.master.lstDetailsViewModel.length == 0 ||
      this.master.lstDetailsViewModel == null
    ) {
      this.toastrService.warning(
        "Please add at least one BOM Details",
        "Message"
      );
      return false;
    }

    return true;
  }




  public roundToDigit(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };


  // calculateGrandTotal() {
  //   this.master.bomTotalCost = 0.0;
  //   this.grandTotalQty = 0.0;
  //   this.master.lstDetailsViewModel.forEach((row) => {
  //     this.master.bomTotalCost += row.totalPrice == "" ? 0.0 : row.totalPrice;
  //     this.grandTotalQty += row.totalQty == "" ? 0.0 : row.totalQty;
  //   });
  // }

  // public refeshDetails() {
  //   this.master.lstDetailsViewModel = [];
  //   this.toastrService.warning(this.commonService.warningmsg, "Message");
  // }

  @Output() myEvent = new EventEmitter();

  // public deleteRow(state, action) {
  //   ////debugger;
  //   const nodeIdToRemove = action.payload;
  //   const filteredData = state.rowData.filter(
  //     (node) => node.id !== nodeIdToRemove
  //   );
  //   return {
  //     ...state,
  //     rowData: [...filteredData],
  //   };
  // }

  // public deleteDetails(index: any) {
  //   let bomDetailsId = this.master.lstDetailsViewModel[index].bomDetailsId;
  //   this.selectedRow = this.master.lstDetailsViewModel[index];

  //   //if (this.selectedRow.helpDetailId > 0) { }

  //   if (bomDetailsId > 0) {
  //     this.bomService
  //       .DeleteBomDetailsById(bomDetailsId)
  //       .subscribe((returns: any) => {
  //         if (returns.success) {
  //           this.master.lstDetailsViewModel.splice(index, 1);
  //           this.toastrService.success(
  //             this.commonService.deletedmsg,
  //             "Message"
  //           );
  //         } else {
  //           this.toastrService.danger("Data not Delete!", "Message");
  //         }
  //       });
  //   } else {
  //     this.master.lstDetailsViewModel.splice(index, 1);
  //     this.toastrService.success(this.commonService.deletedmsg, "Message");
  //   }
  // }

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

  public rbomProductSpecName: string = "";
  public rbomDescription: string = "";
  public rbomNo: string = "";
  public rbomDate: Date = null;
  public rPaymentDate: string = "";

  public rtotalQty: number = 0;
  public rbomQty: number = 0;
  public rgrandTotal: number = 0;

  public rReportHeader = "BOM (Bill of Materials) Report";
  public tableHeader = [
    "#",
    "Details Product Name",
    "Qty.",
    "Waste (%)",
    "Total Qty.",
    "UOM",
  ];
  public apiUrl = "";
  public htmlBodyData: string = "";

  rptHeader = "Product Issue"
  datalength: number;
  requisitionNo: string = "";
  reuisitionDate: Date = new Date();
  quantity: number = 0;
  batchNo: string = "";
  pmProductName: string = "";
  remarks = "";
  receiveNo: string = "";
  issueDate: Date = new Date();
  issueType: string = "";
  bodyData = [];
  headerData = [];
  params = [];
  ReceivedBy: string = "";
  gTotal: number = 0.00;
  public pmRequisitinDetailsData = [];
  public productNameforReport: string = '';

  public bomForType: string = "";

  public getReportData(receiveId) {
    this.productionServiceService.GetReceiveMasterById(receiveId).subscribe((data: any) => {
      if (data.success) {
        console.log("master data for edit======================", data.data[0]);
        this.master = data.data[0];
        console.log("report PM requisiton Data:======================", data.data[0])
        this.batchNo = data.data[0].batchNo;
        this.pmProductName = data.data[0].productName;
        this.requisitionNo = data.data[0].reqNo;
        this.reuisitionDate = data.data[0].reqDate;
        this.quantity = data.data[0].bomQty;
        this.receiveNo = data.data[0].receiveNo;
        this.issueDate = data.data[0].receiveDate;
        this.bomForType = data.data[0].bomForType;
        this.ReceivedBy = data.data[0].ReceivedBy;
        if (data.data[0].typeOfIssue == 'raw') {
          this.issueType = "Raw Materials(RM)";

        }
        else {
          this.issueType = "Packing Materials(PM)";

        }

        //  this.requisitionSelected={
        //   id:data.data[0].rmRequisitonId,
        //   name:data.data[0].reqNo
        //  }
        this.productionServiceService.GetReceiveDetialsByMasterId(receiveId).subscribe((data: any) => {
          if (data.success) {
            this.pmRequisitinDetailsData = data.data;

            console.log("report PM requisiton Data Detail:======================", data.data);
            var fileName = this.rptHeader + ".pdf";
            const content = document.getElementById("reportHeader");
            this.generateReport("print", fileName, content, this.datalength);
          }
          else {
            this.toastrService.danger("Message", this.commonService.nodatafound);
          }

        })
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

  //////////// Open Modal ////////////////



  /////////////////////////////

  typeList: any = [];

  loadTypeList() {
    this.typeList = [
      {
        id: 1,
        name: "Raw Materials(RM)",
      },
      {
        id: 2,
        name: "Packing Materials(PM)",
      },
    ];
  }

  public getType(id) {
    debugger
    if (id == 1) {
      console.log(id)
      this.getBomDetailsProductSpec(3)
    }
    if (id == 2) {
      this.getBomDetailsProductSpec(4)
      console.log(id)
    }

  }
  public issueList = [];
  public requisitionType: string = "";

  //this.requisitionType="";

  public getRequisitionNo(type) {
    this.issueSelected = {
      id: 0,
      name: "Select Issue No"
    };
    if (type == 1) {
      this.productionServiceService.GetMaxReceiveMasterNumber(this.datePipe.transform(this.master.issueDate, "yyyy-MM-dd"), type).subscribe((returns: any) => {
        if (returns.success) {
          this.master.receiveNo = returns.data[0].MaxNo;
        }
      })
    }
    if (type == 2) {
      this.productionServiceService.GetMaxReceiveMasterNumber(this.datePipe.transform(this.master.issueDate, "yyyy-MM-dd"), type).subscribe((returns: any) => {
        if (returns.success) {
          this.master.receiveNo = returns.data[0].MaxNo;
        }
      })

    }
    debugger;
    this.productionServiceService.GetIssueNumberforReceive(type).subscribe((data: any) => {
      if (data.success) {
        this.issueList = data.data.map((val) => ({
          id: val.id,
          name: val.issueNo
        }));
      }
    })
  }


  public getIssueDataById(id) {
    debugger;
    //this.getMaxNo();
    this.productionServiceService.GetIssueMasterByIdForReceive(id).subscribe((data: any) => {
      if (data.success) {
        console.log("requisition data:", data.data[0]);
        this.master.productIssueMasterId = data.data[0].productIssueMasterId;
        this.master.productName = data.data[0].productName;
        this.master.receiveQty = data.data[0].issueQty;
        this.master.issueQty = data.data[0].issueQty;
        this.master.issueRemarks = data.data[0].issueRemarks;
        this.master.issueDate = data.data[0].reqDate;
        this.master.typeOfReceive = data.data[0].type;
        this.master.bomForId = data.data[0].bomForId;
        this.master.bomForType = data.data[0].bomForType;
        this.productionServiceService.GetIssueDetialsByMasterIdForReceive(id).subscribe((list: any) => {
          if (list.success) {
            this.listData = [];
            this.listData = list.data;
          }
        })
      }
    })
  }
}

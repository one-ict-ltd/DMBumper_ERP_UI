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
import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { ProducttransferService } from "app/services/inventory/producttransfer.service";
import { ProductService } from "app/services/inventory/product.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { StockinService } from "app/services/inventory/stockin.service";

import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { forkJoin } from "rxjs";
import { PromoRequisitionService } from "app/pages/inventory/settings/promo-requisition.service";

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: 'ngx-user-wise-product-type',
  templateUrl: './user-wise-product-type.component.html',
  styleUrls: ['./user-wise-product-type.component.scss']
})
export class UserWiseProductTypeComponent implements OnInit {

  serverDate: any[];
  constructor(
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private ProducttransferService: ProducttransferService,
    private productService: ProductService,
    private comboService: CommoncomboService,
    protected dateService: NbDateService<Date>,
    private stockinService: StockinService,
    private PromoRequisition: PromoRequisitionService
  ) {
    this.commonService.valueSet("showlist");
    debugger;
    //this.getServerDateTime();

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
        headerName: "Company",
        field: "companyName",
        width: 200,
      },
      {
        headerName: "Employee Name",
        field: "fullName",
        width: 250,
      },
      {
        headerName: "Product Type",
        field: "productTypeName",
        width: 250,
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
    this.getUserList();

  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    debugger;
    this.GetGridData();
  }

  GetGridData() {
    this.apiUrl = `ProductCategory/GetUserWiseProductType?userProductTypeId=0`;
    this.commonService.getApiData(this.apiUrl).subscribe(
      (data: any) => {
        if (data.success) {
          this.rowData = data.data;
        }
      }
    );
  }

  master: {
    employeeId: number;
    employeeSelected: {};
    listViewModel: any[];
  };

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
  public pageNavigation = "User Wise Product Type Assign";
  public rptHeader = "Issue to Depot (CSD)";
  public tableHeader = ["#", "Product Name", "Pack Size", "Batch No.", "UOM", "Qty"];

  public buttons = this.commonService.btnList;


  public getAllSbu(companyId) {
    this.comboService.getSBUALL(companyId).subscribe((returns: any) => {
      this.tosbus = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
    });
  }
  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
      //this.SbuAutoSelect();
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
  public getMaster() {
    this.master = {
      employeeId: 0,
      employeeSelected: null,
      listViewModel: null,
    };
    //.getPacketTransferNo();
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
    }
  }

  private save() {
    var button = this.commonService.buttonClicked;
    let apiUrl = `ProductCategory/setUserWiseProductType`;
    if (this.master.employeeId == undefined || this.master.employeeId == null) {
      this.toastrService.danger("Message", "Please select user");
      return;
    }
    if (this.master.listViewModel.filter(x => x.isSelect == true).length == 0) {
      this.toastrService.danger("Message", "Please select product type");
      return;
    }
    this.commonService.postApiData(apiUrl, this.master).subscribe(
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
          this.getMaster();
          this.GetGridData();
        }
      }
    );
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

  private gridApi;
  private gridColumnApi;

  public modules: Module[] = AllCommunityModules;
  public columnDefs;
  public defaultColDef;
  public rowData: [];
  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };
  getSelectedRowData() {
    let selectedNodes = this.gridApi.getSelectedNodes();
    let selectedData = selectedNodes.map((node) => node.data);
    alert(`${JSON.stringify(selectedData)}`);
    this.name = selectedData[0].currencyName;
    return selectedData;
  }
  private selectedRows = [];
  public onRowClicked(event) {
    this.selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked;
    this.commonService.agButtonClicked = "";
    if (data == "edit") {
      this.toastrService.info("Access denied!", "Message");
      this.commonService.valueSet("showlist");
      return false;

    } else if (data == "view") {
      this.toastrService.info("Access denied!", "Message");
      this.commonService.valueSet("craete");
      return false;

    } else if (data == "transectionreport") {
      //this.toastrService.info("Access denied!", "Message");
      this.agReport(event);
      this.commonService.valueSet("craete");
      return false;
      //this.agReport(event);
    } else if (data == "delete") {
      this.agDelete(event);
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }

  //   private agEdit(event) {
  //     this.disabled = false;
  //     let temp = 0;
  //     for (let i = 0; i < this.selectedRows.length; i++) {
  //       if (this.selectedRows[i] == event.node.data) {
  //         this.selectedRows.splice(i, 1);
  //         this.selectedRow = event.node.data;
  //         temp = 1;
  //         this.ngOnInit();
  //       }
  //     }
  //     if (temp === 0) {
  //       this.selectedRow = event.node.data;
  //       var prodTrnfrId = event.node.data.depotPromoReceiveId;
  //       this.PromoRequisition.GetPromoReceiveDetailsByMasterId(
  //         prodTrnfrId
  //       ).subscribe((data: any) => {
  //         if (data.success) {
  //           this.master = data.data[0];
  //           //this.master.promoTrnfId = data.data[0].depotPromoReceiveMasterId;
  //           //this.master.lstDetailsViewModel = data.data;
  // ///this.master.fromsbusSelected = {
  //           //   id: data.data[0].fromSbuId,
  //           //   name: data.data[0].sbuFromName,
  //           // };
  //           this.master.productTransferNoSelected = {
  //             id: data.data[0].packetDistributionId,
  //             name: data.data[0].packetDistributionNo,
  //           };
  //         }
  //       }
  //       );
  //       this.ngOnInit();
  //     }
  //   }
  private agReport(event) {
    this.generateCrReport("Pdf", event.node.data.depotPromoReceiveId);
  }

  apiUrl: any = ""
  generateCrReport(reportFormat: any, depotPromoReceiveId: any) {
    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();
    this.apiUrl = `PromoReport/DepotPacketReceiveReport?depotPromoReceiveId=${depotPromoReceiveId}&userId=${userInfo[0].employeeid}&reportFormat=${reportFormat}`;

    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }

  private agDelete(event) {
    if (confirm('Are sure to delete?')) {
      let userProductTypeId = event.node.data.userProductTypeId;;
      this.commonService.postApiData('ProductCategory/DeleteUserWiseProductType', userProductTypeId
      ).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(returns.message, "Message");
          this.GetGridData();
        }
        else {
          this.toastrService.warning(returns.message, "Message");
        }
      });
    }
  }

  public sbus = [];
  public fromsbus = [];
  public tosbus = [];
  public getSBU(companyId) {
    this.comboService.getSBU(companyId).subscribe((returns: any) => {
      this.fromsbus = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
    });
  }

  // public StoreList = [];
  // public getStore(fromSbuId: number) {
  //   this.stockinService
  //     .getStore(fromSbuId, this.master.companyId)
  //     .subscribe((returns: any) => {
  //       this.StoreList = returns.data.map((val) => ({
  //         id: val.storeId,
  //         name: val.storeName,
  //       }));

  //       if (returns.data.length > 0) {
  //         this.master.fromStoreSlected = { id: this.StoreList[0].id, name: this.StoreList[0].name };
  //         this.master.storeId = this.StoreList[0].id;
  //       }
  //     });
  // }

  public DistributionList = [];
  public getDistribution(fromSbuId: number) {
    this.PromoRequisition
      .getDistribution(fromSbuId)
      .subscribe((returns: any) => {
        this.DistributionList = returns.data.map((val) => ({
          id: val.packetDistributionId,
          name: val.packetDistributionNo,
        }));
      });
  }

  // public getPacketTransferNo() {
  //   this.master.promoReceivedNo = null;
  //   if (this.master.packetDistributionDate == null) {
  //     this.master.packetDistributionDate = new Date("dd-MM-yyyy");
  //   }
  //   this.PromoRequisition.GetMaxReceivedTransferNumber(
  //     this.commonService.DateFormat(this.master.packetDistributionDate)
  //   ).subscribe((returns: any) => {
  //     if (returns.success) {
  //       this.master.promoReceivedNo = returns.data[0].MaxNo;
  //     }
  //   });
  // }

  // public getProductById(id) {
  //   this.productService.getProductById(id).subscribe((data: any) => {
  //     if (data.success) {
  //       this.master.uomName = this.master.productSelected["uomName"];
  //     }
  //   });
  // }

  // public prodReqList = [];
  // public GetAllProductReqNumberBySbuId(sbuId) {
  //   this.master.productReqNoSelected = null;
  //   this.ProducttransferService.GetAllProductReqNumberBySbuId(sbuId).subscribe(
  //     (returns: any) => {
  //       this.master.lstDetailsViewModel = [];
  //       this.prodReqList = returns.data.map((val: any) => ({
  //         id: val.prodReqId,
  //         name: val.prodReqNo,
  //       }));
  //     }
  //   );
  // }


  public refesh() {
    //this.master.lstDetailsViewModel = [];
    this.toastrService.warning(this.commonService.warningmsg, "Message");
  }

  datalength: number;
  headerData = [];
  bodyData = [];
  params = [];

  // public getReportData(masterId) {

  //   forkJoin([
  //     this.ProducttransferService.GetProductTransferById(masterId, this.master.transferType),
  //     this.ProducttransferService.GetProductTransferDetailsByMasterId(masterId)
  //   ])
  //     .subscribe(([returnsMaster, returnsDetails]) => {
  //       if (returnsMaster.success) {
  //         this.headerData = returnsMaster.data;
  //         this.bodyData = returnsDetails.data;
  //         this.params = [];
  //         this.params.push({
  //           leftLabel: "Transfer No.",
  //           leftValue: `: ${this.headerData[0].prodTrnNo}`,
  //           rightLabel: "Transfer Date",
  //           rightValue: `: ${this.headerData[0].packetDistributionDate}`,
  //         });
  //         this.params.push({
  //           leftLabel: "Req. No.",
  //           leftValue: `: ${this.headerData[0].prodReqNo}`,
  //           rightLabel: "To Depot",
  //           rightValue: `: ${this.headerData[0].tosbuName}`,
  //         });
  //         this.params.push({
  //           leftLabel: "Driver Name",
  //           leftValue: `: ${this.headerData[0].driverName}`,
  //           rightLabel: "Vehicle No.",
  //           rightValue: `: ${this.headerData[0].vehicleNo}`,
  //         });



  //         var fileName = this.rptHeader + ".pdf";
  //         const content = document.getElementById("reportHeader");
  //         this.generateReport("print", fileName, content, this.datalength);
  //       } else {
  //         this.toastrService.danger("Message", this.commonService.nodatafound);
  //       }
  //     });
  // }

  // public generateReport(
  //   buttonAction: any,
  //   fileName: string,
  //   content: any,
  //   datalength: number
  // ) {
  //   const doc = new jsPDF("p", "pt", "a4");
  //   doc.setFontSize(5);
  //   doc.setTextColor(40);

  //   var legend = {
  //     height: 100,
  //     totalheight: 100 + datalength,
  //   };
  //   const addFooters = (doc) => {
  //     const pageCount = doc.internal.getNumberOfPages();
  //     doc.setFontSize(8);
  //     for (var i = 1; i <= pageCount; i++) {
  //       doc.setPage(i);
  //       doc.text(
  //         "Page " + String(i) + " of " + String(pageCount),
  //         doc.internal.pageSize.width / 1.2,
  //         doc.internal.pageSize.height - 20
  //       );
  //       doc.text(
  //         "Powered by : ONE ERP",
  //         doc.internal.pageSize.width / 2.3,
  //         doc.internal.pageSize.height - 20
  //       );
  //       doc.text(
  //         "Printed Date: " +
  //         new Date().toLocaleDateString() +
  //         " " +
  //         new Date().toLocaleTimeString(),
  //         20,
  //         doc.internal.pageSize.height - 20
  //       );
  //     }
  //   };

  //   doc.html(content, {
  //     callback: function (doc) {
  //       autoTable(doc, {
  //         html: "#header_table_top",
  //         startY: legend.height + 30,
  //         styles: { font: "Meta", fontSize: 15, halign: "center" },
  //         bodyStyles: {
  //           textColor: 50,
  //         },
  //         alternateRowStyles: {
  //         },
  //       });

  //       autoTable(doc, {
  //         html: "#header_table",
  //         startY: legend.height + 80,
  //         styles: { font: "Meta" },
  //         tableLineColor: [0, 0, 0],

  //         bodyStyles: {
  //           textColor: 50,
  //         },
  //         alternateRowStyles: {
  //         },
  //       });

  //       autoTable(doc, {
  //         html: "#body_table",
  //         startY: legend.height + 160,
  //         theme: "grid",
  //         tableLineColor: [0, 0, 0],
  //         tableLineWidth: 0.75,
  //         styles: {
  //           font: "Meta",
  //           lineColor: [44, 62, 80],
  //           lineWidth: 0.55,
  //         },
  //         headStyles: {
  //           fillColor: [250, 250, 250],
  //           fontSize: 11,
  //           textColor: 50,
  //         },
  //         bodyStyles: {
  //           textColor: 50,
  //         },

  //         alternateRowStyles: {
  //         },
  //         columnStyles: {
  //           5: { halign: "right" },
  //         },
  //       });

  //       addFooters(doc);
  //       if (buttonAction == "pdf") {
  //         doc.save(fileName);
  //       } else {
  //         window.open(URL.createObjectURL(doc.output("blob")), "_blank");
  //         doc.close();
  //       }
  //     },
  //   });
  // }

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
  userList = [];
  public getUserList() {
    this.userList = [];
    this.master.employeeSelected = null;
    let apiUrl = `ProductCategory/getAllUserForProductPermission`;
    this.commonService.getApiData(apiUrl).subscribe((returns: any) => {
      this.userList = returns.data.map((val) => ({
        id: val.employeeId,
        name: val.employeeName,
      }));
    });
  }
  productCategories = [];
  public getProductCategory() {
    debugger;
    this.productCategories = [];
    this.master.listViewModel = [];
    let apiUrl = `ProductCategory/getAllProductTypesForUserPermission`;
    this.commonService.getApiData(apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.master.listViewModel = returns.data;
      }
      else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }
  onChangeUser(event: any) {
    let employeeId = this.master.employeeSelected == undefined || this.master.employeeSelected == null ? 0 : this.master.employeeSelected["id"];
    this.master.employeeId = employeeId;
    this.getProductCategory();
  }

}

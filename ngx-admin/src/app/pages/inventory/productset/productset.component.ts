import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  //TemplateRef,
  //ViewChild,
} from "@angular/core";
// interface Country {
//   name: string;
//   flag: string;
//   area: number;
//   population: number;
// }
//import { HttpClient } from "@angular/common/http";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup } from "@angular/forms";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
//import { DatePipe } from '@angular/common';
import {
  NbComponentStatus,
  //NbDialogService,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
//mport { PurchaseorderService } from "app/pages/purchase/settings/purchaseorder.service";
import { ProductService } from "app/services/inventory/product.service";
import { CommoncomboService } from "app/services/commoncombo.service";

@Component({
  selector: "ngx-productset",
  templateUrl: "./productset.component.html",
  styleUrls: ["./productset.component.scss"],
})
export class ProductsetComponent implements OnInit {
  ngOnInit() {
    localStorage.setItem("button", "");
  }

  constructor(
    //private http: HttpClient,
    //private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    //private PurchaseorderService: PurchaseorderService,
    private ProductService: ProductService,
    private comboService: CommoncomboService
  ) //private datePipe: DatePipe,
  {
    this.commonService.valueSet("showlist");
    this.getCompany();
    this.getAllProductSpecification(0);
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
        headerName: "Company Name",
        field: "companyName",
        //filter: "agNumberColumnFilter",
        editable: false,
        width: 180,
      },
      {
        headerName: "Branch Name",
        field: "sbuName",
        editable: false,
        width: 150,
      },
      {
        headerName: "ProductSet Name",
        field: "productSetName",
        editable: false,
        width: 150,
      },
      {
        headerName: "Master Product Name",
        field: "master_ProductName",
        editable: false,
        width: 120,
      },
      {
        headerName: "No of Accessories",
        field: "noOfProductAccessories",
        editable: false,
        width: 130,
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
  }

  // public company: {
  //   name: string; address: string; custom_footer: boolean; phone: string; fax: string; email: string; website: string; vat: string; tin: string;
  // };

  public pageNavigation = "ProductSet";
  public buttons = this.commonService.btnList;
  show: boolean = true;
  disabled: boolean = false;

  vlucherForm: FormGroup;
  submitted: boolean;
  saveupdate: string = "Save";
  gridbutton: string = "";
  name: string;
  description: string;
  selectedRow: any;

  protected options: {};
  protected cd: ChangeDetectorRef;
  showMessages: any = {};
  errors: string[];

  config: NbToastrConfig;
  index = 1;
  destroyByClick = true;
  //duration = 2000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  preventDuplicates = false;
  status: NbComponentStatus = "primary";

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

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      if (this.validationForMasterSave() == false) {
        this.commonService.valueSet("create");
        return;
      }
      this.save();
      this.show = true;
    } else if (this.commonService.buttonClicked == "update") {
      if (this.validationForMasterSave() == false) {
        this.commonService.valueSet("edit");
        return;
      }
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
  master: {
    productSetMasterId: number;
    companyId: number;
    sbuId: number;
    productSetName: string;
    master_ProductWiseSpecificationId: number;
    isActive: number;
    lstDetails: any[];
  };

  public getMaster() {
    this.master = {
      productSetMasterId: 0,
      companyId: 0,
      sbuId: 0,
      productSetName: "",
      master_ProductWiseSpecificationId: 0,
      isActive: 1,
      lstDetails: [],
    };
    this.companySelected = null;
    this.sbuSelected = null;
    this.master_ProductWiseSpecificationIdSelected = null;
    this.accessories_ProductSpecificationSelected = null;
    this.qty = 0;
  }

  //start: custom variables

  qty: number = 0;
  sbus = [];
  companySelected = {};
  sbuSelected = {};
  accessories_ProductWiseSpecificationId = 0;
  master_ProductWiseSpecificationIdSelected = {};
  accessories_ProductSpecificationSelected = {};
  comboBoxSelectedValue: {} = { id: 0, name: "Select None" };

  //end: custom variables

  private save() {
    var button = this.commonService.buttonClicked;
    this.ProductService.SaveProductSet(this.master).subscribe(
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

          //////////////Grid Refresh ///////////////////
          this.getMaster();
          this.ProductService.GetProductSetMasterById(0).subscribe(
            (data: any) => {
              if (data.success) {
                this.rowData = data.data;
              }
            }
          );
          //////////////Grid Refresh ///////////////////
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

  //public selectdetailRows = [];
  private gridApi;
  private gridColumnApi;
  public modules: Module[] = AllCommunityModules;
  public columnDefs;
  public defaultColDef;
  public rowData: [];
  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.ProductService.GetProductSetMasterById(0).subscribe((data: any) => {
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
      //this.agPopup(event, this.templateref);
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
      var productSetMasterId = event.node.data.productSetMasterId;

      this.getCompany();
      this.ProductService.GetProductSetMasterById(productSetMasterId).subscribe(
        (data: any) => {
          if (data.success) {
            this.master = data.data[0];
            this.companySelected = {
              id: data.data[0].companyId,
              name: data.data[0].companyName,
            };
            this.getSBU(this.master.companyId);
            this.sbuSelected = {
              id: data.data[0].sbuId,
              name: data.data[0].sbuName,
            };
            this.master_ProductWiseSpecificationIdSelected = {
              id: data.data[0].master_ProductWiseSpecificationId,
              name: data.data[0].master_ProductName,
            };

            this.ProductService.GetProductSetDetailsById(
              productSetMasterId
            ).subscribe((data: any) => {
              if (data.success) {
                this.master.lstDetails = data.data;
              }
            });
          }
        }
      );

      this.ngOnInit();
    }
  }

  private agDelete(event) {
    this.master.productSetMasterId = event.node.data.productSetMasterId;
    this.ProductService.DeleteProductSetMasterByMasterId(
      this.master.productSetMasterId
    ).subscribe((returns: any) => {
      if (returns.success) {
        this.toastrService.success(this.commonService.deletedmsg, "Message");

        //////////////Grid Refresh ///////////////////
        this.getMaster();
        this.ProductService.GetProductSetMasterById(0).subscribe(
          (data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          }
        );
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

  public Clear() {
    this.accessories_ProductSpecificationSelected = null;
    this.qty = 0;
  }

  public companyList = [];
  public getCompany() {
    this.comboService.getCompany().subscribe((returns: any) => {
      this.companyList = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
    });
    this.sbus.splice(0, 0, this.comboBoxSelectedValue);
  }

  public getSBU(companyId) {
    this.sbuSelected = {};
    this.comboService.getSBU(companyId).subscribe((returns: any) => {
      this.sbus = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
      this.sbus.splice(0, 0, this.comboBoxSelectedValue);
    });
  }

  validationForMasterSave(): boolean {
    if (this.master.companyId == 0 || this.master.companyId == null) {
      this.toastrService.warning("Please select a Company!", "Message");
      return false;
    }
    if (this.master.sbuId == 0 || this.master.sbuId == null) {
      this.toastrService.warning("Please select a Branch!", "Message");
      return false;
    }
    if (
      this.master.master_ProductWiseSpecificationId == 0 ||
      this.master.master_ProductWiseSpecificationId == null
    ) {
      this.toastrService.warning("Please select a Master Product !", "Message");
      return false;
    }
    if (this.master.lstDetails.length == 0) {
      this.toastrService.warning(
        "Please select a Accessories Product !",
        "Message"
      );
      return false;
    }
  }

  validationForAddToList(): boolean {
    if (this.accessories_ProductSpecificationSelected == undefined) {
      this.toastrService.warning(
        "Please select a Accessories Product !",
        "Message"
      );
      return false;
    }
    if (this.qty == 0 || this.qty == null) {
      this.toastrService.warning(
        "Please input a Accessories Quantity!",
        "Message"
      );
      return false;
    }
  }

  addToDetails() {
    if (this.validationForAddToList() == false) {
      return;
    }
    let detail = {
      productSetDetailsId: 0,
      productSetMasterId: this.master.productSetMasterId,
      master_ProductSpecName:
        this.master_ProductWiseSpecificationIdSelected["name"],
      Accessories_ProductSpecName:
        this.accessories_ProductSpecificationSelected["name"],
      accessories_ProductWiseSpecificationId:
        this.accessories_ProductWiseSpecificationId, // this.accessories_ProductSpecificationSelected['id'],
      uomName: this.accessories_ProductSpecificationSelected["uomName"],
      qty: this.qty,
      isActive: 1,
      isDelete: 0,
      isSelect: 1,
    };

    this.master.lstDetails.length == 0
      ? (this.master.lstDetails[0] = detail)
      : this.master.lstDetails.push(detail);
  }

  master_ProductWiseSpecificationList = [];
  accessories_ProductWiseSpecificationList = [];

  public getAllProductSpecification(productId) {
    this.ProductService.getAllProductSpecification(productId).subscribe(
      (returns: any) => {
        if (returns.success) {
          this.master_ProductWiseSpecificationIdSelected = null;
          this.accessories_ProductSpecificationSelected = null;
          this.master_ProductWiseSpecificationList = returns.data.map(
            (val) => ({
              id: val.productWiseSpecificationId,
              name: val.productName,
              skuNumber: val.skuNumber,
            })
          );

          this.accessories_ProductWiseSpecificationList = returns.data.map(
            (val) => ({
              id: val.productWiseSpecificationId,
              name: val.productName,
              uomName: val.uomName,
            })
          );
        }
      }
    );
  }

  getProductSetName() {
    this.master.productSetName =
      "Set-" + this.master_ProductWiseSpecificationIdSelected["skuNumber"];
  }

  public DeleteDetails(index: any) {
    this.selectedRow = this.master.lstDetails[index];
    this.master.lstDetails.splice(index, 1);

    if (this.selectedRow.productSetDetailsId > 0) {
      this.ProductService.DeleteProductSetDetailsById(
        this.selectedRow.productSetDetailsId
      ).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");
        }
      });
    } else {
      this.toastrService.danger(this.commonService.deletedmsg, "Message");
    }
  }

  //#region Report

  private agReport(event) {
    this.generateReport("print", event.data.productSetMasterId);
  }

  rReportHeader = "ProductSet Report";
  rBodyTableHeader = [
    "#",
    "Accesories Product Name",
    "Accessories Count",
    "UOM",
  ];
  htmlBodyData: string = "";

  params = [];
  bodyData: any = [];
  bodyDatashow: any = [];

  rProductSetName: string = "";
  rMasterProductSpecName: string = "";
  rCompanyName: string = "";
  rBranchName: string = "";

  private getReportData(productSetMasterId: number) {
    try {
      this.ProductService.GetProductSetReportById(productSetMasterId).subscribe(
        (returns: any) => {
          if (returns.success && returns.data.length > 0) {
            this.bodyData = [];
            this.bodyData = returns.data;

            this.rProductSetName = this.bodyData[0]["productSetName"];
            this.rMasterProductSpecName =
              this.bodyData[0]["master_ProductSpecName"];
            this.rCompanyName = this.bodyData[0]["companyName"];
            this.rBranchName = this.bodyData[0]["sbuName"];

            this.setParam();
          } else {
            this.toastrService.warning(
              "Message",
              this.commonService.nodatafound
            );
          }
        }
      );
    } catch (error) {
      this.toastrService.danger("Message", error);
    }
  }

  public setParam() {
    this.params = [];
    this.params.push({
      leftLabel: "Company Name:",
      leftValue: this.rCompanyName,
      rightLabel: "Branch Name:",
      rightValue: this.rBranchName,
    });
    this.params.push({
      leftLabel: "ProductSet Name:",
      leftValue: this.rProductSetName,
      rightLabel: "Master Product Spec.:",
      rightValue: this.rMasterProductSpecName,
    });
  }

  public generateReport(buttonAction: any, productSetMasterId: number = 0) {
    //debugger;
    var fileName = this.pageNavigation + "." + buttonAction;
    this.getReportData(productSetMasterId);
    const content = document.getElementById("reportHeader");
    this.commonService.generateSalesReport(buttonAction, fileName, content);
  }

  //#endregion Report

  //   //public tableHeader = ['#', 'Product Name', 'Store Name', 'Current Stock']

  //   private agReport(event) {
  //     //debugger;
  //     //this.generateStockInReport(0);
  //   }

  //   public datalength: number;
  //   public stockNo = '';
  //   public stockInDate = '';
  //   public bodyData = [];

  //   public generateReport(buttonAction: any, fileName: string, content: any, datalength: number) {
  //     const doc = new jsPDF("p", "pt", "a4");
  //     doc.setFontSize(5); //optional
  //     doc.setTextColor(40); //optional

  //     var legend = {
  //       height: 100,
  //       totalheight: 100 + datalength,
  //     };
  //     //debugger;
  //     const addFooters = (doc) => {
  //       const pageCount = doc.internal.getNumberOfPages();
  //       doc.setFontSize(8);
  //       for (var i = 1; i <= pageCount; i++) {
  //         doc.setPage(i);
  //         doc.text(
  //           "Page " + String(i) + " of " + String(pageCount),
  //           doc.internal.pageSize.width / 1.2,
  //           doc.internal.pageSize.height - 20
  //         );
  //         doc.text(
  //           "Powered by : ONE ERP",
  //           doc.internal.pageSize.width / 2.3,
  //           doc.internal.pageSize.height - 20
  //         );
  //         doc.text(
  //           "Printed Date: " +
  //           new Date().toLocaleDateString() +
  //           " " +
  //           new Date().toLocaleTimeString(),
  //           20,
  //           doc.internal.pageSize.height - 20
  //         );

  //       }
  //     };

  //     //////////// TABLE DATA ////////////
  //     // legend.totalheight=legend.height+this.datalength;
  //     doc.html(content, {

  //       callback: function (doc) {
  //         autoTable(doc, {
  //           html: "#header_table_top",
  //           startY: legend.height + 30,
  //           styles: { font: "Meta", fontSize: 15, halign: "center" },
  //         });

  //         autoTable(doc, {
  //           html: "#header_table",
  //           startY: legend.height + 80,
  //           styles: { font: "Meta" },
  //         }
  //         )
  //           ;

  //         autoTable(doc, {
  //           html: "#body_table",
  //           startY: legend.height + 120,
  //           theme: "grid",
  //           tableLineColor: [0, 0, 0],
  //           tableLineWidth: 0.75,
  //           styles: {
  //             font: "Meta",
  //             lineColor: [44, 62, 80],
  //             lineWidth: 0.55,
  //           },
  //           headStyles: {
  //             fillColor: [105, 105, 105],
  //             fontSize: 11,
  //           },
  //           bodyStyles: {
  //             fillColor: [216, 216, 216],
  //             textColor: 50,

  //           },
  //           columnStyles: {
  //             4: { halign: "right" },
  //             5: { halign: "right" }
  //           },

  //           alternateRowStyles: {
  //             fillColor: [250, 250, 250],
  //           },
  //         });

  //         addFooters(doc);
  //         ////////////PRINT ////////////
  //         if (buttonAction == "pdf") {
  //           doc.save(fileName);
  //         } else {
  //           window.open(URL.createObjectURL(doc.output("blob")), "_blank");//doc.output("dataurlnewwindow");
  //           doc.close();
  //         }
  //       },
  //     });
  //   }
}

import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup } from "@angular/forms";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  NbComponentStatus,
  NbDialogService,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
import { PurchaseorderService } from "app/pages/purchase/settings/purchaseorder.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { BillcollectionService } from "app/services/sales/billcollection.service";
import { HrmmasterService } from "app/services/hrm/hrmmaster.service";
import { FormBuilder } from "@angular/forms";
import { PurchaserequisitionService } from "app/pages/purchase/settings/purchaserequisition.service";
import { ProductionPlanService } from "app/services/production/production-plan.service";
import { ProductService } from "app/services/inventory/product.service";
import { BomService } from "app/services/production/bom.service";

@Component({
  selector: 'ngx-production-plan',
  templateUrl: './production-plan.component.html',
  styleUrls: ['./production-plan.component.scss']
})
export class ProductionPlanComponent implements OnInit {

  public company: { name: string; address: string; custom_footer: boolean; phone: string; fax: string; email: string; website: string; vat: string; tin: string; };
  loadFromDateShow: Date = new Date();
  loadToDateShow: Date = new Date();
  /////////////////////////////
  master: {
    productionPlanId: number;
    planTypeId: number;
    uomName: string;
    planNo: string;
    planDate: Date,
    productWiseSpecificationId: number;
    packSize: string;
    batchNo: string;
    batchWeight: number;
    batchTypeId: number;
    chargeNo: string;
    batchRatio: number;
    stdBatchSize: number;
    bomMasterId: number;
    batchStatusId: number;
    thirdPartyStatusId: number;
    packingTypeId: number;
    flagStatus: number;
    productTypeId: number;

    isActive: boolean;
    productSelected: {};
    batchStatusSelected: {};
    thirdPartyStatusSelected: {};
    bomSelected: {};
    batchTypeSelected: {},
    packingTypeSelected: {},
    productTypeSelected: {},
    bomType: string;
    batchWeightForCalculation: number;
    manufacturingDate: Date;
    ExpireDate: Date;
    shelfLife: number;
    batchWeightUOMname: string;
    remarksForPlan: string;
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

  public pageNavigation = "Production Plan";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
      this.disabled = false;

    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      this.save();
      //this.show = true;
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

  public getMaster() {
    this.master = {
      planTypeId: 0,
      productionPlanId: 0,
      planNo: "",
      planDate: new Date(),
      productWiseSpecificationId: 0,
      packSize: "",
      batchNo: "",
      batchWeight: 0,
      batchTypeId: 0,
      chargeNo: "",
      batchRatio: 1,
      stdBatchSize: 0,
      bomMasterId: 0,
      batchStatusId: 1,
      thirdPartyStatusId: 2,
      packingTypeId: 0,
      flagStatus: 1,
      productTypeId: 0,

      uomName: '',
      isActive: true,
      productSelected: null,
      batchStatusSelected: { "id": 1, "name": "Active" },
      thirdPartyStatusSelected: { "id": 2, "name": "InActive" },
      batchTypeSelected: null,
      bomSelected: null,
      packingTypeSelected: null,
      productTypeSelected: null,
      bomType: null,
      batchWeightForCalculation: null,
      manufacturingDate: new Date(),
      ExpireDate: new Date(),
      shelfLife: 0,
      batchWeightUOMname: null,
      remarksForPlan: null
    };
    this.getplanNo();
    //this.getBatchNo();
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

  productList = [];
  public getTypeWiseProducts(productId, productTypeId) {
    this.productService.getTypeWiseProducts(productId, productTypeId, "FG").subscribe((returns: any) => {
      debugger
      this.productList = returns.data.map((val: any) => ({
        id: val.productWiseSpecificationId,
        name: val.productName,
        uomId: val.uomId,
        uomName: val.uomName,
        productId: val.productId,
        packSize: val.packSize
      }));

    });
  }
  public CalculateBatchWeight() {
    debugger

    (this.master.batchWeight == null || this.master.batchWeight == 0) ? 1 : this.master.batchWeight;
    let batchWeight = 0.0;
    batchWeight = this.master.batchWeightForCalculation * this.master.batchRatio;
    this.master.batchWeight = batchWeight;
    if (this.master.batchRatio == 0) {
      this.master.batchWeight = this.master.batchWeightForCalculation;
    }
  }
  public getProductById(id) {
    debugger
    //this.master.uomName = this.master.productSelected["uomName"];
    this.master.packSize = "";
    this.master.packSize = this.master.productSelected["packSize"];

    this.getBOMs(this.master.productWiseSpecificationId)
    // this.productService.getProductById(id).subscribe((data: any) => {
    //   //debugger;
    //   if (data.success) {
    //     this.master.uomName = this.master.productSelected["uomName"];
    //     this.master.packSize = this.master.productSelected["packSize"];
    //   //  this.master.uomId = this.data["uomId"];
    //   }
    // });
  }

  bomList = [];
  getBOMs(productWiseSpecificationId: any) {
    this.bomService.GetProductWiseSpecificationWsieBOM(productWiseSpecificationId).subscribe((returns: any) => {
      if (returns.success) {
        debugger
        this.bomList = [];
        this.master.bomSelected = {
          id: 0,
          name: "Select BOM",
        };
        this.bomList = returns.data.map((val: any) => ({
          id: val.bomId,
          name: val.bomNo,
        }));

        //if (returns.data.length == 1) {

        this.master.bomMasterId = returns.data[0].bomId;
        this.master.batchWeight = returns.data[0].batchWeight;
        this.master.batchWeightForCalculation = returns.data[0].batchWeight;
        this.master.bomType = returns.data[0].bomType;
        this.master.shelfLife = returns.data[0].shelfLife;
        this.master.batchWeightUOMname = returns.data[0].batchWeightUOMname;
        this.bomService.getBomTypeIdByName(this.master.bomType).subscribe((returns: any) => {
          if (returns.success) {
            debugger
            this.master.batchTypeId = returns.data[0].batchTypeId;
          }
        });
        this.master.stdBatchSize = returns.data[0].bomQty;
        this.master.bomSelected = {
          id: returns.data[0].bomId,
          name: returns.data[0].bomNo,
        }
        if (this.master.shelfLife != null) {
          this.calculateExpiryDate();
        }
        //}

      }
    });
  }
  public calculateExpiryDate() {
    if (this.master.manufacturingDate && this.master.shelfLife !== null) {
      var manufactureDate = new Date(this.master.manufacturingDate);
      var ExpireDate = new Date(manufactureDate.setMonth(manufactureDate.getMonth() + this.master.shelfLife));
      //this.master.ExpireDate = new Date(ExpireDate.setDate(ExpireDate.getDate() - 1));
      this.master.ExpireDate = new Date(ExpireDate.setDate(ExpireDate.getDate() - 0));
    } else {
      this.master.ExpireDate = null;
    }
  }
  // batchTypeList = [];
  // getBatchTypebyId(batchTypeId) {
  //   this.productionPlanService.GetBatchTypeById(batchTypeId).subscribe((returns: any) => {
  //     if (returns.success) {
  //       this.batchTypeList = returns.data.map((val: any) => ({
  //         id: val.batchTypeId,
  //         name: val.batchTypeName,
  //       }));
  //     }
  //   });
  // }

  planTypeList = [{ "id": 1, "name": "FG" }, { "id": 2, "name": "Material" }]
  batchStatusList = [{ "id": 1, "name": "Active" }, { "id": 2, "name": "Inactive" }]
  thirdPartyStatusList = [{ "id": 1, "name": "Active" }, { "id": 2, "name": "Inactive" }]

  planTypeChange(event: any) { }
  batchStatusChange(event: any) { }
  thirdPartyStatusChange(event: any) { }
  batchTypeChange(event: any) { }

  getplanNo() {
    if (this.master.planDate == null) {
      this.master.planDate = new Date();
    }
    //console.log("the finalrequsition date is:",this.master.billDate)
    this.productionPlanService
      .getPlanNo(
        this.master.planDate.toDateString().substring(4, 15)
      )
      .subscribe((returns: any) => {
        console.log(returns);
        if (returns.success) {
          this.master.planNo = returns.data[0].MaxNo;
        }
      });
  }


  // getBatchNo() {
  //   if (this.master.planDate == null) {
  //     this.master.planDate = new Date();
  //   }
  //   //console.log("the finalrequsition date is:",this.master.billDate)
  //   this.productionPlanService
  //     .getBatchNo(
  //       this.master.planDate.toDateString().substring(4, 15)
  //     )
  //     .subscribe((returns: any) => {
  //       console.log(returns);
  //       if (returns.success) {
  //         if (this.master.productionPlanId == 0) {
  //           this.master.batchNo = returns.data[0].MaxNo;
  //         }

  //       }
  //     });
  // }
  checkChange(event: any, rowIndex: any) { }
  //need to create a API from backend to get the packing type list by vwPrdPackingType SQL Server view
  packingTypeList = [
    { "id": 3, "name": "Blister packs" },
    { "id": 2, "name": "Bottles" },
    { "id": 5, "name": "Box" },
    { "id": 6, "name": "Jar" },
    { "id": 4, "name": "Sachet" },
    { "id": 1, "name": "Vials" },
  ]
  packingTypeChange(event: any) { }


  /////End of Dynamic Button section (Do Not Edit)///////

  /////////////////////////////// CRUD ///////////////////////////////////////////

  private save() {
    debugger;
    if (this.master.planNo == "") {
      this.toastrService.danger("Please fill up required field", "Message");
      this.commonService.valueSet("create");
      return;
    }

    if (this.master.batchNo == "" || this.master.batchNo == null) {
      this.toastrService.danger("Batch number can not be empty!", "Message");
      this.commonService.valueSet("create");
      return;
    }
    if (this.master.batchWeight == 0 || this.master.batchNo == null) {
      this.toastrService.danger("Batch weight can not be empty or zero!", "Message");
      this.commonService.valueSet("create");
      return;
    }

    if (this.master.productionPlanId > 0) {
      //this.show = true;
      //console.log(this.master);
      this.master.planDate = this.commonService.DateFormat(this.master.planDate);
      this.master.manufacturingDate = this.commonService.DateFormat(this.master.manufacturingDate);
      this.master.ExpireDate = this.commonService.DateFormat(this.master.ExpireDate);
      // this.commonService.ConsoleLog(this.master);
      let button = "";

      this.productionPlanService.SaveProductionPlan(this.master).subscribe((returns: any) => {
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
          this.getMaster();
          // this.productionPlanService.GetProductionPlanById(0).subscribe((data: any) => {
          //   if (data.success) {
          //     this.rowData = data.data;
          //   }
          // });
          this.productionPlanService.GetProductionPlanByIdwithDate(this.commonService.DateFormat(this.loadFromDateShow), this.commonService.DateFormat(this.loadToDateShow), 0).subscribe((data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          });
        }
        else {
          this.toastrService.warning(
            this.commonService.successmsg,
            "Message"
          );
          this.show = false;
        }
      });
    } else {
      this.productionPlanService.CheckDuplicatedBatchNo(this.master.productionPlanId, this.master.batchNo).subscribe((data: any) => {
        if (data.success) {
          if (data.data.length > 0) {
            this.toastrService.danger("Batch number can not be same!", "Message");
            this.commonService.valueSet("create");
          } else {
            this.show = true;
            //console.log(this.master);
            this.master.planDate = this.commonService.DateFormat(this.master.planDate);
            this.master.manufacturingDate = this.commonService.DateFormat(this.master.manufacturingDate);
            this.master.ExpireDate = this.commonService.DateFormat(this.master.ExpireDate);
            // this.commonService.ConsoleLog(this.master);
            let button = "";

            this.productionPlanService.SaveProductionPlan(this.master).subscribe((returns: any) => {
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
                // this.productionPlanService.GetProductionPlanById(0).subscribe((data: any) => {
                //   if (data.success) {
                //     this.rowData = data.data;
                //   }
                // });
                this.productionPlanService.GetProductionPlanByIdwithDate(this.commonService.DateFormat(this.loadFromDateShow), this.commonService.DateFormat(this.loadToDateShow), 0).subscribe((data: any) => {
                  if (data.success) {
                    this.rowData = data.data;
                  }
                });
              }
              else {
                this.toastrService.warning(
                  this.commonService.successmsg,
                  "Message"
                );
              }
            });

          }
        }
      });
    }



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
    private hrmmasterService: HrmmasterService,
    private comboService: CommoncomboService,
    private billcollectionService: BillcollectionService,
    private formBuilder: FormBuilder,
    private purchaserequisitionService: PurchaserequisitionService,
    private productionPlanService: ProductionPlanService,
    private productService: ProductService,
    private bomService: BomService,
  ) {
    this.commonService.valueSet('showlist');
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
        headerName: "Plan No",
        field: "planNo",
        filter: "agTextColumnFilter",
        editable: false,
        width: 180,
      },
      {
        headerName: "Plan Date",
        field: "planDate",
        filter: "agTextColumnFilter",
        editable: false,
        width: 170,
      },
      {
        headerName: "Batch No",
        field: "batchNo",
        filter: "agTextColumnFilter",
        editable: false,
        width: 160,
      },
      {
        headerName: "Batch Type",
        field: "batchTypeName",
        filter: "agTextColumnFilter",
        width: 160,
      },
      {
        headerName: "BOM Name",
        field: "bomName",
        filter: "agTextColumnFilter",
        width: 180,
      },
      {
        headerName: "Product",
        field: "productName",
        filter: "agTextColumnFilter",
        editable: false,
        width: 180,
      },

      // {
      //   headerName: "Type",
      //   field: "productTypeName",
      //   filter: "agTextColumnFilter",
      //   width: 160,
      // },
      {
        headerName: "Remarks",
        field: "remarksForPlan",
        filter: "agTextColumnFilter",
        editable: false,
        width: 230,
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
    this.getProductType();
    //this.getTypeWiseProducts(0, 1);
    //this.getBOMs();
    this.getplanNo();
    //this.getBatchNo();
    //this.getBatchTypebyId(0)
    this.loadFromDateShow.setDate(this.loadFromDateShow.getDate() - 1);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getGridData();

  }
  getGridData() {
    this.productionPlanService.GetProductionPlanByIdwithDate(this.commonService.DateFormat(this.loadFromDateShow), this.commonService.DateFormat(this.loadToDateShow), 0).subscribe((data: any) => {
      if (data.success) {
        this.rowData = data.data;
      }
    })
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

  private agDelete(event) {
    debugger;
    var productionPlanId = event.node.data.productionPlanId;
    //this.master.productionPlanId = event.node.data.processHeadId;
    // this.hrmmasterService.deleteGender(this.master.processHeadId).subscribe((returns: any) => {
    //   if (returns.success) {
    //     this.toastrService.success(this.commonService.deletedmsg, "Message");

    //     //////////////Grid Refresh ///////////////////

    //     //////////////Grid Refresh ///////////////////
    //   }
    // });
    if (confirm('Are you sure?')) {
      this.productionPlanService.DeleteProductionPlanById(productionPlanId).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          // this.productionPlanService.GetProductionPlanById(0).subscribe((data: any) => {
          //   if (data.success) {
          //     this.rowData = data.data;
          //   }
          // });
          this.productionPlanService.GetProductionPlanByIdwithDate(this.commonService.DateFormat(this.loadFromDateShow), this.commonService.DateFormat(this.loadToDateShow), 0).subscribe((data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          });
        }
        else {
          this.toastrService.warning(returns.message, "Message");
        }
      });
    }
  }
  public productTypeList = [];
  public getProductType() {
    this.productService.getProductType().subscribe((retuns: any) => {
      if (retuns.success) {
        //  debugger
        // Finish =1 Raw =5
        this.productTypeList = retuns.data.filter(x => x.productTypeId == 1 || x.productTypeId == 5).map((val: any) => ({
          id: val.productTypeId,
          name: val.productTypeName,
        }))
      }
    })
  }

  //public tableHeader = ['#', 'Product Name', 'Store Name', 'Current Stock']
  private agReport(event) {
    this.generateCrReport(event.data.productionPlanId, "Pdf");
  }
  public apiUrl = "";
  generateCrReport(productionPlanId: any, reportFormat: any) {
    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();
    this.apiUrl = `ProductionReport/GetProductionPlanReportById?reportFormat=${reportFormat}&userId=${userInfo[0].employeeid}&productionPlanId=${productionPlanId}`;
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
  public datalength: number;
  public stockNo = '';
  public stockDate = '';
  public bodyData = [];

  public params = [];
  public setParam() {
    this.params = [];
    this.params.push({ leftLabel: "Voucher No", leftValue: "", rightLabel: "Voucher Date", rightValue: "" });
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
      this.master.productionPlanId = event.node.data.productionPlanId;

      // this.hrmmasterService.getGender(this.master.chargeHeadId).subscribe((data: any) => {
      //   if (data.success) {
      //     this.master = data.data[0];
      //   }
      // });

      this.productionPlanService.GetProductionPlanById(this.master.productionPlanId).subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0];

          this.master.planDate = this.commonService.DateFormat(data.data[0].planDate);
          this.master.manufacturingDate = this.commonService.DateFormat(data.data[0].manufacturingDate);
          this.master.ExpireDate = this.commonService.DateFormat(data.data[0].ExpireDate);

          this.master.bomSelected = {
            id: data.data[0].bomMasterId,
            name: data.data[0].bomNo
          }
          this.master.productTypeSelected = {
            id: data.data[0].productTypeId,
            name: data.data[0].productTypeName
          }

          this.master.productSelected = {
            id: data.data[0].productWiseSpecificationId,
            name: data.data[0].productName
          }

          // this.master.batchTypeSelected = {
          //   id: data.data[0].batchTypeId,
          //   name: data.data[0].batchTypeName
          // }
          debugger
          this.master.bomType = data.data[0].batchTypeName;
          this.master.manufacturingDate = new Date(data.data[0].manufacturingDate);
          this.master.ExpireDate = new Date(data.data[0].ExpireDate);
          this.master.batchWeightUOMname = data.data[0].batchWeightUOMname;
          this.master.packSize = data.data[0].packSize;

          let batchStatus = this.batchStatusList.find(x => x.id == data.data[0].batchStatusId)
          this.master.batchStatusSelected = {
            id: data.data[0].batchStatusId,
            name: batchStatus?.name
          }

          let thirdPartyStatus = this.thirdPartyStatusList.find(x => x.id == data.data[0].thirdPartyStatusId)
          this.master.thirdPartyStatusSelected = {
            id: data.data[0].thirdPartyStatusId,
            name: thirdPartyStatus?.name
          }



          let packingType = this.packingTypeList.find(x => x.id == data.data[0].packingTypeId)
          this.master.packingTypeSelected = {
            id: data.data[0].packingTypeId,
            name: packingType?.name
          }




        }
      })
      this.ngOnInit();
    }
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

}



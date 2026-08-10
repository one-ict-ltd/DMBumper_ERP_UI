import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup } from "@angular/forms";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { NbComponentStatus, NbDialogService, NbGlobalLogicalPosition, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrConfig, NbToastrService, } from "@nebular/theme";
import { PurchaseorderService } from "app/pages/purchase/settings/purchaseorder.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { BillcollectionService } from "app/services/sales/billcollection.service";
import { HrmmasterService } from "app/services/hrm/hrmmaster.service";
import { FormBuilder } from "@angular/forms";
import { PurchaserequisitionService } from "app/pages/purchase/settings/purchaserequisition.service";
import { ProductionPlanService } from "app/services/production/production-plan.service";
import { ProductService } from "app/services/inventory/product.service";
import { BomService } from "app/services/production/bom.service";
import { ProductionServiceService } from "app/services/production/production-service.service";
import { debug } from "node:console";

@Component({
  selector: 'ngx-production-process',
  templateUrl: './production-process.component.html',
  styleUrls: ['./production-process.component.scss']
})
export class ProductionProcessComponent implements OnInit {

  public company: { name: string; address: string; custom_footer: boolean; phone: string; fax: string; email: string; website: string; vat: string; tin: string; };
  loadFromDateShow: Date = new Date();
  loadToDateShow: Date = new Date();
  /////////////////////////////

  master: {
    productionTypeId: number;
    productionPlanId: number;
    planDate: Date,
    productWiseSpecificationId: number;

    packSize: string;
    batchNo: string;
    uomName: string;
    batchSize: string;
    batchWeight: number;
    productName: string;
    productWeight: number;
    processName: string;
    batchDate: string;
    productionPlanSelected: {};
    processModelList: any[];
    processMachineList: any[];
    processDate: string;
  };

  machineDetailModel: {
    machineId: number;
    uploadQty: number;
    outputQty: number;
    machineSelected: {};
    uomSelected: {};
    startingTime: Date;
    endingTime: Date;
    lostTimeHH: number;
    lostTimeMM: number;
    remarks: string;
    machineOutput: number;
    involvePerson: number;
  }

  public getMachineDetailModel() {
    this.machineDetailModel = {
      machineId: null,
      uploadQty: 0,
      outputQty: 0,
      machineSelected: null,
      uomSelected: null,
      startingTime: new Date(),
      endingTime: new Date(),
      lostTimeHH: 0,
      lostTimeMM: 0,
      remarks: "",
      machineOutput: 0,
      involvePerson: 0,
    }
  }

  public getMaster() {
    this.master = {
      productionTypeId: 0,
      productionPlanId: 0,
      planDate: new Date(),
      batchSize: "",
      productWiseSpecificationId: 0,

      packSize: "",
      batchNo: "",
      uomName: "",
      batchWeight: 0,
      productName: "",
      productWeight: 0,
      processName: "",
      batchDate: "",
      processDate: "",
      productionPlanSelected: null,
      processModelList: [],
      processMachineList: [],
    };
    this.getMachineDetailModel();
  }


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

  public pageNavigation = "Production Process";
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

      this.SaveProductionProcess();
      //this.show = true;
    } else if (this.commonService.buttonClicked == "update") {
      this.save();

      this.SaveProductionProcess();
      //this.show = true;
    } else if (this.commonService.buttonClicked == "view") {
      this.show = false;
    } else if (this.commonService.buttonClicked == "reset") {
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      this.show = false;
    }
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

  bomList = [];
  getBOMs(productWiseSpecificationId: any) {
    this.bomService.GetProductWiseSpecificationWsieBOM(productWiseSpecificationId).subscribe((returns: any) => {
      if (returns.success) {
        this.bomList = returns.data.map((val: any) => ({
          id: val.bomId,
          name: val.bomNo,
        }));
      }
    });
  }

  batchTypeList = [];
  getBatchTypebyId(batchTypeId) {
    this.productionPlanService.GetBatchTypeById(batchTypeId).subscribe((returns: any) => {
      if (returns.success) {
        this.batchTypeList = returns.data.map((val: any) => ({
          id: val.batchTypeId,
          name: val.batchTypeName,
        }));
      }
    });
  }


  MachineList = [];
  GetMachineInfoById() {
    this.machineDetailModel.machineSelected = null;
    this.productionProcessService.GetMachineInfoById(0).subscribe((res: any) => {
      if (res.success) {
        this.MachineList = res.data.map((val: any) => ({
          id: val.machineInfoId,
          code: val.machineCode,
          name: val.machineName,
        }));
      }
    });
  }


  planTypeList = [{ "id": 1, "name": "FG" }, { "id": 2, "name": "Material" }]
  batchStatusList = [{ "id": 1, "name": "Active" }, { "id": 2, "name": "Inactive" }]
  thirdPartyStatusList = [{ "id": 1, "name": "Active" }, { "id": 2, "name": "Inactive" }]

  hasQCList: any = [];
  qCSelected: any[] = [];
  loadHasQCList() {
    this.hasQCList = [
      {
        id: 1,
        name: "Yes",
      },
      {
        id: 0,
        name: "No",
      },
    ];
  }

  /////End of Dynamic Button section (Do Not Edit)///////

  /////////////////////////////// CRUD ///////////////////////////////////////////

  private save() {
    this.commonService.valueSet("create");
    this.show = false;
    return;
    debugger;
    // if (this.master.planNo == "") {
    //   this.toastrService.danger("Please fill up required field", "Message");
    //   this.commonService.valueSet("create");
    //   return;
    // }

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
    // console.log(this.master)
    // return;


    this.productionPlanService.CheckDuplicatedBatchNo(this.master.productionPlanId, this.master.batchNo).subscribe((data: any) => {
      if (data.success) {
        if (data.data.length > 0) {
          // console.log(data)
          this.toastrService.danger("Batch number can not be same!", "Message");
          this.commonService.valueSet("create");
        } else {
          this.show = true;
          //console.log(this.master);
          this.master.planDate = this.commonService.DateFormat(this.master.planDate);
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
              this.productionPlanService.GetProductionPlanByIdwithDate(this.commonService.DateFormat(this.loadFromDateShow), this.commonService.DateFormat(this.loadToDateShow)
                , 0).subscribe((data: any) => {
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
    // private http: HttpClient,
    // private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    // private PurchaseorderService: PurchaseorderService,
    // private hrmmasterService: HrmmasterService,
    // private comboService: CommoncomboService,
    // private billcollectionService: BillcollectionService,
    // private formBuilder: FormBuilder,
    // private purchaserequisitionService: PurchaserequisitionService,
    private productionPlanService: ProductionPlanService,
    private productionProcessService: ProductionServiceService,
    // private productService: ProductService,
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
        headerName: "Batch Status",
        field: "batchStatus",
        width: 160,
      },
      {
        headerName: "Plan No",
        field: "planNo",
        editable: false,
        width: 170,
      },
      {
        headerName: "Plan Date",
        field: "planDate",
        editable: false,
        width: 160,
      },
      {
        headerName: "Batch No",
        field: "batchNo",
        editable: false,
        width: 180,
      },
      {
        headerName: "Product",
        field: "productName",
        editable: false,
        width: 200,
      },
      {
        headerName: "Batch Type",
        field: "batchTypeName",
        width: 160,
      },
      // {
      //   headerName: "BOM",
      //   field: "bomName",
      //   width: 160,
      // },
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
    this.loadDropDownData();
    this.loadFromDateShow.setDate(this.loadFromDateShow.getDate() - 7);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.GetGridData();

  }
  GetGridData() {
    this.productionPlanService.GetProductionPlanByIdwithDate(this.commonService.DateFormat(this.loadFromDateShow), this.commonService.DateFormat(this.loadToDateShow)
      , 0).subscribe((data: any) => {
        if (data.success) {
          this.rowData = data.data;
        }
      })
  }
  loadDropDownData() {
    this.getAllBatch();
    this.loadproductionTypeList();
    this.getBatchTypebyId(0);
    this.GetMachineInfoById();
    this.getProductUOM(0);
  }

  uomList: [];
  getProductUOM(uomId: any) {
    this.uomList = [];
    this.machineDetailModel.uomSelected = {};

    let apiUrl = `ProductCategory/getProductUOM?uomId=${uomId}`;
    this.commonService.getApiData(apiUrl).subscribe((data: any) => {
      if (data.success) {
        this.uomList = data.data.map((val: any) => ({
          id: val.uomId,
          name: val.uomName,
        }));
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
    debugger
    this.selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked;
    if (data == "edit") {
      // this.agEdit(event);
      // this.show = false;
      this.toastrService.info("Access denied!", "Info");
      this.commonService.valueSet("showlist");
      this.show = true;
    } else if (data == "view") {
      // this.agEdit(event);
      // this.show = false;
      // this.disabled = true;
      this.toastrService.info("Access denied!", "Info");
      this.commonService.valueSet("showlist");
      this.show = true;

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
    var prdPlanProcessId = event.node.data.productionPlanId;
    if (confirm('Are you sure to delete?')) {
      this.productionPlanService.DeleteProductionProcessById(prdPlanProcessId).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          this.productionPlanService.GetProductionPlanByIdwithDate(this.commonService.DateFormat(this.loadFromDateShow), this.commonService.DateFormat(this.loadToDateShow)
            , 0).subscribe((data: any) => {
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

  //public tableHeader = ['#', 'Product Name', 'Store Name', 'Current Stock']
  private agReport(event) {
    this.generateCrReport(event);
  }
  public apiUrl = "";
  generateCrReport(event: any) {
    this.apiUrl = "";
    let reportFormat = "Pdf";
    let productionPlanId = event.data.productionPlanId;
    let planDate = event.data.planDate;
    let userInfo = this.commonService.GetUserProfileJson();

    this.apiUrl = `ProductionReport/GetProductionProcessReport?reportFormat=${reportFormat}&userId=${userInfo[0].employeeid}&productionPlanId=${productionPlanId}&fdate=${planDate}&tdate=${planDate}`;

    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        //console.log(res.message);
        this.toastrService.warning(res.message, "Info");
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

  productionTypeList: any = [];

  loadproductionTypeList() {
    this.productionTypeList = [
      {
        id: 1,
        name: "Manufacturing",
      },
      {
        id: 2,
        name: "Packing",
      },
    ];
  }



  productionPlanList = [];
  public getAllBatch() {
    //this.productionPlanService.GetProductionPlanForProdProcess(0).subscribe((data: any) => {
    this.productionPlanService.GetProductionPlanBatch(0).subscribe((data: any) => {
      if (data.success) {
        //debugger
        console.log("Batch data: ", data);
        this.productionPlanList = data.data.map((val: any) => ({
          id: val.productionPlanId,
          // name: val.batchNo,
          name: val.batchNo + " | " + val.productName + " " + val.packSize,
          productName: val.productName,
          specId: val.productWiseSpecificationId,
          batchWeight: val.batchWeight,
          batchNo: val.batchNo,
          stdBatchSize: val.stdBatchSize,
          planDate: val.planDate,
          packSize: val.packSize
        }));
      }
    });
  }
  clearBatchNo() {
    this.master.productionPlanSelected = {};
    this.master.processMachineList = [];
    this.clearBatchDetails();
  }
  clearBatchDetails() {
    this.master.batchNo = "";
    this.master.batchSize = "";
    this.master.batchDate = "";
    this.master.batchWeight = 0;
    this.master.productName = "";
    this.master.productWiseSpecificationId = 0;
    this.master.packSize = "";
    this.master.processModelList = []
  }

  getBatchDetails(event: any) {
    debugger
    console.log('productionPlanId: ', this.master.productionPlanId);
    console.log(this.master.productionPlanSelected);
    this.clearBatchDetails();
    //if (event) {
    if (this.master.productionPlanSelected != null) {
      this.master.batchNo = this.master.productionPlanSelected["batchNo"];
      this.master.batchSize = this.master.productionPlanSelected["stdBatchSize"];
      this.master.batchDate = this.master.productionPlanSelected["planDate"];
      this.master.batchWeight = this.master.productionPlanSelected["batchWeight"];

      this.master.productName = this.master.productionPlanSelected["productName"];
      this.master.productWiseSpecificationId = this.master.productionPlanSelected["specId"];
      this.master.packSize = this.master.productionPlanSelected["packSize"];

      //this.productionPlanService.GetBatchWiseProcesses(this.master.productWiseSpecificationId, this.master.productionTypeId).subscribe((data: any) => {
      // this.productionPlanService.GetProductionPlanProcessById(this.master.productionPlanId, this.master.productionTypeId, this.master.productWiseSpecificationId).subscribe((data: any) => {
      //   if (data.success) {
      //     this.master.processModelList = data.data;
      //     this.processCount = data.data.length;
      //     console.log("processModelList :", data.data);
      //     // console.log("processCount :", this.processCount);
      //   }
      // });

      this.GetProductionPlanProcessById(this.master.productionPlanId, this.master.productionTypeId, this.master.productWiseSpecificationId);

    }
  }

  processCount: number = 0;
  processStatusChange(event: any, rowIndex: number) {
    debugger;
    //console.log(this.master.processModelList[index]);
    if ((event == 1 || this.master.processModelList[rowIndex].processCompleteStatus == 1)) {
      this.master.processModelList[rowIndex].processStatus = "Complete";
      this.master.processModelList[rowIndex].processCompleteStatus = 1;
    }
    else {
      this.master.processModelList[rowIndex].processStatus = "Pending";
      this.master.processModelList[rowIndex].processCompleteStatus = 0;
    }
    this.SetMachineDateTime(rowIndex);
  }

  SetMachineDateTime(rowIndex: number) {
    debugger;
    // if (this.master.processModelList[rowIndex].processCompleteStatus == 1 && this.master.processModelList[rowIndex].prdPlanProcessId > 0)
    // {
    //   this.machineDetailModel.startingTime = this.master.processModelList[rowIndex].startTime;
    //   this.machineDetailModel.endingTime = this.master.processModelList[rowIndex].endTime;
    // }
    // else
    if (this.master.processModelList[rowIndex].processCompleteStatus == 1) {
      this.machineDetailModel.startingTime = this.master.processModelList[rowIndex].startTime;
      this.machineDetailModel.endingTime = this.master.processModelList[rowIndex].endTime;
    }
    else {
      this.machineDetailModel.startingTime = null; //this.master.processModelList[index].startTime;
      this.machineDetailModel.endingTime = null; //this.master.processModelList[index].endTime;
    }
  }


  deleteProcessMachine(rowIndex) {
    debugger
    if ((this.master.processMachineList[rowIndex].prdPlanMachineId ?? 0) > 0) {
      this.productionPlanService
        .DeleteProcessMachineById(this.master.processMachineList[rowIndex].prdPlanMachineId)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.toastrService.success(this.commonService.deletedmsg, "Message");

          }
        });
    }
    this.master.processMachineList.splice(rowIndex, 1);
  }

  ProcessNameSelect(event: any, rowIndex: number) {
    if (this.master.processModelList[rowIndex].isSelect == 1) {
      this.master.processModelList.forEach(el => {
        el.isSelect = 0;
      });

      this.master.processModelList[rowIndex].isSelect = 1;
    }

    this.SetMachineDateTime(rowIndex);

    this.master.processMachineList = [];
    if (this.master.processModelList[rowIndex].isSelect == 1) {
      // Load New or Old Machine data
      this.GetProductionPlanMachineById(this.master.processModelList[rowIndex].prdPlanProcessId ?? 0);
    }

  }

  //GetProductionPlanProcessById(int? productionPlanId, int? productWiseSpecificationId, int? productionTypeId)
  GetProductionPlanProcessById(productionPlanId: number, productionTypeId: number, productWiseSpecificationId: number) {
    this.productionPlanService.GetProductionPlanProcessById(productionPlanId, productionTypeId, productWiseSpecificationId).subscribe((data: any) => {
      if (data.success) {
        //this.rowData = data.data;
        this.master.processModelList = data.data;

        if (data.data.length == 0) this.toastrService.warning(`No Data Found!`, "Info");

      } else {
        this.toastrService.warning(`${data.message}`, "Info");
      }
    });
  }

  GetProductionPlanMachineById(prdPlanProcessId: number) {
    if ((prdPlanProcessId ?? 0) > 0) {
      this.productionPlanService.GetProductionPlanMachineById(prdPlanProcessId).subscribe((data: any) => {
        if (data.success) {
          //this.rowData = data.data;
          this.master.processMachineList = data.data;
          if (data.data.length == 0) this.toastrService.warning(`Machine Data Not Found!`, "Info");
        } else {
          this.toastrService.warning(`${data.message}`, "Info");
        }
      });
    }
  }

  ToTransferNote() {
    debugger;
    let isAllProcessComplete: boolean = true;
    let totalOutput = 0;
    //console.log("ToTransferNote")
    this.master.processModelList.forEach(element => {
      if ((element.processCompleteStatus ?? 0) == 0) {
        isAllProcessComplete = false;
        return;
      }
      debugger
      if ((element.hasQC ?? 0) == 1) {
        if ((element.qcApproval ?? 0) == 0) {
          isAllProcessComplete = false;
          return;
        }
      }
      totalOutput = element.totalOutput;
    });
    if (isAllProcessComplete == true) {
      isAllProcessComplete = false;
      this.productionPlanService.GetCheckManufacturingAndPackingProcessComplete(this.master.productionPlanId).subscribe((data: any) => {
        console.log("GetCheckManufacturingAndPackingProcessComplete: ", data);
        if (data.success) {
          isAllProcessComplete = data.data[0].isAllProcessComplete;

          if (isAllProcessComplete && (totalOutput ?? 0) > 0) {
            //Do something
            if (confirm("Are you sure to transfer?")) {
              //transfer this batch to Stock in by 3rd party UI
              //SaveProcessTransfer
              this.productionPlanService.SetProcessTransfer(this.master.productionPlanId, totalOutput).subscribe((data: any) => {
                if (data.success) {
                  this.toastrService.success(data.message, "Info");
                  this.getAllBatch();
                  window.location.reload();
                  // this.show = true;
                  // this.commonService.valueSet("showlist");
                } else {
                  this.toastrService.warning(`${data.message}`, "Info");
                }
              });

              this.toastrService.success("All Process Completed ! Ready to transfer", 'Transfer Status');
            }
          }
          else {
            this.toastrService.warning("All process not completed or final output qty. is 0 (zero) ! So transfer not allowed", 'Transfer Status')
          }

        } else {
          this.toastrService.warning("All process not completed or final output quantity is zero (0) or QC Approval pending ! So transfer not allowed", 'Transfer Status');
        }
      });
    }
  }


  addToMachineList() {
    let prdPlanProcessId: number = null;
    debugger;
    this.master.processModelList.forEach(el => {
      if ((el.isSelect ?? 0) == 1) {
        prdPlanProcessId = el.prdPlanProcessId;
      }
    });

    if (this.machineDetailModel.machineSelected == null) {
      this.toastrService.warning('Please select a Machine.', 'Warning !');
      return;
    }
    if (this.master.productionPlanSelected == null) {
      this.toastrService.warning('Please select a Batch No.', 'Warning !');
      return;
    }
    if (this.machineDetailModel.uomSelected == null) {
      this.toastrService.warning('Please select a UOM.', 'Warning !');
      return;
    }
    if (this.machineDetailModel.startingTime == null) {
      this.toastrService.warning('Please select starting time.', 'Warning !');
      return;
    }
    if (this.machineDetailModel.endingTime == null) {
      this.toastrService.warning('Please select ending time.', 'Warning !');
      return;
    }


    if (this.machineDetailModel.startingTime > this.machineDetailModel.endingTime) {
      this.toastrService.warning(`Machine Start time should be less than End time!`, "warning");
      return;
    }

    if (prdPlanProcessId == null) {
      this.toastrService.warning('Please select a process.', 'Warning !');
      return;
    }

    /*
      Machine Code
      Machine Name
      Starting Time
      Ending Time
      Lost Time
      Upload Qty.
      Output Qty.
      UOM
      Remarks
      Machine Output
      Involve Person
    */

    let obj = {
      prdPlanMachineId: 0,
      prdPlanProcessId: prdPlanProcessId,
      // productionPlanId: 0,
      productionPlanId: this.master.productionPlanId,
      // productionPlanId: this.master.productionPlanSelected['productionPlanId'],
      machineInfoId: this.machineDetailModel.machineSelected['id'],
      machineCode: this.machineDetailModel.machineSelected['code'],
      machineName: this.machineDetailModel.machineSelected['name'],
      uomId: this.machineDetailModel.uomSelected['id'],
      uomName: this.machineDetailModel.uomSelected['name'],
      startingTime: this.machineDetailModel.startingTime,
      endingTime: this.machineDetailModel.endingTime,
      lostTimeHH: this.machineDetailModel.lostTimeHH,
      lostTimeMM: this.machineDetailModel.lostTimeMM,
      uploadQty: this.machineDetailModel.uploadQty,
      outputQty: this.machineDetailModel.outputQty,
      remarks: "",
      machineOutput: null,
      involvePerson: null,
    }

    // this.master.processMachineList.splice(0, 0, obj);
    this.master.processMachineList.push(obj);
    this.machineDetailModel.uomSelected = null;
  }


  SaveProductionProcess() {
    debugger

    console.log('processModelList old: ', this.master.processModelList);

    // this.master.processModelList.forEach(el => {
    //   el.startTime = el.startTime != null ? el.startTime.replace('T', ' ') : el.startTime;
    //   el.endTime = el.endTime != null ? el.endTime.replace('T', ' ') : el.endTime;

    // });

    for (let index = 0; index < this.master.processModelList.length; index++) {
      const el = this.master.processModelList[index];
      el.startTime = el.startTime != null ? el.startTime.replace('T', ' ') : el.startTime;
      el.endTime = el.endTime != null ? el.endTime.replace('T', ' ') : el.endTime;

      if (new Date(el.startTime) > new Date(el.endTime)) {
        this.toastrService.warning(`Process Start time should be less than End time!`, "warning");
        return;
      }
    }

    console.log('processModelList: ', this.master.processModelList);

    if (this.master.processModelList.length == 0) {
      this.toastrService.warning(`Production process not found!`, "Info");
      return;
    }
    this.productionPlanService.SaveProductionProcess(this.master.processModelList).subscribe((data: any) => {
      if (data.success) {
        this.toastrService.success(`Data Saved Successfully!`, "Info");
        this.GetProductionPlanProcessById(this.master.productionPlanId, this.master.productionTypeId, this.master.productWiseSpecificationId);
      } else {
        this.toastrService.warning(`${data.message}`, "Info");
      }
    });
  }

  SaveProductionMachine() {
    //
    debugger;
    console.log('processMachineList: ', this.master.processMachineList);

    // this.master.processMachineList.forEach(el => {
    //   el.startTime = el.startingTime.replace('T', ' ');
    //   el.endTime = el.endingTime.replace('T', ' ');
    // });

    for (let index = 0; index < this.master.processMachineList.length; index++) {
      const el = this.master.processMachineList[index];
      el.startTime = el.startingTime.replace('T', ' ');
      el.endTime = el.endingTime.replace('T', ' ');

      if (new Date(el.startTime) > new Date(el.endTime)) {
        this.toastrService.warning(`Process Start time should be less than End time!`, "warning");
        return;
      }
    }

    console.log('processMachineList: ', this.master.processMachineList);

    if (this.master.processMachineList.length == 0) {
      this.toastrService.warning(`Process wise machine not found!`, "Info");
      return;
    }

    this.productionPlanService.SaveProductionMachine(this.master.processMachineList).subscribe((data: any) => {
      if (data.success) {
        //this.rowData = data.data;
        this.toastrService.success(`Data Saved Successfully!`, "Info");
      } else {
        this.toastrService.warning(`${data.message}`, "Info");
      }
    });
  }

}


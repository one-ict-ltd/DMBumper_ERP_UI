import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from "@angular/core";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
// import { FormGroup } from "@angular/forms";
import { NbDialogService, NbToastrService, } from "@nebular/theme";
// import { CommoncomboService } from "app/services/commoncombo.service";
// import { FormBuilder } from "@angular/forms";
import { ProductionPlanService } from "app/services/production/production-plan.service";

@Component({
  selector: 'ngx-production-qa-approval',
  templateUrl: './production-qa-approval.component.html',
  styleUrls: ['./production-qa-approval.component.scss']
})
export class ProductionQaApprovalComponent implements OnInit {
  loadFromDateShow: Date = new Date();
  loadToDateShow: Date = new Date();

  master: {
    productionQaId: number;
    productionPlanId: number;
    planDate: string,
    productWiseSpecificationId: number;

    batchNo: string;
    stdBatchSize: number;
    batchWeight: number;
    productName: string;
    processName: string;
    batchDate: string;
    productionPlanSelected: {};

    processDate: string;
    testName: string;
    value: number;
    result: string;
    remarks: string;
    startDate: string;
    endDate: string;
    QCDate: Date;
    expDate: string,
    mfgDate: string,
    approvalStatus: string;
    QCprocessList: any[];
    prdPlanProcessId: number;
    description: string;
  };
  public getMaster() {
    this.master = {
      productionQaId: 0,
      productionPlanId: 0,
      planDate: "",
      productWiseSpecificationId: 0,
      batchNo: "",
      stdBatchSize: 0,
      batchWeight: 0,
      productName: "",
      processName: "",
      batchDate: "",
      processDate: "",
      productionPlanSelected: null,
      prdPlanProcessId: 0,
      testName: "",
      value: 0,
      result: "",
      remarks: "",
      startDate: "",
      endDate: "",
      expDate: "",
      mfgDate: "",
      QCDate: new Date(),
      approvalStatus: "",
      QCprocessList: [],
      description: "",
    };
    this.TestParameterId = 0;
    this.ParameterSelected = null;
    this.getAllBatch();
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
    //private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    //private formBuilder: FormBuilder,
    private productionPlanService: ProductionPlanService) {
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
        headerName: "QC Date",
        field: "QCDate",
        editable: false,
        width: 160,
      },
      {
        headerName: "Batch Info",
        field: "planNo",
        editable: false,
        width: 500,
      },
      {
        headerName: "Approval Status",
        field: "approvalStatus",
        editable: false,
        width: 180,
      },
      {
        headerName: "Remarks",
        field: "remarks",
        editable: false,
        width: 180,
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
    this.loadDropDownData();
    this.loadFromDateShow.setDate(this.loadFromDateShow.getDate() - 1);
  }
  loadDropDownData() {
    this.GetAllQcQaParameterList();
  }
  productionPlanList = [];
  public getAllBatch() {
    this.productionPlanService.GetProductionProcessBatch(0).subscribe((data: any) => {
      if (data.success) {
        this.productionPlanList = data.data.map((val: any) => ({
          id: val.productionPlanId,
          name: val.name,
          productName: val.productName,
          specId: val.productWiseSpecificationId,
          batchWeight: val.batchWeight,
          stdBatchSize: val.stdBatchSize,
          batchNo: val.batchNo,
          planDate: val.planDate,
          processName: val.processName,
          startDate: val.startDate,
          endDate: val.endDate,
          mfgDate: val.endDate,
          expDate: val.endDate,
          prdPlanProcessId: val.prdPlanProcessId
        }));
      }
    });
  }
  show: boolean = true;
  ngOnInit(): void {
  }
  public pageNavigation = "Production Process QA Approval";
  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
      // this.disabled = false;

    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      this.save();
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
      this.show = true;
    } else if (this.commonService.buttonClicked == "view") {
      this.show = false;
    } else if (this.commonService.buttonClicked == "reset") {
      //this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      this.show = false;
    }
  }
  public addToDetailsGrid(e: any) {
    let element = {
      QCprocessDetailsId: 0,
      TestParameterId: this.ParameterSelected["id"],
      testName: this.master.testName,
      result: this.master.result,
      value: this.master.value,
      description: this.master.description,
    };
    //this.master.QCprocessList.splice(0, 0, elements);
    this.master.QCprocessList.push(element);
  }
  selectedRow: any;
  public deleteDetails(index: any) {
    debugger;
    if (confirm("Are you sure to delete?")) {
      this.selectedRow = this.master.QCprocessList[index];
      this.master.QCprocessList.splice(index, 1);
      if (this.selectedRow.helpDetailId > 0) {
      }
      this.toastrService.danger(this.commonService.deletedmsg, "Message");
    }
  }
  getProcessDetails(event: any) {
    debugger
    this.master.QCprocessList = [];
    this.ParameterSelected = null;
    this.TestParameterId = 0;

    if (this.master.productionPlanSelected != null) {
      this.master.batchNo = this.master.productionPlanSelected["batchNo"];
      this.master.batchDate = this.master.productionPlanSelected["planDate"];
      this.master.batchWeight = this.master.productionPlanSelected["batchWeight"];
      this.master.stdBatchSize = this.master.productionPlanSelected["stdBatchSize"];
      this.master.productName = this.master.productionPlanSelected["productName"];
      this.master.processName = this.master.productionPlanSelected["processName"];
      this.master.startDate = this.master.productionPlanSelected["startDate"];
      this.master.endDate = this.master.productionPlanSelected["endDate"];
      this.master.prdPlanProcessId = this.master.productionPlanSelected["prdPlanProcessId"];
      this.master.mfgDate = this.master.productionPlanSelected["mfgDate"];
      this.master.expDate = this.master.productionPlanSelected["expDate"];

      this.GetPredefineParameterFormat();
    }
  }
  ParameterSelected: any = {};
  ParameterList: any = [];
  TestParameterId: number = 0;
  uom: string = '';
  GetAllQcQaParameterList() {
    let apiUrl = `ProductionPlan/GetAllQcQaParameterList`;
    this.commonService.getApiData(apiUrl).subscribe((data: any) => {
      if (data.success) {
        this.ParameterList = data.data.map((val: any) => ({
          id: val.TestParameterId,
          name: val.TestParameterName,
          uom: val.ResultOfUom,
        }));
        if (data.data.length == 0) {
          this.toastrService.warning("Test paremeter not found!", "Message");
        }
      }
    });
  }
  GetPredefineParameterFormat() {
    let apiUrl = `ProductionPlan/GetPredefineParameterFormat?productionPlanId=${this.master.productionPlanId}`;
    this.commonService.getApiData(apiUrl).subscribe((data: any) => {
      if (data.success) {
        this.master.QCprocessList = data.data;
        if (data.data.length == 0) {
          this.toastrService.warning("Pre-define test paremeter format not found! Please Add all related parameter.", "Message");
        }
      }
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.GetGridData();
    // this.productionPlanService.GetProductionQAById(0).subscribe((data: any) => {
    //   if (data.success) {
    //     this.rowData = data.data;
    //   }
    // });
  }
  GetGridData() {
    this.productionPlanService.GetProductionQAByIdDate(this.commonService.DateFormat(this.loadFromDateShow), this.commonService.DateFormat(this.loadToDateShow)
      , 0).subscribe((data: any) => {
        if (data.success) {
          this.rowData = data.data;
        }
      })
  }
  private agDelete(event) {
    debugger;
    var productionQaId = event.node.data.productionQaId;
    if (confirm('Are you sure?')) {

      this.productionPlanService.DeleteProductionProcessQaById(productionQaId).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");


          this.productionPlanService.GetProductionQAByIdDate(this.commonService.DateFormat(this.loadFromDateShow), this.commonService.DateFormat(this.loadToDateShow)
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
  public onRowClicked(event) {
    this.selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked;
    if (data == "edit") {
      this.commonService.valueSet("showlist");
      //this.agEdit(event);
      this.show = true;
    } else if (data == "view") {
      this.commonService.valueSet("showlist");
      //this.agEdit(event);
      this.show = true;
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
      if (confirm('Are you sure to delete?')) {
        this.agDelete(event);
        this.toastrService.warning("Access Dennied", 'Info')
        console.log(event.data.dispatchMasterId);
      }
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }
  private selectedRows = [];

  private agReport(event) {
    this.generateCrReport("Pdf", event.data.productionQaId);
  }
  public apiUrl = "";
  generateCrReport(reportFormat: any, productionQaId: any) {
    debugger;

    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();
    this.apiUrl = `ProductionReport/GetProductionQaReportById?reportFormat=${reportFormat}&userId=${userInfo[0].employeeid}&productionQaId=${productionQaId}`;

    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        console.log(res);
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }
  resultList = [{ "id": 1, "name": "Passed" }, { "id": 2, "name": "Failed" }]
  private save() {
    debugger
    this.commonService.valueSet("create");
    this.show = false;
    if (this.master.approvalStatus == "") {
      this.toastrService.danger("Please Select approvalStatus", "Message");
      return;
    }
    if (this.master.productionPlanId == 0) {
      this.toastrService.danger("Please Select BatchNo", "Message");
      return;
    }
    if (this.master.QCprocessList.length == 0) {
      this.toastrService.danger("Please Select QC Process List", "Message");
      return;
    }
    this.master.QCDate = this.commonService.DateFormat(this.master.QCDate);
    this.productionPlanService.SaveProductionQA(this.master).subscribe((returns: any) => {
      if (returns.success) {
        this.show = true;
        if (this.master.prdPlanProcessId > 0) {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }


        debugger

        this.productionPlanService.GetProductionQAByIdDate(this.commonService.DateFormat(this.loadFromDateShow), this.commonService.DateFormat(this.loadToDateShow)
          , 0).subscribe((data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }

            this.getMaster(); //////////////Grid Refresh ///////////////////
            this.loadDropDownData();
          });
        this.commonService.valueSet("showlist");
      }
    });

  }
}

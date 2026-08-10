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

import { CommoncomboService } from "app/services/commoncombo.service";
import { ProductionPlanService } from "app/services/production/production-plan.service";


@Component({
  selector: 'ngx-batch-release',
  templateUrl: './batch-release.component.html',
  styleUrls: ['./batch-release.component.scss']
})
export class BatchReleaseComponent implements OnInit {



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

  public pageNavigation = "Production Batch Release";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();

      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      this.save();
      //this.show = true;
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
      //this.show = true;
    } else if (this.commonService.buttonClicked == "view") {
      this.show = false;
    } else if (this.commonService.buttonClicked == "reset") {
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      this.show = false;
    }
  }
  master: {
    stockMasterId: number;
    transactionMasterId: number;
    poReceiveId: number;

    stockNo: string;


    remarks: string;

    productWiseSpecificationId: number;

    stockQty: number;

    productspecificationSelected: {};
    transectionSelected: {};
    TransferDetailsList: any[];

    batchNo: string;
    mgfDate: Date;
    expireDate: Date;
  };
  public getMaster() {
    this.master = {
      stockMasterId: 0,
      transactionMasterId: null,
      poReceiveId: 0,

      stockNo: "",

      stockQty: 0,


      remarks: "",

      productWiseSpecificationId: null,

      productspecificationSelected: null,
      transectionSelected: null,
      TransferDetailsList: [],

      batchNo: "",
      mgfDate: null,
      expireDate: null,
    };

    this.GETALLTransection();
  }



  transectionList: [];
  GETALLTransection() {
    debugger
    this.productionPlanService.GetTransferNoteById(0).subscribe((data: any) => {
      if (data.success) {
        debugger
        this.transectionList = data.data.filter(x => x.ReleaseStatus == 0 && new Date(x.transferDate) > new Date('10-Feb-2025')).map((val: any) => ({
          id: val.productTransferId,
          name: val.transferNoteNo + ` (${val.batchTypeName})` + ' | ' + val.transferDate + ' | ' + val.productName + ' | Batch: ' + val.batchNo + ' | Qty: ' + val.noOfBox + ' | Batch Status: ' + val.batchStatus,
        }));;
      }
    });
  }

  public getTransferDetailsDataLoad(productTransferId) {
    debugger
    this.master.TransferDetailsList = [];

    this.productionPlanService.GetTransferNoteById(productTransferId).subscribe((data: any) => {
      if (data.success) {
        this.master.TransferDetailsList = data.data;
        if (this.master.TransferDetailsList.length > 0) {
          this.master.TransferDetailsList.forEach(element => {
            element.ReleaseDate = new Date();
          });
        }
      } else {
        this.master.TransferDetailsList = [];
      }
    });

  }



  private save() {
    var button = this.commonService.buttonClicked;
    if (this.master.transectionSelected == null) {
      this.toastrService.danger("Please select tranhsfer Note No.", "Message");

      this.commonService.valueSet("create");
      return false;
    }

    //this.show = true;
    if (this.master.TransferDetailsList.length == 0) {
      this.toastrService.danger("Please select atleast one Batch", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    if (this.master.TransferDetailsList[0].isActive == false) {
      this.toastrService.danger("Please select & approved the Batch", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    this.master.TransferDetailsList.forEach(element => {
      element.ReleaseDate = this.commonService.DateFormat(element.ReleaseDate);
    });

    this.productionPlanService.UpdateTransferNote(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }

        this.getMaster();
        this.productionPlanService.GetTransferNoteById(0).subscribe((data: any) => {
          if (data.success) {
            this.rowData = data.data.filter(x => x.ReleaseStatus == 1);
          }
        }
        );
        this.show = true;
      }
      else {
        this.commonService.valueSet("create");
        this.show = false;
        this.toastrService.danger(returns.message, "Message");
      }
    });

    this.getMaster();
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

  loadFromDateShow: Date = new Date();
  loadToDateShow: Date = new Date();
  constructor(
    private http: HttpClient,
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private comboService: CommoncomboService,
    private productionPlanService: ProductionPlanService,
  ) {
    this.loadFromDateShow.setDate(this.loadFromDateShow.getDate() - 1);
    this.commonService.valueSet("showlist");

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
        headerName: "Release Date",
        field: "ReleaseDate",
        width: 160,
      },
      {
        headerName: "Release Remarks",
        field: "ReleaseRemarks",
        width: 160,
      },
      {
        headerName: "Batch No.",
        field: "batchNo",
        width: 120,
      },
      {
        headerName: "Batch Status",
        field: "batchStatus",
        width: 140,
      },
      {
        headerName: "Transfer No.",
        field: "transferNoteNo",
        width: 140,
      },
      {
        headerName: "Date",
        field: "transferDate",
        width: 140,
      },
      {
        headerName: "Batch Type",
        field: "batchTypeName",
        width: 140,
      },
      {
        headerName: "Product Name",
        field: "sProductName",
        width: 200,
      },
      {
        headerName: "Pack Size",
        field: "sPackSize",
        width: 120,
      },
      {
        headerName: "Qty. (Box)",
        field: "noOfBox",
        width: 110,
      },
      {
        headerName: "Qty. (Pcs)",
        field: "transferQty",
        width: 130,
      },

      {
        headerName: "Issued By",
        field: "transferIssuedBy",
        width: 150,
      },
      {
        headerName: "Remarks",
        field: "remarks",
        width: 150,
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

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.GetGridData();
  }
  GetGridData() {
    this.productionPlanService.GetTransferNoteById(0, this.loadFromDateShow, this.loadToDateShow).subscribe((data: any) => {
      if (data.success) {
        this.rowData = data.data.filter(x => x.ReleaseStatus == 1);
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

      this.show = false;
    } else if (data == "view") {

      this.show = false;
      this.disabled = true;
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
      this.toastrService.info("Can't Delete After Batch Release", "Message");
      //this.agDelete(event);
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }


  //////////////////////////////////End of Ag Grid Data Load/////////////////////////////////

  @Output() myEvent = new EventEmitter();

  //public tableHeader = ["#", "Product Name", "Batch No.", "Price", "Stock Qty.", "Current Stock"];
  private agReport(event) {
    //this.toastrService.info("Print button clicked", "Message");
    //this.getReportData(event.data.rmRequisitonId);
    this.generateCrReport("Pdf", event.data.productTransferId);
  }

  public apiUrl = "";
  generateCrReport(reportFormat: any, productTransferId: any) {
    //debugger;

    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();
    this.apiUrl = `ProductionReport/GetTransferNoteReportById?reportFormat=${reportFormat}&userId=${userInfo[0].employeeid}&productTransferId=${productTransferId}`;

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
}
import {
  Component,
  // EventEmitter,
  OnInit,
  Output,
  // TemplateRef,
} from "@angular/core";
// import { HttpClient } from "@angular/common/http";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import {
  FormGroup,
  // NgForm
} from "@angular/forms";
import {
  NbComponentStatus,
  // NbDialogService,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
// import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { CommoncomboService } from "app/services/commoncombo.service";
// import { SalarygradeService } from "app/services/salary/salarymaster/salarygrade.service";
// import { SalaryslabService } from "app/services/salary/salarymaster/salaryslab.service";
import { SalarystructureService } from "app/services/salary/salarymaster/salarystructure.service";
//import { EmployeeinformationService } from "app/services/hrm/employeeinformation.service";
import { SalaryperiodService } from "app/services/salary/salarymaster/salaryperiod.service";
import { SalaryheadService } from "app/services/salary/salarymaster/salaryhead.service";
import { SalaryFixedHeadStructureService } from "app/services/salary/salarymaster/salary-fixed-head-structure.service";



import * as XLSX from 'xlsx';
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";
type AOA = any[][];

@Component({
  selector: 'ngx-miosalestargetupload',
  templateUrl: './miosalestargetupload.component.html',
  styleUrls: ['./miosalestargetupload.component.scss']
})
export class MiosalestargetuploadComponent implements OnInit {

  private gridApi;
  private gridColumnApi;
  private territoryEdit = '';
  public modules: Module[] = AllCommunityModules;
  public columnDefs;
  public defaultColDef;
  public rowData: [];
  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };
  constructor(
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private salarystructureService: SalarystructureService,
    // private salarygradeService: SalarygradeService,
    // private salaryslabService: SalaryslabService,
    private comboService: CommoncomboService,
    private salaryperiodService: SalaryperiodService,
    private salesinvoiceService: SalesinvoiceService,
    //private employeeinformationService: EmployeeinformationService,
    private salaryheadService: SalaryheadService,
    private SalaryFixedHeadStructureService: SalaryFixedHeadStructureService,) {
    this.commonService.valueSet("showlist");

    this.LoadSalaryPeriod();

    this.columnDefs = [
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.rowIndex + 1",
        pinned: "left",
        filter: false,
        width: 70,
      }, /// Dont Change
      {
        headerName: "Employee's Code",
        field: "employeeNo",
        filter: "agTextColumnFilter",
        width: 200,
      },
      {
        headerName: "Employee's Name",
        field: "fullName",
        filter: "agTextColumnFilter",
        width: 350,
      },
      {
        headerName: "Territory Code",
        field: "territoryCode",
        filter: "agTextColumnFilter",
        width: 250,
      },
      {
        headerName: "Depot Code",
        field: "depotCode",
        filter: "agTextColumnFilter",
        width: 250,
      },
      {
        headerName: "Amount",
        field: "targetvalue",
        filter: "agNumberColumnFilter",
        valueFormatter: (params) => this.currencyFormatter(params.data.targetvalue),
        type: "rightAligned",
        width: 150,
      },
      {
        field: "action",
        cellRenderer: "btnCellRenderer",
        cellRendererParams: {
          clicked: function (field: any) { },
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
      editable: true,
    };
    this.getMaster();
    this.GetAllDepo();
  }

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
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.SalaryFixedHeadStructureService.GetMiosalestargetmasterById(0).subscribe((data: any) => {
      debugger;
      if (data.success) {
        this.rowData = data.data;
      }
    });
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "MIO's Monthly Item Wise Target Upload";//"Employee's Salary Fixed Head Structure";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
      this.disabled = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      this.UploadData();
    } else if (this.commonService.buttonClicked == "update") {
      this.UploadData();
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
      salMIOSalesTargetMasterId: 0,
      EmpFixedHeadStructureId: 0,
      employeeId: 0,
      salaryPeriodId: 0,
      salaryHeadId: 0,
      depotCode: "",
      territoryCode: "",
      structureAmount: 0,
      startDate: new Date(),
      endDate: new Date(),
      isActive: false,
      lstMaster: [],
    };
    this.salaryPeriodSelected = {};
    this.getFirstAndLastDayOfMonth();
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
      this.commonService.valueSet("save");
    } else if (data == "delete") {
      this.agDelete(event)
    } else {
      //this.toastrService.info("Please Click Any Button", "Message");
    }
  }
  ///End of Dynamic Button section (Do Not Edit)///////

  private agDelete(event) {
    if (this.disabled == false) {
      let targetId = event.node.data.targetMasterId;
      if (confirm("Are you sure to delete?")) {
        this.SalaryFixedHeadStructureService
          .DeleteMioItemWiseSalesTarget(targetId)
          .subscribe((returns: any) => {
            if (returns.success) {
              this.toastrService.success(this.commonService.deletedmsg, "Message");

              this.SalaryFixedHeadStructureService.GetMiosalestargetmasterById(0).subscribe((data: any) => {
                debugger;
                if (data.success) {
                  this.rowData = data.data;
                }
              });
            }
          });
      }
    }
  }


  master: {
    salMIOSalesTargetMasterId: number;
    EmpFixedHeadStructureId: number;
    employeeId: number;
    salaryPeriodId: number;
    salaryHeadId: number;
    depotCode: string;
    territoryCode: string;
    structureAmount: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    lstMaster: any[];
  };

  fromdateSelected = new Date();
  todateSelected = new Date();
  territorySelected: any = {};
  territoryList: any[]
  territoryCode: any = "";
  depotCode: any = "";
  apiUrl = "";
  depotList: any[];
  depotSelected = {};
  public GetAllDepo() {
    this.depotSelected = {};

    this.apiUrl = "";
    this.apiUrl = `SalesInvoice/GetAllDepot`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.depotList = returns.data.map((val: any) => ({
          id: val.depotCode,
          name: val.depotName,
        }));

        //if (this.depotList.length > 0) {
        if (this.depotList.length == 1) {
          this.depotSelected = { id: this.depotList[0].id, name: this.depotList[0].name };
          this.depotCode = this.depotList[0].id;
          this.getAllTerritory(this.depotCode);
        }
        //}
      }
    })
  }

  getAllTerritory(depotCode: any = '') {
    this.territoryList = [];
    this.territoryCode = "";
    this.territorySelected = {};
    this.salesinvoiceService.GetAllTerritoryForDepot(depotCode).subscribe((returns: any) => {
      if (returns.success) {
        this.territoryList = returns.data.map((val: any) => ({
          id: val.TerritoryCode,
          name: val.TerritoryName,
        }));
        if (this.territoryEdit?.length > 0) {
          const territorySelectedFilter = this.territoryList.filter(x => x.id == this.territoryEdit)[0];
          this.territorySelected = { id: territorySelectedFilter.id, name: territorySelectedFilter.name };
          this.territoryCode = this.territoryEdit;
          this.territoryEdit = '';
        }

      }
    });
  }

  getFirstAndLastDayOfMonth(): void {
    //Date.UTC(yyyy, mm, dd)
    var date = this.master.startDate;//new Date();
    var firstDay = new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
    var lastDay = new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0));
    this.master.startDate = firstDay;
    this.master.endDate = lastDay;
  }

  data: AOA = [[1, 2], [3, 4]];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'UploadFile.xlsx';



  onFileChange(evt: any) {
    debugger;
    this.master.lstMaster = [];
    if (this.salaryPeriodSelected == null || this.salaryPeriodSelected == undefined) {
      this.toastrService.warning("Please select a salary period.", "Warning Message");
      return false;
    }

    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);

    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const file = target.files[0];
    const fileName = file.name;
    const fileExtension = fileName.substr(fileName.lastIndexOf('.') + 1).toLowerCase();

    if (fileExtension !== 'xlsx') {
      this.toastrService.warning("Please upload an XLSX file.", "Warning Message");
      return false;
    }

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));

      //console.log("data:", this.data);
      this.data.splice(0, 1);
      //console.log('Delete column text', this.data);

      //var myJsonData = JSON.stringify(this.data);
      this.data.forEach(e => {
        debugger;
        let obj = {
          targetDetailId: 0,
          salMIOSalesTargetMasterId: 0,
          productWiseSpecificationId: 0,
          targetvalue: 0,
          isActive: 1,

          skuNumber: e[0],
          productName: e[1],
          CtnQty: e[2],
          targetQty: e[2],
          status: '',
        }
        this.master.lstMaster.push(obj);
      });

      // this.data.map(res => {
      //   if (res[0] === "no") {
      //     console.log(res[0]);
      //   } else {
      //     console.log(res[0]);
      //   }
      // })

    };
    reader.readAsBinaryString(target.files[0]);
  }

  public ReadFileData(evt: any) {

  }

  public LoadData(): void {
    // debugger;
    // this.data = this.data.splice(0, 1);
    // console.log('Delete column text', this.data);

  }

  //// For synchronous call

  // private dataStorage: string = null;
  // private retrieveDataResolver;
  // retrieveDataPromise(evt: any): Promise<any> {
  //   return new Promise((resolve) => {
  //     this.retrieveDataResolver = resolve;
  //     this.ReadFileData(evt);
  //   })
  // }
  // DisplayData(evt: any) {
  //   debugger;
  //   this.retrieveDataPromise(evt).then(() => { this.LoadData() });
  // }



  salaryPeriodItems = [];
  salaryPeriodSelected = {};//{ id: 0, name: 'select a period' };
  public LoadSalaryPeriod() {
    this.salaryperiodService.GetSalaryPeriodById(0).subscribe((returns: any) => {
      this.salaryPeriodItems = returns.data.map((val) => ({
        id: val.salaryPeriodId,
        name: val.periodName,
      }));
    });
  }

  public UploadData() {
    //var myJsonString = JSON.stringify(this.data);
    debugger;
    if (this.verifyStatus != 'Successed') {
      this.toastrService.warning("Vericiation Failed!", "Message");
      return false;
    }
    if (this.depotCode == 0 || this.depotCode == null) {
      this.toastrService.danger("Please select Depot", "Message");
      return false;
    }
    if (this.territoryCode == 0 || this.territoryCode == null) {
      this.toastrService.danger("Please select Territoty", "Message");
      return false;
    }
    this.master.depotCode = this.depotCode;
    this.master.territoryCode = this.territoryCode;
    this.master.startDate = this.commonService.DateFormat(this.master.startDate);
    this.master.endDate = this.commonService.DateFormat(this.master.endDate);

    this.SalaryFixedHeadStructureService.SaveMioItemWiseSalesTarget(this.master).subscribe((retuns: any) => {
      if (retuns.status) {
        this.toastrService.success("Successfully Uploaded!", "Message");
        this.show = true;
      }
    });
    this.refesh();
  }

  totalData = 0;
  verifyStatus = "Not verified";
  public VerifyData() {
    if (this.disabled == false) {
      if (this.master.lstMaster.length == 0) {
        this.toastrService.warning("No data found for verification!", "Message");
        return false;
      }
      this.SalaryFixedHeadStructureService.GetMioSalesTargetUploadDataVerify(this.master.lstMaster).subscribe((retuns: any) => {
        if (retuns.status) {
          this.master.lstMaster = retuns.data

          this.totalData = this.master.lstMaster.length;
          let vData = this.master.lstMaster.filter((i: any) =>
            i.status == "OK").length;
          this.verifyStatus = this.totalData == vData ? "Successed" : "Pirtially Successed";
          //console.log('VerifyData: ', retuns.data);
        }
      })
    }
  }

  private agEdit(event) {
    const dd = event.node.data;
    this.SalaryFixedHeadStructureService.GetMioSalesTargetByTargetMasterId(dd.targetMasterId).subscribe((returns: any) => {
      if (returns.status) {
        const masterData = returns.data[0];
        this.master.lstMaster = masterData.lstMaster;
        this.master.depotCode = masterData.depotCode;
        this.master.territoryCode = masterData.territoryCode;
        this.master.salMIOSalesTargetMasterId = masterData.targetMasterId;
        this.master.startDate = new Date(masterData.startDate);
        this.master.endDate = new Date(masterData.endDate);
        this.master.isActive = true;
        this.depotCode = masterData.depotCode;
        this.territoryEdit = masterData.territoryCode;
        const depotSelectedFilter = this.depotList.filter(x => x.id == masterData.depotCode)[0];
        this.depotSelected = { id: depotSelectedFilter.id, name: depotSelectedFilter.name };
        this.getAllTerritory(masterData.depotCode);
      }
    });
  }

  public refesh() {
    this.data = [[1, 2], [3, 4]];
    this.fileName = "";
    this.master.lstMaster = [];
    this.verifyStatus = "Not verified";
  }

  private reset() {
    // window.location.reload();
    this.getMaster();
    this.depotSelected = {};
    this.territorySelected = {};
  }

  public deleteDetails(index: any) {
    debugger;
    if (this.disabled == false) {
      if (confirm("Are you sure to delete?")) {
        this.commonService.valueSet("create");
        this.selectedRow = this.master.lstMaster[index];
        this.master.lstMaster.splice(index, 1);
        if (this.selectedRow.helpDetailId > 0) {
        }
        this.toastrService.danger(this.commonService.deletedmsg, "Message");
      }
    }
  }

  currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

}


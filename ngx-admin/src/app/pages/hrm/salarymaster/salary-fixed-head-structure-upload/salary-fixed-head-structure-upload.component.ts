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
type AOA = any[][];

@Component({
  selector: 'ngx-salary-fixed-head-structure-upload',
  templateUrl: './salary-fixed-head-structure-upload.component.html',
  styleUrls: ['./salary-fixed-head-structure-upload.component.scss']
})
export class SalaryFixedHeadStructureUploadComponent implements OnInit {

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
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private salarystructureService: SalarystructureService,
    // private salarygradeService: SalarygradeService,
    // private salaryslabService: SalaryslabService,
    private comboService: CommoncomboService,
    private salaryperiodService: SalaryperiodService,
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
        headerName: "Salary Period",
        field: "periodName",
        filter: "agTextColumnFilter",
        width: 250,
      },
      {
        headerName: "Head Name",
        field: "salaryHeadName",
        filter: "agTextColumnFilter",
        width: 250,
      },
      {
        headerName: "Amount",
        field: "structureAmount",
        filter: "agNumberColumnFilter",
        valueFormatter: (params) => this.currencyFormatter(params.data.structureAmount),
        type: "rightAligned",
        width: 150,
      },
      // {
      //   field: "action",
      //   cellRenderer: "btnCellRenderer",
      //   cellRendererParams: {
      //     clicked: function (field: any) { },
      //   },
      //   minWidth: 250,
      //   editable: false,
      //   pinned: "right",
      // },
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
    this.SalaryFixedHeadStructureService.GetSalaryEmployeeFixedHeadStructureById(0, 0).subscribe((data: any) => {
      debugger;
      if (data.success) {
        this.rowData = data.data;
      }
    });
  }
  /////Dynamic Button section (Do Not Edit)///////

  public getSalaryHeadAmount() {
    let salaryPeriodLoad = this.salaryPeriodLoadSelected["id"];
    this.SalaryFixedHeadStructureService.GetSalaryEmployeeFixedHeadStructureById(0, this.master.salaryPeriodLoadId).subscribe((data: any) => {
      debugger;
      if (data.success) {
        this.rowData = data.data;
      }
    });
  }

  public pageNavigation = "Employee's Salary Fixed Head Structure Upload";//"Employee's Salary Fixed Head Structure";
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
      //this.save();
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
      EmpFixedHeadStructureId: 0,
      loadFromDateShow: new Date(),
      loadToDateShow: new Date(),
      employeeId: 0,
      salaryPeriodId: 0,
      salaryPeriodLoadId: 0,
      salaryHeadId: 0,
      structureAmount: 0,
      isActive: false,
      lstMaster: [],
    };
    this.master.loadFromDateShow.setDate(this.master.loadFromDateShow.getDate() - 60);
    this.salaryPeriodSelected = {};
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
      this.commonService.valueSet("save");
    } else if (data == "view") {
      this.commonService.valueSet("save");
    } else if (data == "transectionreport") {
      this.commonService.valueSet("save");
    } else if (data == "delete") {
      this.commonService.valueSet("save");
    } else {
      //this.toastrService.info("Please Click Any Button", "Message");
    }
  }
  /////End of Dynamic Button section (Do Not Edit)///////


  master: {
    EmpFixedHeadStructureId: number;
    loadFromDateShow: Date;
    loadToDateShow: Date;
    employeeId: number;
    salaryPeriodId: number;
    salaryPeriodLoadId: number;
    salaryHeadId: number;
    structureAmount: number;
    isActive: boolean;
    lstMaster: any[];
  };

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
          EmpFixedHeadStructureId: 0,
          employeeId: 0,
          salaryPeriodId: this.master.salaryPeriodId,
          salaryHeadId: 0,
          structureAmount: e[3],
          isActive: 1,

          employeeNo: e[0],
          employeeName: e[1],
          salaryHead: e[2],
          salaryPeriod: this.salaryPeriodSelected["name"],
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
  salaryPeriodLoadSelected = {};//{ id: 0, name: 'select a period' };
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

    console.log('Save model', this.master.lstMaster);
    this.SalaryFixedHeadStructureService.SaveSalaryEmployeeFixedHeadStructure(this.master.lstMaster).subscribe((retuns: any) => {
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
    if (this.master.lstMaster.length == 0) {
      this.toastrService.warning("No data found for verification!", "Message");
      return false;
    }
    this.SalaryFixedHeadStructureService.GetEmployeeSalaryFixedHeadUploadDataVerify(this.master.lstMaster).subscribe((retuns: any) => {
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

  public refesh() {
    this.data = [[1, 2], [3, 4]];
    this.fileName = "";
    this.master.lstMaster = [];
    this.verifyStatus = "Not verified";
  }

  private reset() {
    window.location.reload();
  }

  public deleteDetails(index: any) {
    debugger;
    if (confirm("Are you sure to delete?")) {
      this.commonService.valueSet("create");
      this.selectedRow = this.master.lstMaster[index];
      this.master.lstMaster.splice(index, 1);
      if (this.selectedRow.helpDetailId > 0) {
      }
      this.toastrService.danger(this.commonService.deletedmsg, "Message");
    }
  }

  currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

}

import {
  Component,
  ElementRef,
  // EventEmitter,
  OnInit,
  Output,
  ViewChild,
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
import { VoucherService } from "app/services/transaction/voucher.service";
import { BtnCellRendererVoucher } from "app/pages/common/btn-cell-renderervoucher.component";
import { take } from "rxjs/operators";
type AOA = any[][];

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: 'ngx-voucherupload',
  templateUrl: './voucherupload.component.html',
  styleUrls: ['./voucherupload.component.scss']
})
export class VoucheruploadComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef;
  private gridApi;
  private gridColumnApi;

  public modules: Module[] = AllCommunityModules;
  public columnDefs;
  public defaultColDef;
  public rowData: [];
  public frameworkComponents: {
    btnCellRendererVoucher: typeof BtnCellRendererVoucher;
  };
  constructor(
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private salarystructureService: SalarystructureService,
    // private salarygradeService: SalarygradeService,
    // private salaryslabService: SalaryslabService,
    private comboService: CommoncomboService,
    private salaryperiodService: SalaryperiodService,
    private voucherService: VoucherService,
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
        headerName: "Voucher No",
        field: "voucherNo",
        filter: "agTextColumnFilter",
        width: 140,
      },
      {
        headerName: "Voucher Date",
        field: "voucherDate",
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "Amount",
        field: "voucherAmount",
        filter: "agNumberColumnFilter",
        valueFormatter: (params) =>
          this.currencyFormatter(params.data.voucherAmount),
        type: "rightAligned",
        width: 130,
      },
      {
        headerName: "Account Name",
        field: "accountName",
        filter: "agTextColumnFilter",
        width: 200,
      },
      {
        headerName: "Created By",
        field: "fullName",
        filter: "agTextColumnFilter",
        width: 180,
      },
      {
        headerName: "Status",
        field: "currentStatus",
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Ref. No",
        field: "refNo",
        filter: "agTextColumnFilter",
      },
      {
        field: "action",
        cellRenderer: "btnCellRendererVoucher",
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
      btnCellRendererVoucher: BtnCellRendererVoucher,
    };
    this.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: true,
      editable: true,
    };

    //debugger;
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
  // onGridReady(params) {
  //   this.gridApi = params.api;
  //   this.gridColumnApi = params.columnApi;
  //   this.SalaryFixedHeadStructureService.GetSalaryEmployeeFixedHeadStructureById(0).subscribe((data: any) => {
  //     debugger;
  //     if (data.success) {
  //       this.rowData = data.data;
  //     }
  //   });
  // }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getVoucher();
  }
  public getVoucher() {
    this.voucherService.getUploadedVoucher().pipe(take(1)).subscribe((data: any) => {
      if (data.success) {
        this.rowData = data.data;
      } else {
        this.rowData = [];
      }
    });
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Voucher Upload";//"Employee's Salary Fixed Head Structure";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
      this.disabled = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
      this.verifyStatus = 'Not verified';
      this.totalData = 0;
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
      employeeId: 0,
      salaryPeriodId: 0,
      voucherNo: "",
      remarks: "",
      salaryHeadId: 0,
      voucherTypeId: 2,
      structureAmount: 0,
      voucherDateShow: new Date(),
      voucherDate:
        new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
      isActive: false,
      lstMaster: [],
      voucherTypeSelected: null,
    };
    this.salaryPeriodSelected = {};
    this.getVoucherType();
    this.getVoucherNo();
    this.verifyStatus = "Not verified";
    this.totalData = 0;
  }

  public getVoucherNo() {
    //debugger;
    // console.log(this.master.voucherDate);
    this.voucherService
      .getVoucherNo(this.master.voucherTypeId, this.master.voucherDateShow.toDateString())
      .subscribe((returns: any) => {
        this.master.voucherNo = returns.data[0].voucherNo;
        //alert(returns.data[0].voucherNo);
      });
  }

  public voucherTypes = [];
  public getVoucherType() {
    //debugger;
    this.master.voucherTypeSelected = null;
    this.voucherService.getVoucherType(0).subscribe((returns: any) => {
      this.voucherTypes = returns.data.map((val) => ({
        id: val.voucherTypeId,
        name: val.voucherTypeName,
      }));
      if (returns.data.length > 1) {
        this.master.voucherTypeSelected = {
          id: returns.data[1].voucherTypeId,
          name: returns.data[1].voucherTypeName,
        }
      }
    });
  }

  public getActualDate(event: any) {
    debugger;
    let dateCon = event.toLocaleDateString() + " " + event.toLocaleTimeString();
    if (dateCon != "") {
      this.master.voucherDate = dateCon;
    }
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


  onRowClicked(event) {
    this.selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked; //localStorage.getItem("button");
    if (data == "edit") {
      //this.VoucherEditDeleteCheck(event, 1)
      this.toastrService.danger("You Can not edit from here", "Message");
    } else if (data == "view") {
      this.toastrService.danger("You Can not view from here", "Message");
      //this.agEdit(event);
      //this.show = false;
      //this.disabled = true;
    } else if (data == "transectionreport") {
      this.agReport(event, 1);
    } else if (data == "print") {
      this.agReport(event, 2);
    } else if (data == "delete") {
      this.toastrService.danger("You Can not delete from here", "Message");
      //this.VoucherEditDeleteCheck(event, 2)
    } else if (data === "viewfiles") {
      this.toastrService.info("Please Click Any Button", "Message");
      //this.showFileModal(event.data.voucherMasterId);
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }
  /////End of Dynamic Button section (Do Not Edit)///////


  master: {
    EmpFixedHeadStructureId: number;
    employeeId: number;
    voucherDateShow: Date;
    voucherNo: string;
    remarks: string;
    salaryPeriodId: number;
    voucherTypeId: number;
    salaryHeadId: number;
    structureAmount: number;
    voucherTypeSelected: {};
    voucherDate: string;
    isActive: boolean;
    lstMaster: any[];
  };

  data: AOA = [[1, 2], [3, 4]];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'UploadFile.xlsx';



  onFileChange(evt: any) {
    this.master.lstMaster = [];
    if (this.master.voucherTypeSelected == null || this.master.voucherTypeSelected == undefined) {
      this.toastrService.warning("Please select a Voucher Type.", "Warning Message");
      return false;
    }

    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);

    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const file = target.files[0];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (fileExtension !== 'xlsx') {
        this.toastrService.warning('Invalid file type. Please upload an .xlsx file.', 'Warning Message');
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
        //debugger;
        let obj = {
          VoucherMasterId: 0,
          employeeId: 0,
          accountCode: e[0] ?? '',
          party: e[1] ?? '',
          costCentre: e[2] ?? '',
          drAmount: e[3] ?? 0.00,
          crAmount: e[4] ?? 0.00,
          remarks: e[5] ?? '',
          isActive: 1,
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

  private agReport(event, halfFull) {
    this.generateVoucherReport(event.data.voucherMasterId, halfFull);
  }

  public generateVoucherReport(voucherMasterId, halfFull) {
    debugger;
    //this.getReportData(voucherMasterId, halfFull);
    this.getCrReport(voucherMasterId);
  }

  public apiUrl = "";
  private getCrReport(voucherMasterId: any, reportFormat: any = 'pdf') {
    this.apiUrl = `AccountsReport/GetVoucherReportById?voucherMasterId=${voucherMasterId}&reportFormat=${reportFormat}`;
    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      this.commonService.GenerateBase64ToReport(returns);
    });
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
    if (this.verifyStatus != 'Succeeded') {
      this.toastrService.warning("Verification Failed!", "Message");
      return false;
    } else if (this.master.lstMaster.length == 0) {
      this.toastrService.danger("Please add account head first", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    //console.log('Save model', this.master);
    this.SalaryFixedHeadStructureService.SaveVoucherUploadExcel(this.master).subscribe((returns: any) => {
      if (returns.status) {
        this.toastrService.success("Successfully Uploaded!", "Message");
        this.show = true;
      } else {
        this.toastrService.danger(returns.message, "Message");
      }
    });
  }

  totalData = 0;
  verifyStatus = "Not verified";
  public VerifyData() {
    if (this.master.lstMaster.length == 0) {
      this.toastrService.warning("No data found for verification!", "Message");
      return false;
    }
    this.SalaryFixedHeadStructureService.GetVoucherUploadDataVerify(this.master.lstMaster).subscribe((retuns: any) => {
      if (retuns.status) {
        this.master.lstMaster = retuns.data

        this.totalData = this.master.lstMaster.length;
        let vData = this.master.lstMaster.filter((i: any) =>
          i.status == "OK").length;
        this.verifyStatus = this.totalData == vData ? "Succeeded" : "Partially Succeeded";
        //console.log('VerifyData: ', retuns.data);
        if (this.verifyStatus == 'Succeeded') {
          const details = this.master.lstMaster;
          const debit = details.reduce((pre, curr) => pre += curr['drAmount'], 0);
          const credit = details.reduce((pre, curr) => pre += curr['crAmount'], 0);
          if (debit != credit) {
            this.verifyStatus = 'Debit value is not equal to Credit value';
          }
        }
      }
    })
  }

  public refesh() {
    this.data = [[1, 2], [3, 4]];
    this.fileName = "";
    this.master.lstMaster = [];
    this.verifyStatus = "Not verified";
    this.totalData = 0;
  }

  private reset() {
    //window.location.reload();
    this.getMaster();
    this.fileInput.nativeElement.value = '';
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

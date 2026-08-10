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
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
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
import { SalesDistributionService } from "app/services/sales/sales-distribution.service";
import { FieldforcemasterService } from "app/services/fieldforcetracking/fieldforcemaster.service";
import { DatePipe } from "@angular/common";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";
import { LeaveService } from "app/services/hrm/leave.service";
import { ChartData } from "app/pages/common/models/chart-data.model";
import { rgb } from "d3-color";
import { take } from "rxjs/operators";

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: 'ngx-salesdashboard',
  templateUrl: './salesdashboard.component.html',
  styleUrls: ['./salesdashboard.component.scss']
})
export class SalesdashboardComponent implements OnInit {

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


  chartData: ChartData[];
  dueChartData: ChartData[];
  chartOptions: any;
  labels: string[];

  fdate: Date = new Date(new Date().getFullYear(), 0, 1);
  tdate: Date = new Date(new Date().getFullYear(), 11, 31);

  ngOnInit() {
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
    this.chartDataInit();
    this.createForm();
  }
  ///chart init

  chartDataInit(): void {
    this.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      legend: {
        position: 'bottom',
        labels: {
          fontColor: 'black',
        },
      },
      hover: {
        mode: 'index',
      },
      scales: {
        xAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Month',
            },
            gridLines: {
              display: true,
              color: rgb(150, 150, 150, .5),
            },
            ticks: {
              fontColor: '#000000',
            },
          },
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Amount(TK)',
            },
            gridLines: {
              display: true,
              color: rgb(150, 150, 150, .5),
            },
            ticks: {
              fontColor: '#000000',
            },
          },
        ],
      },
    };
    this.salesinvoiceService.GetSalesDashboardChartData().pipe(take(1)).subscribe(
      (returns) => {
        console.log(returns[`data`]);
        const retData = returns[`data`];
        this.chartData = [];
        retData.map((x) => {
          const chartLine = new ChartData();
          chartLine.label = x[`TransactionType`];
          chartLine.data = [x[`January`], x[`February`], x[`March`], x[`April`], x[`May`], x[`June`], x[`July`], x[`August`], x[`September`], x[`October`], x[`November`], x[`December`]]
          chartLine.borderColor = x[`LineColor`];
          chartLine.backgroundColor = x[`LineColor`];

          this.chartData.push(chartLine);
        });

      });

    this.salesinvoiceService.GetSalesDashboardDueChartData().pipe(take(1)).subscribe(
      (returns) => {
        const retData = returns[`data`];
        this.dueChartData = [];
        console.log(returns[`data`]);
        retData.map((x) => {
          const chartLine = new ChartData();
          chartLine.label = x[`TransactionType`];
          chartLine.data = [x[`January`], x[`February`], x[`March`], x[`April`], x[`May`], x[`June`], x[`July`], x[`August`], x[`September`], x[`October`], x[`November`], x[`December`]]
          chartLine.borderColor = x[`LineColor`];
          chartLine.backgroundColor = x[`LineColor`];

          this.dueChartData.push(chartLine);
        });
        const chartLine = new ChartData();
        const x = retData[0];
        const y = retData[1];
        chartLine.label = 'Dues';
        chartLine.data = [x[`January`] - y[`January`], x[`February`] - y[`February`], x[`March`] - y[`March`], x[`April`] - y[`April`], x[`May`] - y[`May`], x[`June`] - y[`June`], x[`July`] - y[`July`], x[`August`] - y[`August`], x[`September`] - y[`September`], x[`October`] - y[`October`], x[`November`] - y[`November`], x[`December`] - y[`December`]]
        chartLine.borderColor = '#0000FF';
        chartLine.backgroundColor = '#0000FF';

        this.dueChartData.push(chartLine);


      });



  }


  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Financial Analysis Dashboard";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      //this.GetLeaveRegisterListForApproval();
      this.getMaster();
      //this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      //this.GetLeaveRegisterListForApproval();
      //this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      this.save();
      this.commonService.valueSet("create");
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
      this.commonService.valueSet("create");
    } else if (this.commonService.buttonClicked == "view") {
      this.show = false;
    } else if (this.commonService.buttonClicked == "reset") {
      this.GetLeaveRegisterListForApproval();
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      this.show = false;
    }
  }

  master: {
    distributionMasterId: number;
    approvalStatus: string;
    leaveStatus: number;
    salesCount: number;
    salesAmount: number;
    collectionCount: number;
    collectionAmount: number;
    paymentCount: number;
    paymentAmount: number;
    fromDate: Date;
    toDate: Date;
    lstMasterViewModel: any[];
  };

  public getMaster() {
    this.master = {
      distributionMasterId: 0,
      leaveStatus: 0,
      salesCount: 0,
      salesAmount: 0,
      collectionCount: 0,
      collectionAmount: 0,
      paymentCount: 0,
      paymentAmount: 0,
      approvalStatus: "",
      fromDate: new Date(),
      toDate: new Date(),
      lstMasterViewModel: [],
    };
    this.GetLeaveRegisterListForApproval();
  }

  public agButtonAction() {
    debugger
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

  SaveValidation(): boolean {
    if (
      this.ApprovalStatusSelected == null ||
      this.ApprovalStatusSelected["name"] == ""
    ) {
      this.toastrService.warning("Please select a Approval Status.", "Message");
      // this.commonService.valueSet("create");
      return false;
    }

    let count: number = 0;
    this.master.lstMasterViewModel.forEach((e) => {
      if (e.isSelect == 1) count++;
    });

    if (count == 0) {
      this.toastrService.warning(
        "Please select a invoice for approval.",
        "Message"
      );
      // this.commonService.valueSet("create");
      return false;
    }

    return true;
  }

  private save() {
    var button = this.commonService.buttonClicked;
    this.show = true;
    console.log(this.master);

    if (this.SaveValidation() == true) {
      this.leaveService
        .SetApproveLeave(this.master)
        .subscribe((returns: any) => {
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
    //this.onGridReady;
    this.toastrService.warning("warning", this.commonService.warningmsg);
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

  constructor(
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private SalesDistributionService: SalesDistributionService,
    private fieldforcemasterService: FieldforcemasterService,
    private datePipe: DatePipe,
    private salesinvoiceService: SalesinvoiceService,
    private leaveService: LeaveService,
    private dateService: NbDateService<Date>,
    private formBuilder: FormBuilder,
  ) {
    this.commonService.valueSet("showlist");

    this.frameworkComponents = {
      btnCellRenderer: BtnCellRenderer,
    };
    this.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: true,
    };

    this.getMaster();
    this.LoadAllDropdown();
  }

  ////////////////////////////////// Ag Grid Data Load/////////////////////////////////
  private selectedRows = [];
  public onRowClicked(event) {
    this.selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked;
    if (data == "edit") {
      //this.agEdit(event);
      //this.show = false;
    } else if (data == "view") {
      //this.agEdit(event);
      //this.show = false;
      //this.disabled = true;
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
      //this.agDelete(event);
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }

  private agReport(event) {
    //this.generateReport("print", event.data.distributionMasterId);
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


  public modalTitle = ""
  salesShow = false;
  collectionShow = false;
  paymentShow = false;
  salesDetailsViewModel: any[];
  collectionLstDetailsViewModel: any[];
  paymentDetailsViewModel: any[];
  Total = 0;
  TotalMore = 0;
  salesShowMore = false;
  collectionShowMore = false;
  paymentShowMore = false;

  salesDetailsViewModelMore: any[];
  collectionLstDetailsViewModelMore: any[];
  paymentDetailsViewModelMore: any[];



  generateDetails(type, dialog1: TemplateRef<any>) {
    debugger
    if (type == 1) {
      this.modalTitle = "Sales";
      this.salesShow = true;
      this.collectionShow = false;
      this.paymentShow = false;
    } else if (type == 2) {
      this.modalTitle = "Collection";
      this.collectionShow = true;
      this.salesShow = false;
      this.paymentShow = false;
    } else {
      this.modalTitle = "Payment";
      this.collectionShow = false;
      this.salesShow = false;
      this.paymentShow = true;
    }

    this.master.fromDate = this.commonService.DateFormat(this.fdate);
    this.master.toDate = this.commonService.DateFormat(this.tdate);

    this.salesDetailsViewModel = [],
      this.collectionLstDetailsViewModel = [],
      this.paymentDetailsViewModel = [],

      this.leaveService
        .GetSalesDashboardDataDetailsPartyWise(this.commonService.DateFormat(this.fdate), this.commonService.DateFormat(this.tdate), type)
        .subscribe((returns: any) => {
          if (returns.success) {
            debugger
            if (type == 1) {
              this.Total = 0;
              returns.data.forEach(
                (a) => (this.Total += parseFloat(a.Total))
              );
              this.salesDetailsViewModel = returns.data;
            } else if (type == 2) {
              this.Total = 0;
              returns.data.forEach(
                (a) => (this.Total += parseFloat(a.Total))
              );

              this.collectionLstDetailsViewModel = returns.data;
            } else {
              this.Total = 0;
              returns.data.forEach(
                (a) => (this.Total += parseFloat(a.amount))
              );
              this.paymentDetailsViewModel = returns.data;
            }
          }
        });

    this.dialogService.open(dialog1, {
      context: this.data,
    });
  }



  generateDetailsMore(type, dialog1: TemplateRef<any>, partyId) {
    debugger
    if (type == 1) {
      this.modalTitle = "Sales";
      this.salesShowMore = true;
      this.collectionShowMore = false;
      this.paymentShowMore = false;
    } else if (type == 2) {
      this.modalTitle = "Collection";
      this.collectionShowMore = true;
      this.salesShowMore = false;
      this.paymentShowMore = false;
    } else {
      this.modalTitle = "Payment";
      this.collectionShowMore = false;
      this.salesShowMore = false;
      this.paymentShowMore = true;
    }

    this.master.fromDate = this.commonService.DateFormat(this.fdate);
    this.master.toDate = this.commonService.DateFormat(this.tdate);

    this.salesDetailsViewModelMore = [],
      this.collectionLstDetailsViewModelMore = [],
      this.paymentDetailsViewModelMore = [],

      this.leaveService
        .GetSalesDashboardDataDetails(this.commonService.DateFormat(this.fdate), this.commonService.DateFormat(this.tdate), type, partyId)
        .subscribe((returns: any) => {
          if (returns.success) {

            console.log(returns.data, type);
            if (type == 1) {
              this.TotalMore = 0;
              returns.data.forEach(
                (a) => (this.TotalMore += parseFloat(a.Total))
              );
              this.salesDetailsViewModelMore = returns.data;
            } else if (type == 2) {
              this.TotalMore = 0;
              returns.data.forEach(
                (a) => (this.TotalMore += parseFloat(a.collectionAmount))
              );
              this.collectionLstDetailsViewModelMore = returns.data;
            } else {
              this.TotalMore = 0;
              returns.data.forEach(
                (a) => (this.TotalMore += parseFloat(a.amount))
              );
              this.paymentDetailsViewModelMore = returns.data;
            }
          }
        });

    this.dialogService.open(dialog1, {
      context: this.data,
    });

  }

  LoadAllDropdown() {
    this.loadApprovalStatusList();
    this.getAllDepot();
  }

  GetLeaveRegisterListForApproval() {
    this.commonService.valueSet("create");

    this.master.fromDate = this.commonService.DateFormat(this.master.fromDate);
    this.master.toDate = this.commonService.DateFormat(this.master.toDate);

    this.leaveService
      .GetSalesDashboardData(this.master.fromDate, this.master.toDate)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.master.salesCount = returns.data[0].salescount;
          this.master.salesAmount = returns.data[0].salesamount;
          this.master.collectionCount = returns.data[0].collectioncount;
          this.master.collectionAmount = returns.data[0].collectionamount;
          this.master.paymentCount = returns.data[0].paymentcount;
          this.master.paymentAmount = returns.data[0].paymentamount;
        }
      });
  }

  ApprovalStatusList: {};
  ApprovalStatusSelected: {};
  loadApprovalStatusList() {
    this.ApprovalStatusList = [
      {
        id: 1,
        name: "Approve",
      },
      {
        id: 0,
        name: "Pending",
      },
      {
        id: 2,
        name: "Rejected",
      },
    ];
  }

  targetVsAchievementForm: FormGroup;
  depotItems: any[] = [];
  territoryItems: any[] = [];
  targetVsAchievementList: any[] = [];
  totalSalesTarget: number = 0;
  totalSalesAchievement: number = 0;
  totalCollectionTarget: number = 0;
  totalCollectionAchievement: number = 0;


  getTargetVsAchievementData(): void {
    const formValue = this.targetVsAchievementForm.getRawValue();
    formValue.startDate = this.commonService.DateFormat(formValue.startDate);
    formValue.endDate = this.commonService.DateFormat(formValue.endDate);
    formValue.territoryCode = formValue.territoryCode ? formValue.territoryCode : '';
    formValue.depotCode = formValue.depotCode ? formValue.depotCode : '';
    this.leaveService
      .getTargetVsAchievementData(formValue.depotCode, formValue.territoryCode, formValue.startDate, formValue.endDate)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.targetVsAchievementList = returns.data;
          this.calculateTargetVsAchievementTotals();
        }
      });
  }

  calculateTargetVsAchievementTotals() {
    this.totalSalesTarget = 0;
    this.totalSalesAchievement = 0;
    this.totalCollectionTarget = 0;
    this.totalCollectionAchievement = 0;
    this.targetVsAchievementList.map((x) => {
      this.totalSalesTarget += x.salesTarget;
      this.totalSalesAchievement += x.salesAchievement;
      this.totalCollectionTarget += x.collectionTarget;
      this.totalCollectionAchievement += x.collectionAchievement;
    });
  }


  createForm() {
    this.targetVsAchievementForm = this.formBuilder.group({
      depotCode: new FormControl('', [Validators.required]),
      territoryCode: new FormControl(''),
      startDate: new FormControl(this.getFirstDateOfTheMonth(), [Validators.required]),
      endDate: new FormControl(this.datePipe.transform(this.getLastDateOfTheMonth(), 'MMM d, yyyy'), [Validators.required])
    });

    this.targetVsAchievementForm.get('startDate').valueChanges.subscribe(
      (val) => {
        const firstDate = this.getFirstDateOfTheMonth(val);
        if (!(val.getFullYear() === firstDate.getFullYear() && val.getMonth() === firstDate.getMonth() && val.getDate() === firstDate.getDate())) {
          this.assignFirstDayOfMonth();
        }
        this.assignLastDayOfMonth();
      }
    );
  }

  assignFirstDayOfMonth(): void {
    const date = this.targetVsAchievementForm.get('startDate').value;
    this.targetVsAchievementForm.patchValue({
      startDate: this.getFirstDateOfTheMonth(date),
      endDate: this.datePipe.transform(this.getLastDateOfTheMonth(date), 'MMM d, yyyy')
    })
  }
  assignLastDayOfMonth(): void {
    const date = this.targetVsAchievementForm.get('startDate').value;
    this.targetVsAchievementForm.patchValue({
      endDate: this.datePipe.transform(this.getLastDateOfTheMonth(date), 'MMM d, yyyy')
    })
  }

  getFirstDateOfTheMonth(date: Date = new Date()) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
  }

  getLastDateOfTheMonth(date: Date = new Date()) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0));
  }

  getAllTerritory(depotCode: any = '') {
    this.salesinvoiceService.GetAllTerritoryForDepot(depotCode).subscribe((returns: any) => {
      if (returns.success) {
        const defaultValue = [{ id: '', name: 'All' }];
        const loadedValue = returns.data.map((val: any) => ({
          id: val.TerritoryCode,
          name: val.TerritoryName,
        }));
        this.territoryItems = [...defaultValue, ...loadedValue];

      }
    });
  }
  clearFilter(): void {
    this.createForm();
    this.LoadAllDropdown();
  }


  getAllDepot() {
    const apiUrl = `SalesInvoice/GetAllDepot`;
    this.commonService.getApiData(apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.depotItems = returns.data.map((val: any) => ({
          id: val.depotCode,
          name: val.depotName,
        }));

        this.targetVsAchievementForm.patchValue({
          depotCode: this.depotItems[0]?.id
        });
        this.getAllTerritory(this.depotItems[0]?.id);
      }
    });
  }

  getDateWiseData() {
    this.master.fromDate = this.commonService.DateFormat(this.fdate);
    this.master.toDate = this.commonService.DateFormat(this.tdate);

    this.leaveService
      .GetSalesDashboardData(this.master.fromDate, this.master.toDate)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.master.salesCount = returns.data[0].salescount;
          this.master.salesAmount = returns.data[0].salesamount;
          this.master.collectionCount = returns.data[0].collectioncount;
          this.master.collectionAmount = returns.data[0].collectionamount;
          this.master.paymentCount = returns.data[0].paymentcount;
          this.master.paymentAmount = returns.data[0].paymentamount;
        }
      });
  }

}

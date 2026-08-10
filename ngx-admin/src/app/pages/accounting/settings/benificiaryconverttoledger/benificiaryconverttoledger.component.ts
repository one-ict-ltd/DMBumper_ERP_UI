import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
} from "@angular/core";
import {
  NbComponentStatus,
  NbDialogService,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup } from "@angular/forms";
import { PartyService } from "app/services/party.service";

import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";

@Component({
  selector: 'ngx-benificiaryconverttoledger',
  templateUrl: './benificiaryconverttoledger.component.html',
  styleUrls: ['./benificiaryconverttoledger.component.scss']
})
export class BenificiaryconverttoledgerComponent implements OnInit {
  protected options: {};
  protected cd: ChangeDetectorRef;
  showMessages: any = {};
  errors: string[];
  public bodyData: any = [];
  public apiUrl = "";
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



  constructor(
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private partyService: PartyService
  ) {
    this.commonService.valueSet("showlist");

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
        headerName: "Code",
        field: "partyCode",
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "Suplier Name",
        field: "partyName",
        filter: "agTextColumnFilter",
        width: 200,
      },
      {
        headerName: "Address",
        field: "addressLine",
        filter: "agTextColumnFilter",
        width: 320,
      },
      {
        headerName: "Party Type",
        field: "partyTypeName",
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Contact",
        field: "contactNumber",
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Is Converted To Ledger?",
        field: "isConvertedToLedgers",
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
  }


  ngOnInit() {
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Benificiary Convert To Ledger";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.loadGridData(0,0);
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {

      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      this.save();
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
      //this.commonService.valueSet("create");
    } else if (this.commonService.buttonClicked == "view") {
      this.show = false;
    } else if (this.commonService.buttonClicked == "reset") {

      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      this.show = false;
    }
  }

  master: {
    employeeId: number;
    typeId: number;
    approvalStatusValue: number;
    startDate: Date;
    approvalStatus: string;
    lstMasterViewModel: any[];
    lstProductListViewModel: any[];
    EmployeeSelected: {};
    typeSelected: {};
  };

  public getMaster() {
    this.master = {
      employeeId: 0,
      typeId: 0,
      approvalStatus: "",
      lstMasterViewModel: [],
      lstProductListViewModel: [],
      startDate: new Date(),
      EmployeeSelected: null,
      typeSelected: null,
      approvalStatusValue: 1,
    };

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

  SaveValidation(): boolean {
    let count: number = 0;
    this.master.lstMasterViewModel.forEach((e) => {
      if (e.isSelect == 1) count++;
    });

    if (count == 0) {
      this.toastrService.danger("Please select One Benificiary For Convert To Ledgers.","Message");
      return false;
    }
    else if (count > 1) {
      this.toastrService.danger("Please select One Benificiary For Convert To Ledgers.","Message");
      return false;
    }
    else{
      return true;
    }
  }

  private save() {
    if (!this.SaveValidation()) {
      return false;
    }
    var button = this.commonService.buttonClicked;
    this.show = true;
    //console.log(this.master);
    this.partyService
      .saveLedgersConvertedFromBenificiary(this.master)
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
          this.loadGridData(0,1);
        }
        else {
          this.toastrService.warning(
            this.commonService.failedmsg,
            "Message"
          );
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

  ////////////////////////////////// Ag Grid Data Load/////////////////////////////////
  private selectedRows = [];
  public onRowClicked(event) {
    this.selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked;
    this.commonService.agButtonClicked = "";
    if (data == "edit") {
      this.commonService.valueSet("showlist");
      this.toastrService.info('Not Allowed', 'Info')
      //this.agEdit(event);
      //this.show = false;
    } else if (data == "view") {
      this.commonService.valueSet("showlist");
      this.toastrService.info('Not Allowed', 'Info')
      //this.agEdit(event);
      //this.show = false;
      //this.disabled = true;
    } else if (data == "transectionreport") {
      this.commonService.valueSet("showlist");
      this.toastrService.info('Not Allowed', 'Info')
      // this.agReport(event);
    } else if (data == "delete") {
      if (confirm('Are you sure to delete?')) {
        //this.agDelete(event);
        this.toastrService.warning("Access Dennied", 'Info')
        console.log(event.data.dispatchMasterId);
      }
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.loadGridData(0,1);
  }
  loadGridData(supplierId: number,isConverted: number) {
    debugger
    this.partyService
      .getSupplierForConvertToLedger(supplierId, isConverted).subscribe((data: any) => {
        if (data.success) {
          console.log(data);
          if (isConverted == 1)
            this.rowData = data.data;
          else
            this.master.lstMasterViewModel = data.data;

        }
      });
  }
  isSelectAll: boolean = false;
  ToggleChange(event: any) {
    let isChecked: boolean = false;
    isChecked = event.target.checked;
    this.master.lstMasterViewModel.forEach(element => {
      element.isSelect = isChecked;
    });
  }


}
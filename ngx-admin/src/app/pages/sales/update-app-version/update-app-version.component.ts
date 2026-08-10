import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";
import {
  NbComponentStatus,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
import { SalesDistributionService } from "app/services/sales/sales-distribution.service";

import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup } from "@angular/forms";

@Component({
  selector: 'ngx-update-app-version',
  templateUrl: './update-app-version.component.html',
  styleUrls: ['./update-app-version.component.scss']
})
export class UpdateAppVersionComponent implements OnInit {

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
  newVersion: number = null;

  ngOnInit() {
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Update App Version";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {

      this.getMaster();
      //this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {

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
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      this.show = false;
    }
  }

  master: {
    appVersion: number;
    newVersion: number;
    lstMasterViewModel: any[];
  };

  public getMaster() {
    this.master = {
      appVersion: 0,
      newVersion: null,
      lstMasterViewModel: [],
    };
    this.loadAppVersionList();
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
    if (
      this.AppVersionList == null ||
      this.AppVersionSelected["name"] == ""
    ) {
      this.toastrService.warning("Please select a App version.", "Message");
      // this.commonService.valueSet("create");
      return false;
    }
    if (this.master.newVersion == 0 || this.master.newVersion == null) {
      this.toastrService.warning("Please enter a new App version.", "Message");
      // this.commonService.valueSet("create");
      return false;
    }

    return true;
  }

  private save() {
    debugger
    var button = this.commonService.buttonClicked;
    this.show = true;

    let versionId = (this.AppVersionSelected['id'] == null || this.AppVersionSelected['id'] == undefined) ? 0 : this.AppVersionSelected['id'];
    if (this.SaveValidation() == true) {

      let apiUrl = `SalesInvoice/SetAppVersion?versionId=${versionId}&newVersion=${this.master.newVersion}`;
      this.commonService.getApiData(apiUrl).subscribe((returns) => {
        if (returns.success) {
          this.toastrService.success('App Version updated successfully!', 'Message');
          this.getMaster();
        }
        else {
          this.toastrService.danger('App Version not updated successfully!', 'Message');
        }
      })
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
    private commonService: CommonService,
    private toastrService: NbToastrService) {
    this.commonService.valueSet("create");

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
    } else if (data == "view") {
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }

  private agReport(event) {
  }

  LoadAllDropdown() {
    this.loadAppVersionList();
  }



  salesInvoiceId = 0;
  grandTotal = 0;
  salesInvoiceNo = '';
  salesInvoiceDate = '';
  partyName = '';
  address = '';
  mobileNo = '';

  AppVersionList: {};
  AppVersionSelected: {};
  loadAppVersionList() {
    this.AppVersionList = [];
    this.AppVersionSelected = null;
    let apiUrl = 'SalesInvoice/GetAppVersion';
    this.commonService.getApiData(apiUrl).subscribe((returns) => {
      if (returns.success) {
        this.AppVersionList = returns.data;
      }
    });
  }

}

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
import { FieldforcemasterService } from "app/services/fieldforcetracking/fieldforcemaster.service";
import { SalesDistributionService } from "app/services/sales/sales-distribution.service";
import {
  NbComponentStatus,
  NbDialogService,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
@Component({
  selector: 'ngx-dealnotapplicablecustomerandinstitute',
  templateUrl: './dealnotapplicablecustomerandinstitute.component.html',
  styleUrls: ['./dealnotapplicablecustomerandinstitute.component.scss']
})
export class DealnotapplicablecustomerandinstituteComponent implements OnInit {
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

  master: {
    dealNotApplicableCustomerAndInstituteId: number;
    partyId: number;
    BonusType: string;
    CustomerType: string;
    DepoSelected: {};
    depotCode: string;
  };
  public getMaster() {
    this.master = {
      dealNotApplicableCustomerAndInstituteId: 0,
      partyId: 0,
      BonusType: '',
      CustomerType: '',
      DepoSelected: null,
      depotCode: ''
    };
    this.partiesSelected = null;
    this.parties = [];
  }
  constructor(private commonService: CommonService,
    private fieldforcemasterService: FieldforcemasterService,
    private toastrService: NbToastrService,
    private SalesDistributionService: SalesDistributionService) {
    this.commonService.valueSet('showlist');
    this.columnDefs = [
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.rowIndex + 1",
        pinned: "left",
        filter: false,
        width: 70,
      },
      {
        headerName: "Party Name",
        field: "PartyName",
        filter: "agTextColumnFilter",
        editable: false,
        width: 200,
      },
      {
        headerName: "Bonus Type",
        field: "bonusType",
        filter: "agTextColumnFilter",
        editable: false,
        width: 200,
      },
      {
        headerName: "Customer Type",
        field: "customerType",
        filter: "agTextColumnFilter",
        editable: false,
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
    this.GetDepo();
    this.loadTypeList();
    this.loadBonusTypeList();

  }
  show: boolean = true;
  ngOnInit(): void {
  }

  public pageNavigation = "Deal not Applicable Customer and Institute";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
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
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      this.show = false;
    }
  }
  private reset() {
    this.getMaster();
  }
  public DepoList = [];
  public GetDepo() {
    debugger
    this.master.DepoSelected = {};
    this.fieldforcemasterService
      .getDepo(0)
      .subscribe((retuns: any) => {
        if (retuns.success) {
          this.DepoList = retuns.data.map((val: any) => ({
            id: val.Id,
            depotCode: val.Code,
            name: val.Name,
          }));
        }
      });

  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.SalesDistributionService.getDealNotApplicableCustomerAndInstituteList(0).subscribe((data: any) => {
      if (data.success) {
        this.rowData = data.data;
      }
    });
  }
  public parties = [];
  public partiesSelected = {};

  public getCustomerList(depotCode: any) {
    debugger
    this.parties = null;
    this.partiesSelected = null;
    this.rowData = [];
    let apiUrl = `Party/GetPartyForDropdownJson?partyId=0&depotCode=${depotCode}`;

    //this.comboService.GetPartyForDropdownJson().subscribe((returns: any) => {
    this.commonService.getApiData(apiUrl).subscribe((returns: any) => {
      if (returns.status) {
        this.parties = returns.data.map((val) => ({
          id: val.partyId,
          name: val.partyCodeName,
        }));
      }
    });
  }
  CustomerTypeList: any = [];

  loadTypeList() {
    this.CustomerTypeList = [
      {
        id: 1,
        name: "Institution",
      },
      {
        id: 2,
        name: "Customer",
      },
    ];
  }
  BonusTypeList: any = [];

  loadBonusTypeList() {
    this.BonusTypeList = [
      {
        id: 1,
        name: "Deal",
      }

    ];
  }

  private save() {
    if (this.master.partyId == 0) {
      this.toastrService.danger("Party Name is required", "Message");
      this.commonService.valueSet("create");
    }
    else if (this.master.BonusType == "") {
      this.toastrService.danger("Bonus Type is required", "Message");
      this.commonService.valueSet("create");
    }
    else if (this.master.CustomerType == "") {
      this.toastrService.danger("Customer Type is required", "Message");
      this.commonService.valueSet("create");
    }
    else {
      this.show = true;
      var button = this.commonService.buttonClicked;
      this.SalesDistributionService.saveDealNotApplicableCustomerAndInstitute(this.master).subscribe((returns: any) => {
        if (returns.success) {
          if (button == "update") {
            this.toastrService.success(this.commonService.updatedmsg, "Message");
          }
          else {
            this.toastrService.success(this.commonService.successmsg, "Message");
          }

          this.getMaster();
          this.SalesDistributionService.getDealNotApplicableCustomerAndInstituteList(0).subscribe((data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          });
        }
      });
    }
  }
}

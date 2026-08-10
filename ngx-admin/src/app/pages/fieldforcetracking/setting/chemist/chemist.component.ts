
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
import { FormBuilder, Validators } from "@angular/forms";
import {
  NbComponentStatus,
  NbDialogService,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
import { PurchaseorderService } from "app/pages/purchase/settings/purchaseorder.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { BillcollectionService } from "app/services/sales/billcollection.service";
import { HrmmasterService } from "app/services/hrm/hrmmaster.service";
import { FieldforcemasterService } from "app/services/fieldforcetracking/fieldforcemaster.service";
import { ChemistService } from "app/services/fieldforcetracking/chemist.service";

@Component({
  selector: 'ngx-chemist',
  templateUrl: './chemist.component.html',
  styleUrls: ['./chemist.component.scss']
})
export class ChemistComponent implements OnInit {

  public company: { name: string; address: string; custom_footer: boolean; phone: string; fax: string; email: string; website: string; vat: string; tin: string; };

  /////////////////////////////
  master: {
    chemistID: number;
    chemistno: string;
    chemistname: string;
    mobileno: string;
    telephoneno: string;
    address: string;
    druglicense: string;
    creditlimit: number;
    credit_days: string;
    partyTypeId: number;
    latitude: string;
    longitude: string;
    propritor: string;
    ownername: string;

    zoneId: string;
    depoId: string;
    regionId: string;
    areaId: string;
    territoryid: string;
    marketId: string;
    isActive: boolean;
    zoneSelected: {};
    depotSelected: {};
    regionSelected: {};
    areaSelected: {};
    territorySelected: {};
    marketSelected: {};
    partiesSelected: {};
  };

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

  public pageNavigation = "Chemist";
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
      chemistID: 0,
      chemistno: '',
      chemistname: '',
      mobileno: '',
      telephoneno: '',
      address: '',
      druglicense: '',
      creditlimit: 0,
      credit_days: '',
      partyTypeId: null,
      latitude: '',
      longitude: '',
      propritor: '',
      ownername: '',

      zoneId: '',
      depoId: '',
      regionId: '',
      areaId: '',
      territoryid: '',
      marketId: '',

      zoneSelected: null,
      depotSelected: null,
      regionSelected: null,
      areaSelected: null,
      territorySelected: null,
      marketSelected: null,
      partiesSelected: null,
      isActive: true,
    };
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
  /////End of Dynamic Button section (Do Not Edit)///////

  /////////////////////////////// CRUD ///////////////////////////////////////////

  private save() {
    var button = this.commonService.buttonClicked;
    if (this.master.partyTypeId == 0 || this.master.partyTypeId == null) {
      this.toastrService.danger("Please select party type", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.chemistname == "") {
      this.toastrService.danger("Chemist name is required", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.chemistno == "") {
      this.toastrService.danger("Chemist no is required", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.zoneId == "") {
      this.toastrService.danger("Please select zone", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.depoId == "") {
      this.toastrService.danger("Please select depo", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.regionId == "") {
      this.toastrService.danger("Please select region", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.areaId == "") {
      this.toastrService.danger("Please select area", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.territoryid == '' || this.master.territoryid == null) {
      this.toastrService.danger("Please select territory", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    var button = this.commonService.buttonClicked;
    this.chemistService.saveChemist(this.master).subscribe((returns: any) => {
      if (returns.status) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        }
        else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        this.show = true;
        //////////////Grid Refresh ///////////////////
        this.getMaster();
        this.chemistService.getChemist(0).subscribe((data: any) => {
          if (data.success) {
            this.rowData = data.data;
          }
        });
        //////////////Grid Refresh ///////////////////
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
    private http: HttpClient,
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private PurchaseorderService: PurchaseorderService,
    private fieldforcemasterService: FieldforcemasterService,
    private chemistService: ChemistService,
    private hrmmasterService: HrmmasterService,
    private comboService: CommoncomboService,
    private billcollectionService: BillcollectionService,
    private formBuilder: FormBuilder
  ) {

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
        headerName: "Name",
        field: "chemistname",
        filter: "agTextColumnFilter",
        editable: false,
        width: 200,
      },
      {
        headerName: "Mobile",
        field: "mobileno",
        filter: "agTextColumnFilter",
        editable: false,
        width: 120,
      },
      {
        headerName: "Address",
        field: "address",
        filter: "agTextColumnFilter",
        editable: false,
        width: 200,
      },
      {
        headerName: "Type",
        field: "partyTypeName",
        filter: "agTextColumnFilter",
        editable: false,
        width: 120,
      },
      {
        headerName: "Territory Name",
        field: "territoryname",
        filter: "agTextColumnFilter",
        editable: false,
        width: 200,
      },
      {
        headerName: "Area Name",
        field: "areaname",
        filter: "agTextColumnFilter",
        editable: false,
        width: 200,
      },
      {
        headerName: "Region Name",
        field: "regionname",
        filter: "agTextColumnFilter",
        editable: false,
        width: 200,
      },
      {
        headerName: "Depot Name",
        field: "depotname",
        filter: "agTextColumnFilter",
        editable: false,
        width: 200,
      },
      {
        headerName: "Zone Name",
        field: "zonename",
        filter: "agTextColumnFilter",
        editable: false,
        width: 200,
      },
      {
        headerName: "Is Active",
        field: "isActive",
        editable: false,
        width: 120,
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
    this.getzone();
    this.getPartyType();

  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.chemistService.getChemist(0).subscribe((data: any) => {
      if (data.success) {
        this.rowData = data.data;
        console.log(this.rowData);
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
      this.agReport(event);
    } else if (data == "delete") {
      this.agDelete(event);
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }

  private agDelete(event) {
    var result = confirm("Are you sure you want to delete that?");
    if (result) {
      this.master = event.node.data;
      this.chemistService.deleteChemist(this.master).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");
          //////////////Grid Refresh ///////////////////
          this.chemistService.getChemist(0).subscribe((data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          });
          //////////////Grid Refresh ///////////////////
        }
      });
    }
  }

  //public tableHeader = ['#', 'Product Name', 'Store Name', 'Current Stock']
  private agReport(event) {
    //this.generateStockInReport(event.data.stockMasterId);
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
      this.master = event.node.data;
      this.master.chemistID = event.node.data.chemistid;
      this.chemistService.getChemist(this.master.chemistID).subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0];

          this.master.partiesSelected = {
            id: data.data[0].partyTypeId,
            name: data.data[0].partyTypeName,
          };

          this.master.zoneSelected = {
            id: data.data[0].zonecode,
            name: data.data[0].zonename
          }
          this.getdepotbyCode(data.data[0].zonecode);
          this.master.zoneId = data.data[0].zonecode;
          this.master.depotSelected = {
            id: data.data[0].depotcode,
            name: data.data[0].depotname
          }
          this.getregionbydepoCode(data.data[0].depotcode);
          this.master.depoId = data.data[0].depotcode;
          this.master.regionSelected = {
            id: data.data[0].regioncode,
            name: data.data[0].regionname
          }
          this.getareabyregionCode(data.data[0].regioncode);
          this.master.regionId = data.data[0].regioncode;
          this.master.areaSelected = {
            id: data.data[0].areacode,
            name: data.data[0].areaname
          }
          this.getterritorybyareaCode(data.data[0].areacode);
          this.master.areaId = data.data[0].areacode;
          this.master.territorySelected = {
            id: data.data[0].teritoryid,
            name: data.data[0].territoryname
          }
          this.getmarketbyterritoryCode(data.data[0].teritoryid);
          this.master.territoryid = data.data[0].territoryid;

          this.master.marketSelected = {
            id: data.data[0].marketid,
            name: data.data[0].MarketName
          }
        }
      });
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

  public parties = [];
  public getPartyType() {
    this.comboService.getPartyType().subscribe((returns: any) => {
      this.parties = returns.data.map((val) => ({
        id: val.partyTypeId,
        name: val.partyTypeName,
      }));
    });
  }

  public zoneList = [];
  public getzone() {
    this.fieldforcemasterService.getZone(0).subscribe((retuns: any) => {
      if (retuns.length) {
        this.zoneList = retuns.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }
  public depotList = [];
  public getdepot() {
    var zoneId = 0;
    this.fieldforcemasterService.getZone(0).subscribe((retuns: any) => {
      if (retuns.length) {
        zoneId = retuns[0].ZoneID
      }
    })
    this.fieldforcemasterService.getDepo(zoneId).subscribe((retuns: any) => {
      if (retuns.success) {
        this.depotList = retuns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }
  public getdepotbyCode(code) {
    this.master.depotSelected = {};
    this.fieldforcemasterService.getDepoByZoneCode(code).subscribe((retuns: any) => {
      if (retuns.success) {
        this.depotList = retuns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }
  public AreaList = [];
  public getareabyregionCode(ZoneCode) {
    this.master.areaSelected = {};
    this.fieldforcemasterService.getAreabyregioncode(ZoneCode).subscribe((retuns: any) => {
      if (retuns.success) {
        this.AreaList = retuns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }
  public RegionList = [];
  public getregionbydepoCode(ZoneCode) {
    this.master.regionSelected = {};
    this.fieldforcemasterService.getRegionbydepocode(ZoneCode).subscribe((retuns: any) => {
      if (retuns.success) {
        this.RegionList = retuns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }
  public TerritoryList = [];
  public getterritorybyareaCode(ZoneCode) {
    this.master.territorySelected = null;
    this.fieldforcemasterService.getTerritorybyAreacode(ZoneCode).subscribe((retuns: any) => {
      if (retuns.success) {
        this.TerritoryList = retuns.data.map((val: any) => ({
          id: val.TerritoryCode,
          name: val.TerritoryName,
        }))
      }
    })
  }
  public MarketList = [];
  public getmarketbyterritoryCode(ZoneCode) {
    this.master.marketSelected = {};
    this.fieldforcemasterService.getMarketbyTerritorycode(ZoneCode).subscribe((retuns: any) => {
      if (retuns.success) {
        this.MarketList = retuns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }
  //////////// Open Modal ////////////////

}







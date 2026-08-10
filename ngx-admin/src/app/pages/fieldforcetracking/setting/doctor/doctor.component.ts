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
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";

@Component({
  selector: 'ngx-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss']
})
export class DoctorComponent implements OnInit {

  public company: { name: string; address: string; custom_footer: boolean; phone: string; fax: string; email: string; website: string; vat: string; tin: string; };

  /////////////////////////////
  master: {
    Id: number;
    DoctorID: number;
    DoctorNo: string;
    Address: string;
    Designation: string,
    DoctorName: string,
    MobileNo: string,
    Speciality: string,
    Degree: string,
    Latitude: string,
    Institude: string,
    NoOfPatient: string,
    Longitude: string,
    ZoneId: string,
    DepoId: string,
    RegionId: string,
    AreaId: string,
    TerritoryID: string,
    MarketID: string,
    MarketCode: string,
    IsActive: false;
    DoctorCategoryId:number;
    productId:number;
    uomName:string;
    productWiseSpecificationId:number;
    Quantity:number;
    productName:string;
    lstDetailsViewModel: any[];
    ZoneCodeSelected: {};
    DepoCodeSelected: {};
    RegionCodeSelected: {};
    AreaCodeSelected: {};
    TerritoryCodeSelected: {};
    MarketCodeSelected: {};
    DoctorCategorySelected:{};
    productSpecSelected:{};
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

  public pageNavigation = "Doctor";
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

  public getMaster() {
    this.master = {
      Id: 0,
      DoctorID: 0,
      DoctorNo: '',
      uomName:'',
      productId:0,
      productName:'',
      Address: '',
      Designation: '',
      DoctorName: '',
      MobileNo: '',
      Speciality: '',
      Degree: '',
      Latitude: '',
      Institude: '',
      NoOfPatient: '',
      Longitude: '',
      ZoneId: '',
      DepoId: '',
      RegionId: '',
      AreaId: '',
      TerritoryID: '',
      MarketID: '',
      MarketCode: '',
      DoctorCategoryId:0,
      productWiseSpecificationId:0,
      
      Quantity:0,
      IsActive: false,
      ZoneCodeSelected: null,
      DepoCodeSelected: null,
      RegionCodeSelected: null,
      AreaCodeSelected: null,
      TerritoryCodeSelected: null,
      MarketCodeSelected: null,
      DoctorCategorySelected:null,
      productSpecSelected:null,
      lstDetailsViewModel: [],

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
    if (this.master.DoctorName == "") {
      this.toastrService.danger("Market Name is required!!", "Message");
      this.commonService.valueSet("create");
    }
    else if (parseInt(this.master.ZoneId) <= 0) {
      this.toastrService.danger("Zone Code is required!!", "Message");
      this.commonService.valueSet("create");
    }
    else if (parseInt(this.master.RegionId) <= 0) {
      this.toastrService.danger("Region Code is required!!", "Message");
      this.commonService.valueSet("create");
    }
    else if (parseInt(this.master.AreaId) <= 0) {
      this.toastrService.danger("Area Code is required!!", "Message");
      this.commonService.valueSet("create");
    }
    else if (parseInt(this.master.TerritoryID) <= 0) {
      this.toastrService.danger("Territory Code is required!!", "Message");
      this.commonService.valueSet("create");
    }
    else {
      this.show = true;
      var button = this.commonService.buttonClicked;
      console.log(this.master);
      this.fieldforcemasterService.saveDoctor(this.master).subscribe((returns: any) => {
        if (returns.success) {
          if (button == "update") {
            this.toastrService.success(this.commonService.updatedmsg, "Message");
          }
          else {
            this.toastrService.success(this.commonService.successmsg, "Message");
          }
          //////////////Grid Refresh ///////////////////
          this.getMaster();
          this.fieldforcemasterService.getDoctor(0).subscribe((data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          });
          //////////////Grid Refresh ///////////////////
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
    private hrmmasterService: HrmmasterService,
    private comboService: CommoncomboService,
    private billcollectionService: BillcollectionService,
    private formBuilder: FormBuilder,
    private productrequisitionService: ProductrequisitionService,
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
        headerName: "Doctor Name",
        field: "DoctorName",
        filter: "agTextColumnFilter",
        editable: false,
        width: 200,
      },
      {
        headerName: "Doctor Code",
        field: "DoctorNo",
        filter: "agTextColumnFilter",
        editable: false,
        width: 130,
      },
      {
        headerName: "Doctor Category",
        field: "DoctorCategoryName",
        filter: "agTextColumnFilter",
        editable: false,
        width: 130,
      },
      {
        headerName: "Zone Name",
        field: "ZoneName",
        filter: "agTextColumnFilter",
        editable: false,
        width: 200,
      },
      {
        headerName: "Depot Name",
        field: "DepotName",
        filter: "agTextColumnFilter",
        editable: false,
        width: 200,
      },
      {
        headerName: "Region Name",
        field: "RegionName",
        filter: "agTextColumnFilter",
        editable: false,
        width: 200,
      },
      {
        headerName: "Area Name",
        field: "AreaName",
        filter: "agTextColumnFilter",
        editable: false,
        width: 200,
      },
      {
        headerName: "Territory Name",
        field: "TerritoryName",
        filter: "agTextColumnFilter",
        editable: false,
        width: 200,
      },
      {
        headerName: "Is Active",
        field: "IsActive",
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
    this.GetZone();
    this.GetDoctorCategory();
    this.getAllProductForRequisition();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.fieldforcemasterService.getDoctor(0).subscribe((data: any) => {
      if (data.success) {
        this.rowData = data.data;
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
    this.master.Id = event.node.data.doctorId;
    this.fieldforcemasterService.deleteDoctor(this.master).subscribe((returns: any) => {
      if (returns.success) {
        this.toastrService.success(this.commonService.deletedmsg, "Message");

        //////////////Grid Refresh ///////////////////
        this.fieldforcemasterService.getDoctor(0).subscribe((data: any) => {
          if (data.success) {
            this.rowData = data.data;
          }
        });
        //////////////Grid Refresh ///////////////////
      }
    });
  }

  public tableHeader = ['#', 'Product Name', 'Store Name', 'Current Stock']
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
      debugger;
      this.selectedRows.push(event.node.data);
      this.selectedRow = event.node.data;
      this.master.Id = event.node.data.doctorId;
     // var dectorId=event.node.data.doctorId;
      this.fieldforcemasterService.getDoctor(this.master.Id).subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0];
         this.GetDoctorCategory();
          this.master.DoctorCategorySelected = {
            id: data.data[0].DoctorCategoryID,
            name: data.data[0].DoctorCategoryName
          }
          this.GetZone();
          this.master.ZoneCodeSelected = {
            id: data.data[0].ZoneCode,
            name: data.data[0].ZoneName
          }

          this.GetDepo(this.master.ZoneId);
          this.master.DepoCodeSelected = {
            id: data.data[0].DepotCode,
            name: data.data[0].DepotName
          }

          this.GetRegion(this.master.DepoId);
          this.master.RegionCodeSelected = {
            id: data.data[0].RegionCode,
            name: data.data[0].RegionName
          }

          this.GetArea(this.master.RegionId);
          this.master.AreaCodeSelected = {
            id: data.data[0].AreaCode,
            name: data.data[0].AreaName
          }

          this.GetTerritory(this.master.AreaId);
          this.master.TerritoryCodeSelected = {
            id: data.data[0].TerritoryCode,
            name: data.data[0].TerritoryName
          }

          this.GetMarket(this.master.TerritoryID);
          this.master.MarketCodeSelected = {
            id: data.data[0].MarketCode,
            name: data.data[0].MarketName
          }
         // debugger;
        
         this.GetDoctorRx(event.node.data.doctorId);

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
public DoctorCategoryList=[];
public GetDoctorCategory(){
  debugger;
this.fieldforcemasterService.getDoctorCategory(0).subscribe((retuns: any) => {
 // console.log(retuns);
  if (retuns.data.length > 0) {
    debugger;
    this.DoctorCategoryList = retuns.data.map((val: any) => ({
      id: val.DoctorCategoryID,
      name: val.DoctorCategoryName,
    }))
   
    console.log(this.DoctorCategoryList);
  }
})
}
public refresh(){

  this.master.Quantity=0;
  this.master.productSpecSelected=null;
}
public addToDetailsGrid() {
  debugger;
  if (this.master.productSpecSelected == null) {
    this.toastrService.danger("Please select a product !", "Message");
    return;
  }

  if (this.master.Quantity <=0) {
    this.toastrService.danger("Please entire quantity!", "Message");
    return;
  }
  if(this.master.lstDetailsViewModel!=null)
  {
    debugger;
    var x=this.master.lstDetailsViewModel.filter(x=>x.productWiseSpecificationId==this.master.productWiseSpecificationId);
    if(x.length>0)
    {
      this.toastrService.danger("Duplicate Entry!", "Message");
      return;
    }
  }
  

debugger;
  let elements = {
   
    productWiseSpecificationId: this.master.productWiseSpecificationId,
    productId: this.master.productId,
    productName: this.master.productName,
   
   // uomName: this.master.uomName,
    Quantity: this.master.Quantity,
    // isActive: 1,
    // isSelect: 1,
  };

debugger;
  this.master.lstDetailsViewModel.push(elements);
  //this.master.Quantity=0;
 // this.master.productSpecSelected=null;
 // console.log(this.master.lstDetailsViewModel);
 this.master.Quantity=0;
 this.master.productSpecSelected=null;
  
}
public getProductSpecDetails() {
  
  this.master.productId = this.master.productSpecSelected["productId"];
  this.master.uomName = this.master.productSpecSelected["uomName"];
  this.master.productName = this.master.productSpecSelected["name"];
  this.master.productWiseSpecificationId =
    this.master.productSpecSelected["id"];
  

  
}
public deleteDetails(index: any) {
  // this.salesinvoiceService
  //   .DeleteSalesInvoiceDetailsById(
  //     this.master.lstDetailsViewModel[index].salesInvDetailsId
  //   )
  //   .subscribe((returns: any) => {
  //     if (returns.success) {
  //       this.toastrService.success(this.commonService.deletedmsg, "Message");
  //     }
  //   });

  this.selectedRow = this.master.lstDetailsViewModel[index];
  this.master.lstDetailsViewModel.splice(index, 1);
  if (this.selectedRow.helpDetailId > 0) {
  }
  this.toastrService.danger(this.commonService.deletedmsg, "Message");
}

public productSpecList = [];
  public getAllProductForRequisition() {
    this.productrequisitionService
      .getAllProductForRequisition()
      .subscribe((returns: any) => {
        this.productSpecList = returns.data.map((val: any) => ({
          id: val.productWiseSpecificationId,
          name: val.productName,
          uomId: val.uomId,
          uomName: val.uomName,
          productId: val.productId,
          price: val.price,
        }));
      });
  }
  public ZoneList = [];
  public GetZone() {
    this.fieldforcemasterService.getZone(0).subscribe((retuns: any) => {
      if (retuns.length > 0) {
        this.ZoneList = retuns.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }

  public DepoList = [];
  public GetDepo(ZoneCode) {
    this.master.DepoCodeSelected = {};
    this.fieldforcemasterService.getDepoByZoneCode(ZoneCode).subscribe((retuns: any) => {
      if (retuns.success) {
        this.DepoList = retuns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }

  public GetDoctorRx(doctorId) {
  //  this.master.DepoCodeSelected = {};
  debugger;
    this.fieldforcemasterService.getDoctorRx(doctorId).subscribe((retuns: any) => {
     // console.log(retuns);
      if (retuns.success) {
        this.master.lstDetailsViewModel = retuns.data;
        console.log(this.master.lstDetailsViewModel);
      }
    })
   
  }

  public RegionList = [];
  public GetRegion(ZoneCode) {
    this.master.RegionCodeSelected = {};
    this.fieldforcemasterService.getRegionbydepocode(ZoneCode).subscribe((retuns: any) => {
      if (retuns.success) {
        this.RegionList = retuns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }

  public AreaList = [];
  public GetArea(RegionCode) {
    this.master.AreaCodeSelected = {};
    this.fieldforcemasterService.getAreabyRegopmcode(RegionCode).subscribe((retuns: any) => {
      if (retuns.success) {
        this.AreaList = retuns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }

  public TerritoryList = [];
  public GetTerritory(AreaId) {
    this.master.TerritoryCodeSelected = {};
    this.fieldforcemasterService.getTerritorybyAreacode(AreaId).subscribe((retuns: any) => {
      if (retuns.success) {
        this.TerritoryList = retuns.data.map((val: any) => ({
          id: val.TerritoryCode,
          name: val.TerritoryName,
        }))
      }
    })
  }


  public MarketList = [];
  public GetMarket(TerritoryCode) {
    this.master.MarketCodeSelected = {};
    this.fieldforcemasterService.getMarketbyTerritorycode(TerritoryCode).subscribe((retuns: any) => {
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







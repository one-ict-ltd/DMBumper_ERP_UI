import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup, NgForm } from "@angular/forms";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
import { ProductService } from 'app/services/inventory/product.service';
import {
  NbComponentStatus,
  NbDialogService,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { CommoncomboService } from "app/services/commoncombo.service";
import { PartyService } from "app/services/party.service";
import { EmployeeinformationService } from "app/services/hrm/employeeinformation.service";
import { FieldforcemasterService } from "app/services/fieldforcetracking/fieldforcemaster.service";

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: 'ngx-clearence',
  templateUrl: './clearence.component.html',
  styleUrls: ['./clearence.component.scss']
})
export class ClearenceComponent implements OnInit {

  master: {
    ImpClearenceInfoId:number;
    preLcId:number;
    shipmentMasterId:number;
    lcMasterId:number;
    preLcMasterId:number;
    clearenceFlag:boolean
    clearenceType:number;
    type:string;
    clearenceTypeSelected:{};
    expCustomeClrDt:Date;
    actBankClrDt:Date;
    cnfAgent:string;
    DocRecvDate:Date;
    remainderDays:number;

   
    
    

    
  };

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
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Bank and Custom Clearence ";
  public buttons = this.commonService.btnList;
  public temperatureMode="SIGHT";
  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      //this.openConfirmPopup("");
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
      //this.edit();
      this.show = false;
    }
  }
  public getMaster() {
    this.master = {
      ImpClearenceInfoId:0,
      preLcId:null,
      shipmentMasterId:0,
      lcMasterId:0,
      preLcMasterId:0,
      clearenceFlag:true,
      clearenceType:null,
      type:null,
      clearenceTypeSelected:null,
      DocRecvDate: new Date(),
      actBankClrDt: new Date(),
      expCustomeClrDt: new Date(),
      cnfAgent:"",
      remainderDays:null,
      

     
      
      
      
      
     
    };
    this.ToggleDissabled();
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
 


  /*
GetRegionByZoneCode( ZoneCode);GetRegionByZoneOrDepoCode
GetDepoByRegionCode( RegionCode)
GetAreaByDepoCode(DepoCode);
  */
 






 
  /////End of Dynamic Button section (Do Not Edit)///////

  //////////////////////////////////////////////CRUD////////////////////////////
  public companies = [];
  public sbus = [];
  public parties = [];
  public companyCategoryItems = [];
  public genderItems = [];
  public addressTypeItems = [];
  public divisionItems = [];
  public districtItems = [];
  public thanaItems = [];
  public bankItems = [];
  public productTypeList = [];


  public getProductType() {
    this.productService.getProductType().subscribe((retuns: any) => {
      if (retuns.success) {
        this.productTypeList = retuns.data.map((val: any) => ({
          id: val.productTypeId,
          name: val.productTypeName,
        }))
      }
    })
  }


  
  

  public getDistrict(divisionId) {
    //this.master.sbusSelected = null;
    this.comboService.getDistrict(divisionId).subscribe((returns: any) => {
      this.districtItems = returns.data.map((val) => ({
        id: val.districtsId,
        name: val.districtName,
      }));
    });
  }

  public getThana(districtsId) {
    //this.master.sbusSelected = null;
    this.comboService.getThana(districtsId).subscribe((returns: any) => {
      this.thanaItems = returns.data.map((val) => ({
        id: val.thanasId,
        name: val.thanaName,
      }));
    });
  }

  

  public prodSelected = [];

  public getProductDetails() {
    this.productrequisitionService
      .getAllProductForRequisition()
      .subscribe((returns: any) => {
        //console.log(returns.data);
        this.prodSelected = returns.data.map((val: any) => ({
          id: val.productWiseSpecificationId,
          name: val.productName,
          productId: val.productId,
          uomId: val.uomId,
          uomName: val.uomName,        
        }));
      
      });
   //   this.master.uomName = this.master.productSelected["uomName"];

     
  }

  public getProductById(id) {
    // console.log(this.master.productSelected);
    // this.productService.getProductById(id).subscribe((data: any) => {
    //   if (data.success) {
    //     this.master.uomName = this.master.productSelected["uomName"];
    //   }
    // });

   // this.master.uomName = this.master.productSelected["uomName"];
   // this.GetCurrentStock();
  }




 



  private save() {
    debugger;
    var button = this.commonService.buttonClicked;
    // if (this.master.partyTypeId == 0 || this.master.partyTypeId == null) {
    //   this.toastrService.danger("Please select party type", "Message");
    //   this.commonService.valueSet("create");
    //   return;
    // }
    
    // else if (this.master.contactNumber == '') {
    //   this.toastrService.danger("Please insert contact number", "Message");
    //   this.commonService.valueSet("create");
    //   return;
    // }

    //console.log('s ', this.master);

    debugger;
    this.partyService.saveParty(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        this.show = true;
        //////////////Grid Refresh ///////////////////
        this.partyService.getSupplier().subscribe((data: any) => {
          if (data.success) {
            this.rowData = data.data;
          }
        });
        //////////////Grid Refresh ///////////////////
      }
      else {
        this.show = false;
        this.commonService.valueSet("create");
        this.toastrService.warning(this.commonService.failedmsg, "Message");
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
    //this.onGridReady;
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

  //////// grid data load from api////////

  private gridApi;
  private gridColumnApi;

  public modules: Module[] = AllCommunityModules;
  public columnDefs;
  public defaultColDef;
  public rowData: [];
  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };

  readonly profile = [];
  dissabledForDepot: boolean = false;
  constructor(
    private http: HttpClient,
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private partyService: PartyService,
    private comboService: CommoncomboService,
    private employeeinformationService: EmployeeinformationService,
    private fieldforcemasterService: FieldforcemasterService,
    private productrequisitionService: ProductrequisitionService,
    private productService: ProductService
  ) {
    this.commonService.valueSet('showlist');
    this.getProductType();
    
    this.getProductDetails();
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
        headerName: "Customer Name",
        field: "partyName",
        filter: "agTextColumnFilter",
        width: 200,
      },
      {
        headerName: "Territory",
        field: "territoryName",
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "Address",
        field: "addressLine",
        filter: "agTextColumnFilter",
        width: 350,
      },
      {
        headerName: "Party Type",
        field: "partyTypeName",
        filter: "agTextColumnFilter",
      },
      // {
      //   headerName: "Company Name",
      //   field: "companyName",
      //   filter: "agTextColumnFilter",
      // },
      {
        headerName: "SBU Name",
        field: "sbuName",
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Is Active?",
        field: "isActive",
      },
      {
        field: "action",
        cellRenderer: "btnCellRenderer",
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
    this.loadClerenceList();
   // this.loadparticularListforBankData();


    this.profile = this.commonService.GetUserProfileJson();

  }

  ToggleDissabled() {
    debugger;
    if (this.profile.length > 0) {
      let POSTING_LOCATION = this.profile[0].POSTING_LOCATION;
      //if (this.master.partyId > 0 && (POSTING_LOCATION != undefined || null) && POSTING_LOCATION == 'D')
      if ((POSTING_LOCATION != (undefined || null)) && POSTING_LOCATION == 'D')
        this.dissabledForDepot = true;
      else
        this.dissabledForDepot = false;
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.partyService.getSupplier().subscribe((data: any) => {
      //debugger;
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

  private selectedRows = [];

  onRowClicked(event) {
    this.selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked; //localStorage.getItem("button");
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
      var partyId = event.node.data.partyId;

      // this.partyService.getPartyById(partyId).subscribe((data: any) => {
      //   if (data.success) {
      //     debugger;
      //     this.master = data.data[0];
      //     this.master.companiesSelected = {
      //       id: data.data[0].companyId,
      //       name: data.data[0].companyName,
      //     };

      //     this.getSBU(data.data[0].companyId);

      //     this.master.sbusSelected = {
      //       id: data.data[0].sbuId,
      //       name: data.data[0].sbuName,
      //     };
      //     this.master.partiesSelected = {
      //       id: data.data[0].partyTypeId,
      //       name: data.data[0].partyTypeName,
      //     };
      //     this.master.genderSelected = {
      //       id: data.data[0].Name,
      //       name: data.data[0].Name,
      //     };
      //     this.master.companyCategorySelected = {
      //       id: data.data[0].companyCategoryId,
      //       name: data.data[0].categoryName,
      //     };

        
      //     this.master.zoneSelected = {
      //       id: data.data[0].ZoneCode,
      //       name: data.data[0].ZoneName
      //     }
      //     // this.getdepotbyCode(data.data[0].ZoneCode);
      //     // this.master.depotSelected = {
      //     //   id: data.data[0].DepotCode,
      //     //   name: data.data[0].DepotName
      //     // }
      //     this.GetRegionByZoneOrDepoCode(data.data[0].ZoneCode, "");
      //     this.master.regionSelected = {
      //       id: data.data[0].RegionCode,
      //       name: data.data[0].RegionName
      //     }
      //     this.getareabyregionCode(data.data[0].RegionCode);
      //     this.master.areaSelected = {
      //       id: data.data[0].AreaCode,
      //       name: data.data[0].AreaName
      //     }
      //     this.getterritorybyareaCode(data.data[0].AreaCode);
      //     this.master.territorySelected = {
      //       id: data.data[0].territoryCode,
      //       name: data.data[0].territoryName
      //     }
      //     this.master.territoryId = data.data[0].territoryCode;
      //     // alert(this.master.territoryId);
      //     //this.getDuplicate();

      //     this.partyService.GetPartyContactByPartyId(partyId).subscribe((data: any) => {
      //       debugger;
      //       if (data.success) {
      //         this.master.lstPartyContact = data.data;
      //       }
      //     });

      //     this.partyService.GetPartyAddressByPartyId(partyId).subscribe((data: any) => {
      //       debugger;
      //       if (data.success) {
      //         this.master.lstPartyAddress = data.data;
      //       }
      //     });

      //     this.partyService.GetPartyBankByPartyId(partyId).subscribe((data: any) => {
      //       debugger;
      //       if (data.success) {
      //         this.master.lstPartyBank = data.data;
      //       }
      //     });
      //     console.log('master', this.master);
      //     // console.log('data.data[0]', data.data[0]);


      //     this.ToggleDissabled();
      //   }
      // });
      this.ngOnInit();
    }
  }
  private agReport(event) {
    this.toastrService.info("Print button clicked", "Message");
  }
  private agDelete(event) {
    var result = confirm("Are you sure you want to delete that?");
    if (result) {
      //debugger;
     // this.master.partyId = event.node.data.partyId;
      this.partyService.deleteParty(this.master).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          //////////////Grid Refresh ///////////////////
          this.partyService.getParty().subscribe((data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          });
          //////////////Grid Refresh ///////////////////
        }
      });
    }
  }


 
 
  //////////////////////////////////End of Ag Grid Data Load/////////////////////////////////

  @Output() myEvent = new EventEmitter();

  public deleteRow(state, action) {
    //debugger;
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

  //////////// Open Modal ////////////////
///////////////////////////


  public ClearenceList: any = [];
  public CsSelected: any[] = [];

  public loadClerenceList() {
    this.ClearenceList = [
      {
        id: 1,
        name: "Bank Clearence",
      },
      {
        id: 0,
        name: "Custom Clearence",
      },
    ];
  }

  public particularListforBank=[];
  public particularListforInsurance=[];

 

 


  getChargeType(id){
    if(id==1)
    {
      this.master.clearenceFlag=true;
    }
    else{
      this.master.clearenceFlag=false;
    }
  }

}

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
import { PurchaserequisitionService } from "../../settings/purchaserequisition.service";

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}
@Component({
  selector: 'ngx-lc-amendment-charge',
  templateUrl: './lc-amendment-charge.component.html',
  styleUrls: ['./lc-amendment-charge.component.scss']
})
export class LCAmendmentChargeComponent implements OnInit {

  master: {
    preLcId:number;
    lcId:number;
    ImpLCAmendmentId:number;
    ImpLCAmendmentChargeId:number;
    amendmentAmount:number;
    amendmentChargeDate:Date;
    remarks:string;

    amendmentNo:string;
    amendmentCase:string;
    amendmentDate:Date;
    lcAmount:number;
    totalLcAmount:number;
    freightAmount:number;
    lcaNo:string;
    lcNo:string;
    referenceSelected:{};
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

  public pageNavigation = "LC-Amendment Charge";
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
      preLcId:null,
      lcId:null,
      ImpLCAmendmentId:null,
      ImpLCAmendmentChargeId:0,
      amendmentAmount:null,
      amendmentChargeDate:new Date(),
      remarks:"",

      amendmentNo:"",
      amendmentCase:"",
      amendmentDate:new Date(),
      lcAmount:null,
      totalLcAmount:null,
      freightAmount:null,
      lcaNo:"",
      lcNo:"",
      referenceSelected:null,
    };
    this.ToggleDissabled();
  }
  public zoneList = [];
  
 
  /*
GetRegionByZoneCode( ZoneCode);GetRegionByZoneOrDepoCode
GetDepoByRegionCode( RegionCode)
GetAreaByDepoCode(DepoCode);
  */
  

  

  




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

  //////////////////////////////////////////////CRUD////////////////////////////


  public getDropdownData() {
    ////////// Call common service for dropdown data/////////

    

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

    ///this.master.uomName = this.master.productSelected["uomName"];
   // this.GetCurrentStock();
  }


  

  public deleteDetail(index: any) {
    if (confirm('Are You Sure?')) {
      // this.selectedRow = this.master.lstReqDetailsViewModel[index];
      // const productTrnfrDetailsId = this.selectedRow.productTrnfrDetailsId;
      // this.ProducttransferService.deleteProductTrnfrDetailsById(productTrnfrDetailsId).pipe(take(1)).subscribe(
      //   (returns: any) => {
      //     if (returns.success) {
      //       this.master.lstReqDetailsViewModel.splice(index, 1);
      //       if (this.selectedRow.helpDetailId > 0) {
      //       }
      //       this.toastrService.danger(this.commonService.deletedmsg, "Message");
      //     } else {
      //       this.toastrService.warning('Data is not deleted', "Message");
      //     }
      //   }
      // );
      //this.master.lstReqDetailsViewModel = [];
    }
  }

  public refesh() {
   // this.master.lstReqDetailsViewModel = [];
    this.toastrService.warning(this.commonService.warningmsg, "Message");
  }



  private save() {
    debugger;
    var button = this.commonService.buttonClicked;
    // if (this.master.partyTypeId == 0 || this.master.partyTypeId == null) {
    //   this.toastrService.danger("Please select party type", "Message");
    //   this.commonService.valueSet("create");
    //   return;
    // }
    // else if (this.master.companyId == 0 || this.master.companyId == null) {
    //   this.toastrService.danger("Please select company", "Message");
    //   this.commonService.valueSet("create");
    //   return;
    // }
    // else if (this.master.sbuId == 0 || this.master.sbuId == null) {
    //   this.toastrService.danger("Please select sbu", "Message");
    //   this.commonService.valueSet("create");
    //   return;
    // }
    // else if (this.master.partyName == '' || this.master.partyName == null) {
    //   this.toastrService.danger("Please insert party name", "Message");
    //   this.commonService.valueSet("create");
    //   return;
    // }
    // else if (this.master.creditLimit == null || this.master.creditLimit == 0) {
    //   this.toastrService.danger("Please insert credit limit amount", "Message");
    //   this.commonService.valueSet("create");
    //   return;
    // }
    // else if (this.master.creditDays == null || this.master.creditDays == 0) {
    //   this.toastrService.danger("Please insert credit days limit", "Message");
    //   this.commonService.valueSet("create");
    //   return;
    // }
    // else if (this.master.countData != 0) {
    //   this.toastrService.danger("Duplicate party name", "Message");
    //   this.commonService.valueSet("create");
    //   return false;
    // }

    // else if (this.master.territorySelected == null || this.master.territorySelected["id"] == null) {
    //   this.toastrService.danger("Please choose market structure", "Message");
    //   this.commonService.valueSet("create");
    //   return;
    // }
    // else if (this.master.contactNumber == '') {
    //   this.toastrService.danger("Please insert contact number", "Message");
    //   this.commonService.valueSet("create");
    //   return;
    // }

    //console.log('s ', this.master);
    this.master.amendmentChargeDate=this.commonService.DateFormat(this.master.amendmentChargeDate);
    debugger;
    this.purchaserequisitionService.SaveLcAmendmentChargeInfo(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        this.commonService.valueSet("showlist");
        this.show = true;
        //////////////Grid Refresh ///////////////////
        this.purchaserequisitionService.getLcAmendmentChargeDatabyId(0).subscribe((data:any)=>{
          if(data.success)
          {
            this.rowData=data.data;
          }
        })
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
    private productService: ProductService,
    private purchaserequisitionService:PurchaserequisitionService,
  ) {
    this.commonService.valueSet('showlist');
  
    this.getDropdownData();
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
      // {
      //   headerName: "LCA No",
      //   field: "lcaNo",
      //   filter: "agTextColumnFilter",
      //   width: 120,
      // },
      {
        headerName: "LC NO",
        field: "lcNo",
        filter: "agTextColumnFilter",
        width: 200,
      },
      {
        headerName: "Amendment No",
        field: "amendmentNo",
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "Amendment Charge Date",
        field: "amendmentChargeDate",
        filter: "agTextColumnFilter",
        width: 350,
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
    this.getPreLcIdListFromLcMasterTable();

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
    // this.partyService.getSupplier().subscribe((data: any) => {
    //   //debugger;
    //   if (data.success) {
    //     this.rowData = data.data;
    //   }
    // });
    this.purchaserequisitionService.getLcAmendmentChargeDatabyId(0).subscribe((data:any)=>{
      if(data.success)
      {
        this.rowData=data.data;
      }
    })
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
      var chargeId = event.node.data.ImpLCAmendmentChargeId;

      this.purchaserequisitionService.getLcAmendmentChargeDatabyId(chargeId).subscribe((data: any) => {
        if (data.success) {
          debugger;
          this.master = data.data[0];
          this.master.referenceSelected={
            id:data.data[0].ImpLCAmendmentId,
            name:data.data[0].refNo+'-'+data.data[0].amendmentNo
          }

          // this.partyService.GetPartyContactByPartyId(partyId).subscribe((data: any) => {
          //   debugger;
          //   if (data.success) {
          //     this.master.lstPartyContact = data.data;
          //   }
          // });

        


          
        }
      });
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
      var id = event.node.data.ImpLCAmendmentChargeId;
      this.purchaserequisitionService.deleteLcAmendmentChargeInfo(id).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          //////////////Grid Refresh ///////////////////
          this.purchaserequisitionService.getLcAmendmentChargeDatabyId(0).subscribe((data: any) => {
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



  
  /////////////////////////////

  public listdata=[];
  public getPreLcAndLcAndAmendmentData(id)
  {
    this.listdata=[];
    this.master.lcAmount=null;
    this.master.totalLcAmount=null;
    this.master.ImpLCAmendmentId=null;

    this.master.freightAmount=null;
    this.master.lcaNo=null;
    this.master.lcNo=null;
    this.master.amendmentNo=null;
    this.master.amendmentCase=null;
    this.master.amendmentDate=null;
    this.master.referenceSelected=null;
    debugger
    
     this.purchaserequisitionService.getPreLcandLcAndAmendentInfoforAmemdmentCharge(id).subscribe((returns:any)=>{
      if(returns.success)
      {
        // console.log("lc open data:==================",returns.data[0].lcOpenDate);
       this.master.lcAmount=returns.data[0].lcAmount;
       this.master.totalLcAmount=returns.data[0].totalLcAmount;
       this.master.ImpLCAmendmentId=returns.data[0].ImpLCAmendmentId;

       this.master.freightAmount=returns.data[0].freightAmount;
       this.master.lcaNo=returns.data[0].lcaNo;
       this.master.lcNo=returns.data[0].lcNo;
       this.master.amendmentNo=returns.data[0].amendmentNo;
       this.master.amendmentCase=returns.data[0].amendmentCase;
       this.master.amendmentDate=returns.data[0].amendmentDate;
       
        this.master.referenceSelected={
          id:returns.data[0].ImpLCAmendmentId,
          name:returns.data[0].refNo+'-'+returns.data[0].amendmentNo
        }

      }
     })

     
  }
  public referenceList=[];
  public preLcIdList=[];
  public getPreLcIdListFromLcMasterTable()
  {
    this.preLcIdList=[];
    this.purchaserequisitionService.getPrelcIdListFromLcMasterTableforAmendmentCharge(0).subscribe((returns:any)=>{
       if(returns.success)
       {
        //this.preLcIdList=returns.data;
      
       this.referenceList = returns.data.map((val)=>({
        id:val.ImpLCAmendmentId,
        name:val.refNo +'-'+val.amendmentNo,
      }))
       }
       console.log("this reference list is========================",this.referenceList);
    })
    
  }

}

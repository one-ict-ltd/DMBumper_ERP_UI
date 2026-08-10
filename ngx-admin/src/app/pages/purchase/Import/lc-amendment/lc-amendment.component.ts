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
  selector: 'ngx-lc-amendment',
  templateUrl: './lc-amendment.component.html',
  styleUrls: ['./lc-amendment.component.scss']
})
export class LCAmendmentComponent implements OnInit {

  master: {
    ImpLCAmendmentId:number;
    amendmentNo:string;
    amendmentDate:Date;
    amendment:string;
    remarks:string;
    preLcId:number;

    //from lc for model
    ImpPreLCInfoMasterId:number;
    ImpLCInfoMasterId:number;
    // for model
    productSelected:{};
    referenceSelected:{};

    productWiseSpecificationId: number;
    lstReqDetailsViewModel:any[];
    unitPrice:number;
    blDate:Date;
    blNo:string;
    blValue:number;
    blRate:number
    hsCode:string;
    uomName: string;
    productTypeId:number;
    productTypeSelected: {};
    index: number;
    refNo:string;
    reqNoDate:Date;
    indentDate:Date;
    indentRecvDate:Date;
    lcAmount:number;
    ImpModeOfTransportId:number;
    modeTransportSelected:{};
    ImpLocalAgentId:number;
    localAgentSelected:{};
    ImpBenificiaryId:number;
    benificiarySelected:{};
   
    lcStatus:string;
    lcPaymentType:string;
    partShipment:string;
    transShipment:string;
    dockShipt:string;
    psiStatus:string;
    indentNo:string;
    rfiNo:string;
    psiNo:string;
    psiCompany:string;
    requisitionNo:string;
    manufacturerId:number;
    manufacturerSelected:{};
    countryOriginSelected:{};
    countryOriginId:number;
    countryOriginName:number;
    requisitionDate:Date;
    proformaInvoiceDate:Date;
    proformaInvoiceNo:string;
    conversionRate:number;
    sbuName:string;
    currencyName:string;
    modeOfTransportName:string;
    localAgentName:string;
    benificiaryName:string;
    manufactureName:string;
    productTypeName:string;
    typedDate:Date;
    bankSubDate:Date;
    mailReqRcvDate:Date;
    faxedOnDate:Date;
    amndCopyDate:Date;
    signDate:Date;
    appliedOnDate:Date;
    sortedDate:Date;

    lcNegotiation:string;

    lcOpenDate:Date;
    validityDate:Date;
    exshiptDate:Date;
    expireDate:Date;
    lcNo:string;
    lcaNo:string;
    bankId:number;
    bankSelected:{};
    openBankName:string;
    adviceBankName:string;
    adviceBankId:number;
    adviceBankSelected:{};

    loadingPortId:number;
    loadingPortSelected:{};
    portLoadingName:string;
    portDestinationName:string;
    destinatinPortId:number;
    destinationPortSelected:{};
    totalLcAmount:number;
    frightAmount:number;
    shiptDay:string;
    remindDate:Date;
    
    
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

  public pageNavigation = "LC-Amendment Information";
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
      ImpLCAmendmentId:null,
      
      amendmentNo:"",
      amendmentDate:new Date(),
      amendment:"",
      remarks:"",
      preLcId:null,
 
      //fromLc for model
      ImpPreLCInfoMasterId:0,
      ImpLCInfoMasterId:0,
     
      // for model

      referenceSelected:null,
   
      productSelected: null,
      productWiseSpecificationId: 0,
      lstReqDetailsViewModel:[],
      unitPrice:0,
      blDate:new Date(),
      blNo:"",
      blValue:0,
      blRate:0,
      hsCode:"",
      uomName: "",
      productTypeId:0,
      productTypeSelected: null,
      index:0,
      refNo:"",
      reqNoDate:new  Date(),
      indentDate:new Date(),
      indentRecvDate:new Date(),
      expireDate: new Date(),
      lcAmount:0,
      ImpModeOfTransportId:0,
      modeTransportSelected:null,
      ImpLocalAgentId:0,
      localAgentSelected:null,
      ImpBenificiaryId:0,
      benificiarySelected:0,
      
      lcStatus:"",
      lcPaymentType:"",
      partShipment:"",
      transShipment:"",
      psiStatus:"",
      indentNo:"",
      rfiNo:"",
      psiNo:"",
      psiCompany:"",
      requisitionNo:"",
      manufacturerId:0,
      manufacturerSelected:null,
      requisitionDate:new Date(),
      proformaInvoiceDate:new Date(),
      proformaInvoiceNo:"",
      conversionRate:0,
      dockShipt:"",
      sbuName:"",
      currencyName:"",
      modeOfTransportName:"",
      localAgentName:"",
      benificiaryName:"",
      manufactureName:"",
      productTypeName:"",
      countryOriginSelected:null,
      countryOriginId:0,
      countryOriginName:null,
      typedDate:new Date(),
      bankSubDate:new Date(),
      mailReqRcvDate:new Date(),
      faxedOnDate:new Date(),
      amndCopyDate:new Date(),
      signDate:new Date(),
      appliedOnDate:new Date(),
      sortedDate: new Date(), 
    
      lcNegotiation:"",

      lcOpenDate: new Date(),
      validityDate: new Date(),
      exshiptDate: new Date(),
      lcNo:"",
      lcaNo:"",
    
      bankId:null,
      bankSelected:null,
      openBankName:null,
      adviceBankName:null,
      adviceBankId:null,
      adviceBankSelected:null,
      
      loadingPortId:null,
      loadingPortSelected:null,
      portLoadingName:null,
      portDestinationName:null,
      destinatinPortId:null,
      destinationPortSelected:null,
      totalLcAmount:0,
      frightAmount:0,
      shiptDay:"",
      remindDate: new Date(),
   
      
      
    };
    this.ToggleDissabled();
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
  /////End of Dynamic Button section (Do Not Edit)///////

  //////////////////////////////////////////////CRUD////////////////////////////
  

 

  // public addDetails() {
  //   debugger
  //   let flag=0;
  //   //console.log(this.master.productSelected);
  //   if (
  //     this.master.productWiseSpecificationId == 0 ||
  //     this.master.productWiseSpecificationId == null
  //   ) {
  //     this.toastrService.danger("Please select product.", "Message");

  //     return false;
  //   }
  //   // if (this.master.CtnQty == 0 || this.master.CtnQty == null || this.master.looseQty == 0 || this.master.looseQty == null) {
  //   //   this.toastrService.danger("Please enter CTN OR Loose Quantity.", "Message");

  //   //   return false;
  //   // }
  //   //this.getProductDetails();
  //   let detail = {
  //     productReqDetailsId: 0, //this.master.lstReqDetailsViewModel.productReqDetailsId,
  //     productWiseSpecificationId: this.master.productWiseSpecificationId,
  //     //dropdown: this.prodSelected,
  //     productId: this.master.productSelected["productId"],
  //     productName: this.master.productSelected["name"],
  //     uomId: this.master.productSelected["uomId"],
   
  //     unitPrice: this.master.unitPrice,
  //     blDate: this.master.blDate,
  //     blNo: this.master.blNo,
  //     hsCode: this.master.hsCode,
  //     blValue: this.master.blValue,
  //     blRate: this.master.blRate,
  //     uomName: this.master.uomName,
  //     isActive: 1,
  //   };
  //  let presentData = this.master.lstReqDetailsViewModel;
  //  if(presentData.length>0)
  //  {
  //   for (let i = 0; i < presentData.length; i++){

  //     if(presentData[i].productWiseSpecificationId==detail.productWiseSpecificationId){
  //       this.toastrService.danger("This Product already exits in List", "Message");
  //       flag=1;
  //       return;

  //     }
  //  }
  // }
  //  if(flag==0){
  //   if (detail.unitPrice >= 0 ) {
  //     this.master.lstReqDetailsViewModel.push(detail);
  //   } else {
  //     this.toastrService.danger("Quantity is zero.", "Message");
  //     return;
  //   }
  //   this.master.productSelected = null;
  //   this.master.unitPrice = null;
  //   this.master.hsCode=null;
  //   this.master.blRate=null;
  //   this.master.blValue=null;
  //   this.master.blNo=null;
  //   this.master.uomName=null;
  //  }
  //   // if(detail.productWiseSpecificationId==this.master.productWiseSpecificationId){
  //   // alert("match");
  //   // }
  //   //this.master.lstReqDetailsViewModel.push(detail);
    

  //   //console.log(this.master.lstReqDetailsViewModel);
  // }

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
    if (this.master.preLcId == 0 || this.master.preLcId == null) {
      this.show = false;
      this.toastrService.danger("Please select Reference No", "Message");
      this.commonService.valueSet("create");
      return;
    }
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

    debugger;
    this.master.amendmentDate=this.commonService.DateFormat(this.master.amendmentDate);
    this.purchaserequisitionService.SaveLcAmendmentInfo(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        this.commonService.valueSet("showlist");
        this.show = true;
        //////////////Grid Refresh ///////////////////
        this.purchaserequisitionService.getLcAmendmentDatabyId(0).subscribe((data: any) => {
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
    private productService: ProductService,
    private purchaserequisitionService:PurchaserequisitionService
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
      }, /// Dont Change 
      {
        headerName: "Amendment No",
        field: "amendmentNo",
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "Amendment",
        field: "amendment",
        //filter: "agTextColumnFilter",
        width: 200,
      },
      {
        headerName: "Amendment Date",
        field: "amendmentDate",
       // filter: "agTextColumnFilter",
        width: 120,
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
    this.purchaserequisitionService.getLcAmendmentDatabyId(0).subscribe((data: any) => {
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
      var AmendmentId = event.node.data.ImpLCAmendmentId;

      this.purchaserequisitionService.getLcAmendmentDatabyId(AmendmentId).subscribe((data: any) => {
        if (data.success) {
          debugger;
          this.master = data.data[0];
        

          this.master.referenceSelected = {
            id: data.data[0].preLcId,
            name: data.data[0].refNo
          }
                 
          console.log('master', this.master);
          // console.log('data.data[0]', data.data[0]);


          this.ToggleDissabled();
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
      debugger;
      var id = event.node.data.ImpLCAmendmentId;
      this.purchaserequisitionService.deleteLcAmendmentInfo(id).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          //////////////Grid Refresh ///////////////////
          this.purchaserequisitionService.getLcAmendmentDatabyId(0).subscribe((data: any) => {
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
  public getPreLcAndLcData(id)
  {
    this.listdata=[];
    debugger
    var amendNo=this.master.amendmentNo;
    var amdcause=this.master.amendment;
    var amnddate=this.master.amendmentDate;
    var re=this.master.remarks;

     this.purchaserequisitionService.getPreLcandLcInfoforAmemdment(id).subscribe((returns:any)=>{
      if(returns.success)
      {
        console.log("lc open data:==================",returns.data[0].lcOpenDate);
        this.master=returns.data[0];
       this.master.amendmentNo= amendNo;
       this.master.amendment= amdcause;
        this.master.amendmentDate=amnddate;
      this.master.remarks=re;
        this.master.referenceSelected={
          id:returns.data[0].preLcId,
          name:returns.data[0].refNo
        }

      }
     })

     this.purchaserequisitionService.getPreLcDetailsInfoByMasterId(id).subscribe((returns:any)=>{
      if(returns.success)
      {
        this.listdata=returns.data;
        console.log("details data is==============",this.listdata);
        
      }
   });
  }
  public referenceList=[];
  public preLcIdList=[];
  public getPreLcIdListFromLcMasterTable()
  {
    this.preLcIdList=[];
    this.purchaserequisitionService.getPrelcIdListFromLcMasterTable(0).subscribe((returns:any)=>{
       if(returns.success)
       {
        //this.preLcIdList=returns.data;
      
       this.referenceList = returns.data.map((val)=>({
        id:val.preLcId,
        name:val.refNo,
      }))
       }
    })
    
  }

 
 

}



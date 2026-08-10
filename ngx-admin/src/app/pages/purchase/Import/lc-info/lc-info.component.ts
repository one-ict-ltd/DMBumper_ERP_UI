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
import { PurchaserequisitionService } from "app/pages/purchase/settings/purchaserequisition.service";
import { id } from "@swimlane/ngx-charts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: 'ngx-lc-info',
  templateUrl: './lc-info.component.html',
  styleUrls: ['./lc-info.component.scss']
})
export class LCInfoComponent implements OnInit {

  master: {
    
    ImpPreLCInfoMasterId:number;
    ImpLCInfoMasterId:number;
    // for model
    productSelected:{};
    referenceSelected:{};
    preLcId:number;
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
    remarks:string;
    lcNegotiation:string;

    lcOpenDate:Date;
    validityDate:Date;
    exshiptDate:Date;
    expireDate:Date;
    lcNo:string;
    lcaNo:string;
    bankId:number;
    bankSelected:{};

    adviceBankId:number;
    adviceBankSelected:{};

    loadingPortId:number;
    loadingPortSelected:{};

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

  public pageNavigation = "LC information";
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
      this.show = true;
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
      this.show = true;
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
      ImpPreLCInfoMasterId:0,
      ImpLCInfoMasterId:0,
     
      // for model

      referenceSelected:null,
      preLcId:0,
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
      typedDate:new Date(),
      bankSubDate:new Date(),
      mailReqRcvDate:new Date(),
      faxedOnDate:new Date(),
      amndCopyDate:new Date(),
      signDate:new Date(),
      appliedOnDate:new Date(),
      sortedDate: new Date(), 
      remarks:"",
      lcNegotiation:"",

      lcOpenDate: new Date(),
      validityDate: new Date(),
      exshiptDate: new Date(),
      lcNo:"",
      lcaNo:"",
    
      bankId:null,
      bankSelected:null,
      adviceBankId:null,
      adviceBankSelected:null,
      
      loadingPortId:null,
      loadingPortSelected:null,
  
      destinatinPortId:null,
      destinationPortSelected:null,
      totalLcAmount:0,
      frightAmount:0,
      shiptDay:"",
      remindDate: new Date(),
   
      
    };
    this.ToggleDissabled();
    this.getLcNo();
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

  public getDropdownData() {
    ////////// Call common service for dropdown data/////////

    this.comboService.getCompany().subscribe((returns: any) => {
      this.companies = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
    });

    this.comboService.GetCompanyCategory().subscribe((returns: any) => {
      this.companyCategoryItems = returns.data.map((val) => ({
        id: val.companyCategoryId,
        name: val.categoryName,
      }));
    });

    this.comboService.getPartyType().subscribe((returns: any) => {
      this.parties = returns.data.map((val) => ({
        id: val.partyTypeId,
        name: val.partyTypeName,
      }));
   
    });

    this.comboService.getGender().subscribe((returns: any) => {
      this.genderItems = returns.data.map((val) => ({
        id: val.Name,
        name: val.Name,
      }));
    });

    this.comboService.getAddressType().subscribe((returns: any) => {
      this.addressTypeItems = returns.data.map((val) => ({
        id: val.addressTypeId,
        name: val.Name,
      }));
    });

    this.comboService.getDivision().subscribe((returns: any) => {
      this.divisionItems = returns.data.map((val) => ({
        id: val.divisionsId,
        name: val.divisionName,
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

    this.master.uomName = this.master.productSelected["uomName"];
   // this.GetCurrentStock();
  }


  public addDetails() {
    debugger
    let flag=0;
    //console.log(this.master.productSelected);
    if (
      this.master.productWiseSpecificationId == 0 ||
      this.master.productWiseSpecificationId == null
    ) {
      this.toastrService.danger("Please select product.", "Message");

      return false;
    }
    // if (this.master.CtnQty == 0 || this.master.CtnQty == null || this.master.looseQty == 0 || this.master.looseQty == null) {
    //   this.toastrService.danger("Please enter CTN OR Loose Quantity.", "Message");

    //   return false;
    // }
    //this.getProductDetails();
    let detail = {
      productReqDetailsId: 0, //this.master.lstReqDetailsViewModel.productReqDetailsId,
      productWiseSpecificationId: this.master.productWiseSpecificationId,
      //dropdown: this.prodSelected,
      productId: this.master.productSelected["productId"],
      productName: this.master.productSelected["name"],
      uomId: this.master.productSelected["uomId"],
   
      unitPrice: this.master.unitPrice,
      blDate: this.master.blDate,
      blNo: this.master.blNo,
      hsCode: this.master.hsCode,
      blValue: this.master.blValue,
      blRate: this.master.blRate,
      uomName: this.master.uomName,
      isActive: 1,
    };
   let presentData = this.master.lstReqDetailsViewModel;
   if(presentData.length>0)
   {
    for (let i = 0; i < presentData.length; i++){

      if(presentData[i].productWiseSpecificationId==detail.productWiseSpecificationId){
        this.toastrService.danger("This Product already exits in List", "Message");
        flag=1;
        return;

      }
   }
  }
   if(flag==0){
    if (detail.unitPrice >= 0 ) {
      this.master.lstReqDetailsViewModel.push(detail);
    } else {
      this.toastrService.danger("Quantity is zero.", "Message");
      return;
    }
    this.master.productSelected = null;
    this.master.unitPrice = null;
    this.master.hsCode=null;
    this.master.blRate=null;
    this.master.blValue=null;
    this.master.blNo=null;
    this.master.uomName=null;
   }
    // if(detail.productWiseSpecificationId==this.master.productWiseSpecificationId){
    // alert("match");
    // }
    //this.master.lstReqDetailsViewModel.push(detail);
    

    //console.log(this.master.lstReqDetailsViewModel);
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
      this.master.lstReqDetailsViewModel = [];
    }
  }

  public refesh() {
    this.master.lstReqDetailsViewModel = [];
    this.toastrService.warning(this.commonService.warningmsg, "Message");
  }



  private save() {
    debugger;
   
    var button = this.commonService.buttonClicked;
    if(this.master.preLcId==0 || this.master.preLcId==null){
      this.toastrService.danger("Please Select Pre LC Reference No", "Message");
      this.commonService.valueSet("create");
      return;
    }

    else if(this.master.lcStatus== "" || this.master.lcStatus == null){
      this.toastrService.danger("Please Choose LC Status", "Message");
      this.commonService.valueSet("create");
      return;
    }

    else if (this.master.lcNo == "" || this.master.lcNo == null) {
      this.toastrService.danger("Please Enter LC No", "Message");
      this.commonService.valueSet("create");
      return;
    }
    // else if (this.master.lcaNo == "" || this.master.lcaNo == null) {
    //   this.toastrService.danger("Please Enter LCA No", "Message");
    //   this.commonService.valueSet("create");
    //   return;
    // }
    // else if (this.master.bankId == 0 || this.master.bankId == null) {
    //   this.toastrService.danger("Please select Open Bank", "Message");
    //   this.commonService.valueSet("create");
    //   return;
    // }
    else if (this.master.adviceBankId == 0 || this.master.adviceBankId == null) {
      this.toastrService.danger("Please Select Advice Bank", "Message");
      this.commonService.valueSet("create");
      return;
    }
    else if (this.master.validityDate == null ) {
      this.toastrService.danger("Please select Validity Date ", "Message");
      this.commonService.valueSet("create");
      return;
    }
    else if (this.master.loadingPortId == 0 || this.master.loadingPortId == null) {
      this.toastrService.danger("Please Select Port of Loading", "Message");
      this.commonService.valueSet("create");
      return;
    }
    else if (this.master.destinatinPortId == 0 || this.master.destinatinPortId==null) {
      this.toastrService.danger("Please Select Desrination ", "Message");
      this.commonService.valueSet("create");
      return false;
    }  
    debugger;

    this.master.appliedOnDate=this.commonService.DateFormat(this.master.appliedOnDate);
    this.master.typedDate=this.commonService.DateFormat(this.master.typedDate);
    this.master.mailReqRcvDate=this.commonService.DateFormat(this.master.mailReqRcvDate);
    this.master.bankSubDate=this.commonService.DateFormat(this.master.bankSubDate);
    this.master.faxedOnDate=this.commonService.DateFormat(this.master.faxedOnDate);
    this.master.amndCopyDate=this.commonService.DateFormat(this.master.amndCopyDate);
    this.master.signDate=this.commonService.DateFormat(this.master.signDate);
    this.master.validityDate=this.commonService.DateFormat(this.master.validityDate);
    this.master.exshiptDate=this.commonService.DateFormat(this.master.exshiptDate);
    this.master.expireDate=this.commonService.DateFormat(this.master.expireDate);
    this.master.remindDate=this.commonService.DateFormat(this.master.remindDate);

    
    this.purchaserequisitionService.saveLcInfo(this.master).subscribe((returns:any)=>{
      if(returns.success)
      {
        this.commonService.valueSet('showlist');
          if (button == "update") {
            this.toastrService.success(this.commonService.updatedmsg, "Message");
          }
            else {
            this.toastrService.success(this.commonService.successmsg, "Message");
          }
         
          this.purchaserequisitionService.getLcInfo(0).subscribe((data:any)=>{
            if(data.success)
            {
              this.rowData=data.data;
            }
          })
      }
      else{
        this.toastrService.danger(this.commonService.failedmsg,"Message")
      }
    });

    this.getMaster();
    this.getPreLcIdListFromLcMasterTable();
    
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
    this.getPreLcIdListFromLcMasterTable()
    this.getProductType();
   // this.getDropdownData();
    this.getProductDetails();
  
    this.getCountryOrigin();
    this.getBank();
    
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
        headerName: "LC No",
        field: "lcNo",
        filter: "agTextColumnFilter",
        width: 120,
      },
      // {
      //   headerName: "LCA No",
      //   field: "lcaNo",
      //   filter: "agTextColumnFilter",
      //   width: 200,
      // },
      {
        headerName: "LC Open Date",
        field: "lcOpenDate",
        filter: "agTextColumnFilter",
        width: 120,
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
    this.purchaserequisitionService.getLcInfo(0).subscribe((data:any)=>{
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
      // this.selectedRows.push(event.node.data);
      // this.selectedRow = event.node.data;
      // var partyId = event.node.data.partyId;

      this.selectedRows.push(event.node.data);
      this.selectedRow = event.node.data;
      var ImpLCInfoMasterId = event.node.data.ImpLCInfoMasterId;
    
      this.purchaserequisitionService.getLcInfo(ImpLCInfoMasterId).subscribe((data:any)=>{
        if(data.success){
          this.master=data.data[0];

          
          this.master.referenceSelected={
            id:data.data[0].ImpPreLCInfoMasterId,
            name:data.data[0].refNo,
          }
          this.master.bankSelected={
            id:data.data[0].BankId,
            name:data.data[0].openBankName
          }

          this.master.adviceBankSelected={
            id:data.data[0].adviceBankId,
            name:data.data[0].adviceBankName
          }
          this.master.loadingPortSelected={
            id:data.data[0].loadingPortId,
            name:data.data[0].loadingPortName
          }

          this.master.destinationPortSelected={
            id:data.data[0].destinatinPortId,
            name:data.data[0].detinationPort
          }
          this.master.countryOriginSelected={
            id:data.data[0].CountryId,
            name: data.data[0].countryName
          }


          this.listdata=[];
          this.purchaserequisitionService.getPreLcDetailsInfoByMasterId(this.master.ImpPreLCInfoMasterId).subscribe((returns:any)=>{
            if(returns.success)
            {
              this.listdata=returns.data;
            }
          })


        }
      })

     
      this.ngOnInit();
    }
  }
  private agReport(event) {
    this.getReportData(event.data.ImpLCInfoMasterId)
    //this.toastrService.info("Print button clicked", "Message");
  }
  private agDelete(event) {
    var result = confirm("Are you sure you want to delete that?");
    if (result) {
    let lcId=event.data.ImpLCInfoMasterId;
    this.master.ImpLCInfoMasterId=lcId;
    if (result) {
      this.purchaserequisitionService.deleteLcInfo(this.master).subscribe((returns:any)=>{
        if(returns.success)
        {
          this.toastrService.success(this.commonService.deletedmsg, "Message");
          this.purchaserequisitionService.getLcInfo(0).subscribe((returns:any)=>{
            if(returns.success)
            {
              this.rowData=returns.data;
            }
          })
        }
      })
    }
    }
  }

  rptHeader="Pre Lc Info"
  datalength: number;
  
  
  refNo:string="";
  lcType:string="";
  psiNo:string="";
  psiCompany:string="";
  lcAmount:number=0;
  conRate:string="";
  lcNo:string="";
  lcaNo:string="";
  lcOpenDate:Date=new Date();
  freightAmount:number=0;
  totalAmount:number=0;
  modeOfTransport:string="";
  benificiary:string="";
  bodyData = [];
  headerData = [];
  params = [];
  gTotal: number = 0.00;
   public preLcDetailData=[];
   public productNameforReport:string='';
   
public preLcId:number=0;

  public getReportData(lcId) {
      this.purchaserequisitionService.getLcInfo(lcId).subscribe((data:any)=>{
        if(data.success){
          this.master=data.data[0];
           this.preLcId=data.data[0].ImpPreLCInfoMasterId;
          console.log("master data for Report=====================",data.data[0]);
          this.refNo=data.data[0].refNo;
          this.lcType=data.data[0].lcPaymentType;
          this.lcAmount=data.data[0].lcAmount;
          this.conRate=data.data[0].conversionRate;
          
          this.modeOfTransport=data.data[0].modeOfTransportName;
          this.benificiary=data.data[0].benificiaryName;

          this.lcNo=data.data[0].lcNo;
          this.lcaNo=data.data[0].lcaNo;
          this.lcOpenDate=data.data[0].lcOpenDate;
          
          this.freightAmount=data.data[0].frightAmount;
          this.totalAmount=data.data[0].totalLcAmount;

          this.purchaserequisitionService.getPreLcDetailsInfoByMasterId(this.preLcId).subscribe((returns:any)=>{
            if(returns.success)
            {
              this.preLcDetailData=returns.data;
              console.log("report PM requisiton Data Detail:======================",data.data);
              var fileName = this.rptHeader + ".pdf";
              const content = document.getElementById("reportHeader");
              this.generateReport("print", fileName, content, this.datalength);
            }
            else{
              this.toastrService.danger("Message", this.commonService.nodatafound);
            }
          })


        }
      })
  }


  /////////////////////////////report
  public generateReport(
    buttonAction: any,
    fileName: string,
    content: any,
    datalength: number
  ) {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(5); //optional
    doc.setTextColor(40); //optional

    var legend = {
      height: 100,
      totalheight: 100 + datalength,
    };
    //debugger;
    const addFooters = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      for (var i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(
          "Page " + String(i) + " of " + String(pageCount),
          doc.internal.pageSize.width / 1.2,
          doc.internal.pageSize.height - 20
        );
        doc.text(
          "Powered by : ONE ERP",
          doc.internal.pageSize.width / 2.3,
          doc.internal.pageSize.height - 20
        );
        doc.text(
          "Printed Date: " +
          new Date().toLocaleDateString() +
          " " +
          new Date().toLocaleTimeString(),
          20,
          doc.internal.pageSize.height - 20
        );
      }
    };

    //////////// TABLE DATA ////////////
    // legend.totalheight=legend.height+this.datalength;
    doc.html(content, {
      callback: function (doc) {
        autoTable(doc, {
          html: "#header_table_top",
          startY: legend.height + 50,
          styles: { font: "Meta", fontSize: 15, halign: "center" },
        });

        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 80,
          styles: { font: "Meta" },
        });

    
        autoTable(doc, {
          html: "#body_table1",
          startY: legend.height + 250,
          theme: "grid",
          // tableLineColor: [0, 0, 0],
          // tableLineWidth: 0.75,
          styles: {
            font: "Meta",
            lineColor: [44, 62, 80],
            lineWidth: 0.55,
          },
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontSize: 11,
            halign: "center",
            valign: "middle",
            fontStyle: "bold",
          },
          bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
          columnStyles: {
            3: { halign: "right" },
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });

        autoTable(doc, {
          html: "#footer_table",
          //startY: legend.totalheight + 300,
          theme: "grid",
          // tableLineColor: [0, 0, 0],
          // tableLineWidth: 0.75,
          styles: {
            font: "Meta",
            lineColor: [44, 62, 80],
            lineWidth: 0.55,
          },
          headStyles: {
            fillColor: [105, 105, 105],
            fontSize: 11,
          },
          bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });
        addFooters(doc);
        ////////////PRINT ////////////
        if (buttonAction == "pdf") {
          doc.save(fileName);
        } else {
          window.open(URL.createObjectURL(doc.output("blob")), "_blank"); //doc.output("dataurlnewwindow");
          doc.close();
        }
      },
    });
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


  public referenceList=[];
  public getReferenceList()
  {

    debugger;
    this.purchaserequisitionService.getPreLcInfo(0).subscribe((returns:any)=>{
      if(returns.success)
      {
        this.referenceList = returns.data.map((val)=>({
          id:val.ImpPreLCInfoMasterId,
          name:val.refNo,
        }))

        this.preLcIdList.forEach( idlist  => {
          this.referenceList= this.referenceList.filter(item=>item.id !=idlist.preLcId);
         })
      }
    })
    
  }

  public listdata=[];
  public getPreLcData(id)
  {
    this.listdata=[];
    debugger
  

     this.purchaserequisitionService.getPreLcInfo(id).subscribe((returns:any)=>{
      if(returns.success)
      {
        //this.master=returns.data[0];
        this.master.ImpPreLCInfoMasterId=returns.data[0].ImpPreLCInfoMasterId;
        this.master.lcAmount=returns.data[0].lcAmount;
        this.master.sbuName=returns.data[0].sbuName;
        this.master.lcPaymentType=returns.data[0].lcPaymentType;
        this.master.currencyName=returns.data[0].currencyName;
        this.master.modeOfTransportName=returns.data[0].modeOfTransportName;
        this.master.conversionRate=returns.data[0].conversionRate;
        this.master.indentNo=returns.data[0].indentNo;
        this.master.indentDate=returns.data[0].indentDate;
        this.master.indentRecvDate=returns.data[0].indentRecvDate;
        this.master.localAgentName=returns.data[0].localAgentName;
        this.master.benificiaryName=returns.data[0].benificiaryName;
        this.master.manufactureName=returns.data[0].manufactureName;
        this.master.proformaInvoiceNo=returns.data[0].proformaInvoiceNo;
        this.master.proformaInvoiceDate=returns.data[0].proformaInvoiceDate;
        this.master.productTypeName=returns.data[0].productTypeName;

        this.master.rfiNo=returns.data[0].rfiNo;
        this.master.requisitionNo=returns.data[0].requisitionNo;
        this.master.requisitionDate=returns.data[0].requisitionDate;
        this.master.psiStatus=returns.data[0].psiStatus;
        this.master.partShipment=returns.data[0].partShipment;
        this.master.transShipment=returns.data[0].transShipment;
        this.master.dockShipt=returns.data[0].dockShipt;
        //this.master.psiStatus=returns.data[0].psiStatus;
        this.master.referenceSelected={
          id: returns.data[0].ImpPreLCInfoMasterId,
          name: returns.data[0].refNo,
        }
      // this.master.lcNo=this.genLcNo;

        console.log("after call master data is==================",this.master);
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

  public countryOriginList=[];
  public getCountryOrigin()
  {
    this.productService.getProductOriginCountry().subscribe((data:any)=>{
      this.countryOriginList = data.data.map((val)=>({
        id:val.countryId,
        name:val.countryName,
    }))
    })
  }

  public genLcNo:string;
  public getLcNo() {
    this.genLcNo="";
    debugger;
    if (this.master.lcOpenDate == null) {
      this.master.lcOpenDate = new Date();
    }
    //console.log("the finalrequsition date is:",this.master.requisitionFianlDate)
    this.purchaserequisitionService
      .getLcNo(
        this.master.lcOpenDate.toDateString().substring(4, 15)
      )
      .subscribe((returns: any) => {
        console.log(returns);
        if (returns.success) {
          this.genLcNo = returns.data[0].MaxNo;
          this.master.lcNo=returns.data[0].MaxNo;
          console.log("lc no =",this.genLcNo);
        }
      });
  }

  public bankList=[];
  public adviceBankList=[];
  public portList=[];
  public getBank()
  {
    this.comboService.getBank(0,0).subscribe((returns: any) => {
      this.bankList = returns.data.map((val) => ({
        id: val.bankId,
        name: val.bankName,
      }));
      console.log("datalist",this.bankList)
    });

    this.purchaserequisitionService.getAdviceBank(0).subscribe((returns:any)=>{
        this.adviceBankList = returns.data.map((val)=>({
          id:val.adviceBankId,
          name:val.adviceBankName,
        }))      
    });

    this.purchaserequisitionService.getPortInof(0).subscribe((returns:any)=>{
      this.portList = returns.data.map((val)=>({
        id:val.portInfoId,
        name:val.portInfoName,
      }))
    })

    console.log("Advice Bank List:", this.adviceBankList)
  }

  public getTotalAmountForLc()
  {
    this.master.totalLcAmount=this.master.lcAmount+this.master.frightAmount;
  }

  public preLcIdList=[];
  public getPreLcIdListFromLcMasterTable()
  {
    this.preLcIdList=[];
    this.purchaserequisitionService.getPrelcIdListFromLcMasterTable(0).subscribe((returns:any)=>{
       if(returns.success)
       {
        this.preLcIdList=returns.data;
        //console.log("Pre lc id list:====================",this.preLcIdList);
        this.getReferenceList();
       }
    })
    
  }
}



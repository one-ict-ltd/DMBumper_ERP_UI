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
  selector: 'ngx-other-charge',
  templateUrl: './other-charge.component.html',
  styleUrls: ['./other-charge.component.scss']
})
export class OtherChargeComponent implements OnInit {

  master: {
    ImpLCInfoMasterId:number;
    preLcId:number;
    lcNo:string;
    lcaNo:string;
    lcAmount:number;
    totalLcAmount:number;
    lcOpenDate:Date;
    frightAmount:number;
    referenceSelected:{};
    bankSelected:{};
    benificiaryName:string;
    ManufactureName:string;
   


    ImpOtherChargeId:number;
    CustomsDutyOthersCharge:number;
    CustomsDutyOthersChargeDate:Date;
    ClearingCNFCharge:number;
    ClearingCNFChargeDate:Date;
    LoadingUnloadingCharge:number;
    LoadingUnloadingChargeDate:Date;
    CarringCharge:number;
    CarringChargeDate:Date;
    OthersCharge:number;	
    OthersCharge2:number;
    remarks:string

    bankName:string;

    BankChargeDate:Date;
    InsuranceAmount:number;
    InsuranceBranch:string;
    InsuranceCompany:string
    InsuranceNo:string    
    InsuranceDate:Date;
    InsuranceCharge:number;
    BankCharge:number;
   
  


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

  public pageNavigation = "Other Charge";
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
    ImpLCInfoMasterId:0,
    preLcId:0,
    lcNo:"",
    lcaNo:"",
    lcAmount:0,
    totalLcAmount:0,
    lcOpenDate:new Date(),
    frightAmount:0,
    referenceSelected:null,
    bankSelected:null,
    benificiaryName:"",
    ManufactureName:"",


    ImpOtherChargeId:0,
    CustomsDutyOthersCharge:0,
    CustomsDutyOthersChargeDate:new Date(),
    ClearingCNFCharge:0,
    ClearingCNFChargeDate:new Date(),
    LoadingUnloadingCharge:0,
    LoadingUnloadingChargeDate:new Date(),
    CarringCharge:0,
    CarringChargeDate:new Date(),
    OthersCharge:0,	
    OthersCharge2:0,
    remarks:"",

    bankName:"",

    BankChargeDate:new Date(),
    InsuranceAmount:0,
    InsuranceBranch:"",
    InsuranceCompany:"",
    InsuranceNo:"",   
    InsuranceDate:new Date(),
    InsuranceCharge:0,
    BankCharge:0
    };
    this.ToggleDissabled();
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

    this.comboService.getBank(0, 0).subscribe((returns: any) => {
      this.bankItems = returns.data.map((val) => ({
        id: val.bankId,
        name: val.bankName,
      }));
    });

  }

  public getActualDate(event: any) {
    debugger;
    let dateCon = event.toLocaleDateString() + " " + event.toLocaleTimeString();
    if (dateCon != '') {
      //this.master.businessStartDate = dateCon;
    }
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

    debugger;
    this.master.CustomsDutyOthersChargeDate=this.commonService.DateFormat(this.master.CustomsDutyOthersChargeDate);
    this.master.ClearingCNFChargeDate=this.commonService.DateFormat(this.master.ClearingCNFChargeDate);
    this.master.LoadingUnloadingChargeDate=this.commonService.DateFormat(this.master.LoadingUnloadingChargeDate);
    this.master.CarringChargeDate=this.commonService.DateFormat(this.master.CarringChargeDate);
    this.purchaserequisitionService.SaveOtherChargeInfo(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        this.show = true;
        //////////////Grid Refresh ///////////////////
        this.purchaserequisitionService.getOhterChargeInfo(0).subscribe((data:any)=>{
          if (data.success) {
            this.rowData = data.data;
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
    private purchaserequisitionService:PurchaserequisitionService
  ) {
    this.commonService.valueSet('showlist');
    this.getProductType();
    this.getDropdownData();
    this.getProductDetails();
    this.getPreLcIdListFromLcMasterTable();
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
        headerName: "Customs Duty Others Charge",
        field: "CustomsDutyOthersCharge",
        filter: "agTextColumnFilter",
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
    this.purchaserequisitionService.getOhterChargeInfo(0).subscribe((data:any)=>{
      if (data.success) {
        this.rowData = data.data;
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
      var chargeId = event.node.data.ImpOtherChargeId;

      this.purchaserequisitionService.getOhterChargeInfo(chargeId).subscribe((data: any) => {
        if (data.success) {
          debugger;
          this.master = data.data[0];
          this.master.referenceSelected = {
            id: data.data[0].preLcId,
            name: data.data[0].refNo,
          };

         
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
      var chargeId = event.node.data.ImpOtherChargeId;

      this.purchaserequisitionService.deleteOtherChargeInfo(chargeId).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          //////////////Grid Refresh ///////////////////
          this.purchaserequisitionService.getOhterChargeInfo(0).subscribe((data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          });
          //////////////Grid Refresh ///////////////////
        }
      });
    }
  }

  public addContact(dialog: TemplateRef<any>) {
    debugger;
    // if (this.master.mobileOne == '') {
    //   this.toastrService.danger("Please select mobile", "Message");
    //   return;
    // }

    // var RowCount = this.master.lstPartyContact.length;
    // for (let i = 0; i < RowCount; i++) {
    //   debugger;
    //   var _mobileOne = this.master.lstPartyContact[i].mobileOne;
    //   if (_mobileOne == this.master.mobileOne) {
    //     this.toastrService.danger("You have already added this", "Message");
    //     return;
    //   }
    // }

    // let detail = {
    //   mobileOne: this.master.mobileOne,
    //   mobileTwo: this.master.mobileTwo,
    //   emailAddress: this.master.emailAddress,
    //   managerName: this.master.managerName,
    //   managerContact: this.master.managerContact,
    // };

    // var indexu = this.master.lstPartyContact.findIndex(
    //   (x) =>
    //     x.partyContactId == this.master.partyContactId
    // );
    // if (indexu > -1) {
    //   this.master.lstPartyContact[indexu] = detail;
    // } else {
    //   this.master.lstPartyContact.push(detail);
    // }

    // this.master.isContactUpdated = 1;
    // this.ClearContact();
  }

  public DeleteContact(index: any) {
    debugger;
    // this.selectedRow = this.master.lstPartyContact[index];
    // this.master.lstPartyContact.splice(index, 1);

    // var index1 = this.master.lstPartyContact.findIndex(x => x.mobileOne == this.master.mobileOne);
    // if (index1 > -1) {
    //   this.master.lstPartyContact.splice(index1, 1);
    // }
    // this.master.isContactUpdated = 1;
    // this.toastrService.danger(this.commonService.deletedmsg, "Message");
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

  names: any;
  openWithDataObjModel(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
      context: this.data,
    });
  }
  openWithDataModel() {
    this.dialogService
      .open(DialogNamePromptComponent)
      .onClose.subscribe((name) => name && this.names.push(name));
  }
  /////////////////////////////

  chargeList: any = [];
  CsSelected: any[] = [];
  partySelected: any[] = [];
  loadChargeList() {
    this.chargeList = [
      {
        id: 0,
        name: "Other Charge",
      },
      {
        id: 1,
        name: "Offshore Charge",
      },
    ];
  }

  // getChargeType(id){
  //   if(id==1)
  //   {
  //     this.master.chargeFlag=true;
  //   }
  //   else{
  //     this.master.chargeFlag=false;
  //   }
  // }

  public listdata=[];
  public getPreLcAndLcData(id)
  {
    this.listdata=[];
    debugger
    this.master.lcNo="";
    this.master.lcaNo="";
    this.master.lcAmount=0;
    this.master.totalLcAmount=0;
    this.master.lcOpenDate=null;
    this.master.frightAmount=0;
  
    this.master.referenceSelected=null,
    this.master.bankSelected=null,

     this.purchaserequisitionService.getPreLcandLcBankInsuranceChargeInfoforOtherCharge(id).subscribe((returns:any)=>{
      if(returns.success)
      {
        console.log("lc open data:==================",returns.data[0].lcOpenDate);
       //this.master=returns.data[0];
        this.master.ImpLCInfoMasterId=returns.data[0].ImpLCInfoMasterId;
        this.master.preLcId=returns.data[0].preLcId;
        this.master.lcNo=returns.data[0].lcNo;
        this.master.lcaNo=returns.data[0].lcaNo;
        this.master.lcAmount=returns.data[0].lcAmount;
        this.master.totalLcAmount=returns.data[0].totalLcAmount;
        this.master.lcOpenDate=returns.data[0].lcOpenDate;
        this.master.frightAmount=returns.data[0].frightAmount;

        this.master.BankCharge=returns.data[0].BankCharge;
        this.master.BankChargeDate=returns.data[0].bankChargeDate;
        this.master.benificiaryName=returns.data[0].benificiaryName;
        this.master.bankName=returns.data[0].bankName;
        this.master.ManufactureName=returns.data[0].ManufactureName;

        this.master.InsuranceAmount=returns.data[0].InsuranceAmount;
        this.master.InsuranceNo=returns.data[0].InsuranceNo;
        this.master.InsuranceBranch=returns.data[0].InsuranceBranch;
        this.master.InsuranceCompany=returns.data[0].InsuranceCompany;
        this.master.InsuranceDate=returns.data[0].InsuranceDate;
        this.master.InsuranceCharge=returns.data[0].InsuranceCharge;

        this.master.referenceSelected={
          id: returns.data[0].preLcId,
          name: returns.data[0].refNo,
        }
        // this.master.bankSelected={
        //   id: returns.data[0].bankId,
        //   name: returns.data[0].openBankName,
        // }
      // this.master.lcNo=this.genLcNo;

        //console.log("after call master data is==================",this.master);
      }
     })

    //  this.purchaserequisitionService.getPreLcDetailsInfoByMasterId(id).subscribe((returns:any)=>{
    //   if(returns.success)
    //   {
    //     this.listdata=returns.data;
    //     console.log("details data is==============",this.listdata);
    //   }
   // });
  }
  public preLcIdList=[];
  public referenceList=[];
  public getPreLcIdListFromLcMasterTable()
  {
    this.preLcIdList=[];
    this.purchaserequisitionService.getPrelcIdListFromLcMasterTable(0).subscribe((returns:any)=>{
       if(returns.success)
       {
        this.preLcIdList=returns.data;
       // console.log("Pre lc id list:====================",this.preLcIdList);
       this.referenceList = returns.data.map((val)=>({
        id:val.preLcId,
        name:val.refNo,
      }))
       }
    })
    
  }


}

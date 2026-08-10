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
import { CurrencyService } from "app/services/currency.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: 'ngx-pre-lc-info',
  templateUrl: './pre-lc-info.component.html',
  styleUrls: ['./pre-lc-info.component.scss']
})
export class PreLcInfoComponent implements OnInit {

  master: {
    ImpPreLCInfoMasterId: number;
    currencyId: number;
    sbusSelected: {};
    currencySelected: {};
    productSelected: {};
    productWiseSpecificationId: number;
    lstReqDetailsViewModel: any[];
    lcInfoData: any[];
    unitPrice: number;
    blDate: Date;
    blNo: string;
    blValue: number;
    blRate: number
    hsCode: string;
    uomName: string;
    productTypeId: number;
    productTypeSelected: {};
    index: number;
    refNo: string;
    reqNoDate: Date;
    indentDate: Date;
    indentRecvDate: Date;
    lcAmount: number;
    ImpModeOfTransportId: number;
    modeTransportSelected: {};
    ImpLocalAgentId: number;
    localAgentSelected: {};
    ImpBenificiaryId: number;
    benificiarySelected: {};

    lcPaymentType: string;
    partShipment: string;
    transShipment: string;
    dockShipt: string;
    psiStatus: string;
    indentNo: string;
    rfiNo: string;
    psiNo: string;
    psiCompany: string;
    requisitionNo: string;
    manufacturerId: number;
    manufacturerSelected: {};
    requisitionDate: Date;
    proformaInvoiceDate: Date;
    proformaInvoiceNo: string;
    conversionRate: number;
    remarks: string;

    //Lc Info

    ImpLCInfoMasterId: number;
    lcOpenDate: Date;
    lcNo: string;
    validityDate: Date;
    exshiptDate: Date;
    expireDate: Date;

    bankId: number;
    bankSelected: {};

    adviceBankId: number;
    adviceBankSelected: {};

    loadingPortId: number;
    loadingPortSelected: {};

    destinatinPortId: number;
    destinationPortSelected: {};
    totalLcAmount: number;
    frightAmount: number;
    countryOriginSelected: {};
    countryOriginId: number;

    isCS: number
    csSelected: {};
    csMasterId: number;
    supplierSelected: {}
    supplierId: number;
  };

  newMaster: {
    ImpPreLCInfoMasterId: number;
    lcPaymentType: string;
    csMasterId: number;
    refNo: string;
    currencyId: number;
    lcAmount: number;
    ImpModeOfTransportId: number;
    conversionRate: number;
    ImpBenificiaryId: number;
    proformaInvoiceNo: string;
    proformaInvoiceDate: Date;
    productTypeId: number;
    partShipment: string;
    Remarks: string;

    lstReqDetailsViewModel: any[];

    lcInfoData: any[];

  };


  isReadOnly: boolean = false;
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

  public pageNavigation = "Lc-information";
  public buttons = this.commonService.btnList;
  public temperatureMode = "SIGHT";
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

      sbusSelected: null,
      currencySelected: null,
      productSelected: null,
      productWiseSpecificationId: 0,

      unitPrice: 0,
      blDate: new Date(),
      blNo: "",
      blValue: 0,
      blRate: 0,
      hsCode: "",
      uomName: "",
      productTypeId: 0,
      productTypeSelected: null,
      index: 0,

      reqNoDate: new Date(),
      indentDate: new Date(),
      indentRecvDate: new Date(),

      ImpLocalAgentId: 0,
      localAgentSelected: null,



      transShipment: "",
      dockShipt: "",
      psiStatus: "",
      indentNo: "",
      rfiNo: "",
      psiNo: "",
      psiCompany: "",
      requisitionNo: "",
      manufacturerId: 0,
      manufacturerSelected: null,
      requisitionDate: new Date(),

      ImpPreLCInfoMasterId: 0,
      refNo: "",
      currencyId: 0,
      lcPaymentType: "",
      partShipment: "",
      proformaInvoiceDate: new Date(),
      proformaInvoiceNo: "",
      conversionRate: 0,
      lcAmount: 0,
      ImpModeOfTransportId: 0,
      modeTransportSelected: null,
      ImpBenificiaryId: 0,
      benificiarySelected: null,
      remarks: "",
      lstReqDetailsViewModel: [],
      lcInfoData: [],


      //Lc info
      ImpLCInfoMasterId: 0,
      lcOpenDate: new Date(),
      lcNo: "",
      validityDate: new Date(),
      exshiptDate: new Date(),
      expireDate: new Date(),

      bankId: 0,
      bankSelected: null,

      adviceBankId: 0,
      adviceBankSelected: null,

      loadingPortId: 0,
      loadingPortSelected: null,

      destinatinPortId: 0,
      destinationPortSelected: null,
      totalLcAmount: 0,
      frightAmount: 0,
      countryOriginSelected: null,
      countryOriginId: 0,

      isCS: 0,
      csSelected: null,
      csMasterId: 0,
      supplierSelected: null,
      supplierId: 0
    };
    this.ToggleDissabled();
    //this.getRefNo()
    this.getCurrencyList();
    this.GetModeOfTransport();
    this.GetLocalAgent();
    this.getBenificiay();
    this.getLcNo();
    this.getApprovedCS();
  }


  // Function to format the date as "YYYY-MM-DD"
  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

  public AreaList = [];

  public RegionList = [];


  /*
GetRegionByZoneCode( ZoneCode);GetRegionByZoneOrDepoCode
GetDepoByRegionCode( RegionCode)
GetAreaByDepoCode(DepoCode);
  */

  csList = [];
  getApprovedCS() {
    this.csList = [];
    this.purchaserequisitionService.GetAllComparativeStatementsForLCbyStatus(1, 2).subscribe(
      (returns: any) => {
        if (returns.success) {
          this.csList = returns.data.map((val) => ({
            id: val.csMasterId,
            name: val.csMasterNo,
          }));
        }
      });
  }

  public supplierList = [];
  clearSupplier() {
    this.supplierList = [];
    this.benificiaryList = [];
    this.master.supplierSelected = {};
    this.master.benificiarySelected = {};
  }

  csDetails(data: any) {
    this.purchaserequisitionService.GetCSDetailsbyMasterId(this.master.csMasterId, 0).subscribe((res: any) => {
      if (res.success) {

        // this.supplierList = res.data.map((val: any) => ({
        //   id: val.supplierId,
        //   name: val.supplierName,
        // }));
        // if (this.supplierList.length == 1) {
        //   this.master.supplierSelected = { id: this.supplierList[0].id, name: this.supplierList[0].name }
        //    this.getProductsSupplierWise();
        //   this.master.supplierId = this.supplierList[0].id;
        // }

        this.benificiaryList = res.data.map((val: any) => ({
          id: val.supplierId,
          name: val.supplierName,
        }));

        if (this.benificiaryList.length == 1) {
          this.master.benificiarySelected = { id: this.benificiaryList[0].id, name: this.benificiaryList[0].name }
          this.master.ImpBenificiaryId = this.benificiaryList[0].id;
          this.getProductsSupplierWise();
        }

      }
    });

  }



  getProductsSupplierWise() {
    this.ClearOrderItemList()
    this.purchaserequisitionService.GetCSDetailsbyMasterId(this.master.csMasterId, this.master.ImpBenificiaryId).subscribe((returns: any) => {
      if (returns.success) {
        this.master.lstReqDetailsViewModel = returns.data;
      }
    });
  }

  public ClearOrderItemList() {
    this.master.lstReqDetailsViewModel = [];
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

    // this.comboService.getPartyType().subscribe((returns: any) => {
    //   this.parties = returns.data.map((val) => ({
    //     id: val.partyTypeId,
    //     name: val.partyTypeName,
    //   }));
    //   this.master.partiesSelected = {
    //     id: 19,
    //     name: "Supplier",
    //   };
    // });

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

  // public getActualDate(event: any) {
  //   debugger;
  //   let dateCon = event.toLocaleDateString() + " " + event.toLocaleTimeString();
  //   if (dateCon != '') {
  //     this.master.businessStartDate = dateCon;
  //   }
  // }

  // public getSBU(companyId) {
  //   this.master.sbusSelected = null;
  //   this.comboService.getSBU(companyId).subscribe((returns: any) => {
  //     this.sbus = returns.data.map((val) => ({
  //       id: val.sbuId,
  //       name: val.sbuName,
  //     }));
  //   });
  // }

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

  // public getDuplicate() {
  //   //debugger;
  //   this.partyService.getDuplicateParty(this.master.partyId, this.master.partyName).subscribe((returns: any) => {
  //     //debugger;
  //     this.master.countData = returns.data[0].countData;
  //   });
  // }

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
    let flag = 0;
    //console.log(this.master.productSelected);
    if (
      this.master.productWiseSpecificationId == 0 ||
      this.master.productWiseSpecificationId == null
    ) {
      this.toastrService.danger("Please select product.", "Message");

      return false;
    }

    let detail = {
      ImpPreLCInfoMasterId: this.master.ImpPreLCInfoMasterId,
      ImpPreLCInfoDetailId: 0,
      productWiseSpecificationId: this.master.productWiseSpecificationId,
      dropdown: this.prodSelected,
      productId: this.master.productSelected["productId"],
      productName: this.master.productSelected["name"],
      uomId: this.master.productSelected["uomId"],
      uomName: this.master.productSelected["uomName"],
      totalPrice: this.master.blValue * this.master.blRate,
      unitPrice: this.master.unitPrice,
      blDate: this.master.blDate = this.commonService.DateFormat(this.master.blDate),
      blNo: this.master.blNo,
      hsCode: this.master.hsCode,
      blValue: this.master.blValue,
      blRate: this.master.blRate,

      isActive: 1,
    };
    let presentData = this.master.lstReqDetailsViewModel;
    if (presentData.length > 0) {
      for (let i = 0; i < presentData.length; i++) {

        if (presentData[i].productWiseSpecificationId == detail.productWiseSpecificationId) {
          this.toastrService.danger("This Product already exits in List", "Message");
          flag = 1;
          return;

        }
      }
    }
    if (flag == 0) {
      if (detail.unitPrice >= 0) {
        this.master.lstReqDetailsViewModel.push(detail);
      } else {
        this.toastrService.danger("Quantity is zero.", "Message");
        return;
      }
      this.master.productSelected = null;
      this.master.unitPrice = null;
      this.master.hsCode = null;
      this.master.blRate = null;
      this.master.blValue = null;
      this.master.blNo = null;
      this.master.uomName = null;
    }

  }

  public deleteDetail(index: any) {
    debugger;
    if (confirm('Are You Sure?')) {

      this.master.lstReqDetailsViewModel.splice(index, 1);
      // this.master.lstReqDetailsViewModel = [];
    }
  }

  public refesh() {
    this.master.lstReqDetailsViewModel = [];
    this.toastrService.warning(this.commonService.warningmsg, "Message");
  }



  private save() {
    debugger;
    this.LcInofData();



    var button = this.commonService.buttonClicked;


    //  if (this.master.UnitId == 0 || this.master.UnitId == null) {
    //     this.toastrService.danger("Please select sbu", "Message");
    //     this.commonService.valueSet("create");
    //     return;
    //   }


    // this.master.requisitionDate=this.commonService.DateFormat( this.master.requisitionDate);
    this.master.proformaInvoiceDate = this.commonService.DateFormat(this.master.proformaInvoiceDate);
    // this.master.indentRecvDate=this.commonService.DateFormat( this.master.indentRecvDate);
    // this.master.indentDate=this.commonService.DateFormat(this.master.indentDate);

    this.newMaster = {
      ImpPreLCInfoMasterId: this.master.ImpPreLCInfoMasterId,
      lcPaymentType: this.master.lcPaymentType,

      refNo: this.master.refNo,
      currencyId: this.master.currencyId,
      lcAmount: this.master.lcAmount,
      ImpModeOfTransportId: this.master.ImpModeOfTransportId,
      conversionRate: this.master.conversionRate,
      ImpBenificiaryId: this.master.ImpBenificiaryId,
      csMasterId: this.master.csMasterId,
      proformaInvoiceNo: this.master.proformaInvoiceNo,
      proformaInvoiceDate: this.master.proformaInvoiceDate,
      productTypeId: this.master.productTypeId,
      partShipment: this.master.partShipment,
      Remarks: this.master.remarks,

      lstReqDetailsViewModel: this.master.lstReqDetailsViewModel,

      lcInfoData: this.master.lcInfoData,

    }

    debugger

    console.log("New Master Data:", this.newMaster);


    this.purchaserequisitionService.savePreLcInfo(this.newMaster).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        }
        else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        this.commonService.valueSet('showlist');
        this.purchaserequisitionService.getPreLcInfo(0).subscribe((data: any) => {
          if (data.success) {
            this.rowData = data.data;
          }
        })
      }
      else {
        this.toastrService.danger(this.commonService.failedmsg, "Message")
      }
    });
    this.getMaster();
  }

  public LcInofData() {
    debugger
    var obj = {
      ImpLCInfoMasterId: this.master.ImpLCInfoMasterId,
      ImpPreLCInfoMasterId: this.master.ImpPreLCInfoMasterId,
      lcOpenDate: this.commonService.DateFormat(this.master.lcOpenDate),
      validityDate: this.commonService.DateFormat(this.master.validityDate),
      exshiptDate: this.commonService.DateFormat(this.master.exshiptDate),
      expireDate: this.commonService.DateFormat(this.master.expireDate),
      lcNo: this.master.lcNo,
      bankId: this.master.bankId,
      adviceBankId: this.master.adviceBankId,
      loadingPortId: this.master.loadingPortId,
      destinatinPortId: this.master.destinatinPortId,
      totalLcAmount: this.master.totalLcAmount,
      frightAmount: this.master.frightAmount,
      countryOriginId: this.master.countryOriginId,
    }
    this.master.lcInfoData = [];
    this.master.lcInfoData.push(obj);
    var obj = {
      ImpLCInfoMasterId: this.master.ImpLCInfoMasterId,
      ImpPreLCInfoMasterId: this.master.ImpPreLCInfoMasterId,
      lcOpenDate: this.commonService.DateFormat(this.master.lcOpenDate),
      validityDate: this.commonService.DateFormat(this.master.validityDate),
      exshiptDate: this.commonService.DateFormat(this.master.exshiptDate),
      expireDate: this.commonService.DateFormat(this.master.expireDate),
      lcNo: this.master.lcNo,
      bankId: this.master.bankId,
      adviceBankId: this.master.adviceBankId,
      loadingPortId: this.master.loadingPortId,
      destinatinPortId: this.master.destinatinPortId,
      totalLcAmount: this.master.totalLcAmount,
      frightAmount: this.master.frightAmount,
      countryOriginId: this.master.countryOriginId,
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
    private purchaserequisitionService: PurchaserequisitionService,
    private currencyService: CurrencyService,
  ) {
    this.commonService.valueSet('showlist');
    this.getProductType();
    this.getDropdownData();
    this.getProductDetails();
    this.getSBU(0);
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
        headerName: "LC Payment Type",
        field: "lcPaymentType",
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "Ref No",
        field: "refNo",
        filter: "agTextColumnFilter",
        width: 200,
      },
      {
        headerName: "LC No",
        field: "lcNo",
        filter: "agTextColumnFilter",
        width: 200,
      },
      {
        headerName: "LC Amount",
        field: "lcAmount",
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "LC Open Date",
        field: "lcOpenDate",
        filter: "agTextColumnFilter",
        width: 120,
      },
      // {
      //   headerName: "PSI No",
      //   field: "psiNo",
      //   filter: "agTextColumnFilter",
      //   width: 350,
      // },
      // {
      //   headerName: "PSI Company",
      //   field: "psiCompany",
      //   filter: "agTextColumnFilter",
      // },
      // {
      //   headerName: "Company Name",
      //   field: "companyName",
      //   filter: "agTextColumnFilter",
      // },

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

    this.profile = this.commonService.GetUserProfileJson();

  }

  ToggleDissabled() {

    // if (this.profile.length > 0) {
    //   let POSTING_LOCATION = this.profile[0].POSTING_LOCATION;
    //   //if (this.master.partyId > 0 && (POSTING_LOCATION != undefined || null) && POSTING_LOCATION == 'D')
    //   if ((POSTING_LOCATION != (undefined || null)) && POSTING_LOCATION == 'D')
    //     this.dissabledForDepot = true;
    //   else
    //     this.dissabledForDepot = false;
    // }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.purchaserequisitionService.getPreLcInfo(0).subscribe((data: any) => {
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
    debugger
    this.disabled = false;
    this.isReadOnly = true;
    //this.show=true;
    //this.master.conversionRate.readonly = true;
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
      var ImpPreLCInfoMasterId = event.node.data.ImpPreLCInfoMasterId;

      this.purchaserequisitionService.getPreLcInfo(ImpPreLCInfoMasterId).subscribe((data: any) => {
        if (data.success) {
          debugger
          this.master = data.data[0];

          this.master.currencySelected = {
            id: data.data[0].currencyId,
            name: data.data[0].currencyName,
          };

          this.master.csSelected = {
            id: data.data[0].csMasterId,
            name: data.data[0].csMasterNo
          }

          this.master.benificiarySelected = {
            id: data.data[0].benificiaryId,
            name: data.data[0].benificiaryName,
          }

          this.master.productTypeSelected = {
            id: data.data[0].productTypeId,
            name: data.data[0].productTypeName,
          }

          this.master.modeTransportSelected = {
            id: data.data[0].modeTransportId,
            name: data.data[0].modeOfTransportName,
          }


          // L/C INFORMATION

          this.master.bankSelected = {
            id: data.data[0].bankId,
            name: data.data[0].bankName
          }

          this.master.adviceBankSelected = {
            id: data.data[0].adviceBankId,
            name: data.data[0].adviceBankName
          }
          this.master.loadingPortSelected = {
            id: data.data[0].loadingPortId,
            name: data.data[0].loadingPortName
          }

          this.master.destinationPortSelected = {
            id: data.data[0].destinatinPortId,
            name: data.data[0].detinationPort
          }
          this.master.countryOriginSelected = {
            id: data.data[0].countryOriginId,
            name: data.data[0].countryName
          }


          this.purchaserequisitionService.getPreLcDetailsInfoByMasterId(ImpPreLCInfoMasterId).subscribe((returns: any) => {
            if (returns.success) {
              debugger

              this.master.lstReqDetailsViewModel = returns.data;
              // console.log("Lst Request Details Data:========", returns.data);

              //const dateToFormat = new Date(); // Current date as an example
              //this.master.blDate = this.formatDateForInput(dateToFormat);
            }
          })


        }
      })

      this.ngOnInit();
    }
  }
  private agReport(event) {
    this.getReportData(event.data.ImpPreLCInfoMasterId)
    //this.toastrService.info("Print button clicked", "Message");
  }
  private agDelete(event) {
    var result = confirm("Are you sure you want to delete that?");
    debugger
    let preLcId = event.data.ImpPreLCInfoMasterId;
    this.master.ImpPreLCInfoMasterId = preLcId;
    if (result) {
      this.purchaserequisitionService.deletePrelcInfo(preLcId).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");
          this.purchaserequisitionService.getPreLcInfo(0).subscribe((returns: any) => {
            if (returns.success) {
              this.rowData = returns.data;
            }
          })
        }
      })
    }
  }




  rptHeader = "Pre Lc Info"
  datalength: number;


  refNo: string = "";
  lcType: string = "";
  psiNo: string = "";
  psiCompany: string = "";
  lcAmount: number = 0;
  conRate: string = "";
  modeOfTransport: string = "";
  benificiary: string = "";
  lcNo: string = "";
  totalLcAmount: string = "";
  lcOpenDate: string = "";
  freightAmount: number = 0;
  bodyData = [];
  headerData = [];
  params = [];
  gTotal: number = 0.00;
  public preLcDetailData = [];
  public productNameforReport: string = '';



  public getReportData(preLcId) {
    this.purchaserequisitionService.getPreLcInfo(preLcId).subscribe((data: any) => {
      if (data.success) {
        this.master = data.data[0];
        // console.log("master data for Report=====================", data.data[0]);
        this.refNo = data.data[0].refNo;
        this.lcType = data.data[0].lcPaymentType;
        this.lcAmount = data.data[0].lcAmount;
        this.conRate = data.data[0].conversionRate;
        this.psiNo = data.data[0].psiNo;
        this.psiCompany = data.data[0].psiCompany;
        this.modeOfTransport = data.data[0].modeOfTransportName;
        this.benificiary = data.data[0].benificiaryName;
        this.lcNo = data.data[0].lcNo;
        this.totalLcAmount = data.data[0].totalLcAmount;
        this.lcOpenDate = data.data[0].lcOpenDate;
        this.freightAmount = data.data[0].frightAmount
        this.purchaserequisitionService.getPreLcDetailsInfoByMasterId(preLcId).subscribe((returns: any) => {
          if (returns.success) {
            this.preLcDetailData = returns.data;
            console.log("report PM requisiton Data Detail:======================", data.data);
            var fileName = this.rptHeader + ".pdf";
            const content = document.getElementById("reportHeader");
            this.generateReport("print", fileName, content, this.datalength);
          }
          else {
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
          startY: legend.height + 200,
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

  //public sbus = [];
  public fromsbus = [];
  public tosbus = [];
  public getSBU(companyId) {
    debugger;
    //let factorySbuIds = [32,19]
    this.comboService.getSBU(companyId).subscribe((returns: any) => {

      this.fromsbus = returns.data.filter(x => x.sbuId == 32 || x.sbuId == 19).map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
      // this.fromsbus = sbuList.filter(function(item){

      //   let data= factorySbuIds.indexOf(item.id) === 1;
      //   console.log(data)
      //   return data;

      // });
      // this.tosbus = returns.data.map((val) => ({
      //   id: val.sbuId,
      //   name: val.sbuName,
      // }));
    });
  }

  public currencyList = [];
  public getCurrencyList() {
    debugger;
    // this.currencyService.getCurrency().subscribe((data: any) => {
    //   this.currencyList = data.data.map((val) => ({
    //     id: val.currencyId,
    //     name: val.currencyName
    //   }))
    // })
    this.currencyService.getAllActiveInActiveCurrency().subscribe((data: any) => {
      this.currencyList = data.data.map((val) => ({
        id: val.currencyId,
        name: val.currencyName
      }))
    })
  }

  public modeOfTransportList = [];
  public GetModeOfTransport() {
    this.purchaserequisitionService.getModeOfTransport(0).subscribe((returns: any) => {
      this.modeOfTransportList = returns.data.map((val) => ({
        id: val.modeTransportId,
        name: val.modeTransportName
      }))
    })
  }

  public localAgentList = [];
  public GetLocalAgent() {
    this.purchaserequisitionService.getLocalAgent(0).subscribe((returns: any) => {
      this.localAgentList = returns.data.map((val) => ({
        id: val.localAgentId,
        name: val.localAgentName
      }))
    })
  }

  public benificiaryList = [];
  public getBenificiay() {
    this.purchaserequisitionService.getBenificiaryByID(0).subscribe((returns: any) => {
      console.log(returns);
      this.benificiaryList = returns.data.map((val) => ({
        id: val.partyId,
        name: val.partyName + '-' + val.partyCode,
      }))
    })
  }

  public getRefNo() {
    debugger;
    if (this.master.reqNoDate == null) {
      this.master.reqNoDate = new Date();
    }
    //console.log("the finalrequsition date is:",this.master.requisitionFianlDate)
    this.purchaserequisitionService
      .getRefuisionNo(
        this.master.reqNoDate.toDateString().substring(4, 15)
      )
      .subscribe((returns: any) => {
        console.log(returns);
        if (returns.success) {
          this.master.refNo = returns.data[0].MaxNo;
        }
      });
  }



  public bankList = [];
  public adviceBankList = [];
  public portList = [];
  public getBank() {
    this.comboService.getBank(0, 0).subscribe((returns: any) => {
      this.bankList = returns.data.map((val) => ({
        id: val.bankId,
        name: val.bankName,
      }));
      console.log("datalist", this.bankList)
    });

    this.purchaserequisitionService.getAdviceBank(0).subscribe((returns: any) => {
      this.adviceBankList = returns.data.map((val) => ({
        id: val.adviceBankId,
        name: val.adviceBankName,
      }))
    });

    this.purchaserequisitionService.getPortInof(0).subscribe((returns: any) => {
      this.portList = returns.data.map((val) => ({
        id: val.portInfoId,
        name: val.portInfoName,
      }))
    })

    console.log("Advice Bank List:", this.adviceBankList)
  }

  public countryOriginList = [];
  public getCountryOrigin() {
    this.productService.getProductOriginCountry().subscribe((data: any) => {
      this.countryOriginList = data.data.map((val) => ({
        id: val.countryId,
        name: val.countryName,
      }))
    })
  }

  public genLcNo: string;
  public getLcNo() {
    this.genLcNo = "";
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

          this.master.refNo = returns.data[0].MaxNo;
          console.log("lc no =", this.genLcNo);
        }
      });
  }

  public getTotalAmountForLc() {
    this.master.totalLcAmount = this.master.lcAmount //+ this.master.frightAmount;
  }
}





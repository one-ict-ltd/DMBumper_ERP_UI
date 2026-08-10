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
import { PurchaserequisitionService } from "../../settings/purchaserequisition.service";
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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}


@Component({
  selector: 'ngx-shipment-info',
  templateUrl: './shipment-info.component.html',
  styleUrls: ['./shipment-info.component.scss']
})
export class ShipmentInfoComponent implements OnInit {

  master: {

    ImpPreLCInfoMasterId: number;
    ImpLCInfoMasterId: number;
    lcId: number;
    refNo: string;
    shipmentNo: string;
    preLcId: number;
    productSelected: {};
    productWiseSpecificationId: number;
    lstReqDetailsViewModel: any[];

    productTypeId: number;
    productTypeSelected: {};
    index: number;
    lcExpireDate: Date;
    expectShiptDate: Date;
    validityShiptDate: Date;
    lcStatus: string;
    lcPaymentType: string;
    transShipment: string;
    currencyName: string;
    modeOfTransportName: string;
    localAgentName: string;
    benificiaryName: string;
    productTypeName: string;
    typedDate: Date;
    bankSubDate: Date;
    mailReqRcvDate: Date;
    faxedOnDate: Date;
    amndCopyDate: Date;
    signDate: Date;
    appliedOnDate: Date;
    sortedDate: Date;
    remarks: string;
    lcNegotiation: string;

    lcOpenDate: Date;
    exshiptDate: Date;
    expireDate: Date;
    lcNo: string;
    lcaNo: string;




    loadingPortId: number;
    loadingPortSelected: {};
    loadingPortName: string;
    destinationPortName: string;
    destinatinPortId: number;
    destinationPortSelected: {};
    totalLcAmount: number;
    frightAmount: number;
    shiptDay: string;
    remindDate: Date;
    referenceSelected: {};
    lcamount: number;

    currencyId: number;
    localAgentId: number;
    benificiaryId: number;
    modeOfTransPortId: number
    //shipment data
    ImpShipmentInformationId: number;
    invoiceNo: string;
    invoiceAmt: number;
    shipmentDate: Date;
    invoiceDate: Date;
    carrierBillDate: Date;
    carrierBillNo: string;
    cagesDrumsItems: string;
    expectedDurgCLrDate: Date;
    remainderDays: number;
    carrierName: string;
    actualLoadingPortId: number;
    actualLoadingPortSelected: {};
    actualDestinationPortId: number;
    actualDestinationPortSelected: {};
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

  public pageNavigation = "Shipment Information";
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
      ImpLCInfoMasterId: 0,
      lcId: 0,
      ImpPreLCInfoMasterId: null,
      refNo: null,
      preLcId: 0,
      productSelected: null,
      productWiseSpecificationId: 0,
      lstReqDetailsViewModel: [],
      shipmentNo: "",
      productTypeSelected: null,
      productTypeId: 0,
      index: -1,
      lcExpireDate: new Date(),
      expectShiptDate: new Date(),
      validityShiptDate: new Date(),

      invoiceDate: new Date(),
      carrierBillDate: new Date(),
      lcStatus: "",
      lcPaymentType: "",
      transShipment: "",
      currencyName: "",
      modeOfTransportName: "",
      localAgentName: "",
      benificiaryName: "",
      productTypeName: "",
      loadingPortName: "",
      destinationPortName: "",
      typedDate: new Date(),
      bankSubDate: new Date(),
      mailReqRcvDate: new Date(),
      faxedOnDate: new Date(),
      amndCopyDate: new Date(),
      signDate: new Date(),
      appliedOnDate: new Date(),
      sortedDate: new Date(),
      remarks: "",
      lcNegotiation: "",

      lcOpenDate: new Date(),
      exshiptDate: new Date(),
      lcNo: "",
      lcaNo: "",
      loadingPortId: null,
      loadingPortSelected: null,

      destinatinPortId: null,
      destinationPortSelected: null,
      totalLcAmount: 0,
      frightAmount: 0,
      shiptDay: "",
      remindDate: new Date(),
      expireDate: new Date(),
      referenceSelected: null,
      lcamount: 0,


      currencyId: 0,
      localAgentId: 0,
      benificiaryId: 0,
      modeOfTransPortId: 0,
      //shipment Info
      ImpShipmentInformationId: 0,
      invoiceNo: "",
      invoiceAmt: 0,
      carrierBillNo: "",
      cagesDrumsItems: "",
      shipmentDate: new Date(),
      expectedDurgCLrDate: new Date(),
      remainderDays: null,
      carrierName: "",
      actualLoadingPortId: null,
      actualLoadingPortSelected: null,
      actualDestinationPortId: null,
      actualDestinationPortSelected: null,
    };
    this.getShipmentNo()
    //this.ToggleDissabled();
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


  // public getProductType() {
  //   this.productService.getProductType().subscribe((retuns: any) => {
  //     if (retuns.success) {
  //       this.productTypeList = retuns.data.map((val: any) => ({
  //         id: val.productTypeId,
  //         name: val.productTypeName,
  //       }))
  //     }
  //   })
  // }

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

    //this.master.uomName = this.master.productSelected["uomName"];
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
    // if (this.master.CtnQty == 0 || this.master.CtnQty == null || this.master.looseQty == 0 || this.master.looseQty == null) {
    //   this.toastrService.danger("Please enter CTN OR Loose Quantity.", "Message");

    //   return false;
    // }
    //this.getProductDetails();
    // let detail = {
    //   productReqDetailsId: 0, //this.master.lstReqDetailsViewModel.productReqDetailsId,
    //   productWiseSpecificationId: this.master.productWiseSpecificationId,
    //   //dropdown: this.prodSelected,
    //   productId: this.master.productSelected["productId"],
    //   productName: this.master.productSelected["name"],
    //   uomId: this.master.productSelected["uomId"],

    //   unitPrice: this.master.unitPrice,
    //   blDate: this.master.blDate,
    //   blNo: this.master.blNo,
    //   hsCode: this.master.hsCode,
    //   blValue: this.master.blValue,
    //   blRate: this.master.blRate,
    //   uomName: this.master.uomName,
    //   isActive: 1,
    // };
    let presentData = this.master.lstReqDetailsViewModel;
    if (presentData.length > 0) {
      for (let i = 0; i < presentData.length; i++) {

        // if(presentData[i].productWiseSpecificationId==detail.productWiseSpecificationId){
        //   this.toastrService.danger("This Product already exits in List", "Message");
        //   flag=1;
        //   return;

        // }
      }
    }

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
    // if (this.master.partyTypeId == 0 || this.master.partyTypeId == null) {
    //   this.toastrService.danger("Please select party type", "Message");
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


    this.master.shipmentDate = this.commonService.DateFormat(this.master.shipmentDate);
    this.master.expectedDurgCLrDate = this.commonService.DateFormat(this.master.expectedDurgCLrDate);
    this.master.invoiceDate = this.commonService.DateFormat(this.master.invoiceDate);
    this.master.carrierBillDate = this.commonService.DateFormat(this.master.carrierBillDate);

    debugger;
    this.purchaserequisitionService.SaveShipmentInfo(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        this.commonService.valueSet("showlist");
        //////////////Grid Refresh ///////////////////
        this.purchaserequisitionService.getShipmentDatabyId(0).subscribe((data: any) => {
          if (data.success) {
            this.rowData = data.data;
          }
        })
        //////////////Grid Refresh ///////////////////
        // this.purchaserequisitionService.
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
    private purchaserequisitionService: PurchaserequisitionService
  ) {
    this.commonService.valueSet('showlist');
    this.getPreLcIdListFromLcMasterTable(),
      this.GetPortList()
    //this.getProductType();
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
      {
        headerName: "Shipment No",
        field: "shipmentNo",
        //filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "Inovoice No",
        field: "invoiceNo",
        //filter: "agTextColumnFilter",
        width: 200,
      },
      {
        headerName: "Shipment Date",
        field: "shipmentDate",
        //filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "Ref No",
        field: "refNo",
        //filter: "agTextColumnFilter",
        width: 160,
      },
      {
        headerName: "LC No",
        field: "lcNo",
        //filter: "agTextColumnFilter",
        width: 160,
      },


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


    this.profile = this.commonService.GetUserProfileJson();

  }

  // ToggleDissabled() {
  //   debugger;
  //   if (this.profile.length > 0) {
  //     let POSTING_LOCATION = this.profile[0].POSTING_LOCATION;
  //     //if (this.master.partyId > 0 && (POSTING_LOCATION != undefined || null) && POSTING_LOCATION == 'D')
  //     if ((POSTING_LOCATION != (undefined || null)) && POSTING_LOCATION == 'D')
  //       this.dissabledForDepot = true;
  //     else
  //       this.dissabledForDepot = false;
  //   }
  // }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // this.partyService.getSupplier().subscribe((data: any) => {
    //   //debugger;
    //   if (data.success) {
    //     this.rowData = data.data;
    //   }
    // });
    this.purchaserequisitionService.getShipmentDatabyId(0).subscribe((data: any) => {
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
    debugger;
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
      var shipmentId = event.node.data.ImpShipmentInformationId;
      var preLcId = event.node.data.preLcId;

      // this.partyService.getPartyById(partyId).subscribe((data: any) => {
      //   if (data.success) {
      //     debugger;
      //     this.master = data.data[0];


      //     this.ToggleDissabled();
      //   }
      // });
      this.purchaserequisitionService.getShipmentDatabyId(shipmentId).subscribe((returns: any) => {
        if (returns.success) {
          this.master = returns.data[0];

          this.master.referenceSelected = {
            id: returns.data[0].ImpPreLCInfoMasterId,
            name: returns.data[0].refNo,
          }
          this.master.actualDestinationPortSelected = {
            id: returns.data[0].actualDestinationPortId,
            name: returns.data[0].actualDestinationPortName
          }
          this.master.actualLoadingPortSelected = {
            id: returns.data[0].actualLoadingPortId,
            name: returns.data[0].actualLoadingPortName
          }
        }
      })

      this.purchaserequisitionService.getPreLcDetailsInfoByMasterId(preLcId).subscribe((returns: any) => {
        if (returns.success) {
          this.listdata = returns.data;

        }
      });

      this.ngOnInit();
    }
  }
  private agReport(event) {
    //this.toastrService.info("Print button clicked", "Message");
    this.getReportData(event.node.data.ImpShipmentInformationId, event.node.data.preLcId);
  }
  private agDelete(event) {
    var result = confirm("Are you sure you want to delete that?");
    if (result) {
      //debugger;
      //this.master.partyId = event.node.data.partyId;
      var shipmentId = event.node.data.ImpShipmentInformationId;
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

      this.purchaserequisitionService.deleteShipmentInfo(shipmentId).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          this.purchaserequisitionService.getShipmentDatabyId(0).subscribe((returns: any) => {
            this.rowData = returns.data;
          })
        }
      })
    }
  }
  rptHeader = "Shipment Information";
  datalength: number;

  shipmentNo: string = "";
  shipmentDate: Date = new Date();
  invoiceNo: string = "";
  invoiceAmt: number = 0;
  refNo: string = "";
  lcType: string = "";
  psiNo: string = "";
  psiCompany: string = "";
  lcAmount: number = 0;
  conRate: string = "";
  lcNo: string = "";
  lcaNo: string = "";
  lcOpenDate: Date = new Date();
  freightAmount: number = 0;
  totalAmount: number = 0;
  modeOfTransport: string = "";
  benificiary: string = "";
  loadingPort: string = "";
  arrivalPort: string = "";
  bodyData = [];
  headerData = [];
  params = [];
  gTotal: number = 0.00;
  public preLcDetailData = [];
  public productNameforReport: string = '';

  //public preLcId:number=0;

  public getReportData(shipmentInfoId, preLcId) {
    this.purchaserequisitionService.getShipmentDatabyId(shipmentInfoId).subscribe((data: any) => {
      if (data.success) {
        this.master = data.data[0];
        // this.preLcId=data.data[0].ImpPreLCInfoMasterId;
        console.log("master data for Report=====================", data.data[0]);
        this.refNo = data.data[0].refNo;
        this.lcType = data.data[0].lcPaymentType;
        this.lcAmount = data.data[0].lcAmount;
        this.conRate = data.data[0].conversionRate;

        this.modeOfTransport = data.data[0].modeOfTransportName;
        this.benificiary = data.data[0].benificiaryName;

        this.lcNo = data.data[0].lcNo;
        this.lcaNo = data.data[0].lcaNo;
        this.lcOpenDate = data.data[0].lcOpenDate;

        this.freightAmount = data.data[0].frightAmount;
        this.totalAmount = data.data[0].totalLcAmount;

        this.shipmentNo = data.data[0].shipmentNo;
        this.shipmentDate = data.data[0].shipmentDate;
        this.invoiceNo = data.data[0].invoiceNo;
        this.invoiceAmt = data.data[0].invoiceAmt;
        this.loadingPort = data.data[0].actualDestinationPortName;
        this.arrivalPort = data.data[0].actualLoadingPortName;
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
          startY: legend.height + 300,
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
  public listdata = [];
  public getPreLcData(id) {
    this.listdata = [];
    debugger


    this.purchaserequisitionService.getPreLcLcInfoForShipment(id).subscribe((returns: any) => {
      if (returns.success) {
        this.master.lcaNo = returns.data[0].lcaNo;
        this.master.lcNo = returns.data[0].lcNo;
        this.master.lcOpenDate = returns.data[0].lcOpenDate;
        this.master.currencyName = returns.data[0].currencyName;
        this.master.lcExpireDate = returns.data[0].lcExpireDate;
        this.master.lcamount = returns.data[0].lcamount;
        this.master.frightAmount = returns.data[0].frightAmount;
        this.master.totalLcAmount = returns.data[0].totalLcAmount
        this.master.loadingPortName = returns.data[0].loadingPortName
        this.master.destinationPortName = returns.data[0].destinationPortName;
        this.master.ImpPreLCInfoMasterId = returns.data[0].ImpPreLCInfoMasterId;
        this.master.preLcId = returns.data[0].preLcId;
        this.master.ImpLCInfoMasterId = returns.data[0].ImpLCInfoMasterId
        this.master.lcId = returns.data[0].lcId;
        this.master.localAgentName = returns.data[0].localAgentName
        this.master.localAgentId = returns.data[0].localAgentId;
        this.master.benificiaryId = returns.data[0].benificiaryId;
        this.master.benificiaryName = returns.data[0].benificiaryName;
        this.master.currencyName = returns.data[0].currencyName;
        this.master.modeOfTransportName = returns.data[0].modeOfTransportName;
        this.master.productTypeName = returns.data[0].productTypeName;
        this.master.expectShiptDate = returns.data[0].expectShiptDate
        this.master.validityShiptDate = returns.data[0].validityShiptDate;

        //this.master.psiStatus=returns.data[0].psiStatus;
        this.master.referenceSelected = {
          id: returns.data[0].ImpPreLCInfoMasterId,
          name: returns.data[0].refNo,
        }


      }
    })

    this.purchaserequisitionService.getPreLcDetailsInfoByMasterId(id).subscribe((returns: any) => {
      if (returns.success) {
        this.listdata = returns.data;

      }
    });
  }
  public referenceList = [];
  public finalreferenceList = [];
  public getReferenceList() {

    debugger;
    this.purchaserequisitionService.getPreLcInfo(0).subscribe((returns: any) => {
      if (returns.success) {
        this.referenceList = returns.data.map((val) => ({
          id: val.ImpPreLCInfoMasterId,
          name: val.refNo,
        }))
        console.log("reference list========================================================", this.referenceList);
        for (var pre of this.preLcIdList) {

          for (var ref of this.referenceList) {
            if (ref.id == pre.preLcId) {
              this.finalreferenceList.push(ref);
            }
          }
        }


        // console.log("final reference list============================",this.finalreferenceList);

      }
    })

  }
  public preLcIdList = [];
  public getPreLcIdListFromLcMasterTable() {
    this.preLcIdList = [];
    this.purchaserequisitionService.getPrelcIdListFromLcMasterTable(0).subscribe((returns: any) => {
      if (returns.success) {
        this.preLcIdList = returns.data;
        console.log("Pre lc id list:====================", this.preLcIdList);
        this.getReferenceList();
      }
    })

  }
  public getShipmentNo() {
    debugger;
    // if (this.master.reqNoDate == null) {
    //   this.master.reqNoDate = new Date();
    // }
    //console.log("the finalrequsition date is:",this.master.requisitionFianlDate)
    let today: Date;
    today = new Date();
    this.purchaserequisitionService
      .getShipmentNo(
        today.toDateString().substring(4, 15)
      )
      .subscribe((returns: any) => {
        console.log(returns);
        if (returns.success) {
          this.master.shipmentNo = returns.data[0].MaxNo;
        }
      });
  }

  public portList = [];
  public GetPortList() {

    this.purchaserequisitionService.getPortInof(0).subscribe((returns: any) => {
      this.portList = returns.data.map((val) => ({
        id: val.portInfoId,
        name: val.portInfoName,
      }))
    })


  }
}


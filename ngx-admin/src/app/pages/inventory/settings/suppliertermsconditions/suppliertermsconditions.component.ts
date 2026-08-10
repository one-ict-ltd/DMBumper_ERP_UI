import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
} from "@angular/core";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup } from "@angular/forms";
import {
  NbComponentStatus,
  NbDialogService,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
import { NavigationStart, Router } from "@angular/router";
import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { ProductService } from "app/services/inventory/product.service";
import { BranchService } from "app/services/erpsetting/branch.service";
import { PartyService } from "app/services/party.service";
import { SuppliertermsconditionsService } from "app/pages/inventory/settings/suppliertermsconditions.service";
import { from } from "rxjs";


interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}


@Component({
  selector: 'ngx-suppliertermsconditions',
  templateUrl: './suppliertermsconditions.component.html',
  styleUrls: ['./suppliertermsconditions.component.scss']
})
export class SuppliertermsconditionsComponent implements OnInit {

  /////////////////////////////
  master: {
    partytTerms: string;
    isDelete: number;
    isActive: number;

    productSelected: [];

    partyId: number;
    partyName: string;
    productTypeId:number;
    partyNameSelected: {};
    companySelected: {};
    productTypeSelected: {};
    supplierId: number;

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

  public pageNavigation = "Terms & Conditions";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.lstdetailmodel = [];
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      //this.openConfirmPopup("");     
      this.save();
     // this.show = true;
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
      partytTerms: "",
      isDelete: 0,
      isActive: 1,
      productTypeId:0,
      productSelected: null,

      partyId: 0,
      partyName: "",
      partyNameSelected: null,
      companySelected: null,
      productTypeSelected: null,
      supplierId: 0,
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
    // if (this.master.supplierId == 0 || this.master.supplierId == null) {
    //   this.toastrService.danger("Please select supplier", "Message");
    //  this.commonService.valueSet("create");
    //   return false;
    // }
    // if (this.master.partytTerms == "" || this.master.partytTerms == null) {
    //   this.toastrService.danger("Please enter party terms & conditions.", "Message");
    //  this.commonService.valueSet("create");
    //   return false;
    // }

    if(this.lstdetailmodel.length<1){
         this.toastrService.danger("Please add terms & conditions.", "Message");
         this.commonService.valueSet("create");
    }

    this.show = true;
    this.suppliertermsconditionsService.saveTermsAndConditions(this.master.supplierId,this.master.productTypeId, this.lstdetailmodel).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        }
        else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        //////////////Grid Refresh ///////////////////
        this.suppliertermsconditionsService.getTermsAndConditionsNoStuff(0,0).subscribe((data: any) => {
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

  constructor(
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private suppliertermsconditionsService: SuppliertermsconditionsService,
    private productrequisitionService: ProductrequisitionService,
    private partyService: PartyService,
    private comboService: CommoncomboService,
    private productService: ProductService,
    private branchService: BranchService,
  ) {

    this.commonService.valueSet('showlist');

    // this.getProductDetails();
    // this.getWarehouse(0);
    // this.getSBU(0);
    this.getSupplier();

    this.columnDefs = [
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.rowIndex + 1",
        pinned: "left",
        filter: false,
        width: 50,
      }, /// Dont Change
      {
        headerName: "Product Type",
        field: "productTypeName",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 180,
      },
      {
        headerName: "Terms & Conditions",
        field: "termsAndConditions",
        width: 550,
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
    };
    this.getMaster();
    this.getProductType();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // this.suppliertermsconditionsService.getTermsAndConditions(0).subscribe((data: any) => {
    //   if (data.success) {
    //     this.rowData = data.data;
    //   }
    // });
    this.suppliertermsconditionsService.getTermsAndConditionsNoStuff(0,0).subscribe((data: any) => {
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

  private agEdit(event) {
    this.disabled = false;
     let temp = 0;
    // for (let i = 0; i < this.selectedRows.length; i++) {
    //   if (this.selectedRows[i] == event.node.data) {
    //     this.selectedRows.splice(i, 1);
    //     this.selectedRow = event.node.data;
    //     temp = 1;
    //     this.ngOnInit();
    //   }
    // }
    if (temp === 0) {
      this.selectedRows.push(event.node.data);
      this.selectedRow = event.node.data;
      var supplierId = event.node.data.supplierId;
      var productTypeId = event.node.data.productTypeId;
      this.suppliertermsconditionsService.getTermsAndConditionsNoStuff(supplierId,productTypeId).subscribe((data: any) => {
        if (data.success) {
          this.getSupplier();
          
          this.master.partyNameSelected = {
            id: data.data[0].supplierId,
            name: data.data[0].supplierName,
          }
          this.master.productTypeSelected = {
            id: data.data[0].productTypeId,
            name: data.data[0].productTypeName,
          }
        }
        this.master.supplierId=supplierId;
        this.master.productTypeId=productTypeId;
        //this.selectedRows.push(data.data);    
        //this.selectedRow = [];
        this.lstdetailmodel = [];
        this.getTermsAndConditionsNoStuff(0);
        this.ngOnInit();
        this.master.partytTerms = "";
      }
      )
    };
  }

  private agReport(event) {
    this.toastrService.info("Print button clicked", "Message");
  }

  private agDelete(event) {
    let termsAndCoditionsId = event.node.data.termsAndCoditionsId;
    if(termsAndCoditionsId && termsAndCoditionsId!=0){
      this.suppliertermsconditionsService.deleteTermsAndConditionsId(termsAndCoditionsId).subscribe((returns: any) => {
      if (returns.success) {
        this.toastrService.success("Deleted Successfully", "Message");
        this.suppliertermsconditionsService.getTermsAndConditionsNoStuff(0,0).subscribe((data: any) => {
          if (data.success) {
            this.rowData = data.data;
          }
        });
        }
      });
    }
  }

  // public supplierList = [];
  // public getPartyNameById(partyId) {
  //   this.partyService.getPartyById(partyId).subscribe((returns: any) => {
  //     console.log(returns.data);

  //     this.supplierList = returns.data.map((val: any) => ({
  //       id: val.partyId,
  //       name: val.partyName,
  //     }));
  //   });
  // }

  public supplierList = [];
  public getSupplier() {
    this.suppliertermsconditionsService.getProductsupplier().subscribe((retuns: any) => {
      if (retuns.success) {
        this.supplierList = retuns.data.map((val: any) => ({
          id: val.supplierId,
          name: val.supplierName,
        }))
      }
    })
  }

  public detailList = [];
  public gettermsandconditionbypartyid(supplierId) {

    this.suppliertermsconditionsService.getTermsAndConditionsNoStuff(this.master.supplierId,this.master.productTypeId).subscribe((data: any) => {
      console.log(data.data);
      if (data.success) {
        this.detailList = data.data.map((val: any) => ({
          // supplierId: val.supplierId,
          // supplierName: val.supplierName,
          termsAndCoditionsId: val.termsAndCoditionsId,
          productTypeId: val.productTypeId,
          productTypeName: val.productTypeName,
          termsAndConditions: val.termsAndConditions,

        }))
        this.lstdetailmodel = this.detailList;
        console.log(this.lstdetailmodel);
      }
    });

  }
  
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



  public getTermsAndConditionsNoStuff(id:any) {
    this.suppliertermsconditionsService.getTermsAndConditionsNoStuff(this.master.supplierId,this.master.productTypeId).subscribe((data: any) => {
      console.log(data.data);
      if (data.success) {
        this.detailList = data.data.map((val: any) => ({
          termsAndCoditionsId: val.termsAndCoditionsId,
          productTypeId : val.productTypeId,
          productTypeName : val.productTypeName,
          // supplierId: val.supplierId,
          // supplierName: val.supplierName,
          termsAndConditions: val.termsAndConditions,

        }))
        this.lstdetailmodel = this.detailList;
        console.log(this.lstdetailmodel);
      }
    });

  }

  public lstdetailmodel = [];
  public addDetails() {
    console.log(this.master.partyNameSelected);
    // this.getProductDetails();
   // this.getSupplier();
    let detail = {
      //  supplierId: null,
      //  supplierName: null,
      termsAndCoditionsId : 0,
      productTypeId : this.master.productTypeId,
      productTypeName : this.master.productTypeSelected["name"],
      termsAndConditions: this.master.partytTerms,
    };
    this.lstdetailmodel.push(detail);
    this.master.partytTerms="";
  }

  public deleteDetail(index: any) {
    let termsAndCoditionsId =this.lstdetailmodel[index].termsAndCoditionsId;
    debugger
    if(termsAndCoditionsId && termsAndCoditionsId!=0){
      this.suppliertermsconditionsService.deleteTermsAndConditionsId(termsAndCoditionsId).subscribe((returns: any) => {
      if (returns.success) {
        //this.toastrService.success(this.commonService.deletedmsg, "Message");
         this.selectedRow = this.lstdetailmodel[index];
         this.lstdetailmodel.splice(index, 1);
         if (this.selectedRow.helpDetailId > 0) {
         }
         this.toastrService.danger(this.commonService.deletedmsg, "Message");
        }
      });
    }else{
      this.selectedRow = this.lstdetailmodel[index];
      this.lstdetailmodel.splice(index, 1);
      if (this.selectedRow.helpDetailId > 0) {
      }
      this.toastrService.danger(this.commonService.deletedmsg, "Message");
    }
   
  }

  public refesh() {
    this.lstdetailmodel = [];
    this.toastrService.warning(this.commonService.warningmsg, "Message");
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

  public getCompany() {
    this.comboService.getCompany().subscribe((returns: any) => {
      this.companyItems = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
    });
  }

}

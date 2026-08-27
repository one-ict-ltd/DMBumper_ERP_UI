import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup } from "@angular/forms";
import {
  NbComponentStatus,
  NbDialogService,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbThemeService,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { CommoncomboService } from "app/services/commoncombo.service";
import { ModalService } from "app/services/transaction/modal.service";
import { Router } from "@angular/router";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { ElementRef } from "@angular/core";
import { ChequebookService } from "app/services/transaction/chequebook.service";
import { ModulepermissionService } from "app/services/erpsetting/modulepermission.service";
import { ModuleService } from "app/services/erpsetting/module.service";
import { MenupermissionService } from "app/services/erpsetting/menupermission.service";
import { UsergroupService } from "app/services/erpsetting/usergroup.service";
import { ProductService } from 'app/services/inventory/product.service';
import { ConsoleService } from "@ng-select/ng-select/lib/console.service";


@Component({
  selector: 'ngx-product-entry',
  templateUrl: './product-entry.component.html',
  styleUrls: ['./product-entry.component.scss']
})
export class ProductEntryComponent implements OnInit {

  master: {
    productId: number;
    productWiseSpecificationId: number;
    productCode: string;
    productName: string;
    width: number;
    height: number;
    weight: number;
    isQCRequired: false;
    hsCODE: string;
    description: string;
    warrantyDuration: number;
    notificationDay: number;
    productTypeId: number;
    productTypeSelected: {};
    productCategoryId: number;
    productCategorySelected: {};
    productSubCategoryId: number;
    productSubCategorySelected: {};
    modelId: number;
    modelSelected: {};
    brandId: number;
    brandSelected: {};
    uomId: number;
    uomSelected: {};
    originCountryId: number;
    originCountrySelected: {};
    gradeId: number;
    gradeSelected: {};
    companyId: number;
    companySelected: {};
    isActive: true;
    Active: true;
    Default: true;
    Specificationdetail: any[];
    expiryDate: Date;

    
    skuNumber: string;
    skuName: string;
    partslink: string;
    location: string;
    qtyonHand: number;
    uom: string;
    listPrice: number;
    costPrice: number;
    salesPrice: number;
    fromYear: number;
    toYear: number;
    make: string;
    model: string;
    category: string;
    subCategory: string;
    oem: string;
    interchange: string;
    patent: string;
    side: string;
    position: string;
    material: string;
    colorOrFinish: string;
    certification: string;
    status: string;
    barcodeOrQR: string;
    productWeight: number;
    productWeight_UOM: string;
    productWidth: string;
    productHeight: string;
    productLength: string;
    productSizeUOM: string;
    productActive: string;
    productTaxable: string;
    isWebsiteActive: boolean;
    isReturnable: boolean;
    warrantyDays: number;
    lastReceivedDate: Date;
    lastSoldDate: Date;
    primaryVendor: string;
    vendorType: string;
    submodelOrTrim: string;
    bodyStyle: string;
    engineSize: string;
    warehouse: string;
    zone: string;
    aisle: string;
    rack: string;
    shelf: string;
    bin: string;
    pickLocationOrZone: string;
    bulkLocationOrZone: string;
    qtyReserved: number;
    qtyDamagedHold: number;
    qtyReceivingHold: number;
    qtyReturnIntake: number;
    qtyVendorReturn: number;
    qtyScrap: number;
    previousCountdays: number;
    spotCountDate: Date;
    currentCountDays: number;
    cycleCountFrequency: number;
    abc_Class: string;
    leadTimeDays: number;
    safetyStock: number;
    minStock: number;
    maxStock: number;
    suggestedReorderQty: number;
    vendorName: string;
    defaultVendor: string;
    vendorPartNumber: string;
    cost: number;
    vendorUOM: string;
    assetAccount: string;
    cogsAccount: string;
    adjustmentAccount: string;
    scrapAccount: string;
    varianceAccount: string;
    incomeAccount: string;
    upc: string;
    partTypeID: string;
    batchNumber: string;
    notes: string;
    makeId: number;
    makeSelected: {};
    makeModelId: number;
    makeModelSelected: {};

    search_productCategoryId: number;
    search_productCategorySelected: {};
    search_skuNumber: string;
    search_partslink: string;
    search_interchange: string;

  };


  showMessages: any = {};
  errors: string[];
  readonly: boolean = false;
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
  showParent: boolean = false;
  vlucherForm: FormGroup;
  submitted: boolean;
  saveupdate: string = "Save";
  gridbutton: string = "";
  name: string;
  description: string;
  selectedRow: any;
  MenuService: any;

  private gridApi;
  private gridColumnApi;

  public modules: Module[] = AllCommunityModules;
  public columnDefs;
  public defaultColDef;
  public rowData: [];
  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };

  constructor(private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private comboService: CommoncomboService,
    private productService: ProductService) {

    this.getProductCategory();
    this.getProductSubCategory();
    this.getProductType();
    this.getMakeById();
    //this.getProductGrade();
    //this.getProductModel();
    //this.getProductBrand();
    this.getProductUOM();
    this.getOriginCountry();
    this.getCompany();
    //this.getcolor();
    //this.getSize();
    this.getDiscoutType();

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
        headerName: "Product Number",
        field: "skuNumber",
        filter: "agTextColumnFilter",
        editable: false,
        width: 160,
      },
      {
        headerName: "Partslink",
        field: "partslink",
        filter: "agTextColumnFilter",
        editable: false,
        width: 160,
      },
      {
        headerName: "Description",
        field: "skuName",
        filter: "agTextColumnFilter",
        editable: false,
        width: 450,
      },
      {
        headerName: "From Year",
        field: "fromYear",
        filter: "agTextColumnFilter",
        editable: false,
        width: 120,
      },
      {
        headerName: "To Year",
        field: "toYear",
        filter: "agTextColumnFilter",
        editable: false,
        width: 120,
      },
      {
        headerName: "Make",
        field: "makeName",
        filter: "agTextColumnFilter",
        editable: false,
        width: 170,
      },
      {
        headerName: "Model",
        field: "makeModelName",
        filter: "agTextColumnFilter",
        editable: false,
        width: 450,
      },
      {
        headerName: "Category",
        field: "categoryName",
        filter: "agTextColumnFilter",
        editable: false,
        width: 200,
      },
      {
        headerName: "Sub Category",
        field: "subCategoryName",
        filter: "agTextColumnFilter",
        editable: false,
        width: 200,
      },
      {
        headerName: "OEM",
        field: "oem",
        filter: "agTextColumnFilter",
        editable: false,
        width: 200,
      },
      {
        headerName: "Interchange",
        field: "interchange",
        filter: "agTextColumnFilter",
        editable: false,
        width: 300,
      },
      {
        field: "action",
        cellRenderer: "btnCellRenderer",
        cellRendererParams: {
          clicked: function (field: any) {

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
  }

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
      this.readonly = true;
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
      // this.agDelete(event);
      this.toastrService.info("Access Denied", "Message");
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }

  private selectedRows = [];
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
      var productWiseSpecificationId = event.node.data.productWiseSpecificationId;

      this.productService.getInvProductWiseSpecificationById(productWiseSpecificationId,0,'','','').subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0];

          this.getProductCategory();
          this.getProductSubCategory();
          this.getMakeById();
          this.getMakeModelByMakeId();
          // this.getProductType();
          //this.getProductGrade();
          //this.getProductModel();
          //this.getProductBrand();
          // this.getProductUOM();
          // this.getOriginCountry();
          // this.getCompany();
          //this.getcolorInUpdate();
          //this.getSize();
          //this.getSizeInUpdate();
          // this.getBarcode();
          // this.getDiscountList();
          //this.getSupplierInUpdate();
          // this.getSpecificationDetailsInUpdate();
        debugger;
          // this.master.companySelected = {
          //   id: data.data[0].companyId,
          //   name: data.data[0].companyName,
          // };

          this.master.productCategorySelected = {
            id: data.data[0].productCategoryId,
            name: data.data[0].categoryName,
          };

          this.master.productSubCategorySelected = {
            id: data.data[0].productSubCategoryId,
            name: data.data[0].subCategoryName,
          };

           this.master.makeSelected = {
            id: data.data[0].makeId,
            name: data.data[0].makeName,
          };

          this.master.makeModelSelected = {
            id: data.data[0].makeModelId,
            name: data.data[0].makeModelName,
          };

          // this.master.productTypeSelected = {
          //   id: data.data[0].productTypeId,
          //   name: data.data[0].productTypeName,
          // };

          // this.master.gradeSelected = {
          //   id: data.data[0].gradeId,
          //   name: data.data[0].gradeName,
          // };
          // this.master.modelSelected = {
          //   id: data.data[0].modelId,
          //   name: data.data[0].modelName,
          // };

          // this.master.brandSelected = {
          //   id: data.data[0].brandId,
          //   name: data.data[0].brandName,
          // };

          this.master.uomSelected = {
            id: data.data[0].uomId,
            name: data.data[0].uomName,
          };

          // this.master.originCountrySelected = {
          //   id: data.data[0].countryId,
          //   name: data.data[0].countryName,
          // };

          // this.master.companySelected = {
          //   id: data.data[0].companyId,
          //   name: data.data[0].companyName,
          // };

        }
      });
      this.ngOnInit();
    }
  }
  private agReport(event) {
    this.toastrService.info("Print button clicked", "Message");
  }

  private agDelete(event) {
    this.master.productId = event.node.data.productId;
    var categoryId = event.node.data.productcategoryId;

    this.productService.deleteProduct(this.master).subscribe((returns: any) => {
      if (returns.success) {
        this.toastrService.success(this.commonService.deletedmsg, "Message");

        //////////////Grid Refresh ///////////////////
        this.productService.getInvProductWiseSpecificationById(0, categoryId, '', '', '').subscribe((data: any) => {
          if (data.success) {
            this.rowData = data.data;
          }
        });
        //////////////Grid Refresh ///////////////////
      }
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.productService.getInvProductWiseSpecificationById(0,1,'','','').subscribe((data: any) => {
      if (data.success) {
        this.rowData = data.data;
      }
    });
  }


  ngOnInit(): void {
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }

  public pageNavigation = "Product Entry";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      //this.getcolor();
      //this.getSize();
      this.colorModel = [];
      this.BarCodeModel = [];
      this.lstdetailmodel = [];
      this.getDiscountDetails();

      this.show = false;
      this.disabled = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      this.save();
      // this.show = true;
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
      // this.show = true;
    } else if (this.commonService.buttonClicked == "view") {
      this.show = false;
    } else if (this.commonService.buttonClicked == "reset") {
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      this.show = false;
    }
  }

  public ColorButton = "Save";
  public DiscountButton = "Save";
  public SizeButton = "Save";
  public SaveSizeButton = "Save";
  public generatCodeButton = "Generat Bar Code";

  private save() {
    var button = this.commonService.buttonClicked;
    if (this.master.skuNumber == "" || this.master.skuNumber == null) {
      this.toastrService.danger("Please enter a product number", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.partslink == "" || this.master.partslink == null) {
      this.toastrService.danger("Please enter a partslink", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.skuName == "" || this.master.skuName == null) {
      this.toastrService.danger("Please enter a description", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.makeId == 0 || this.master.makeId == null) {
      this.toastrService.danger("Please select make.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.makeModelId == 0 || this.master.makeModelId == null) {
      this.toastrService.danger("Please select model.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.productCategoryId == 0 || this.master.productCategoryId == null) {
      this.toastrService.danger("Please select category.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    var categoryId = this.master.productCategoryId;
    this.show = true;
    this.productService.saveProduct(this.master).subscribe((returns: any) => {
      console.log(returns);
      this.master.productId = returns.productId;
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        }
        else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }

        //////////////Grid Refresh ///////////////////
        this.productService.getInvProductWiseSpecificationById(0, categoryId, '', '', '').subscribe((data: any) => {
          if (data.success) {
            this.rowData = data.data;
          }
        });
        //////////////Grid Refresh ///////////////////
      }

    });
  }

  private addColor() {
    var button = this.commonService.buttonClicked;
    var NewColor: any = [];
    for (let i = 0; i < this.colorModel.length; i++) {
      if (this.colorModel[i].Active == true) {
        NewColor.push(this.colorModel[i])
      }
    }
    var productId = this.master.productId;
    // this.productService.saveProductColor(NewColor, productId).subscribe((returns: any) => {
    //   if (returns.success) {
    //     if (button == "update") {
    //       this.toastrService.success(this.commonService.updatedmsg, "Message");
    //     }
    //     else {
    //       this.toastrService.success(this.commonService.successmsg, "Message");
    //     }
    //   }
    // });
  }

  private SaveOtherSpecification() {
    var button = this.commonService.buttonClicked;
    var productId = this.master.productId;
    this.productService.saveProductSpecification(this.master.Specificationdetail, productId).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
          this.clearSpecificationDetails();
          this.getSpecificationDetailsInUpdate();
        }
        else {
          this.toastrService.success(this.commonService.successmsg, "Message");
          this.clearSpecificationDetails();
          this.getSpecificationDetailsInUpdate();

        }
      }
    });
  }

  private addSize() {
    var button = this.commonService.buttonClicked;
    var NewSize: any = [];
    for (let i = 0; i < this.sizeModel.length; i++) {
      if (this.sizeModel[i].Active == true) {
        NewSize.push(this.sizeModel[i])
      }
    }
    var productId = this.master.productId;
    this.productService.saveProductSize(NewSize, productId).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        }
        else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
      }
    });
  }

  private addPricing() {
    var button = this.commonService.buttonClicked;
    var productId = this.master.productId;
    this.productService.saveProductPricing(this.BarCodeModel, productId).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        }
        else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
      }
    });
  }

  private reset() {
    this.getMaster();
  }
  public getDiscountDetails() {
    this.Discountdetail = {
      discountTypeId: 0,
      discountTypeIdSelected: {},
      toDate: '',
      fromDate: '',
      isAmount: false,
      discountAmountOrPercentage: '',
      discountId: 0,
      discountTypeName: ''
    };
  }

  public getMaster() {
    this.master = {
      productId: 0,
      productWiseSpecificationId: 0,
      productCode: "",
      productName: "",
      width: 0,
      height: 0,
      weight: 0,
      isQCRequired: false,
      hsCODE: "",
      description: "",
      warrantyDuration: 0,
      notificationDay: 0,
      productTypeId: null,
      productTypeSelected: null,
      productCategoryId: null,
      productCategorySelected: null,
      productSubCategoryId: null,
      productSubCategorySelected: null,
      modelId: null,
      modelSelected: null,
      brandId: null,
      brandSelected: null,
      uomId: null,
      uomSelected: null,
      originCountryId: null,
      originCountrySelected: null,
      gradeId: null,
      gradeSelected: null,
      companyId: 1,
      companySelected: null,
      isActive: true,
      Active: true,
      Default: true,
      Specificationdetail: [],
      expiryDate: null,

      // Partslink fields
        skuNumber: "",
        skuName: "",
        partslink: "",
        location: "",
        qtyonHand: 0,
        uom: "",
        listPrice: 0,
        costPrice: 0,
        salesPrice: 0,
        fromYear: 0,
        toYear: 0,
        make: "",
        model: "",
        category: "",
        subCategory: "",
        oem: "",
        interchange: "",
        patent: "",
        side: "",
        position: "",
        material: "",
        colorOrFinish: "",
        certification: "",
        status: "",
        barcodeOrQR: "",
        productWeight: 0,
        productWeight_UOM: "",
        productWidth: "",
        productHeight: "",
        productLength: "",
        productSizeUOM: "",
        productActive: "",
        productTaxable: "",
        isWebsiteActive: false,
        isReturnable: false,
        warrantyDays: 0,
        lastReceivedDate: null,
        lastSoldDate: null,
        primaryVendor: "",
        vendorType: "",
        submodelOrTrim: "",
        bodyStyle: "",
        engineSize: "",
        warehouse: "",
        zone: "",
        aisle: "",
        rack: "",
        shelf: "",
        bin: "",
        pickLocationOrZone: "",
        bulkLocationOrZone: "",
        qtyReserved: 0,
        qtyDamagedHold: 0,
        qtyReceivingHold: 0,
        qtyReturnIntake: 0,
        qtyVendorReturn: 0,
        qtyScrap: 0,
        previousCountdays: 0,
        spotCountDate: null,
        currentCountDays: 0,
        cycleCountFrequency: 0,
        abc_Class: "",
        leadTimeDays: 0,
        safetyStock: 0,
        minStock: 0,
        maxStock: 0,
        suggestedReorderQty: 0,
        vendorName: "",
        defaultVendor: "",
        vendorPartNumber: "",
        cost: 0,
        vendorUOM: "",
        assetAccount: "",
        cogsAccount: "",
        adjustmentAccount: "",
        scrapAccount: "",
        varianceAccount: "",
        incomeAccount: "",
        upc: "",
        partTypeID: "",
        batchNumber: "",
        notes: "",
        makeId: 0,
        makeSelected: null,
        makeModelId: 0,
        makeModelSelected: null,

        search_productCategoryId: 0,
        search_productCategorySelected: null,
        search_skuNumber: "",
        search_partslink: "",
        search_interchange: ""

    };
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

  public productCategoryList = [];
  public productSubCategoryList = [];
  public productTypeList = [];
  public productGradeList = [];
  public productModelList = [];
  public productBrandList = [];
  public productUOMList = [];
  public OriginCountryList = [];
  public companyList = [];
  public colorModel = [];
  public sizeModel = [];
  public BarCodeModel = [];
  public SpecificationModel = [];
  public DiscountDetailsmodel = [];
  public makeList = [];
  public makeModelList = [];

  public getProductCategory() {
    this.productService.getProductCategory().subscribe((retuns: any) => {
      if (retuns.success) {
        this.productCategoryList = retuns.data.map((val: any) => ({
          id: val.productCategoryId,
          name: val.categoryName,
        }))
      }
    })
  }

  public getProductSubCategory() {
    this.productService.getProductSubCategory().subscribe((retuns: any) => {
      if (retuns.success) {
        this.productSubCategoryList = retuns.data.map((val: any) => ({
          id: val.productSubCategoryId,
          name: val.subCategoryName,
        }))
      }
    })
  }
  public getProductSubCategorybyCatId() {
    this.productService.getProductSubCategorybyId(this.master.productCategoryId, 0).subscribe((retuns: any) => {
      if (retuns.success) {
        this.productSubCategoryList = retuns.data.map((val: any) => ({
          id: val.productSubCategoryId,
          name: val.subCategoryName,
        }))
      }
    })
  }

  public getMakeById() {
    this.productService.getMakeById().subscribe((retuns: any) => {
      if (retuns.success) {
        this.makeList = retuns.data.map((val: any) => ({
          id: val.makeId,
          name: val.makeName,
        }))
      }
    })
  }
  public getMakeModelByMakeId() {
    this.productService.getMakeModelByMakeId(this.master.makeId, 0).subscribe((retuns: any) => {
      if (retuns.success) {
        this.makeModelList = retuns.data.map((val: any) => ({
          id: val.makeModelId,
          name: val.makeModelName,
        }))
      }
    })
  }

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

  public getProductGrade() {
    this.productService.getProductGrade().subscribe((retuns: any) => {
      if (retuns.success) {
        this.productGradeList = retuns.data.map((val: any) => ({
          id: val.gradeId,
          name: val.gradeName,
        }))
      }
    })
  }

  public getProductModel() {
    this.productService.getProductModel().subscribe((retuns: any) => {
      if (retuns.success) {
        this.productModelList = retuns.data.map((val: any) => ({
          id: val.modelId,
          name: val.modelName,
        }))
      }
    })
  }

  public getProductBrand() {
    this.productService.getProductBrand().subscribe((retuns: any) => {
      if (retuns.success) {
        this.productBrandList = retuns.data.map((val: any) => ({
          id: val.brandId,
          name: val.brandName,
        }))
      }
    })
  }

  public getProductUOM() {
    this.productService.getProductUOM().subscribe((retuns: any) => {
      if (retuns.success) {
        this.productUOMList = retuns.data.map((val: any) => ({
          id: val.uomId,
          name: val.uomName,
        }))
      }
    })
  }

  public getOriginCountry() {
    this.productService.getProductOriginCountry().subscribe((retuns: any) => {
      if (retuns.success) {
        this.OriginCountryList = retuns.data.map((val: any) => ({
          id: val.countryId,
          name: val.countryName,
        }))
      }
    })
  }

  public getCompany() {
    this.comboService.getCompany().subscribe((returns: any) => {
      this.companyList = returns.data.map((val: any) => ({
        id: val.companyId,
        name: val.companyName,
      }));
    });
  }

  public getProduct() {
      const fields = [
        this.master.search_productCategoryId,
        this.master.search_skuNumber,
        this.master.search_partslink,
        this.master.search_interchange
      ];

      const filledFields = fields.filter(x =>
        x !== null &&
        x !== undefined &&
        x !== "" &&
        x !== 0
      ).length;

      if (filledFields == 0) { 
        this.toastrService.danger( "Please input only one search criteria.","Message");
        return false;
      }

     this.productService.getInvProductWiseSpecificationById(0, this.master.search_productCategoryId, this.master.search_skuNumber, this.master.search_partslink, this.master.search_interchange).subscribe((data: any) => {
          if (data.success) {
            this.rowData = data.data;
          }
        });
  }

  // public getcolorInUpdate() {
  //   this.colorModel = [];
  //   this.productService.getcolorInUpdate(this.master.productId).subscribe((data: any) => {
  //     if (data.success) {
  //       this.colorModel = [];
  //       this.colorModel = data.data;
  //     }
  //   });
  // }

  public getSpecificationDetailsInUpdate() {
    var hide = true;
    var skuNumberhiden = "";
    this.master.Specificationdetail = [];
    this.productService.getSpecificationDetailsInUpdate(this.master.productId).subscribe((data: any) => {
      this.master.Specificationdetail = [];
      if (data.success) {
        var specdata = data.data;
        this.master.Specificationdetail.length == 0 ? (this.master.Specificationdetail = specdata) : (specdata.forEach(element => { this.master.Specificationdetail.push(element); }));

        // specdata.forEach(element => {
        //   this.master.Specificationdetail.push(element);
        // })


        /* 
        ////commented by mostafa 10-Jul-2021

        var specdata = data.data;
        //console.log(specdata);
        
        this.Specificationindex = 0;
        specdata.map(item => {
          if (item.skuNumber != skuNumberhiden) {
            hide = false;
          }
          else {
            hide = true;
          }
          // if (this.Specificationindex > 0) {
          //hide = true;
          //}
          this.master.Specificationdetail.push({
            productCategorySpecificationId: item.productCategorySpecificationId,
            productId: this.master.productId,
            specificationType: item.specificationType,
            value: item.value,
            skuName: item.skuName,
            skuNumber: item.skuNumber,
            productWiseSpecificationId: item.productWiseSpecificationId,
            specificationDetailsId: item.specificationDetailsId,
            hide: hide,
            imageFile: item.imageFile,
            imageUrl: item.imageUrl,
          });
          this.Specificationindex++;
          skuNumberhiden = item.skuNumber;
        });
        //console.log(this.master.Specificationdetail);
        */
      }
    });
  }


  public getSupplierInUpdate() {
    this.productService.getProductsupplierInUpdate(this.master.productId).subscribe((data: any) => {
      if (data.success) {
        this.lstdetailmodel = data.data;
        //this.getSupplier();

        this.lstdetailmodel.map((detail) => {
          return (detail.supplierSelected = {
            id: detail.supplierId,
            name: detail.supplierName,
          });
        });

      }
    });

  }

  public getcolor() {
    this.productService.getcolor().subscribe((data: any) => {
      if (data.success) {
        this.colorModel = data.data;
      }
    });
  }

  public skuNumber = "";
  public Specificationindex = 0;
  public getproductSpecification() {
    debugger;
    this.SpecificationModel = [];
    var hide = false;
    this.productService.getproductSpecification(this.master.productCategoryId, this.master.productId, this.skuNumber).subscribe((data: any) => {
      if (data.success) {
        var specdata = data.data;

        for (let index = 0; index < specdata.length; index++) {
          specdata[index].productId = this.master.productId;
        }

        if (this.master.Specificationdetail.length == 0) {
          this.master.Specificationdetail = specdata;
          this.skuNumber = specdata[0].skuNumber;
        }
        else {
          specdata.forEach(element => {
            this.master.Specificationdetail.push(element);
            this.skuNumber = element.skuNumber;
          });
        }

        // //debugger;
        // specdata.forEach(element => {
        //   this.master.Specificationdetail.push(element);
        // })


        // this.skuNumber = data.skuNumber;
        // this.Specificationindex = 0;

        // specdata.map(item => {
        //   if (this.Specificationindex > 0) {
        //     hide = true;
        //   }

        //   this.master.Specificationdetail.push({
        //     productCategorySpecificationId: item.productCategorySpecificationId
        //     , productId: this.master.productId, specificationType: item.specificationType, value: item.value, skuName: item.skuName,
        //     skuNumber: this.skuNumber, hide: hide
        //   });
        //   this.Specificationindex++;
        // });
      }
    });
  }
  //public Specificationdetail = [];
  public addSpecificationDetails() {
    this.getproductSpecification();
  }

  public clearSpecificationDetails() {
    this.master.Specificationdetail = [];
    this.skuNumber = "";
  }

  public getSize() {
    this.productService.getSize().subscribe((data: any) => {
      if (data.success) {
        this.sizeModel = data.data;
      }
    });
  }

  public getSizeInUpdate() {
    this.productService.getSizeInUpdate(this.master.productId).subscribe((data: any) => {
      if (data.success) {
        this.sizeModel = data.data;
      }
    });
  }

  private generatBarcode() {
    this.productService.getBarCode(this.master.productId).subscribe((data: any) => {
      if (data.success) {
        this.BarCodeModel = data.data;
      }
    });
  }

  private getBarcode() {
    this.productService.getBarCodeInUpdate(this.master.productId).subscribe((data: any) => {
      if (data.success) {
        this.BarCodeModel = data.data;
      }
    });
  }

  public supplierList = [];
  public getSupplier() {
    this.productService.getProductsupplier().subscribe((retuns: any) => {
      if (retuns.success) {
        this.supplierList = retuns.data.map((val: any) => ({
          id: val.supplierId,
          name: val.supplierName,
        }))
      }
    })
  }

  public lstdetailmodel = [];
  public addDetails() {
    //this.getSupplier();
    var ind = 0;
    if (this.lstdetailmodel.length > 0) {
      ind = this.lstdetailmodel.length + 1;
    }
    let detail = {
      index: ind,
      helpDetailId: 0,
      supplierId: "",
      supplierSelected: {},
      supplierAddress: "",
      supplierContact: "",
      supplierEmail: "",
      dropdown: this.supplierList,
    };
    this.lstdetailmodel.push(detail);
    //this.toastrService.success(this.commonService.successmsg, "Message");
  }

  public deleteDetail(index: any) {
    this.selectedRow = this.lstdetailmodel[index];
    this.lstdetailmodel.splice(index, 1);
    if (this.selectedRow.helpDetailId > 0) {
    }
    this.toastrService.danger(this.commonService.deletedmsg, "Message");
  }

  public refesh() {
    this.lstdetailmodel = [];
    this.toastrService.warning(this.commonService.warningmsg, "Message");
  }

  public productDiscountList = [];
  public getDiscoutType() {
    this.productService.getDiscoutType().subscribe((retuns: any) => {
      if (retuns.success) {
        this.productDiscountList = retuns.data.map((val: any) => ({
          id: val.discountTypeId,
          name: val.discountTypeName,
        }))
      }
    })
  }

  public Discountdetail = {
    discountTypeId: 0,
    discountTypeIdSelected: {},
    toDate: '',
    fromDate: '',
    isAmount: false,
    discountAmountOrPercentage: '',
    discountId: 0,
    discountTypeName: ''
  };

  public editdiscount(index: any) {

    this.selectedRow = this.DiscountDetailsmodel[index];
    this.Discountdetail.discountTypeId = this.selectedRow.discountTypeId;
    this.Discountdetail.discountTypeName = this.selectedRow.discountTypeName;
    this.Discountdetail.fromDate = this.selectedRow.fromDate;
    this.Discountdetail.toDate = this.selectedRow.toDate;
    this.Discountdetail.isAmount = this.selectedRow.isAmount;
    this.Discountdetail.discountId = this.selectedRow.discountId;
    this.Discountdetail.discountAmountOrPercentage = this.selectedRow.discountAmountOrPercentage;
    this.Discountdetail.discountTypeIdSelected = {
      id: this.Discountdetail.discountTypeId,
      name: this.selectedRow.discountTypeName,
    };
  }

  public ClearDiscount() {
    this.Discountdetail.discountTypeId = 0;
    this.Discountdetail.discountTypeIdSelected = {},
      this.Discountdetail.toDate = '',
      this.Discountdetail.fromDate = '',
      this.Discountdetail.isAmount = false,
      this.Discountdetail.discountAmountOrPercentage = '',
      this.Discountdetail.discountId = 0
  }

  private addDiscount() {
    var button = this.commonService.buttonClicked;
    var productId = this.master.productId;
    this.productService.saveProductDiscount(this.Discountdetail, productId).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
          this.getDiscountList();
        }
        else {
          this.toastrService.success(this.commonService.successmsg, "Message");
          this.getDiscountList();
        }
      }
    });
  }


  public getSupplierIdWise(supplierId: number, index: any) {
    this.selectedRow = this.lstdetailmodel[index];
    this.productService.getSupplierIdWise(supplierId).subscribe((retuns: any) => {
      if (retuns.success) {
        this.lstdetailmodel[index] = retuns.data[0];
        this.lstdetailmodel[index].supplierSelected = {
          id: retuns.data[0].supplierId,
          name: retuns.data[0].supplierName,
        };
        console.log(this.lstdetailmodel);
      }
    })
  }

  public onOptionsSelected(supplierId, index: any) {
    this.selectedRow = this.lstdetailmodel[index];
    this.getSupplierIdWise(supplierId, index);
  }

  public getDiscountList() {
    this.DiscountDetailsmodel = [];
    this.productService.getDiscountList(this.master.productId).subscribe((data: any) => {
      if (data.success) {
        this.DiscountDetailsmodel = data.data;
      }
    });
  }

  private DeleteDiscount(index: any) {
    this.selectedRow = this.DiscountDetailsmodel[index];
    this.Discountdetail.discountId = this.selectedRow.discountId;
    this.Discountdetail.discountTypeId = this.selectedRow.discountTypeId;
    this.Discountdetail.fromDate = this.selectedRow.fromDate;
    this.Discountdetail.toDate = this.selectedRow.toDate;
    this.Discountdetail.isAmount = this.selectedRow.isAmount;
    this.Discountdetail.discountId = this.selectedRow.discountId;
    this.Discountdetail.discountAmountOrPercentage = this.selectedRow.discountAmountOrPercentage;
    this.productService.deleteDiscount(this.Discountdetail).subscribe((returns: any) => {
      if (returns.success) {
        this.toastrService.success(this.commonService.deletedmsg, "Message");
        this.getDiscountList();
      }
    });
  }

  private SaveSupplier() {
    var button = this.commonService.buttonClicked;
    var productId = this.master.productId;
    this.productService.saveProductSupplier(this.lstdetailmodel, productId).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        }
        else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
      }
    });
  }

  //Start Upload File

  public imagePath: any;
  public uploadFileDetail(file, index) {
    //debugger;
    if (file.length === 0) return;
    const mimeType = file[0].type;
    if (mimeType.match(/image\/*/) == null) {
      //this.master.Specificationdetail[index].imageFile = null;
      //this.master.Specificationdetail[index].imageUrl = null;
      this.toastrService.warning("Please choose a image.", "Warning")
      return;
    }

    //if file change
    this.master.Specificationdetail[index].imageUrl = null;
    //
    const reader = new FileReader();
    this.imagePath = file;
    reader.readAsDataURL(file[0]);
    reader.onload = (_event) => {
      //this.url = reader.result;
      this.master.Specificationdetail[index].imageFile = reader.result;//file[0];
      //this.master.Specificationdetail[index].imageUrl = reader.result;
      console.log(this.master.Specificationdetail);
    };

    // console.log("file", file);
    // for (let i = 0; i < file.length; i++) {
    //   this.formData.append("file", file[i], file[i]["name"]);
    // }
  }

  image64: string;
  getProductImage(filePath: any) {
    // this.productService.getProductImage(filePath).subscribe((returns: any) => {
    //   if (returns.success) {
    //     this.image64 = returns.data[0].ImageFile;
    //     console.log("img" + this.image64);
    //     //return this.image64;
    //   }
    // });
  };


  //End
}

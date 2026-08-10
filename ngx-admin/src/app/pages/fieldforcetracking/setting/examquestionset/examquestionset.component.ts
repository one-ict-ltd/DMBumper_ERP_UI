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
import { analyzeAndValidateNgModules } from "@angular/compiler";
import { FieldforcemasterService } from "app/services/fieldforcetracking/fieldforcemaster.service";
import { formatDate } from "@angular/common";
import { take } from "rxjs/operators";

@Component({
  selector: 'ngx-examquestionset',
  templateUrl: './examquestionset.component.html',
  styleUrls: ['./examquestionset.component.scss']
})
export class ExamquestionsetComponent implements OnInit {

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
    isActive: false;
    Active: false;
    Default: false;
    Specificationdetail: any[];
    expiryDate: Date;
    startTime: string;
    lastSubmitDate:Date;
    endTime: string;
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
  timeList: any[]=[];

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
    private fieldforcemasterService: FieldforcemasterService,
    private productService: ProductService) {

    //this.getProductCategory();
    //this.getProductSubCategory();
    //this.getProductType();
    //this.getProductGrade();
    //this.getProductModel();
    //this.getProductBrand();
    //this.getProductUOM();
    //this.getOriginCountry();
    //this.getCompany();
    //this.getcolor();
    //this.getSize();
    this.getExamContent();
    this.getTimeList();

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
        headerName: "Exam Name",
        field: "name",
        filter: "agTextColumnFilter",
        editable: false,
        width: 140,
      },
      {
        headerName: "Exam Date",
        field: "date",
        filter: "agTextColumnFilter",
        valueFormatter: (params) =>
          formatDate(params.data.date,'dd-MM-yyyy','en'),
        editable: false,
        width: 250,
      },
      {
        headerName: "Exam Duration(m)",
        field: "time",
        filter: "agTextColumnFilter",
        editable: false,
        width: 200,
      },
      {
        headerName: "Total Marks",
        field: "totalMarks",
        filter: "agTextColumnFilter",
        editable: false,
        width: 200,
      },
      {
        headerName: "Exam Content",
        field: "ContentName",
        filter: "agTextColumnFilter",
        editable: false,
        width: 200,
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
      this.agDelete(event);
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }

  private selectedRows = [];
  private agEdit(event) {
    this.disabled = false;

    this.selectedRows.push(event.node.data);
    this.selectedRow = event.node.data;
    var productId = event.node.data.CmnExamID;

    this.fieldforcemasterService.getExamById(productId).subscribe((data: any) => {
      if (data.success) {
        this.master = data.data[0];
        this.master.productCode = data.data[0].name;
        this.master.productName = data.data[0].time;
        this.master.productTypeId = data.data[0].CmnExamContentId;
        this.master.width = data.data[0].totalMarks;
        this.master.expiryDate = new Date(data.data[0].date);
        this.master.lastSubmitDate =new Date(data.data[0].lastSubmitDate);
        this.master.isActive = data.data[0].IsActive;
        this.master.productId = data.data[0].CmnExamID;
        this.master.startTime = formatDate(data.data[0].date,'HH:mm','en');
        this.master.endTime = formatDate(data.data[0].lastSubmitDate,'HH:mm','en');
        this.getExamContent();

        this.master.productTypeSelected = {
          id: data.data[0].CmnExamContentId,
          name: data.data[0].ContentName,
        };

        this.fieldforcemasterService.getExamQuestionByexamId(productId).subscribe((data: any) => {
          if (data.success) {
            console.log(data.data);
            this.master.Specificationdetail = data.data;
          }
        });
      }
    });
    this.ngOnInit();
  }
  private agReport(event) {
    this.toastrService.info("Print button clicked", "Message");
  }

  private agDelete(event) {
    this.master.productId = event.node.data.productId;

    this.productService.deleteProduct(this.master).subscribe((returns: any) => {
      if (returns.success) {
        this.toastrService.success(this.commonService.deletedmsg, "Message");

        //////////////Grid Refresh ///////////////////
        this.productService.getProduct().subscribe((data: any) => {
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
    this.fieldforcemasterService.getExamByContentId(0).subscribe((data: any) => {
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

  public pageNavigation = "Exam Create";
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
    const startDate = formatDate(this.master.expiryDate,'yyyy-MM-dd','en');
    const endDate = formatDate(this.master.lastSubmitDate,'yyyy-MM-dd','en');
    this.master.expiryDate = new Date(startDate + 'T06:00:00');
    this.master.lastSubmitDate = new Date(endDate + 'T06:00:00');
    if (this.master.productCode == "" || this.master.productCode == null) {
      this.toastrService.danger("Please enter a exam name", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.productName == "" || this.master.productName == null) {
      this.toastrService.danger("Please enter a exam time", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.productTypeId == 0 || this.master.productTypeId == null) {
      this.toastrService.danger("Please select Content.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.width == 0 || this.master.width == null) {
      this.toastrService.danger("Please select Total Marks.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.Specificationdetail.length == 0 || this.master.Specificationdetail == null) {
      this.toastrService.danger("Please entry Question.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if(new Date(startDate + 'T' + this.master.startTime +':00') > new Date(endDate + 'T' + this.master.endTime +':00')) {
      this.toastrService.danger("Start Time is greater than End Time.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    this.show = true;
    console.log(this.master);
    this.fieldforcemasterService.SaveExamQuestionSet(this.master).subscribe((returns: any) => {
      //console.log(returns);
      this.master.productId = returns.productId;
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        }
        else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }

        //////////////Grid Refresh ///////////////////
        this.getMaster();
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
      companyId: null,
      companySelected: null,
      isActive: false,
      Active: false,
      Default: false,
      Specificationdetail: [],
      expiryDate: null,
      startTime: '',
      lastSubmitDate: null,
      endTime: '',
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
  public contentList = [];
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

  public getExamContent() {
    this.fieldforcemasterService.getExamContent().subscribe((retuns: any) => {
      if (retuns.success) {
        this.contentList = retuns.data.map((val: any) => ({
          id: val.CmnExamContentID,
          name: val.ContentName,
        }))
      }
    })
  }

  public getTimeList() {
   const tpList = [];
   this.timeArray.forEach((val,i)=>{
    const obj ={
      id: val,
      name: val
    };
    tpList.push(obj);
   });
   this.timeList = tpList;
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
      this.companyList = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
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
        this.getSupplier();

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
    this.SpecificationModel = [];
    var hide = false;

    let question = [
      { skuName: "", Specificationindex: this.Specificationindex, skuNumber: "", isHide: 0, rowMerge: 4, specificationType: "", value: 0, },
      { skuName: "", Specificationindex: this.Specificationindex, skuNumber: "", isHide: 1, rowMerge: 0, specificationType: "", value: 0, },
      { skuName: "", Specificationindex: this.Specificationindex, skuNumber: "", isHide: 1, rowMerge: 0, specificationType: "", value: 0, },
      { skuName: "", Specificationindex: this.Specificationindex, skuNumber: "", isHide: 1, rowMerge: 0, specificationType: "", value: 0, },
    ];
    question.forEach(element => {
      this.master.Specificationdetail.push(element);
    });
    this.Specificationindex = this.Specificationindex - 1;

  }
  //public Specificationdetail = [];
  public addSpecificationDetails() {
    this.getproductSpecification();
  }

  public deleteDetails(index: any) {

    this.master.Specificationdetail = this.master.Specificationdetail.filter((item) => item.Specificationindex !== index)
    this.toastrService.danger(this.commonService.deletedmsg, "Message");
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
    this.getSupplier();
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


  public getSupplierIdWise(supplierId, index: any) {
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

  timeArray = [
    '00:00',
    '00:15',
    '00:30',
    '00:45',
    '01:00',
    '01:15',
    '01:30',
    '01:45',
    '02:00',
    '02:15',
    '02:30',
    '02:45',
    '03:00',
    '03:15',
    '03:30',
    '03:45',
    '04:00',
    '04:15',
    '04:30',
    '04:45',
    '05:00',
    '05:15',
    '05:30',
    '05:45',
    '06:00',
    '06:15',
    '06:30',
    '06:45',
    '07:00',
    '07:15',
    '07:30',
    '07:45',
    '08:00',
    '08:15',
    '08:30',
    '08:45',
    '09:00',
    '09:15',
    '09:30',
    '09:45',
    '10:00',
    '10:15',
    '10:30',
    '10:45',
    '11:00',
    '11:15',
    '11:30',
    '11:45',
    '12:00',
    '12:15',
    '12:30',
    '12:45',
    '13:00',
    '13:15',
    '13:30',
    '13:45',
    '14:00',
    '14:15',
    '14:30',
    '14:45',
    '15:00',
    '15:15',
    '15:30',
    '15:45',
    '16:00',
    '16:15',
    '16:30',
    '16:45',
    '17:00',
    '17:15',
    '17:30',
    '17:45',
    '18:00',
    '18:15',
    '18:30',
    '18:45',
    '19:00',
    '19:15',
    '19:30',
    '19:45',
    '20:00',
    '20:15',
    '20:30',
    '20:45',
    '21:00',
    '21:15',
    '21:30',
    '21:45',
    '22:00',
    '22:15',
    '22:30',
    '22:45',
    '23:00',
    '23:15',
    '23:30',
    '23:45'
  ]
}

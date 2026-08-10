import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup } from "@angular/forms";
import {
  NbComponentStatus,
  NbDateService,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
import * as XLSX from 'xlsx';
import { colorSets } from "@swimlane/ngx-charts";
import { HttpClient } from "@angular/common/http";
type AOA = any[][];

@Component({
  selector: 'ngx-promo-requisition-file-upload',
  templateUrl: './promo-requisition-file-upload.component.html',
  styleUrls: ['./promo-requisition-file-upload.component.scss']
})
export class PromoRequisitionFileUploadComponent implements OnInit {
  allStatusOk: boolean = false;
  @ViewChild('fileInput') fileInput: ElementRef;

  errorInFile: string = '';
  hasErrorInFile: boolean = false;

  serverDate: any[];
  constructor(
    private commonService: CommonService,
    private toastrService: NbToastrService,
    protected dateService: NbDateService<Date>,
    private cd: ChangeDetectorRef,
    private http: HttpClient

  ) {
    this.commonService.valueSet("showlist");
    this.frameworkComponents = {
      btnCellRenderer: BtnCellRenderer,
    };
    this.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: true,
    };
    this.getMaster();
  }
  master: {
    prodTrnfrId: number;
    prodTrnNo: string;
    productReqId: number;
    prodReqNo: string;
    program: string;
    allocationTypeId: string;
    prodTrnDate: Date;
    fromWarehouseId: string;
    toWarehouseId: string;
    fromsbuId: number;
    tosbuId: number;
    purpose: string;
    isUrgency: number;
    approvalStatus: number;
    productWiseSpecificationId: number;
    PurchaseReqDetailsId: number;
    prodReqId: number;
    prodName: string;
    productName: string;
    uomName: string;
    fromSbuName: string;
    tosbuName: string;
    transferType: string;
    isDelete: number;
    isActive: number;
    reqQty: number;
    productReqNoSelected: {};
    productSelected: [];
    fromStoreSlected: {};
    storeId: number;
    fromsbusSelected: {};
    tosbusSelected: {};
    toStorselected: {};
    storeSelected: [];
    allocationTypeSelected: {};
    companyId: number;
    lstDetailsViewModel: any[];
  };


  protected options: {};
  //protected cd: ChangeDetectorRef;
  showMessages: any = {};
  errors: string[];
  spinner: boolean = false;

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

  show: boolean = true;
  vlucherForm: FormGroup;
  submitted: boolean;
  saveupdate: string = "Save";
  gridbutton: string = "";
  name: string;
  description: string;
  selectedRow: any;
  id: string;
  apiUrl: string;

  ngOnInit() {
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }
  public pageNavigation = "Upload Promo Requisition file";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "view") {
      this.show = false;
    } else if (this.commonService.buttonClicked == "reset") {
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      this.show = false;
    }
  }
  public getMaster() {
    this.master = {
      prodTrnfrId: 0,
      prodTrnNo: "",
      productReqId: 0,
      program: "",
      allocationTypeId: "T",
      prodTrnDate: new Date(),
      fromWarehouseId: "",
      toWarehouseId: "",
      purpose: "",
      isUrgency: 0,
      approvalStatus: 0,
      productWiseSpecificationId: 0,
      PurchaseReqDetailsId: 0,
      prodReqId: 0,
      prodReqNo: "",
      prodName: "",
      reqQty: 0,
      productName: "",
      uomName: "",
      fromSbuName: "",
      transferType: "F2D",
      tosbuName: "",
      isDelete: 0,
      isActive: 1,

      productReqNoSelected: null,
      productSelected: null,
      fromStoreSlected: null,
      storeId: 0,
      toStorselected: null,
      fromsbusSelected: null,
      tosbusSelected: null,
      allocationTypeSelected: null,

      fromsbuId: 0,
      tosbuId: 0,
      lstDetailsViewModel: [],

      storeSelected: null,
      companyId: 0,
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
    } else {
    }
  }

  private reset() {
    this.getMaster();
  }


  onRefesh() {
    this.selectedRow = "";
    this.ngOnInit();
    this.toastrService.warning("warning", this.commonService.warningmsg);
  }




  private gridApi;
  private gridColumnApi;

  public modules: Module[] = AllCommunityModules;
  public columnDefs;
  public defaultColDef;
  public rowData: [];
  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };

  getSelectedRowData() {
    let selectedNodes = this.gridApi.getSelectedNodes();
    let selectedData = selectedNodes.map((node) => node.data);
    alert(`${JSON.stringify(selectedData)}`);
    this.name = selectedData[0].currencyName;
    return selectedData;
  }

  private selectedRows = [];
  public onRowClicked(event) {
    this.selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked;
    if (data == "edit") {
      let receiveStatus = event.node.data.receiveStatus;
      if (receiveStatus && receiveStatus == "Received") {
        this.toastrService.info("Already Received! You can not Edit!", 'Info')
        return;
      }
    }
  }


  public refesh() {
    this.master.lstDetailsViewModel = [];
    this.toastrService.warning(this.commonService.warningmsg, "Message");
  }
  datalength: number;
  headerData = [];
  bodyData = [];
  params = [];
  data: AOA = [[1, 2], [3, 4]];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'UploadFile.xlsx';
  BatchWiseStock: any = [];
  onFileChange(evt: any) {
    debugger
    this.hasErrorInFile = false;
    this.errorInFile = '';
    this.spinner = true;
    const target: DataTransfer = <DataTransfer>(evt.target);

    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();

    reader.onload = async (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      console.log("ExcelData:", this.data);
      const product = this.data[0].slice(1);


      for (let i = 0; i < product.length; i++) {
        for (let j = i + 1; j < product.length; j++) {
          if (product[i] === product[j]) {
            this.hasErrorInFile = true;
            this.errorInFile += `Duplicate product found: ${product[j]}`
            this.spinner = false;
            this.fileInput.nativeElement.value = null;
            return;
          }
        }
      }
      const product2 = this.data[1].slice(1);
      //console.log(product);

      this.data.splice(0, 1);

      const tempDataHolder = [];
      const chunkSize = 1000;
      for (let start = 0; start < this.data.length; start += chunkSize) {
        const chunk = this.data.slice(start, start + chunkSize);
        chunk.forEach(e => {
          let obj: any = {};
          for (let k = 0; k < product.length; k++) {
            const quantity = e[k + 1];
            if (!isNaN(quantity) && parseFloat(quantity) !== 0 && quantity !== '') {
              obj = {
                depotCode: '',
                territoryCode: e[0].trim(),
                productCode: product[k],
                quantity: quantity,
                status: ''
              };
              tempDataHolder.push(obj);
            }
          }
        });
      }

      this.master.lstDetailsViewModel = tempDataHolder;
      this.totalData = tempDataHolder.length;
      this.spinner = false;
    };

    reader.readAsBinaryString(target.files[0]);
    this.GetAllTerritories();
    this.GetAllProductCodes();
  }



  totalData = 0;
  verifyStatus = "Not verified";
  territoryCodeValid: boolean = false;
  areaManagerCodeValid: boolean = false;
  productCodeValid: boolean = false;
  allTerritories: any = [];
  allAreaManagerCode: any = [];
  allRSMCode: any = [];
  validRowCounter: number = 0;
  public VerifyData() {
    debugger;
    this.territoryCodeValid = false;
    this.areaManagerCodeValid = false;
    this.productCodeValid = false;
    this.spinner = true;
    this.cd.detectChanges();

    setTimeout(() => {
      if (this.master.lstDetailsViewModel.length === 0) {
        this.toastrService.warning("No data found for verification!", "Message");
        this.spinner = false;
        this.cd.detectChanges(); // Trigger change detection
        return false;
      }

      let territoryCode = '';
      this.master.lstDetailsViewModel.forEach(el => {
        if (this.master.allocationTypeId == 'T') {
          this.territoryCodeValid = this.isTerritoryCodeValid(el.territoryCode);
          this.areaManagerCodeValid = true;
        }
        if (this.master.allocationTypeId == 'A') {
          this.areaManagerCodeValid = this.isValidAreaManagerCode(el.territoryCode);
          this.territoryCodeValid = true;
        }
        if (this.master.allocationTypeId == 'R') {
          this.areaManagerCodeValid = this.isValidRsmCode(el.territoryCode);
          this.territoryCodeValid = true;
        }
        //let territoryCodeValid = this.isTerritoryCodeValid(el.territoryCode);
        this.productCodeValid = this.isProductCodeValid(el.productCode);
        if (this.master.allocationTypeId == 'T') {
          let depotCodes = this.allTerritories
            .filter(x => x.territoryCode === el.territoryCode)
            .map(x => x.depotCode);
          el.depotCode = depotCodes.length > 0 ? depotCodes[0] : null;
        }
        if (this.master.allocationTypeId == 'A') {
          let depotCodes = this.allAreaManagerCode
            .filter(x => x.areaCode === el.territoryCode)
            .map(x => x.depotCode);
          el.depotCode = depotCodes.length > 0 ? depotCodes[0] : null;
        }
        if (this.master.allocationTypeId == 'R') {
          let depotCodes = this.allRSMCode
            .filter(x => x.regionCode === el.territoryCode)
            .map(x => x.depotCode);
          el.depotCode = depotCodes.length > 0 ? depotCodes[0] : null;
        }


        if (this.territoryCodeValid && this.productCodeValid && this.areaManagerCodeValid) {
          el.status = 'Ok';
          this.validRowCounter++;
        } else if (!this.territoryCodeValid) {
          el.status = 'Invalid Territory Code';
        } else if (!this.productCodeValid) {
          el.status = 'Invalid Product Code';
        }
        else if (!this.areaManagerCodeValid) {
          el.status = 'Invalid Area Manager Code';
        }
      });

      this.allTerritories = [];
      this.productCodes = [];
      if (this.validRowCounter == this.master.lstDetailsViewModel.length) {
        this.verifyStatus = "Verified";
        this.allStatusOk = true;
        this.spinner = false;
        this.cd.detectChanges();
      }
      else {
        this.allStatusOk = false;
        this.spinner = false;
        this.cd.detectChanges();
      }

    }, 10)
  }

  private isTerritoryCodeValid(territoryCode: string): boolean {
    return this.allTerritories.some(element => element.territoryCode === territoryCode);
  }

  private isProductCodeValid(productCode: string): boolean {
    return this.productCodes.some(element => element.productCode === productCode);
  }

  private isValidAreaManagerCode(areaManagerCode: string): boolean {
    return this.allAreaManagerCode.some(element => element.areaCode.trim() === areaManagerCode.trim());
  }
  private isValidRsmCode(regionCode: string): boolean {
    return this.allRSMCode.some(element => element.regionCode.trim() === regionCode.trim());
  }




  private GetAllTerritories() {
    debugger
    let user = this.commonService.GetUserProfileJson();
    user[0].employeeid;
    this.apiUrl = `Promo/GetAllTerritoryCodes?userId=${user[0].employeeid}`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.allTerritories = returns.data;
      }
      else {

      }
    });
  }

  private GetAllAreaManagerCode() {
    debugger
    let user = this.commonService.GetUserProfileJson();
    user[0].employeeid;
    this.apiUrl = `Promo/GetAllAreaCodes`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.allAreaManagerCode = returns.data;
      }
      else {

      }
    });
  }
  private GetAllRSMCode() {
    debugger
    let user = this.commonService.GetUserProfileJson();
    user[0].employeeid;
    this.apiUrl = `Promo/GetAllRSMCode`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.allRSMCode = returns.data;
      }
      else {

      }
    });
  }




  productCodes: any[];
  private GetAllProductCodes() {
    debugger
    this.productCodes = [];
    let user = this.commonService.GetUserProfileJson();
    user[0].employeeid;
    this.apiUrl = `Promo/GetAllProductCodes?userId=${user[0].employeeid}`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.productCodes = returns.data;
      }
      else {

      }
    });
  }
  spinnerForSave: boolean = false;
  public UploadData() {
    debugger
    this.spinnerForSave = true;
    let user = this.commonService.GetUserProfileJson();
    this.apiUrl = `Promo/SetPromoRequisitionUpload`;



    this.commonService.postApiData(this.apiUrl, this.master).subscribe((returns: any) => {
      if (returns.success) {
        this.toastrService.success("Promo product requisition upload success!", "Message");
        this.spinnerForSave = false;
        this.master.lstDetailsViewModel = [];
        this.allStatusOk = false;
        this.clearFileInput();
      }
      else {
        this.toastrService.danger("Promo product requisition upload fail!", "Message");
      }
    });
  }
  private clearFileInput() {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
      this.master.lstDetailsViewModel = [];
      this.allStatusOk = false;
      this.verifyStatus = "Not verified";
      this.totalData = 0;
      this.spinner = false;
    }
  }
  allocationTypeList = [{ 'id': 'T', 'name': 'Territory' }, { 'id': 'A', 'name': 'Area Manager' }, { 'id': 'R', 'name': 'Regional Sales Manager(RSM)' }];

  setAllocationType(event: any) {
    debugger
    if (event == null || event == undefined) {
      this.master.allocationTypeId = "T";
    }
    else {
      this.master.allocationTypeId = event.id;
    }
    if (this.master.allocationTypeId == 'A') {
      this.GetAllAreaManagerCode();
    }
    if (this.master.allocationTypeId == 'R') {
      this.GetAllRSMCode();
    }

  }

}

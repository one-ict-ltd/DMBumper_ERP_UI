import { CommonService } from 'app/@core/mock/common.service';

import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";
import {
  NbComponentStatus,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";

import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { FormGroup } from "@angular/forms";
import { DatePipe } from "@angular/common";

import { MiscellaneousItemService } from 'app/services/sales/miscellaneous-item.service';
import { first } from 'rxjs/operators';
import { FieldforcemasterService } from 'app/services/fieldforcetracking/fieldforcemaster.service';
import { ProductrequisitionService } from 'app/pages/purchase/settings/productrequisition.service';
import { CommoncomboService } from 'app/services/commoncombo.service';
import { SalesreturnService } from 'app/services/sales/salesreturn.service';

@Component({
  selector: 'ngx-miscellaneous-item-for-depot',
  templateUrl: './miscellaneous-item-for-depot.component.html',
  styleUrls: ['./miscellaneous-item-for-depot.component.scss']
})
export class MiscellaneousItemForDepotComponent implements OnInit {

  pageNavigation = "Miscellaneous Item Entry (Depot)";
  public tableHeader = ["#", "Picking Number", "Picking Date", "Invoice Details", "Product Details"];
  protected options: {};
  protected cd: ChangeDetectorRef;
  showMessages: any = {};
  errors: string[];
  public bodyData: any = [];
  public apiUrl = "";
  public dispatchNo = "";
  public dispatchDate = "";
  public dispatcherName = "";
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

  disabledNew: boolean = false;



  constructor(
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private miscellaneousItemService: MiscellaneousItemService,
    private fieldforcemasterService: FieldforcemasterService,
    private productrequisitionService: ProductrequisitionService,
    private comboService: CommoncomboService,
    private datePipe: DatePipe,
    private salesreturnService: SalesreturnService

  ) {
    this.commonService.valueSet("showlist");
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
        headerName: "Miscellaneous No",
        field: "miscellaneousNo",
        width: 260,
      },
      {
        headerName: "Date",
        field: "itemDate",
        // valueFormatter: (params) =>
        //   this.datePipe.transform(params.data.itemDate, 'dd-MMM-yyyy'),
        width: 260,
      },
      {
        headerName: "Type",
        field: "miscellaneousTypeName",
        //valueFormatter: (params) => this.typeList.find(x => x.id == params.data.miscellaneousTypeId).name,
        width: 160,
      },
      {
        headerName: "From Depot",
        field: "sbuName",
        width: 260,
      },
      {
        headerName: "Status",
        field: "approveStatus",
        width: 220,
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
    this.LoadAllDropdown();
  }


  ngOnInit() {
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
      this.setSbu();
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      this.save();
      //this.commonService.valueSet("create");
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
      //this.commonService.valueSet("create");
    } else if (this.commonService.buttonClicked == "view") {
      this.show = false;
    } else if (this.commonService.buttonClicked == "reset") {
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      this.show = false;
    }
  }

  master: {
    miscellaneousItemId: number;
    itemDate: Date;
    miscellaneousNo: string;
    batchNo: string;
    fromSbuId: number;
    sbuId: number;
    miscellaneousTypeId: number;
    lstMiscellaneousDetailsViewModel: any[];
    lstFileAttachment: any[];
    sbuSelected: {};
    typeSelected: {};
    productSelected: {};


    remarks: string;
    detailsRemarks: string;
    selectedProductId: number;
    detailsLooseQty: number;
    detailsCtnQty: number;
    miscellaneousItemDetailsId: number;
    rowIndex: number;

    mgfDate: Date;
    expireDate: Date;
  };

  public getMaster() {
    this.master = {
      miscellaneousItemId: 0,
      miscellaneousTypeId: 0,
      miscellaneousItemDetailsId: 0,
      miscellaneousNo: "",
      batchNo: "",
      fromSbuId: 0,
      sbuId: 0,
      lstMiscellaneousDetailsViewModel: [],
      lstFileAttachment: [],
      itemDate: new Date(),
      sbuSelected: null,
      typeSelected: null,
      productSelected: null,
      remarks: null,
      detailsRemarks: null,
      selectedProductId: null,
      detailsLooseQty: null,
      detailsCtnQty: null,
      rowIndex: null,
      mgfDate: new Date(),
      expireDate: new Date()
    };

    this.hasFile == false;
    this.disabledBtnFile = true;
    this.disabledNew = false;
    this.getMaxNo();
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

  SaveValidation(): boolean {
    // if (
    //   this.ApprovalStatusSelected == null ||
    //   this.ApprovalStatusSelected["name"] == ""
    // ) {
    //   this.toastrService.warning("Please select a Approval Status.", "Message");
    //   // this.commonService.valueSet("create");
    //   return false;
    // }
    return true;
  }
  onbatchNoChange() {
    debugger
    if (this.master.batchNo != null || this.master.batchNo != '') {
      this.salesreturnService
        .GetManufactAndExpireDateFromStock(this.master.batchNo, this.master.productSelected["id"])
        .subscribe((data: any) => {
          if (data.success) {
            if (data.data.length > 0) {
              this.master.mgfDate = data.data[0].mgfDate;
              this.master.expireDate = data.data[0].expireDate;
            }

          }
        });
    }

  }
  private save() {
    debugger
    if (this.master.miscellaneousTypeId == null || this.master.miscellaneousTypeId == 0) {
      this.toastrService.danger("Please Select Type", "Message");
      this.commonService.valueSet("create");
      return;
    }
    if (this.master.lstMiscellaneousDetailsViewModel.length == 0) {
      this.toastrService.danger("Please add atleast one product", "Message");
      this.commonService.valueSet("create");
      return;
    }
    if (this.hasFile == true && this.master.lstFileAttachment.length == 0) {
      this.toastrService.danger("Please add atleast an attachment", "Message");
      this.commonService.valueSet("create");
      return;
    }

    this.master.itemDate = this.commonService.DateFormat(this.master.itemDate);
    var button = this.commonService.buttonClicked;

    //console.log('arr ', this.master);

    this.miscellaneousItemService
      .SaveMiscellaneousItemDepot(this.master).pipe(first())
      .subscribe((returns: any) => {
        if (returns.success) {
          if (button == "update") {
            this.toastrService.success(
              this.commonService.updatedmsg,
              "Message"
            );
          } else {
            this.toastrService.success(
              this.commonService.successmsg,
              "Message"
            );
          }

          this.getMaster();
          this.getGridData();
          this.show = true;
        }
        else {
          this.show = false;
          this.commonService.valueSet("create");
          this.toastrService.danger(
            returns.message,
            "Message"
          );
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

  private gridApi;
  private gridColumnApi;

  public modules: Module[] = AllCommunityModules;
  public columnDefs;
  public defaultColDef;
  public rowData: [];
  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };

  ////////////////////////////////// Ag Grid Data Load/////////////////////////////////
  private selectedRows = [];
  public onRowClicked(event) {
    this.selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked;
    this.commonService.agButtonClicked = "";
    if (data == "edit") {
      this.toastrService.info("Access denied !", "Message");
      // this.agEdit(event);
      // this.show = false;
      // this.disabledNew = false;
    } else if (data == "view") {
      this.agEdit(event);
      this.show = false;
      this.disabled = true;
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
      //this.agDelete(event);
      if (this.commonService.getUserGroup() == '1') {
        this.agDelete(event);
      }
      else {
        this.toastrService.warning('Access denied!', 'Warning');
      }
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }

  private agReport(event) {
    this.GetReport(event);
  }


  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getGridData();
  }

  public getMaxNo() {
    this.miscellaneousItemService.GetMaxMiscellaneousNumberDepot(this.commonService.DateFormat(this.master.itemDate))
      .subscribe((returns: any) => {
        debugger;
        if (returns.success) {
          this.master.miscellaneousNo = returns.data[0].MaxNo;
        }
        else {
          this.toastrService.warning('Max no. not found!', 'Warning')
        }
      });
  }

  getGridData() {
    this.miscellaneousItemService
      .GetMiscellaneousItemDepotById().pipe(first()).subscribe(
        (data: any) => {
          debugger;
          if (data.success) {
            this.rowData = data.data;
          } else {
            this.rowData = [];
          }
        },
        (err) => {
          this.rowData = [];
        }
      );
  }


  LoadAllDropdown() {
    //this.loadApprovalStatusList();
    //this.getSBU(0);
    this.getProductList();
    this.getTypeList();
  }

  getProductList() {
    this.productrequisitionService
      .getAllProductForRequisition()
      .subscribe((returns: any) => {
        this.productList = returns.data.map((val: any) => ({
          id: val.productWiseSpecificationId,
          name: val.productName,
          uomId: val.uomId,
          uomName: val.uomName,
          productId: val.productId,
          price: val.tradePrice,
          packSize: val.packSize,
          // code: val.productCode
          code: val.skuNumber
        }));
      });
  }

  getDepotList() {
    this.fieldforcemasterService.GetAllDepo('').subscribe((retuns: any) => {
      if (retuns.success) {
        this.depotList = retuns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }));
      }
    });
  }

  public getSBU(companyId) {
    debugger;
    //this.master.fromsbusSelected = null;
    this.comboService.getSBU(companyId).subscribe((returns: any) => {
      this.fromsbus = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
    });
  }

  disableSbu: boolean = false;
  setSbu() {
    this.disableSbu = false;
    if (this.fromsbus.length == 1) {
      this.disableSbu = true;
      this.master.fromSbuId = this.fromsbus[0].id;
      this.master.sbuSelected = { id: this.fromsbus[0].id, name: this.fromsbus[0].name };
    }
  }

  getTypeList() {

    /*
    this.typeList = [
      // { id: 1, name: 'Damage' },
      // { id: 2, name: 'Demo' },
      // { id: 3, name: 'Sample' },
      // //{ id: 4, name: 'TD' },
      // //{ id: 5, name: 'TR' },
      // { id: 6, name: 'Depot Expired' },

      { id: 1, name: 'Damage' },
      //{ id: 2, name: 'Demo' },
      { id: 3, name: 'Sample' },
      // { id: 4, name: 'TD' },
      // { id: 5, name: 'TR' },
      { id: 6, name: 'Depot Expired' },
      { id: 7, name: 'Quarantine In' },
      { id: 8, name: 'Quarantine Out' },
      { id: 9, name: 'Sample Return' },
      { id: 10, name: 'Write In' },
      { id: 11, name: 'Write Off' },

    ]
 */

    this.typeList = [];
    this.master.typeSelected = null;
    this.miscellaneousItemService
      .GetAllMiscellaneousType('').pipe(first())
      .subscribe((data: any) => {
        console.log(data);
        if (data.success) {
          this.typeList = data.data.map((val: any) => ({
            id: val.id,
            name: val.name,
            hasDependency: val.hasDependency,
          }));
        }
      });
  }


  salesInvoiceId = 0;
  grandTotal = 0;
  salesInvoiceNo = '';
  salesInvoiceDate = '';
  partyName = '';
  address = '';
  mobileNo = '';

  SalesModel: any[];



  agEdit(event: any) {
    this.master.miscellaneousItemId
    this.disabled = false;
    this.selectedRow = event.node.data;
    const miscellaneousItemId = event.node.data.miscellaneousItemId;

    this.miscellaneousItemService
      .GetMiscellaneousItemDetailsDepotByMasterId(miscellaneousItemId).pipe(first())
      .subscribe((data: any) => {
        console.log(data);
        if (data.success) {
          const ddd = data.data[0];
          const miscellaneousType = this.typeList.find(x => x.id === data.data[0].miscellaneousTypeId);
          this.master = data.data[0];
          this.master.typeSelected = {
            id: miscellaneousType.id,
            name: miscellaneousType.name,
          };
          this.master.sbuSelected = {
            id: data.data[0].sbuId,
            name: data.data[0].sbuName,
          };
        }
      });
  }

  agDelete(event: any) {
    const miscellaneousItemId = event.node.data.miscellaneousItemId;
    if (confirm('Are you sure to delete?')) {
      this.miscellaneousItemService
        .DeleteMiscellaneousItemDepot(miscellaneousItemId).pipe(first())
        .subscribe((data: any) => {
          if (data.success) {
            this.toastrService.success('Deleted successfully!', 'Msg');
            this.getGridData();
          }
        });
    }

  }
  hasFile: boolean = false;
  disabledBtnFile: boolean = true;
  MiscTypeChange() {
    this.hasFile = false;
    this.disabledBtnFile = true;
    this.master.lstFileAttachment = [];
    if (this.master.miscellaneousTypeId == 10 || this.master.miscellaneousTypeId == 11) {
      this.hasFile = true;
      this.disabledBtnFile = false;
    }
  }
  addToDetailsGrid() {
    debugger;
    if (this.master.batchNo.trim() == "") {
      this.toastrService.danger('Batch Number not found.', 'Warning');
      return;
    }
    if (this.master.selectedProductId == null || this.master.selectedProductId == 0) {
      this.toastrService.warning("Please select a product.", "warning")
      return;
    }
    if (this.master.detailsCtnQty == null || this.master.detailsCtnQty == 0) {
      this.toastrService.warning("Please input quantity.", "warning")
      return;
    }
    else if (this.master.mgfDate == null) {
      this.toastrService.danger("Please add manufacturing Date", "Message");

      return;
    }
    else if (this.master.expireDate == null) {
      this.toastrService.danger("Please add expire Date", "Message");
      return;
    }


    const details = {
      code: this.master.productSelected[`code`] ?? '',
      productName: this.master.productSelected[`name`] ?? '',
      packSize: this.master.productSelected[`packSize`] ?? '',
      ctnQty: this.master.detailsCtnQty <= 0 ? 1 : this.master.detailsCtnQty,
      looseQty: this.master.detailsLooseQty,
      miscellaneousItemDetailsId: this.master.miscellaneousItemDetailsId,
      remarks: this.master.detailsRemarks,
      productSpecificationId: this.master.productSelected[`id`],
      price: this.master.productSelected[`price`] ?? 0,
      batchNo: this.master.batchNo,
      mgfDate: this.commonService.DateFormat(this.master.mgfDate),
      expireDate: this.commonService.DateFormat(this.master.expireDate),
    }

    // if (this.master.rowIndex !== null && this.master.rowIndex !== undefined) {
    //   this.master.lstMiscellaneousDetailsViewModel[this.master.rowIndex] = details;
    // } else {
    //   this.master.lstMiscellaneousDetailsViewModel.push(details);
    // }

    this.master.lstMiscellaneousDetailsViewModel.splice(0, 0, details);

    this.clearDetailsInfo();

    this.disableType();
  }

  disableType() {
    if (this.master.lstMiscellaneousDetailsViewModel.length > 0)
      this.disabledNew = true;
    else
      this.disabledNew = false;
  }

  clearDetailsInfo() {
    this.master.productSelected = null;
    this.master.detailsCtnQty = null;
    this.master.detailsLooseQty = null;
    this.master.batchNo = '';
    this.master.detailsRemarks = null;
    this.master.selectedProductId = null;
    this.master.rowIndex = null;
    this.master.mgfDate = null;
    this.master.expireDate = null;
  }

  removeDetails(rowNumber: number) {
    if (confirm('Are you sure to remove?')) {
      const miscellaneousItemDetailsId = this.master.lstMiscellaneousDetailsViewModel[rowNumber].miscellaneousItemDetailsId;
      this.miscellaneousItemService
        .DeleteMiscellaneousItemDetailsDepot(miscellaneousItemDetailsId).pipe(first())
        .subscribe((data: any) => {
          if (data.success) {
            this.toastrService.success('Item deleted successfully!', 'Info');
          }
        });
      this.master.lstMiscellaneousDetailsViewModel.splice(rowNumber, 1);
      this.disableType();
    }
  }

  editDetails(rowNumber: number) {
    const detail = this.master.lstMiscellaneousDetailsViewModel[rowNumber];
    this.master.productSelected = {
      id: detail.productSpecificationId,
      code: detail.code,
      name: detail.productName,
      price: detail.price
    };

    this.master.selectedProductId = detail.productSpecificationId;
    this.master.detailsCtnQty = detail.ctnQty;
    this.master.detailsLooseQty = detail.looseQty;
    this.master.miscellaneousItemDetailsId = detail.miscellaneousItemDetailsId;
    this.master.detailsRemarks = detail.remarks;
    this.master.rowIndex = rowNumber;
    console.log(this.master.rowIndex, rowNumber);
  }

  productList: any[] = [];
  typeList: any[] = [];
  depotList: any[] = [];
  fromsbus: any[] = [];


  msg = "";
  names: any;


  GetReport(event: any) {

    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();
    this.apiUrl = `SalesInvoiceReport/GetMiscellaneousReportDepotById?reportFormat=Pdf&userId=${userInfo[0].employeeid}&miscellaneousItemId=${event.data.miscellaneousItemId}`;
    console.log('apiUrl: ', this.apiUrl);
    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }


  public imagePath: any;
  public getFileDetails(file, index) {
    //debugger;
    if (file.length === 0) return;
    const mimeType = file[0].type;

    console.log("mimeType = ", mimeType);

    // if (mimeType.match(/image\/*/) == null) {
    //   //this.master.lstFileAttachment[index].imageFile = null;
    //   //this.master.lstFileAttachment[index].imageUrl = null;
    //   this.toastrService.warning("Please choose a image.", "Warning")
    //   return;
    // }

    //if file change
    this.master.lstFileAttachment[index].imageUrl = null;
    //
    const reader = new FileReader();
    this.imagePath = file;
    reader.readAsDataURL(file[0]);
    reader.onload = (_event) => {
      //this.url = reader.result;
      this.master.lstFileAttachment[index].imageFile = reader.result;//file[0];
      //this.master.lstFileAttachment[index].imageUrl = reader.result;
      console.log(this.master.lstFileAttachment);
    };

    // console.log("file", file);
    // for (let i = 0; i < file.length; i++) {
    //   this.formData.append("file", file[i], file[i]["name"]);
    // }
  }
  addFiles() {
    let item = { miscellaneousItemFileId: 0, docInfo: "", imageFile: "" }
    this.master.lstFileAttachment.splice(0, 0, item);
  }
  removeFile(index: number) {
    if (confirm('Are you sure to remove?')) {
      const miscellaneousItemFileId = this.master.lstFileAttachment[index].miscellaneousItemFileId;
      if ((miscellaneousItemFileId == null ? 0 : miscellaneousItemFileId) == 0) {
        this.master.lstFileAttachment.splice(index, 1);
        this.disableType();
      }
      else {
        //////  API not implemented

        // this.miscellaneousItemService
        //   .DeleteMiscellaneousItemFileDepot(miscellaneousItemFileId).pipe(first())
        //   .subscribe((data: any) => {
        //     if (data.success) {
        //       this.toastrService.success('File deleted successfully!', 'success');
        //       this.master.lstFileAttachment.splice(index, 1);
        //       this.disableType();
        //     }
        //     else {
        //       this.toastrService.warning('Deleted process failed!', 'warning');
        //     }
        //   });
      }
    }
  }
}

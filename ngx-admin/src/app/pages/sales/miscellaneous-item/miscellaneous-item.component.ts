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
  selector: 'ngx-miscellaneous-item',
  templateUrl: './miscellaneous-item.component.html',
  styleUrls: ['./miscellaneous-item.component.scss']
})
export class MiscellaneousItemComponent implements OnInit {


  pageNavigation = "Miscellaneous Item Entry (Factory)";
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
        valueFormatter: (params) =>
          this.datePipe.transform(params.data.itemDate, 'dd-MMM-yyyy'),
        width: 260,
      },
      {
        headerName: "To Depot",
        field: "sbuName",
        width: 260,
      },
      {
        headerName: "Type",
        field: "miscellaneousTypeId",
        valueFormatter: (params) => this.typeList.find(x => x.id == params.data.miscellaneousTypeId).name,
        width: 160,
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
    this.disabledNew = false;
    this.getMaxNo();
  }
  public getMaxNo() {
    this.miscellaneousItemService.GetMaxMiscellaneousNumber(this.commonService.DateFormat(this.master.itemDate))
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
    if (this.master.sbuId == null || this.master.sbuId == 0) {
      this.toastrService.danger("Please Select To Depot.", "Message");
      this.commonService.valueSet("create");
      return;
    }
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

    this.master.itemDate = this.commonService.DateFormat(this.master.itemDate);
    var button = this.commonService.buttonClicked;
    this.miscellaneousItemService
      .SaveMiscellaneousItem(this.master).pipe(first())
      .subscribe((returns: any) => {
        if (returns.success) {
          this.show = true;
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
        }
        else {
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
      // this.agEdit(event);
      // this.show = false; 
      this.toastrService.info("Not Allowed", "Message");
      this.commonService.valueSet("showlist");
    } else if (data == "view") {
      // this.agEdit(event);
      // this.show = false;
      // this.disabled = true;
      this.toastrService.info("Not Allowed", "Message");
      this.commonService.valueSet("showlist");
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
      //this.agDelete(event);
      if (this.commonService.getUserGroup() == '1') {
        this.agDelete(event);
      }
      else this.toastrService.info("Not Allowed", "Message");
      this.commonService.valueSet("showlist");
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

  getGridData() {
    this.miscellaneousItemService
      .GetMiscellaneousItemById().pipe(first()).subscribe(
        (data: any) => {
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
    this.getSBU(0);
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
          price: val.price,
          //code: val.productCode
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
    //debugger;
    //this.master.fromsbusSelected = null;
    this.comboService.getSBU(companyId).subscribe((returns: any) => {
      this.fromsbus = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
      // this.fromsbus = this.fromsbus.filter((element) => {
      //   return element.id != 19;
      // });
    });
  }

  getTypeList() {
    /*
    this.typeList = [
      // { id: 1, name: 'Damage' },
      // { id: 2, name: 'Demo' }, ,
      // { id: 6, name: 'Factory Expired' },
      // { id: 3, name: 'Sample' },
      // { id: 4, name: 'TD' },
      // { id: 5, name: 'TR' }

      { id: 1, name: 'Damage' },
      { id: 2, name: 'Demo' },
      { id: 3, name: 'Sample' },
      { id: 4, name: 'TD' },
      { id: 5, name: 'TR' },
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
      .GetMiscellaneousItemDetailsByMasterId(miscellaneousItemId).pipe(first())
      .subscribe((data: any) => {
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
    this.toastrService.warning('Access denied!');
    return;
    const miscellaneousItemId = event.node.data.miscellaneousItemId;
    if (confirm('Are you sure to delete?')) {
      this.miscellaneousItemService
        .DeleteMiscellaneousItem(miscellaneousItemId).pipe(first())
        .subscribe((data: any) => {
          if (data.success) {
            this.toastrService.success('Deleted successfully!');
            this.getGridData();
          }
        });
    }

  }

  addToDetailsGrid() {
    if (this.master.batchNo == null || this.master.batchNo == "") {
      this.toastrService.warning("Please input a correct Batch", "Warning");
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
    this.master.detailsRemarks = null;
    this.master.selectedProductId = null;
    this.master.rowIndex = null;
    this.master.mgfDate = null;
    this.master.expireDate = null;
    this.master.batchNo = null;
  }


  removeDetails(rowNumber: number) {
    if (confirm('Are You Sure to remove?')) {
      const miscellaneousItemDetailsId = this.master.lstMiscellaneousDetailsViewModel[rowNumber].miscellaneousItemDetailsId;
      if (miscellaneousItemDetailsId > 0) {
        this.miscellaneousItemService
          .DeleteMiscellaneousItemDetails(miscellaneousItemDetailsId).pipe(first())
          .subscribe((data: any) => {
            if (data.success) {
              this.toastrService.success('Item deleted successfully!');
              this.master.lstMiscellaneousDetailsViewModel.splice(rowNumber, 1);
              this.disableType();
            }
          });
      }
      else {
        this.toastrService.success('Item deleted successfully!');
        this.master.lstMiscellaneousDetailsViewModel.splice(rowNumber, 1);
        this.disableType();
      }
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
    this.apiUrl = `SalesInvoiceReport/GetMiscellaneousReportById?reportFormat=Pdf&userId=${userInfo[0].employeeid}&miscellaneousItemId=${event.data.miscellaneousItemId}`;

    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }




}

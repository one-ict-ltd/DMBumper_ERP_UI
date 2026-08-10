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
import { PurchaseorderreceiveService } from "app/pages/purchase/settings/purchaseorderreceive.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { BranchService } from "app/services/erpsetting/branch.service";

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: 'ngx-purchaseorderreceive',
  templateUrl: './purchaseorderreceive.component.html',
  styleUrls: ['./purchaseorderreceive.component.scss']
})
export class PurchaseorderreceiveComponent implements OnInit {

  /////////////////////////////
  master: {
    poReceiveId: number;
    purOrderRecvNo: string;
    purchaseOrderId: number;
    purOrderNo: string;
    purchaseOrderRecvDate: Date;
    toWarehouseId: string;
    approvalStatus: number;
    isActive: number;
    isDelete: number;


    productSelected: [];
    purchaseOrderNoSelected: {};
    tosbusSelected: {};
    companySelected: {};

    fromsbuId: number;
    fromsbuName: string;
    tosbuId: number;
    tosbuName: string;
    receivedBy: string;
    //productReqDetails: [];
    lstDetailsViewModel: any[];

    // isPurOrderNoDisable: string;
    // isToSbuDisable: string;
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

  isPurOrderNoDisable: boolean = false;

  ngOnInit() {
    //debugger;
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;

    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Purchase Order Received";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.getMaxPurchaseOrderReceiveNumber();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      //this.openConfirmPopup("");     
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
      //this.edit();
      this.show = false;
    }
  }
  public getMaster() {
    this.master = {
      poReceiveId: 0,
      purOrderRecvNo: "",
      purchaseOrderId: 0,
      purOrderNo: "",
      purchaseOrderRecvDate: new Date(),
      toWarehouseId: "",
      approvalStatus: 0,
      isDelete: 0,
      isActive: 1,


      productSelected: null,
      purchaseOrderNoSelected: null,
      tosbusSelected: null,
      companySelected: null,

      fromsbuId: 0,
      fromsbuName: "",
      tosbuId: 0,
      tosbuName: "",
      receivedBy: "",
      lstDetailsViewModel: null,

    };
    this.isPurOrderNoDisable = false;
  }

  public employeeItems = [];
  public companyItems = [];

  public agButtonAction() {
    if (this.commonService.agButtonClicked == "pin") {
      this.commonService.onPin(this.gridColumnApi);
    }
    else if (this.commonService.agButtonClicked == "unpin") {
      this.commonService.onClear(this.gridColumnApi);
    }
    else if (this.commonService.agButtonClicked == "refresh") {
      window.location.reload();
    }
    else if (this.commonService.agButtonClicked == "csv") {
      this.commonService.onExportCSV(this.gridApi, this.pageNavigation);
    }
    else {
      console.log("Click action button");
    }
  }
  /////End of Dynamic Button section (Do Not Edit)///////

  /////////////////////////////// CRUD ///////////////////////////////////////////

  private save() {
    var button = this.commonService.buttonClicked;
    if (this.master.purchaseOrderRecvDate == null) {
      this.toastrService.danger("Please enter purchase order receive date.", "Message");
      // this.show = false;
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.purOrderRecvNo == "" || this.master.purOrderRecvNo == null) {
      this.toastrService.danger("Please enter purchase order receive no.", "Message");
      // this.show = false;
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.purchaseOrderNoSelected == null) {
      this.toastrService.danger("Please select purchase order no.", "Message");
      // this.show = false;
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.tosbusSelected == null) {
      this.toastrService.danger("Please select Product Receive To.", "Message");
      // this.show = false;
      this.commonService.valueSet("create");
      return false;
    }
    this.show = true;
    this.master.tosbuId = this.master.fromsbuId;

    this.purchaseOrderReceiveService.savePurchaseOrderReceive(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        }
        else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        //////////////Grid Refresh ///////////////////

        this.getMaster();
        this.purchaseOrderReceiveService.getPurchaseOrderReceive(0).subscribe((data: any) => {
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
    private purchaseOrderReceiveService: PurchaseorderreceiveService,
    private comboService: CommoncomboService,
    private branchService: BranchService,
  ) {

    this.commonService.valueSet('showlist');

    this.getSBU(0);
    this.getPurchaseOrderNo();

    this.columnDefs = [
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.rowIndex + 1",
        pinned: "left",
        filter: false,
        width: 50,
      }, /// Dont Change
      // {
      //   headerName: "purchase Req. ID",
      //   field: "poReceiveId",
      //   filter: "agNumberColumnFilter",
      //   editable: false,
      //   width: 180,
      // },
      {
        headerName: "Purchase Order Recv. No.",
        field: "purOrderRecvNo",
        width: 180,
      },
      {
        headerName: "Purchase Order No.",
        field: "purOrderNo",
        width: 180,
      },
      {
        headerName: "Purchase Order Recv. Date",
        field: "purchaseOrderRecvDate",
        width: 180,
      },
      {
        headerName: "Warehouse",
        field: "fromsbuName",
        width: 160,
      },
      {
        headerName: "Received By",
        field: "receivedBy",
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
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.purchaseOrderReceiveService.getPurchaseOrderReceive(0).subscribe((data: any) => {
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
      var poReceiveId = event.node.data.poReceiveId;

      this.purchaseOrderReceiveService.getPurchaseOrderReceive(poReceiveId).subscribe((data: any) => {
        if (data.success) {
          //debugger;
          this.master = data.data[0];

          this.master.purchaseOrderNoSelected = {
            id: data.data[0].purchaseOrderId,
            name: data.data[0].purOrderNo,
          };

          this.master.tosbusSelected = {
            id: data.data[0].fromsbuId,
            name: data.data[0].fromsbuName,
          };
          console.log("Hit agEdit");
          console.log(this.master);

          this.purchaseOrderReceiveService.getPurchaseOrderReceiveDetails(poReceiveId).subscribe((data: any) => {
            //debugger;
            if (data.success) {
              this.master.lstDetailsViewModel = data.data;
              console.log(this.master.lstDetailsViewModel);

              this.isPurOrderNoDisable = true;
            }
          });
        }
      });
      this.ngOnInit();
    }
  }

  private agReport(event) {
    this.toastrService.info("Print button clicked", "Message");
  }

  private agDelete(event) {
    // this.master.poReceiveId = event.node.data.poReceiveId;
    // console.log("Hit agDelete: " + this.master.poReceiveId);
    this.purchaseOrderReceiveService.deletePurchaseOrderReceiveById(this.master.poReceiveId).subscribe((returns: any) => {
      if (returns.success) {
        this.toastrService.success(this.commonService.deletedmsg, "Message");

        //////////////Grid Refresh ///////////////////
        //this.purchaseOrderReceiveService.getPurchaseOrderReceiveDetails(this.master.poReceiveId).subscribe((data: any) => {
        //   if (data.success) {
        //     this.rowData = data.data;
        //   }
        // });

        this.purchaseOrderReceiveService.getPurchaseOrderReceive(0).subscribe((data: any) => {
          if (data.success) {
            this.rowData = data.data;
          }
        });
        //////////////Grid Refresh ///////////////////
      }
    });
  }
  //////////////////////////////////End of Ag Grid Data Load/////////////////////////////////


  public sbus = [];
  public purchaseOrderNos = [];
  public tosbus = [];

  public getSBU(companyId) {
    this.comboService.getSBU(companyId).subscribe((returns: any) => {
      this.sbus = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
    });
  }

  public getPurchaseOrderNo() {
    this.purchaseOrderReceiveService.GetPurchaseOrderNumber().subscribe((returns: any) => {
      this.purchaseOrderNos = returns.data.map((val) => ({
        id: val.purchaseOrderId,
        name: val.purOrderNo,
      }));
    });
  }
  public getMaxPurchaseOrderReceiveNumber() {
    ////debugger;
    // let currentDate = new Date();
    // console.log("returns.data.getMaxPurchaseOrderReceiveNumber");
    // console.log(this.master.purchaseOrderRecvDate);
    this.purchaseOrderReceiveService.getMaxPurchaseOrderReceiveNumber(this.master.purchaseOrderRecvDate.toDateString().substring(4, 15)).subscribe((returns: any) => {
      //console.log(returns.data[0].MaxNo);
      this.master.purOrderRecvNo = returns.data[0].MaxNo;
    });
  }

  public getPORecvdate() {
    if (this.master.purchaseOrderRecvDate == null) {
      this.master.purchaseOrderRecvDate = new Date("dd/MM/yyyy");
      // console.log("this.master.purchaseOrderRecvDate");
      //console.log(this.master.purchaseOrderRecvDate.toLocaleDateString());
    }
  }

  public purOrderRecvSelected = [];
  public getPurchaseOrderReceiveDetails() {
    this.purchaseOrderReceiveService.getPurchaseOrderReceiveDetails(this.master.poReceiveId).subscribe((returns: any) => {
      //console.log(returns.data);

      this.purOrderRecvSelected = returns.data.map((val: any) => ({
        id: val.productWiseSpecificationId,
        name: val.productName,
        productId: val.productId,
        uomId: val.uomId,
        uomName: val.uomName,
      }));
    });
  }

  //public purOrderSelected = [];
  public getPurchaseOrderDetails(purchaseOrderId: any) {
    this.purchaseOrderReceiveService.getPurchaseOrderDetailsByIdForPoRecv(purchaseOrderId).subscribe((returns: any) => {

      console.log(returns.data);
      this.master.lstDetailsViewModel = returns.data;
      //console.log(this.master.lstDetailsViewModel);

      this.master.fromsbuId = returns.data[0].fromsbuId;
      this.master.tosbuId = returns.data[0].tobuId;

      this.master.tosbusSelected = {
        id: returns.data[0].fromsbuId,//tosbuId,
        name: returns.data[0].fromsbuName,//tosbuName,
      };

      this.ngOnInit();
    });
  }
  public setIsUpdate(index: any) {
    //console.log(returns.data);
    //this.master.lstDetailsViewModel = returns.data;
    this.selectedRow = this.master.lstDetailsViewModel[index];
    this.master.lstDetailsViewModel.splice(index, 1);
    if (this.selectedRow.helpDetailId > 0) {

    }
  }
  public validateReceiveQty(index: any) {
    //console.log(returns.data);
    //this.master.lstDetailsViewModel = returns.data;

    // this.master.lstDetailsViewModel.forEach(element => {
    //   //Find index of specific object using findIndex method.    
    //   var objIndex = this.master.lstDetailsViewModel.findIndex((obj => obj.id == 1));

    //   //Log object to Console.
    //   console.log("Before update: ", this.master.lstDetailsViewModel[objIndex])

    //   //Update object's name property.
    //   this.master.lstDetailsViewModel[objIndex].name = "Laila"
    // });

    // this.selectedRow = this.master.lstDetailsViewModel[index];
    // this.master.lstDetailsViewModel.splice(index, 1);
    // if (this.selectedRow.helpDetailId > 0) {

    // }

    console.log('this.master.lstDetailsViewModel[index]', this.master.lstDetailsViewModel[index]);
    var remainingQty = this.master.lstDetailsViewModel[index].remainingQty;
    var receiveQty = this.master.lstDetailsViewModel[index].receiveQty;
    if ((receiveQty == "" ? 0 : receiveQty) > remainingQty) {
      if (this.master.lstDetailsViewModel[index].poReceiveDetailsId == 0)
        this.master.lstDetailsViewModel[index].receiveQty = this.master.lstDetailsViewModel[index].remainingQty
      else
        this.master.lstDetailsViewModel[index].receiveQty = this.master.lstDetailsViewModel[index].receivedQty
    }
    // if (receiveQty == "" || receiveQty == null) {
    //   this.master.lstDetailsViewModel[index].receiveQty = 0;
    // }
    //filter 
    //var res = this.master.lstDetailsViewModel.filter(t => t.receiveQty==0)
  }


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

}

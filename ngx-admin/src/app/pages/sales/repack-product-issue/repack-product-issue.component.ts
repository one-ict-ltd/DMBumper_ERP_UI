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
  NbDateService,
  NbDialogService,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
// import { NavigationStart, Router } from "@angular/router";
import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { ProducttransferService } from "app/services/inventory/producttransfer.service";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
import { ProductService } from "app/services/inventory/product.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { StockinService } from "app/services/inventory/stockin.service";

import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { forkJoin } from "rxjs";

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: 'ngx-repack-product-issue',
  templateUrl: './repack-product-issue.component.html',
  styleUrls: ['./repack-product-issue.component.scss']
})

export class RepackProductIssueComponent implements OnInit {
  /////////////////////////////

  serverDate: any[];
  constructor(
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private ProducttransferService: ProducttransferService,
    private productrequisitionService: ProductrequisitionService,
    private productService: ProductService,
    private comboService: CommoncomboService,
    protected dateService: NbDateService<Date>,
    private stockinService: StockinService
  ) {
    this.commonService.valueSet("showlist");
    debugger;


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
        headerName: "RePack Transfer No.",
        field: "RePackProductTransferNo",
        width: 300,
      },
      {
        headerName: "DestructionNote Receive No.",
        field: "destructionNoteReceiveNo",
        width: 250,
      },
      {
        headerName: "Transfer Date",
        field: "RePackProductTransferDate",
        width: 180,
      },
      {
        headerName: "Remarks",
        field: "remarks",
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
    //debugger;
    this.getMaster();
    this.getDestructionNoteReceiveList();
  }


  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.ProducttransferService.GetRePackProductTransferById(0).subscribe(
      (data: any) => {
        if (data.success) {
          this.rowData = data.data;
        }
      }
    );
  }
  public DestructionReceivLst = [];
  public getDestructionNoteReceiveList() {
    debugger
    this.ProducttransferService
      .getDestructionNoteReceiveForRePack()
      .subscribe((returns: any) => {
        this.DestructionReceivLst = returns.data.map((val) => ({
          id: val.destructionNoteReceiveId,
          name: val.destructionNoteReceiveNo,
          destructionNoteReceiveNo: val.destructionNoteReceiveNo,
          isApproved: val.isApproved
        }));
      });
  }

  master: {
    RePackProductTransferId: number;
    destructionNoteReceiveId: number;
    destructionNoteReceiveNo: string;
    RePackProductTransferNo: string;
    RePackProductTransferDate: Date;

    miscellaneousTypeId: number;
    remarks: string;
    isApproved: number;
    marketOrDepo: string;

    productWiseSpecificationId: number;
    productName: string;
    uomName: string;


    destructionNoteReceiveSelected: {};
    lstDetailsViewModel: any[];

    companyId: 0,
  };
  public getMaster() {

    this.master = {
      RePackProductTransferId: 0,
      destructionNoteReceiveId: 0,
      destructionNoteReceiveNo: "",
      RePackProductTransferNo: "",
      RePackProductTransferDate: new Date(),

      miscellaneousTypeId: 13,
      remarks: null,
      isApproved: 0,
      marketOrDepo: 'Depot',

      productWiseSpecificationId: 0,
      productName: "",
      uomName: "",


      destructionNoteReceiveSelected: null,
      lstDetailsViewModel: null,

      companyId: 0,

    };

  }

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

  show: boolean = true;
  vlucherForm: FormGroup;
  submitted: boolean;
  saveupdate: string = "Save";
  gridbutton: string = "";
  name: string;
  description: string;
  selectedRow: any;

  ngOnInit() {
    //debugger;
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Repack Product Issue to Depot";
  public rptHeader = "Repack Product Issue to Depot";
  public tableHeader = ["#", "Product Name", "Pack Size", "Batch No.", "UOM", "Qty"];

  public buttons = this.commonService.btnList;



  public getDestructionNoteReceiveDetails(event) {
    debugger
    this.master.destructionNoteReceiveNo = event.name;
    this.master.destructionNoteReceiveId = event.id;
    this.master.isApproved = event.isApproved;

    this.ProducttransferService.GetDestructionNoteReceiveDetailById(
      event.id
    ).subscribe((returns: any) => {
      if (returns.success) {
        debugger;
        this.master.lstDetailsViewModel = returns.data;

      } else this.master.lstDetailsViewModel = [];
    });
  }

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      let status: boolean = this.validationForSave();

      if (!status) {
        this.commonService.valueSet("create");
        return;
      };
      // return
      this.save();
      //this.show = true;
    } else if (this.commonService.buttonClicked == "update") {
      let status: boolean = this.validationForSave();

      if (!status) {
        this.commonService.valueSet("create");
        return;
      };
      // return
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
      this.commonService.onExportCSV(this.gridApi, this.rptHeader);
    } else {
      //console.log("Click action button");
    }
  }

  /////////////////////////////// CRUD ///////////////////////////////////////////

  validationForSave(): boolean {

    let flag: boolean = true;
    if (!flag) return flag

    if (
      this.master.lstDetailsViewModel.length == 0 ||
      this.master.lstDetailsViewModel == null
    ) {
      this.toastrService.danger("Please add data.", "Message");
      this.commonService.valueSet("create");

      flag = false
      return false;
    }

    return flag;
  }

  private save() {
    var button = this.commonService.buttonClicked;

    this.master.RePackProductTransferDate = this.commonService.DateFormat(this.master.RePackProductTransferDate);
    this.ProducttransferService.SaveRePackProductTransfer(this.master).subscribe(
      (returns: any) => {
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
          this.ProducttransferService.GetRePackProductTransferById(0).subscribe(
            (data: any) => {
              if (data.success) {
                //debugger;
                this.rowData = data.data;
              }
            }
          );
        }
        else {
          this.toastrService.warning(
            this.commonService.failedmsg,
            "Message"
          );
        }
      }
    );
  }

  private reset() {
    this.getMaster();
  }

  //////////////////////////////// End CRUD /////////////////////////////////////////

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
    this.commonService.agButtonClicked = "";
    if (data == "edit") {
      let receiveStatus = event.node.data.receiveStatus;
      if (receiveStatus && receiveStatus == "Received") {
        this.toastrService.info("Already Received! You can not Edit!", 'Info')
        return;
      }
      //this.agEdit(event);
      this.show = false;
    } else if (data == "view") {
      this.agEdit(event);
      this.show = false;
      this.disabled = true;
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
      if (this.commonService.getUserGroup() == '1') {
        this.agDelete(event);
      }
      else {
        this.toastrService.info("Access denied", "Message");
      }
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
      var RePackProductTransferId = event.node.data.RePackProductTransferId;

      this.master.destructionNoteReceiveSelected = {
        id: event.node.data.destructionNoteReceiveId,
        name: event.node.data.destructionNoteReceiveNo
      };

      debugger;
      this.master.RePackProductTransferDate = new Date(event.node.data.RePackProductTransferDate);

      this.ProducttransferService.GetDestructionNoteReceiveDetailById(
        event.node.data.destructionNoteReceiveId
      ).subscribe((returns: any) => {
        if (returns.success) {
          debugger;
          this.master.lstDetailsViewModel = returns.data;

        } else this.master.lstDetailsViewModel = [];
      });


      this.ngOnInit();
    }
  }

  private agReport(event) {
    this.generateCrReport("Pdf", event.data.RePackProductTransferId);
  }



  apiUrl: any = ""
  generateCrReport(reportFormat: any, masterId: any) {
    // debugger;

    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();
    this.apiUrl = `InventoryReport/GetRepackProductIssueReport?reportFormat=${reportFormat}&userId=${userInfo[0].employeeid}&masterId=${masterId}`;

    //console.log(this.apiUrl);
    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }

  private agDelete(event) {
    if (confirm('Are sure to delete?')) {
      let RePackProductTransferId = event.node.data.RePackProductTransferId;
      // let receiveStatus = event.node.data.receiveStatus;
      // if (receiveStatus == "Received") {
      //   this.toastrService.warning('You Can not delete this, because it`s already Received.', "Message");
      //   return;
      // }
      this.ProducttransferService.DeleteRePackProductTransferById(
        RePackProductTransferId
      ).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          //////////////Grid Refresh ///////////////////
          this.ProducttransferService.GetRePackProductTransferById(0).subscribe(
            (data: any) => {
              if (data.success) {
                this.rowData = data.data;
              }
            }
          );
          //////////////Grid Refresh ///////////////////
        }
      });
    }
  }

  public prodReqList = [];
  public GetAllProductReqNumberBySbuId(sbuId) {
    this.ProducttransferService.GetAllProductReqNumberBySbuId(sbuId).subscribe(
      (returns: any) => {

        this.master.lstDetailsViewModel = [];

        this.prodReqList = returns.data.map((val: any) => ({
          id: val.prodReqId,
          name: val.prodReqNo,

        }));

      }
    );
  }



  public getProdReqDetails(prodReqId, storeId) {
    this.ProducttransferService.GetProductReqDetailsForProdTrnsfrById(
      prodReqId,
      storeId
    ).subscribe((returns: any) => {
      if (returns.success) {
        debugger;
        this.master.lstDetailsViewModel = returns.data;

        this.master.lstDetailsViewModel.forEach(el => {
          el.currentStock = 0;
          if (el.BatchList.length > 0) {
            el.BatchSelected = { id: el.BatchList[0].id, name: el.BatchList[0].name };
            el.batchNo = el.BatchList[0].batchNo;
          }
        });

      } else this.master.lstDetailsViewModel = [];
    });
  }

  getBatchStock(i: number, id: any) {

    this.master.lstDetailsViewModel[i].batchNo = this.master.lstDetailsViewModel[i].BatchSelected["batchNo"];

    console.log('BatchSelected= ', this.master.lstDetailsViewModel[i].BatchSelected);
  }
  public validateTransferQty(index: any) {
    /*
        this.master.lstDetailsViewModel[index].isSelect = 1;
    
        var reqQty = this.master.lstDetailsViewModel[index].reqQty;
        var currentStock = this.master.lstDetailsViewModel[index].currentStock ?? 0;
        if (currentStock < 0) currentStock = 0;
    
        var transferQty =
          this.master.lstDetailsViewModel[index].transferQty == null
            ? 0
            : this.master.lstDetailsViewModel[index].transferQty;
    
        if (transferQty == null || transferQty == 0) {
          this.master.lstDetailsViewModel[index].transferQty = transferQty; //reqQty;
          this.master.lstDetailsViewModel[index].isSelect = 0;
          //transferQty = 0;
        }
        //             4 > 3                     4 > 5
        if (reqQty > currentStock) {
          this.master.lstDetailsViewModel[index].transferQty = 0;
          this.master.lstDetailsViewModel[index].isSelect = 0;
        }
        if (transferQty > reqQty) {
          this.master.lstDetailsViewModel[index].transferQty = 0;
          this.master.lstDetailsViewModel[index].isSelect = 0;
        }
        */

  }

  public refresh() {
    this.master.lstDetailsViewModel = [];
    this.toastrService.warning(this.commonService.warningmsg, "Message");
  }

  datalength: number;
  headerData = [];
  bodyData = [];
  params = [];



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
          startY: legend.height + 30,
          styles: { font: "Meta", fontSize: 15, halign: "center" },
          bodyStyles: {
            //fillColor: [216, 216, 216],
            textColor: 50,
          },
          alternateRowStyles: {
            //fillColor: [250, 250, 250],
          },
        });

        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 80,
          styles: { font: "Meta" },
          tableLineColor: [0, 0, 0],

          bodyStyles: {
            //fillColor: [216, 216, 216],
            textColor: 50,
          },
          alternateRowStyles: {
            //fillColor: [250, 250, 250],
          },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 160,
          theme: "grid",
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.75,
          styles: {
            font: "Meta",
            lineColor: [44, 62, 80],
            lineWidth: 0.55,
          },
          headStyles: {
            fillColor: [250, 250, 250],
            fontSize: 11,
            textColor: 50,
          },
          bodyStyles: {
            //fillColor: [216, 216, 216],
            textColor: 50,
          },

          alternateRowStyles: {
            //fillColor: [250, 250, 250],
          },
          columnStyles: {
            5: { halign: "right" },
            //5: { halign: "right" },
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
}

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
import { DatePipe } from '@angular/common';
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
import { CommoncomboService } from "app/services/commoncombo.service";
import { BranchService } from "app/services/erpsetting/branch.service";
import { from } from "rxjs";
import { Console } from "node:console";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { SalesreturnService } from "app/services/sales/salesreturn.service";
import { HttpClient } from "@angular/common/http";
import { SalesapprovalmatrixService } from "app/services/sales/salesapprovalmatrix.service";

@Component({
  selector: 'ngx-purchaseapprovalmatrix',
  templateUrl: './purchaseapprovalmatrix.component.html',
  styleUrls: ['./purchaseapprovalmatrix.component.scss']
})
export class PurchaseapprovalmatrixComponent implements OnInit {

  master: {
      approvalMatrixId: number;
      sequenceNo: number;
  
      isActive: number;
  
      approvalTypeId: number;
      approvalTypeSelected: any;
      approverTypeId: number;
      approverSelected: any;
  
      companyId: number;
      companySelected: any;
      sbuId: number;
      sbuSelected: any;
  
      lstDetails: any[];
      index: number;
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
    sequenceNo: string;
    selectedRow: any;
    //showtd: boolean = true;
  
    ngOnInit() {
      localStorage.setItem("button", "");
      if (this.selectedRow != undefined) {
        this.name = this.selectedRow.currencyName;
        this.sequenceNo = this.selectedRow.aliasName;
      }
    }
    /////Dynamic Button section (Do Not Edit)///////
  
    public pageNavigation = "Approval Matrix";
    public buttons = this.commonService.btnList;
  
    public ButtonAction() {
      if (this.commonService.buttonClicked == "create") {
        this.getMaster();
        this.show = false;
        this.disabled = false;
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
        approvalMatrixId: 0,
        sequenceNo: 0,
        isActive: 1,
  
        approvalTypeId: 0,
        approvalTypeSelected: null,
        approverTypeId: 0,
        approverSelected: null,
  
        companyId: 0,
        companySelected: null,
        sbuId: 0,
        sbuSelected: null,
  
        lstDetails: [],
        index: -1,
      };
    }
  
    public companyItems = [];
    public sbuItems = [];
    public approvalTypeItems = [];
    public approverItems = [];
  
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
  
    public addDetails(dialog: TemplateRef<any>) {
      debugger;
      if (this.master.approverTypeId == 0) {
        this.toastrService.danger("Please select approver type", "Message");
        return;
      }
      if (this.master.sequenceNo < 0) {
        this.toastrService.danger("Please insert Positive number only", "Message");
        return;
      }
  
      var RowCount = this.master.lstDetails.length;
      for (let i = 0; i < RowCount; i++) {
        debugger;
        var _approverTypeId = this.master.lstDetails[i].approverTypeId;
        if (_approverTypeId == this.master.approverTypeId) {
          this.toastrService.danger("You have already added this", "Message");
          return;
        }
      }
  
      let detail = {
        approvalTypeId: this.master.approvalTypeId,
        companyId: this.master.companyId,
        sbuId: this.master.sbuId,
        approverTypeId: this.master.approverTypeId,
        approverTypeName: this.master.approverSelected['name'],
        sequenceNo: this.master.sequenceNo,
        isActive: this.master.isActive,
        //showtd: true
      };
      this.master.lstDetails.push(detail);
    }
  
    public deleteDetail(index: any) {
      debugger;
      this.selectedRow = this.master.lstDetails[index];
      this.master.lstDetails.splice(index, 1);
  
      var index1 = this.master.lstDetails.findIndex(x => x.approverTypeId == this.master.approverTypeId);
      if (index1 > -1) {
        this.master.lstDetails.splice(index1, 1);
      }
      this.toastrService.danger(this.commonService.deletedmsg, "Message");
    }
  
    private save() {
      if (this.master.sequenceNo < 0) {
        this.toastrService.danger("Please insert Positive number only", "Message");
        return;
      }
      var button = this.commonService.buttonClicked;
      this.salesapprovalmatrixService.SaveApprovalMatrix(this.master).subscribe((returns: any) => {
        debugger;
        if (returns.success) {
          if (button == "update") {
            this.toastrService.success(this.commonService.updatedmsg, "Message");
          } else {
            this.toastrService.success(this.commonService.successmsg, "Message");
          }
          //////////////Grid Refresh ///////////////////
          this.salesapprovalmatrixService.GetApprovalMatrix(0).subscribe((data: any) => {
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
      private http: HttpClient,
      private dialogService: NbDialogService,
      private commonService: CommonService,
      private toastrService: NbToastrService,
      private comboService: CommoncomboService,
      private salesapprovalmatrixService: SalesapprovalmatrixService,
    ) {
      this.commonService.valueSet('showlist');
      this.getCompany();
      this.GetApprovalType();
  
  
      this.columnDefs = [
        {
          headerName: "#",
          colId: "rowNum",
          valueGetter: "node.rowIndex + 1",
          pinned: "left",
          filter: false,
          width: 50,
        },
        {
          headerName: "Company Name",
          field: "companyName",
          filter: "agTextColumnFilter",
          width: 450,
        },
        {
          headerName: "Branch Name",
          field: "sbuName",
          filter: 'agDateColumnFilter',
          width: 350,
        },
        {
          headerName: "Approval Type Name",
          field: "approvalTypeName",
          filter: "agTextColumnFilter",
          width: 350,
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
      debugger;
    }
  
    currencyFormatter(currency) {
      var sansDec = currency.toFixed(2);
      var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return `${formatted}`;
    }
  
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      this.salesapprovalmatrixService.GetApprovalMatrix(0).subscribe((data: any) => {
        debugger;
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
  
    private selectedRows = [];
  
    onRowClicked(event) {
      this.selectedRow = event.node.data;
      var data = this.commonService.agButtonClicked; //localStorage.getItem("button");
      this.commonService.agButtonClicked = "";
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
        var approvalTypeId = event.node.data.approvalTypeId;
  
        this.salesapprovalmatrixService.GetApprovalMatrix(approvalTypeId).subscribe((data: any) => {
          if (data.success) {
            debugger;
            this.master = data.data[0];
  
            this.master.companySelected = {
              id: data.data[0].companyId,
              name: data.data[0].companyName,
            };
  
            this.getSBU(data.data[0].companyId);
  
            this.master.sbuSelected = {
              id: data.data[0].sbuId,
              name: data.data[0].sbuName,
            };
  
            this.master.approvalTypeSelected = {
              id: data.data[0].approvalTypeId,
              name: data.data[0].approvalTypeName,
            };
  
            this.GetApproverType(data.data[0].approvalTypeId);
  
            this.master.approverSelected = {
              id: data.data[0].approverTypeId,
              name: data.data[0].approverTypeName,
            };
  
            this.salesapprovalmatrixService.GetApprovalMatrixByTypeId(approvalTypeId).subscribe((data: any) => {
              debugger;
              if (data.success) {
                this.master.lstDetails = data.data;
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
      var result = confirm("Are you sure you want to delete that?");
      if (result) {
        debugger;
        let approvalTypeId = event.node.data.approvalTypeId;
  
        this.salesapprovalmatrixService.DeleteApprovalMatrixByTypeId(approvalTypeId).subscribe((returns: any) => {
          if (returns.success) {
            this.toastrService.success(this.commonService.deletedmsg, "Message");
  
            //////////////Grid Refresh ///////////////////
            this.salesapprovalmatrixService.GetApprovalMatrix(0).subscribe((data: any) => {
              if (data.success) {
                this.rowData = data.data;
              }
            });
            //////////////Grid Refresh ///////////////////
          }
        });
      }
    }
    //////////////////////////////////End of Ag Grid Data Load/////////////////////////////////
  
    @Output() myEvent = new EventEmitter();
  
    public deleteRow(state, action) {
      debugger;
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
  
    names: any;
    openWithDataObjModel(dialog: TemplateRef<any>) {
      this.dialogService.open(dialog, {
        context: this.master,
      });
    }
  
    openWithDataModel() {
      this.dialogService
        .open(DialogNamePromptComponent)
        .onClose.subscribe((name) => name && this.names.push(name));
    }
  
    public getCompany() {
      this.comboService.getCompany().subscribe((returns: any) => {
        this.companyItems = returns.data.map((val) => ({
          id: val.companyId,
          name: val.companyName,
        }));
      });
    }
  
    public getSBU(companyId) {
      this.master.sbuSelected = null;
      this.comboService.getSBU(companyId).subscribe((returns: any) => {
        this.sbuItems = returns.data.map((val) => ({
          id: val.sbuId,
          name: val.sbuName,
        }));
      });
    }
  
    public GetApprovalType() {
      this.salesapprovalmatrixService.GetApprovalTypeById(0).subscribe((returns: any) => {
        this.approvalTypeItems = returns.data.map((val) => ({
          id: val.approvalTypeId,
          name: val.approvalTypeName,
        }));
      });
    }
  
    public GetApproverType(approvalTypeId) {
      this.salesapprovalmatrixService.GetApproverTypeById(0, approvalTypeId).subscribe((returns: any) => {
        this.approverItems = returns.data.map((val) => ({
          id: val.approverTypeId,
          name: val.approverTypeName,
        }));
      });
    }
  
  }
  
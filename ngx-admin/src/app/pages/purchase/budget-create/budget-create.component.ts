import { ChangeDetectorRef, Component, OnInit, TemplateRef } from "@angular/core";
import { NbComponentStatus, NbDialogService, NbGlobalLogicalPosition, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrConfig, NbToastrService } from "@nebular/theme";

import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup } from "@angular/forms";
import { PurchaseorderService } from "app/pages/purchase/settings/purchaseorder.service";
import { debug } from "node:console";
@Component({
  selector: 'ngx-budget-create',
  templateUrl: './budget-create.component.html',
  styleUrls: ['./budget-create.component.scss']
})
export class BudgetCreateComponent implements OnInit {

  disabled: boolean = false;
  private gridApi;
  private gridColumnApi;

  public modules: Module[] = AllCommunityModules;
  public columnDefs;
  public defaultColDef;
  public rowData: [];
  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };
  master: {
    BudgetCreateId: number;
    BudgetCategoryId: number;
    BudgetAmount: number;
    BudgetYear: string;
    lstBudgetDetailsViewModel: any[];
    BudgetCategorySelected: {};
  };

  public getMaster() {
    this.master = {
      BudgetCreateId: 0,
      BudgetCategoryId: 0,
      BudgetAmount: 0,
      BudgetYear: "",
      lstBudgetDetailsViewModel: [],
      BudgetCategorySelected: null,
    };
    this.GetBudgetCategoryList();
  }

  show: boolean = true;
  vlucherForm: FormGroup;
  submitted: boolean;
  saveupdate: string = "Save";
  gridbutton: string = "";
  name: string;
  description: string;
  selectedRow: any;
  ngOnInit() {
    debugger;
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }
  public pageNavigation = "Budget Create";
  public buttons = this.commonService.btnList;

  // public ButtonAction() {
  //   if (this.commonService.buttonClicked == "create") {
  //     this.getMaster();
  //     this.show = false;
  //   } else if (this.commonService.buttonClicked == "showlist") {
  //     this.show = true;
  //   } else if (this.commonService.buttonClicked == "save") {

  //     this.save();
  //   } else if (this.commonService.buttonClicked == "update") {
  //     this.save();
  //   } else if (this.commonService.buttonClicked == "view") {
  //     this.agEdit(event);
  //     this.show = false;
  //     this.disabled = true;
  //   } else if (this.commonService.buttonClicked == "reset") {
  //     this.reset();
  //   } else if (this.commonService.buttonClicked == "edit") {
  //     this.agEdit(event);
  //     this.show = false;
  //   }
  // }
  public ButtonAction() {

    if (this.commonService.buttonClicked == "create") {

      this.getMaster();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      this.save();
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
    } else if (this.commonService.buttonClicked == "view") {
      this.show = false;
    } else if (this.commonService.buttonClicked == "reset") {
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      this.show = false;
    }
  }

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
      //this.agReport(event);
    } else if (data == "delete") {
      //this.agDelete(event);
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }
  private selectedRows = [];
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
      var BudgetCreateId = event.node.data.BudgetCreateId;
      this.PurchaseorderService.GetBudgetCreateList(BudgetCreateId).subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0];
          this.master.BudgetCategorySelected = {
            BudgetCategoryId: data.data[0].BudgetCategoryId,
            BudgetCategoryName: data.data[0].BudgetCategoryName
          }

          this.master.lstBudgetDetailsViewModel = [];
        }
      });
      this.ngOnInit();
    }
  }

  public BudgetCategoryList = [];
  public GetBudgetCategoryList() {
    this.PurchaseorderService.getBudgetCategoryList().subscribe((returns: any) => {
      if (returns.success) {
        this.BudgetCategoryList = returns.data.map((val: any) => ({
          BudgetCategoryId: val.BudgetCategoryId,
          BudgetCategoryName: val.BudgetCategoryName,

        }));
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
  constructor(private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private PurchaseorderService: PurchaseorderService) {

    this.commonService.valueSet("showlist");

    this.frameworkComponents = {
      btnCellRenderer: BtnCellRenderer,
    };
    this.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: true,
    };
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
        headerName: "Budget Category Name",
        field: "BudgetCategoryName",
        width: 200,
      },
      {
        headerName: "Budget Amount",
        field: "BudgetAmount",
        width: 150,
      },
      {
        headerName: "Budget Year",
        field: "BudgetYear",
        width: 150,
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
    this.getMaster();
  }
  private reset() {
    this.getMaster();
  }
  private save() {
    debugger
    var button = this.commonService.buttonClicked;
    this.show = true;
    debugger
    this.PurchaseorderService
      .SaveBudgetCreate(this.master)
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
          this.PurchaseorderService.GetBudgetCreateList(0).subscribe((data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          });
        }
      });
  }


  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.PurchaseorderService.GetBudgetCreateList(0).subscribe((data: any) => {
      if (data.success) {
        this.rowData = data.data;
      }
    });
  }

  public addDetails() {
    debugger
    let detail = {
      BudgetCategoryId: this.master.BudgetCategorySelected["BudgetCategoryId"],
      BudgetCategoryName: this.master.BudgetCategorySelected["BudgetCategoryName"],
      BudgetAmount: this.master.BudgetAmount,
      BudgetYear: this.master.BudgetYear,
      BudgetCreateId: this.master.BudgetCreateId
    };


    if (this.master.BudgetAmount != 0) {
      this.master.lstBudgetDetailsViewModel.push(detail);
      this.master.BudgetCategorySelected = null;
      this.master.BudgetAmount = 0;
      this.master.BudgetYear = null;
      this.master.BudgetCreateId = 0;
      this.master.BudgetCategoryId = 0;
    } else {
      this.toastrService.danger("Budget Amount is zero.", "Message");
      return;
    }
  }
}



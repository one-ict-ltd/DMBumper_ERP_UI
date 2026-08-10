import { Component, OnInit } from "@angular/core";
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
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { HrmmasterService } from "app/services/hrm/hrmmaster.service";
import { FormBuilder } from "@angular/forms";
import { SalaryslabService } from "app/services/salary/salarymaster/salaryslab.service";
import { SalarygradeService } from "app/services/salary/salarymaster/salarygrade.service";

@Component({
  selector: 'ngx-salary-slab-designation',
  templateUrl: './salary-slab-designation.component.html',
  styleUrls: ['./salary-slab-designation.component.scss']
})
export class SalarySlabDesignationComponent implements OnInit {

  public pageNavigation = "Slab Wise Designation";

  master: {
    salaryGradeId: number;
    salaryGradeName: string;
    salarySlabId: number;
    salarySlabName: string;
    designationId: number;
    designationName: string;
    lstMasterViewModel: any[];
    designationSelected: {};
    salarySlabSelected: {};
    salaryGradeSelected: {}
  };

  protected options: {};
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
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }

  public buttons = this.commonService.btnList;

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
      salarySlabId: 0,
      salarySlabName: '',
      designationId: 0,
      designationName: '',
      salaryGradeId: 0,
      salaryGradeName: '',
      lstMasterViewModel: [],
      designationSelected: null,
      salaryGradeSelected: null,
      salarySlabSelected: null
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
  /////End of Dynamic Button section (Do Not Edit)///////

  /////////////////////////////// CRUD ///////////////////////////////////////////

  private save() {
    debugger
    if (!this.commonService.IsValidNumber(this.master.salarySlabId)) {
      this.toastrService.danger("Pleae select a salary slab", "Message");
      this.commonService.valueSet("create");
      return;
    }
    if (this.master.lstMasterViewModel.length == 0) {
      this.toastrService.danger("No item to save", "Message");
      this.commonService.valueSet("create");
      return;
    }
    if (!this.commonService.IsValidNumber(this.master.designationId)) {
      this.toastrService.danger("Pleae select a  designation", "Message");
      this.commonService.valueSet("create");
      return;
    } else {
      this.show = true;
      var button = this.commonService.buttonClicked;
      this.commonService
        .postApiData(`Designation/SetSlabDesignation`, this.master.lstMasterViewModel)
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
            //////////////Grid Refresh ///////////////////
            this.getMaster();
            this.hrmmasterService
              .GetSlabDesignationById(0)
              .subscribe((data: any) => {
                if (data.success) {
                  this.rowData = data.data;
                }
              });
            //////////////Grid Refresh ///////////////////
            //
          }
        });
    }
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

  public selectdetailRows = [];
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
    private hrmmasterService: HrmmasterService,
    private comboService: CommoncomboService,
    private formBuilder: FormBuilder,
    private salaryslabService: SalaryslabService,
    private salarygradeService: SalarygradeService,
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
      },
      {
        headerName: "Slab Designation Id",
        field: "slabDesignationId",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 150,
      }, {
        headerName: "Slab Name",
        field: "slabName",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 280,
      },
      {
        headerName: "Designation Name",
        field: "designationName",
        width: 280,
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
      editable: true,
    };
    this.getMaster();
    this.LoadSalarySlab();
    this.LoadSalaryGrade();
    this.GetDesignation();
    //this.onGridReady(0);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.hrmmasterService
      .GetSlabDesignationById(0)
      .subscribe((data: any) => {
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
      this.toastrService.info('Action unavailable', 'Message');
      return;
      this.agEdit(event);
      this.show = false;
    } else if (data == "view") {
      this.toastrService.info('Action unavailable', 'Message');
      return;
      this.agEdit(event);
      this.show = false;
      this.disabled = true;
    } else if (data == "transectionreport") {
      this.toastrService.info('Action unavailable', 'Message');
      return;
      this.agReport(event);
    } else if (data == "delete") {
      if (confirm('Do you want to delete this item?'))
        this.agDelete(event);
      else return;
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }

  private agDelete(event) {
    debugger
    let slabDesignationId = event.node.data.slabDesignationId;
    this.hrmmasterService
      .DeleteSlabDesignation(slabDesignationId)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");
          this.hrmmasterService
            .GetSlabDesignationById(0)
            .subscribe((data: any) => {
              if (data.success) {
                this.rowData = data.data;
              }
            });
        }
      });
  }

  private agReport(event) {
    this.toastrService.success(
      this.commonService.successmsg,
      "Report button click!"
    );
  }

  private agEdit(event) {
    // this.disabled = false;
    // let temp = 0;
    // for (let i = 0; i < this.selectedRows.length; i++) {
    //   if (this.selectedRows[i] == event.node.data) {
    //     this.selectedRows.splice(i, 1);
    //     this.selectedRow = event.node.data;
    //     temp = 1;
    //     this.ngOnInit();
    //   }
    // }
    // if (temp === 0) {
    //   this.selectedRows.push(event.node.data);
    //   this.selectedRow = event.node.data;
    //   this.master.subjectId = event.node.data.subjectId;

    //   this.hrmmasterService
    //     .GetEducationalSubjectById(this.master.subjectId)
    //     .subscribe((data: any) => {
    //       if (data.success) {
    //         this.master = data.data[0];
    //       }
    //     });
    //   this.ngOnInit();
    // }
  }
  salarySlabItems: [];
  public LoadSalarySlab() {
    this.salarySlabItems = null;
    this.master.salarySlabSelected = null;
    this.master.designationSelected = null;
    this.salaryslabService.GetSalarySlabById(0, this.master.salaryGradeId).subscribe((returns: any) => {
      this.salarySlabItems = returns.data.map((val) => ({
        id: val.salarySlabId,
        name: val.slabName,
      }));
    });
  }
  salaryGradeItems: [];
  public LoadSalaryGrade() {
    this.salarygradeService.GetSalaryGradeById(0).subscribe((returns: any) => {
      this.salaryGradeItems = returns.data.map((val) => ({
        id: val.salaryGradeId,
        name: val.gradeName,
      }));
    });
  }
  designationList = [];
  public GetDesignation() {
    this.hrmmasterService.getDesignation(0).subscribe((returns: any) => {
      this.designationList = returns.data.map((val: any) => ({
        id: val.designationId,
        name: val.designationName,
      }))
    })
  }

  addToTable() {
    const validationFields = [
      { field: 'salarySlabId', message: 'Please select a slab.' },
      { field: 'designationId', message: 'Please select a designation.' },
      { field: 'salaryGradeId', message: 'Please select a salary grade.' }
    ];

    if (!this.validateFields(validationFields)) {
      return;
    }

    let obj = {
      slabDesignationId: 0,
      salaryGradeId: this.master.salaryGradeId,
      salaryGradeName: this.master.salaryGradeSelected['name'] ?? '',
      salarySlabId: this.master.salarySlabId,
      salarySlabName: this.master.salarySlabSelected['name'] ?? '',
      designationId: this.master.designationId,
      designationName: this.master.designationSelected['name'] ?? ''
    };

    if (!this.isDuplicate(obj)) {
      this.master.lstMasterViewModel.push(obj);
    } else {
      alert('Duplicate entry detected! The record will not be added.');
    }

  }

  private validateFields(fields: { field: string; message: string }[]): boolean {
    for (const item of fields) {
      const value = this.master[item.field];
      if (value === 0 || value === null || value === undefined) {
        this.toastrService.warning(item.message, 'Message');
        return false;
      }
    }
    return true;
  }

  private isDuplicate(obj: any): boolean {
    return this.master.lstMasterViewModel.some(item =>
      item.salaryGradeId === obj.salaryGradeId &&
      item.salarySlabId === obj.salarySlabId &&
      item.designationId === obj.designationId
    );
  }

  private removeItemFromList(indexAt: number) {
    this.master.lstMasterViewModel.splice(indexAt, 1)
  }

}

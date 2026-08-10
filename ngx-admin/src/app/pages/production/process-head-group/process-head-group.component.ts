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
import { DatePipe } from "@angular/common";
import {
  NbComponentStatus,
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
// import { BranchService } from "app/services/erpsetting/branch.service";
// import { from } from "rxjs";
// import { Console } from "node:console";
import { BomService } from "app/services/production/bom.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ProductionServiceService } from "app/services/production/production-service.service";

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: 'ngx-process-head-group',
  templateUrl: './process-head-group.component.html',
  styleUrls: ['./process-head-group.component.scss']
})
export class ProcessHeadGroupComponent implements OnInit {

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

  title = "Hi there!";
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
    { title: null, body: "Toaster rock!" },
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

  ngOnInit() {
    ////debugger;
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Production Process Group";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      if (this.validationForMasterSave() == false) {
        this.commonService.valueSet("create");
        return;
      }
      this.save();
      this.show = true;
    } else if (this.commonService.buttonClicked == "update") {
      if (this.validationForMasterSave() == false) {
        this.commonService.valueSet("edit");
        return;
      }
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

  //
  companyList: [];
  companySelected: {};
  sbuList: [];
  sbuSelected: {};
  bomProductSpecList: {};
  productionTypeSelected: {};
  master: {
    phGroupMasterId: number;
    productionTypeId: number;
    groupName: string;
    companyId: number;

    lstDetailsViewModel: any[];
    typeId: number;
    typeSelected: {};
    meterialsType: string;
  };
  public getMaster() {
    this.master = {
      typeId: 0,
      productionTypeId: 0,
      phGroupMasterId: 0,
      groupName: "",
      companyId: null,
      lstDetailsViewModel: [],
      typeSelected: null,
      meterialsType: null,
    };
    this.companySelected = null;
    this.sbuSelected = null;
    this.productionTypeSelected = null;
    this.processHeadSelected = null;

    this.headOrder = 1;
    this.processHeadId = 0;
    this.processHeadName = "";
  }

  // bomDetails

  processHeadId: number = 0;
  headOrder: number = 0;
  processHeadName: string = "";
  detailsProductSpecList: {};
  processHeadSelected: {};

  // All Button Action

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
    var button = this.commonService.buttonClicked;
    this.beforeSave();
    this.productionProcessService.SaveProductionProcessGroup(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }

        this.getMaster(); //////////////Grid Refresh ///////////////////
        this.productionProcessService.GetProcessHeadGroupMasterById(0).subscribe((data: any) => {
          if (data.success) {
            this.rowData = data.data;
          }
        });
      }
    });
  }

  private reset() {
    this.getMaster();
  }

  beforeSave() {
    this.master.lstDetailsViewModel.forEach((element) => {
      element.imageFile = null;
    });
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
    private ProducttransferService: ProducttransferService,
    private productrequisitionService: ProductrequisitionService,
    private productService: ProductService,
    private comboService: CommoncomboService,
    private stockinService: StockinService,
    private bomService: BomService,
    private datePipe: DatePipe,
    private productionProcessService: ProductionServiceService,
  ) {
    this.commonService.valueSet("showlist");
    this.LoadDropdown();
    this.loadproductionTypeList();
    this.columnDefs = [
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.rowIndex + 1",
        pinned: "left",
        filter: false,
        width: 60,
      }, /// Dont Change
      {
        headerName: "Process Group Name",
        field: "groupName",
        width: 260,
      },
      // {
      //   headerName: "Production Type",
      //   field: "productionType",
      //   width: 350,
      // },
      {
        headerName: "Company",
        field: "companyName",
        width: 350,
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

  LoadDropdown() {
    this.getCompany();
    //this.getBomMasterProductSpec();
    //this.getBomDetailsProductSpec();
    this.getAllProcessHeadNames();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.productionProcessService.GetProcessHeadGroupMasterById(0).subscribe((data: any) => {
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


  productionTypeList: any = [];
  loadproductionTypeList() {
    this.productionTypeList = [
      {
        id: 1,
        name: "Manufacturing",
      },
      {
        id: 2,
        name: "Packing",
      },
    ];
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
      var phGroupMasterId = event.node.data.phGroupMasterId;

      this.productionProcessService.GetProcessHeadGroupMasterById(phGroupMasterId).subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0];
          let prodType = this.productionTypeList.filter(x => x.id == data.data[0].productionTypeId)[0];
          this.productionTypeSelected = prodType;


          this.productionProcessService.GetProcessGroupDetailsById(phGroupMasterId)
            .subscribe((data: any) => {
              if (data.success) {
                this.master.lstDetailsViewModel = data.data;
                //  console.log(this.master);
              }
            });
          //console.log(this.master);
        }
      });
      this.ngOnInit();
    }
  }

  private agReport(event) {
    //this.toastrService.info("Print button clicked", "Message");
    this.generateReport("print", event.data.bomId);
  }

  private agDelete(event) {
    this.master.phGroupMasterId = event.node.data.phGroupMasterId;
    if (confirm('Are you sure?')) {
      this.productionProcessService
        .DeleteProductionProcessGroupById(this.master.phGroupMasterId)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.toastrService.success(this.commonService.deletedmsg, "Message");

            this.productionProcessService.GetProcessHeadGroupMasterById(0).subscribe((data: any) => {
              if (data.success) {
                this.rowData = data.data;
              }
            });
          }
        });
    }
  }

  getCompany() {
    this.comboService.getCompany().subscribe((returns: any) => {
      this.companyList = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
    });
  }

  productImageFile: string;
  getProductImage(imageUrl: string) {
    this.productImageFile = "";
    // this.salesOfferService.getProductImage(imageUrl).subscribe((returns: any) => {
    //   if (returns.success) {
    //     this.productImageFile = returns.data[0].ImageFile;
    //   }
    // });
  }

  processHeadList = [];
  getAllProcessHeadNames() {
    this.productionProcessService.GetProductionProcessHeadById(0).subscribe((data: any) => {
      if (data.success) {
        // this.rowData=data.data;
        this.processHeadList = data.data.map((val: any) => ({
          id: val.processHeadId,
          name: val.headName,
          isQA: val.isQA,
          hasQC: val.isQA
        }));
      }
    })

  }

  public getBomDetailsProductSpec(id) {
    this.productrequisitionService
      .getAllProductForBOM(id)
      .subscribe((returns: any) => {
        this.detailsProductSpecList = returns.data.map((val: any) => ({
          id: val.productWiseSpecificationId,
          name: val.productName,
          uomId: val.uomId,
          uomName: val.uomName,
          productId: val.productId,
          price: val.price,
          imageUrl: val.imageUrl,
        }));
      });
  }

  public getBomMasterProductSpec() {
    this.bomService.GetBomMasterProductSpec(0).subscribe((returns: any) => {
      this.bomProductSpecList = returns.data.map((val: any) => ({
        id: val.productWiseSpecificationId,
        name: val.productName,
        uomId: val.uomId,
        uomName: val.uomName,
        productId: val.productId,
        price: val.price,
        imageUrl: val.imageUrl,
      }));
    });
  }

  validationForMasterSave(): boolean {
    if (
      this.master.lstDetailsViewModel.length == 0 ||
      this.master.lstDetailsViewModel == null
    ) {
      this.toastrService.warning(
        "Please add at least one BOM Details",
        "Message"
      );
      return false;
    }

    return true;
  }

  public addToDetailsGrid() {
    ////debugger;
    if (
      this.processHeadSelected == null ||
      this.processHeadSelected["id"] == null ||
      this.processHeadSelected["id"] == undefined
    ) {
      this.toastrService.warning("Please select a Process Head", "Message");
      return;
    }
    // if (this.price == 0 || this.price == null) {
    //   this.toastrService.warning("Price is zero.", "Message");
    //   return;
    // }
    if (this.headOrder == 0 || this.headOrder == null) {
      this.toastrService.warning("Head Order is zero.", "Message");
      return;
    }

    this.processHeadName = this.processHeadSelected["name"];
    this.processHeadId = this.processHeadSelected["id"];
    let elements = {
      phGroupDetailId: 0,
      processHeadId: this.processHeadId,
      processHeadName: this.processHeadName,
      headOrder: this.headOrder,
      isActive: 1,
      isQA: this.processHeadSelected["isQA"],
      hasQC: this.processHeadSelected["isQA"],
    };
    this.master.lstDetailsViewModel.push(elements);
    this.processHeadSelected = null;
  }

  public refeshDetails() {
    this.master.lstDetailsViewModel = [];
    this.toastrService.warning(this.commonService.warningmsg, "Message");
  }

  @Output() myEvent = new EventEmitter();

  public deleteRow(state, action) {
    ////debugger;
    const nodeIdToRemove = action.payload;
    const filteredData = state.rowData.filter(
      (node) => node.id !== nodeIdToRemove
    );
    return {
      ...state,
      rowData: [...filteredData],
    };
  }

  public deleteDetails(index: any) {
    let phGroupDetailId = this.master.lstDetailsViewModel[index].phGroupDetailId;
    this.selectedRow = this.master.lstDetailsViewModel[index];

    //if (this.selectedRow.helpDetailId > 0) { }

    if (phGroupDetailId > 0) {
      this.productionProcessService.DeleteProcessGroupDetailsById(phGroupDetailId)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.master.lstDetailsViewModel.splice(index, 1);
            this.toastrService.success(
              this.commonService.deletedmsg,
              "Message"
            );
          } else {
            this.toastrService.danger("Data not Delete!", "Message");
          }
        });
    } else {
      this.master.lstDetailsViewModel.splice(index, 1);
      this.toastrService.success(this.commonService.deletedmsg, "Message");
    }
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

  //#region Report

  public rbomProductSpecName: string = "";
  public rbomDescription: string = "";
  public rbomNo: string = "";
  public rbomDate: Date = null;
  public rPaymentDate: string = "";

  public rtotalQty: number = 0;
  public rbomQty: number = 0;
  public rgrandTotal: number = 0;

  public rReportHeader = "BOM (Bill of Materials) Report";
  public tableHeader = [
    "#",
    "Details Product Name",
    "Qty.",
    "Waste (%)",
    "Total Qty.",
    "UOM",
  ];
  public apiUrl = "";
  public htmlBodyData: string = "";

  public params = [];
  public bodyData: any = [];
  public bodyDatashow: any = [];

  private getReportData(bomId: number, buttonAction: any) {
    try {
      this.apiUrl = `Bom/GetBomReportDataById?bomId=${bomId}`;
      this.commonService
        .getReportData(this.apiUrl)
        .subscribe((returns: any) => {
          if (returns.success && returns.data.length > 0) {
            this.bodyData = [];
            this.bodyData = returns.data;
            this.rgrandTotal = this.bodyData[0]["grandTotal"];
            this.rbomProductSpecName = this.bodyData[0]["bomProductSpecName"];
            this.rbomDescription = this.bodyData[0]["bomDescription"];
            this.rbomDate = this.bodyData[0]["bomDate"];
            this.rbomQty = this.bodyData[0]["bomQty"];
            this.rbomNo = this.bodyData[0]["bomNo"];

            this.setParam();
            if (this.bodyData.length == 0) {
              this.toastrService.warning(
                "Message",
                this.commonService.nodatafound
              );
            } else {
              var fileName = this.pageNavigation + "." + buttonAction;
              const content = document.getElementById("reportHeader");
              this.generateSalesReport(
                buttonAction,
                fileName,
                content,
                2,
                this.bodyData
              );
            }
          } else {
            this.toastrService.warning(
              "Message",
              this.commonService.nodatafound
            );
          }
        });
    } catch (error) {
      this.toastrService.danger("Message", error);
    }
  }

  public setParam() {
    this.params = [];
    this.params.push({
      leftLabel: "BOM No.",
      leftValue: this.rbomNo,
      rightLabel: "BOM Date",
      rightValue: this.rbomDate,
    });
    this.params.push({
      leftLabel: "BOM Product Name",
      leftValue: this.rbomProductSpecName,
      rightLabel: "BOM Qty.",
      rightValue: this.rbomQty,
    });
  }

  public generateReport(buttonAction: any, bomId: number = 0) {
    ////debugger;
    // var fileName = this.pageNavigation + "." + buttonAction;
    this.getReportData(bomId, buttonAction);
    // if (this.bodyData.length == 0) {
    //   this.toastrService.warning("Message", this.commonService.nodatafound);
    // }
    // else {
    //   const content = document.getElementById("reportHeader");
    //   this.generateSalesReport(buttonAction, fileName, content, 2, this.bodyData);
    // }
  }

  generateSalesReport(
    buttonAction: any,
    fileName: string,
    content: any,
    columnIndex: any,
    bodyData: any
  ) {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(5); //optional
    doc.setTextColor(40); //optional
    const legend = {
      height: 100,
    };
    const addFooters = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      //var a = doc.internal.setFont("helvetica", "italic");
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
    doc.html(content, {
      callback: function (doc) {
        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 20,
          styles: { font: "Meta" },
          headStyles: {
            halign: "center",
            valign: "top",
            fontStyle: "bold",
            textColor: 50,
            fontSize: 20,
            fillColor: [216, 216, 216],
          },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 130,
          theme: "grid",
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.75,
          styles: {
            font: "Meta",
            lineColor: [44, 62, 80],
            lineWidth: 0.55,
          },
          headStyles: {
            fillColor: [105, 105, 105],
            fontSize: 11,
          },
          bodyStyles: {
            fillColor: [216, 216, 216],
            textColor: 50,
            valign: "middle",
          },
          alternateRowStyles: {
            fillColor: [250, 250, 250],
          },
          columnStyles: {
            2: { halign: "right" },
            3: { halign: "right" },
            4: { halign: "right" },
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

  //#endregion Report

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
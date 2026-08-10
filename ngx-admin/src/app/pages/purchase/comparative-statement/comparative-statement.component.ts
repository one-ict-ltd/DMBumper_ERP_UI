import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, TemplateRef } from "@angular/core";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup } from "@angular/forms";
import {
  NbComponentStatus, NbDialogService, NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrConfig, NbToastrService,
} from "@nebular/theme";
import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
import { ProducttransferService } from "app/services/inventory/producttransfer.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { ProductService } from "app/services/inventory/product.service";
import { BranchService } from "app/services/erpsetting/branch.service";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { BillcollectionService } from "app/services/sales/billcollection.service";
import { StockinService } from "app/services/inventory/stockin.service";
import { forkJoin } from "rxjs";
import { PurchaserequisitionService } from "app/pages/purchase/settings/purchaserequisition.service";
import { take } from "rxjs/operators";

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}


@Component({
  selector: 'ngx-comparative-statement',
  templateUrl: './comparative-statement.component.html',
  styleUrls: ['./comparative-statement.component.scss']
})
export class ComparativeStatementComponent implements OnInit {
  master: {
    csMasterId: number,
    quotationCollectionMasterId: number
    csMasterNo: string,
    csDate: Date;
    productName: string;
    remarks: string;
    lstCSDetailsViewModel: any[];

    quotationCollection: string;
    quotationSelected: {}
    isDisabled: boolean;
    BudgetCreateId: number;
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
    //debugger;
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Comparative Statement(CS)";
  public rptHeader = "Product Issue (TD)";

  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      //this.getProductReqNo();
      //this.master.isActive = 1;
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
      isDisabled: false,
      csMasterId: 0,
      quotationCollectionMasterId: 0,
      csMasterNo: "",
      csDate: new Date(),
      productName: "",
      remarks: "",
      lstCSDetailsViewModel: [],
      quotationCollection: null,
      quotationSelected: null,
      BudgetCreateId: 0
    };
    this.getComperativeStatementNo();
    this.getQuotationCollectionNoName();
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
      console.log("Click action button");
    }
  }
  /////End of Dynamic Button section (Do Not Edit)///////

  /////////////////////////////// CRUD ///////////////////////////////////////////

  private save() {
    debugger;
    var button = this.commonService.buttonClicked;
    // if (this.master.prodReqNo == "" || this.master.prodReqNo == null) {
    //   this.toastrService.danger("Please enter a transfer No.", "Message");
    //   this.commonService.valueSet("create");
    //   return false;
    // }
    // if (this.master.csDate == null) {
    //   this.toastrService.danger("Please enter transfer date.", "Message");
    //   this.commonService.valueSet("create");
    //   return false;
    // }
    // if (this.master.fromsbuId == 0 || this.master.fromsbuId == null) {
    //   this.toastrService.danger("Please select from sbu.", "Message");
    //   this.commonService.valueSet("create");
    //   return false;
    // }
    // if (this.master.tosbuId == 0 || this.master.tosbuId == null) {
    //   this.toastrService.danger("Please select to sbu.", "Message");
    //   this.commonService.valueSet("create");
    //   return false;
    // }
    // if (
    //   this.master.lstCSDetailsViewModel.length == 0 ||
    //   this.master.lstCSDetailsViewModel == null
    // ) {
    //   this.toastrService.danger("Please enter a product.", "Message");
    //   this.commonService.valueSet("create");
    //   return false;
    // }
    this.show = true;
    this.master.csDate = this.commonService.DateFormat(this.master.csDate);

    this.purchaserequisitionService.saveComparativeStatement(this.master).subscribe((returns: any) => {
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

        this.getMaster(); //////////////Grid Refresh ///////////////////
        //debugger;
        this.purchaserequisitionService.GetComparativeStatementById(0).subscribe(
          (data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          });
      }
      else {
        this.toastrService.warning(
          this.commonService.successmsg,
          "Message"
        );
      }

    })

  }

  private reset() {
    this.getMaster();
    //this.getProductReqNo();
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

  constructor(
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private productrequisitionService: ProductrequisitionService,
    private ProducttransferService: ProducttransferService,
    private comboService: CommoncomboService,
    private productService: ProductService,
    private branchService: BranchService,
    private stockinService: StockinService,
    private purchaserequisitionService: PurchaserequisitionService,
    private billcollectionService: BillcollectionService
  ) {
    this.commonService.valueSet("showlist");
    this.getProductDetails();
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
      //   headerName: "Product Req. ID",
      //   field: "prodReqId",
      //   filter: "agNumberColumnFilter",
      //   editable: false,
      //   width: 180,
      // },
      {
        headerName: " No.",
        field: "csMasterNo",
        width: 180,
      },
      {
        headerName: "Date",
        field: "csDate",
        width: 150,
      },
      // {
      //   headerName: "Quotation Collection No.",
      //   field: "quotationCollectionMasterNo",
      //   width: 120,
      // },
      {
        headerName: "Remarks",
        field: "remarks",
        width: 120,
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
    //this.getProductReqNo();
  }

  onGridReady(params) {
    debugger
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.purchaserequisitionService
      .GetComparativeStatementById(0).subscribe(
        (data: any) => {
          if (data.success) {
            this.rowData = data.data;
          }
        }
      );
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
    debugger
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
      var csMasterId = event.node.data.csMasterId;

      this.purchaserequisitionService
        .GetComparativeStatementById(csMasterId)
        .subscribe((data: any) => {
          if (data.success) {
            this.master = data.data[0];
            this.master.csDate = new Date(data.data[0].csDate);

            //  let quotation = this.quotationList.filter(x=> x.id = this.master.quotationCollectionMasterId)[0];
            this.master.quotationSelected = {
              id: data.data[0].quotationCollectionMasterId,
              name: data.data[0].quotationCollectionMasterNo,
              productName: data.data[0].productName,
            }

            this.master.productName = this.master.productName;
            // this.master.quotationSelected = {
            //   id:  data.data[0].quotationCollectionMasterId,
            //   name: data.data[0].quotationCollectionMasterNo,
            // }

            this.getquotationDetailsById(this.master.quotationCollectionMasterId, this.master.csMasterId)
            this.master.isDisabled = true;
          }
        });

      this.ngOnInit();
    }
  }

  private agDelete(event) {

    if (confirm('Are you sure to delete?')) {
      this.master.csMasterId = event.node.data.csMasterId;
      this.purchaserequisitionService.deleteComparativeStatementById(this.master.csMasterId)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.toastrService.success(this.commonService.deletedmsg, "Message");

            //////////////Grid Refresh ///////////////////
            this.purchaserequisitionService
              .GetComparativeStatementById(0)
              .subscribe((data: any) => {
                if (data.success) {
                  this.rowData = data.data;
                }
              });
            //////////////Grid Refresh ///////////////////
          }
        });
    }
  }



  // public getProductById(id) {

  //   this.purchaserequisitionService.GetQuotationCollectionDetailsById(id).subscribe((returns: any) =>{
  //     if(returns.success){
  //       this.master.lstCSDetailsViewModel=returns.data;
  //     }
  //     console.log("data list for supplierr-------------------------------",returns.data);
  //   })

  //   this.master.productName = this.master.quotationSelected["productName"];
  //   //this.GetCurrentStock();
  // }

  public getFromWarehouse() { }

  public prodSelected = [];

  public getProductDetails() {
    this.productrequisitionService
      .getAllProductForRequisition()
      .subscribe((returns: any) => {
        //console.log(returns.data);
        this.prodSelected = returns.data.map((val: any) => ({
          id: val.productWiseSpecificationId,
          name: val.productName,
          productId: val.productId,
          uomId: val.uomId,
          uomName: val.uomName,
        }));
      });
  }

  public getquotationDetailsById(quotationCollectionMasterId, csMasterId) {

    this.purchaserequisitionService.GetQuotationCollectionDetailsById(quotationCollectionMasterId, csMasterId).subscribe((returns: any) => {
      if (returns.success) {
        this.master.lstCSDetailsViewModel = returns.data;
      }
    })

    this.master.productName = this.master.quotationSelected["productName"];
    //this.GetCurrentStock();
  }

  public deleteDetail(index: any) {
    if (confirm('Are You Sure?')) {
      this.selectedRow = this.master.lstCSDetailsViewModel[index];
      const productTrnfrDetailsId = this.selectedRow.productTrnfrDetailsId;
      this.ProducttransferService.deleteProductTrnfrDetailsById(productTrnfrDetailsId).pipe(take(1)).subscribe(
        (returns: any) => {
          if (returns.success) {
            this.master.lstCSDetailsViewModel.splice(index, 1);
            if (this.selectedRow.helpDetailId > 0) {
            }
            this.toastrService.danger(this.commonService.deletedmsg, "Message");
          } else {
            this.toastrService.warning('Data is not deleted', "Message");
          }
        }
      );
    }
  }

  public refesh() {
    this.master.lstCSDetailsViewModel = [];
    this.toastrService.warning(this.commonService.warningmsg, "Message");
  }


  selectedRate(event: any, rowIndex: number) {
    debugger;
    //console.log(this.master.processModelList[index]);
    this.master.lstCSDetailsViewModel[rowIndex].rate = this.master.lstCSDetailsViewModel[rowIndex].sightRate
    if (event == 1 || event == "1") {
      this.master.lstCSDetailsViewModel[rowIndex].rateFrom = 1;
    } else if ((event == 2 || event == "2")) {
      this.master.lstCSDetailsViewModel[rowIndex].rate = this.master.lstCSDetailsViewModel[rowIndex].deferredRate
      this.master.lstCSDetailsViewModel[rowIndex].rateFrom = 2;
    }

    this.CalculateTotal(rowIndex)

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

  /////////////////////////////////////////get data section for cs////////////////

  public getComperativeStatementNo() {
    if (this.master.csDate == null) {
      this.master.csDate = new Date();
    }
    this.purchaserequisitionService
      .getComperativeStatementNo(
        this.commonService.DateFormat(this.master.csDate))
      .subscribe((returns: any) => {
        //console.log(returns);
        if (returns.success) {
          this.master.csMasterNo = returns.data[0].MaxNo;
        }
      });
  }
  public quotationList = [];
  public getQuotationCollectionNoName() {
    this.purchaserequisitionService.getQuotationCollectionNoName().subscribe((returns: any) => {
      if (returns.success) {
        this.quotationList = returns.data.map((val: any) => ({
          id: val.id,
          name: val.name,
          productName: val.productName
        }));
        // console.log(this.quatationNoName );
      }
    })
  }




  ////////////////////////////////////// report section/////////////////////////////////////////////////////////////

  public getCompany() {
    this.comboService.getCompany().subscribe((returns: any) => {
      this.companyItems = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
    });
  }

  public tableHeader = [
    "#",
    "Product Name",
    "Carton Qty.",
    "Loose Qty.",
    "UOM",
    // "TP",
    "Amount (TK)"];

  private agReport(event) {
    debugger
    this.generateCrReport(event.data.csMasterId, event.data.quotationCollectionMasterId, 'pdf');
    //this.getReportData(event.data.csMasterId);
  }
  generateCrReport(masterId: any, quotationCollectionMasterId: any, reportFormat: any) {
    let apiUrl = `PurchaseRequisition/GetComparativeStatementReport?comparativeStatementMasterId=${masterId}&quotationCollectionMasterId=${quotationCollectionMasterId}&reportFormat=${reportFormat}`;
    //console.log(this.apiUrl);
    this.commonService.GetCrystalReportData(apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }
  datalength: number;
  prodReqNo = "";
  csDate = "";
  purpose = "";
  bodyData = [];
  headerData = [];
  params = [];
  gTotal: number = 0.00;
  public comStNo: string = "";
  public comDate: Date;
  public quocolNo: string = '';
  public pordName: string = '';
  public csDetailsData: any = [];
  public getReportData(masterId) {

    debugger;
    this.purchaserequisitionService
      .GetComparativeStatementById(masterId).subscribe((data: any) => {
        if (data.success) {
          // console.log("quotation master data:======================",data.data);
          this.master = data.data[0];
          this.quocolNo = data.data[0].quotationCollectionMasterNo;
          this.pordName = data.data[0].productName;
          this.comDate = data.data[0].csDate;
          this.comStNo = data.data[0].csMasterNo;



          this.purchaserequisitionService.GetCSDetailsbyMasterId(masterId, 0).subscribe((data: any) => {
            if (data.success) {
              //  console.log("cs Details Data:=============",data.data);
              this.csDetailsData = data.data;
            }
            var fileName = this.rptHeader + ".pdf";
            const content = document.getElementById("reportHeader");
            this.generateReport("print", fileName, content, this.datalength);
          })



        }
        else {
          this.toastrService.danger("Message", this.commonService.nodatafound);
        }

        // console.log("master model");
        console.log("master model", this.master);

      });
  }


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
          startY: legend.height + 50,
          styles: { font: "Meta", fontSize: 15, halign: "center" },
        });

        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 80,
          styles: { font: "Meta" },
        });


        autoTable(doc, {
          html: "#body_table1",
          startY: legend.height + 150,
          theme: "grid",
          // tableLineColor: [0, 0, 0],
          // tableLineWidth: 0.75,
          styles: {
            font: "Meta",
            lineColor: [44, 62, 80],
            lineWidth: 0.55,
          },
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontSize: 11,
            halign: "center",
            valign: "middle",
            fontStyle: "bold",
          },
          bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
          columnStyles: {
            3: { halign: "right" },
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });

        autoTable(doc, {
          html: "#footer_table",
          //startY: legend.totalheight + 300,
          theme: "grid",
          // tableLineColor: [0, 0, 0],
          // tableLineWidth: 0.75,
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
            fillColor: [255, 255, 255],
            textColor: 50,
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
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
  checkChange(e, rowIndex) {
    debugger;
    if (e.target.checked) {
      this.master.lstCSDetailsViewModel[rowIndex].isEnable = 1;
      this.master.lstCSDetailsViewModel[rowIndex].total = Math.round(this.master.lstCSDetailsViewModel[rowIndex].approvedqty * this.master.lstCSDetailsViewModel[rowIndex].rate);
    } else {
      this.master.lstCSDetailsViewModel[rowIndex].isEnable = 0;
      this.master.lstCSDetailsViewModel[rowIndex].total = 0;
      this.master.lstCSDetailsViewModel[rowIndex].approvedqty = this.master.lstCSDetailsViewModel[rowIndex].qty;

    }
  }

  CalculateTotal(rowIndex) {
    this.master.lstCSDetailsViewModel[rowIndex].total =
      Math.round(this.master.lstCSDetailsViewModel[rowIndex].approvedqty * this.master.lstCSDetailsViewModel[rowIndex].rate);

  }


}
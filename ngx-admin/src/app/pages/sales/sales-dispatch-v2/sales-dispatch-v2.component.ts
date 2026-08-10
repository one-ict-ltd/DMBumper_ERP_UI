import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
} from "@angular/core";
import {
  NbComponentStatus,
  NbDialogService,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
// import { SalesDistributionService } from "app/services/sales/sales-distribution.service";

import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup } from "@angular/forms";
// import { FieldforcemasterService } from "app/services/fieldforcetracking/fieldforcemaster.service";
import { DatePipe } from "@angular/common";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";
// import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { EmployeeinformationService } from "app/services/hrm/employeeinformation.service";

import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
@Component({
  selector: 'ngx-sales-dispatch-v2',
  templateUrl: './sales-dispatch-v2.component.html',
  styleUrls: ['./sales-dispatch-v2.component.scss']
})
export class SalesDispatchV2Component implements OnInit {

  loadFromDateShow: Date = new Date();
  loadToDateShow: Date = new Date();
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
  isUpdate: boolean = false;


  constructor(
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    // private SalesDistributionService: SalesDistributionService,
    // private fieldforcemasterService: FieldforcemasterService,
    // private datePipe: DatePipe,
    private employeeinformationService: EmployeeinformationService,
    private salesinvoiceService: SalesinvoiceService
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
        headerName: "Dispatch Number",
        field: "dispatchNo",
        width: 180,
      },
      {
        headerName: "Dispatch Date",
        field: "dispatchDate",
        width: 160,
      },
      {
        headerName: "Prepared By",
        field: "empName",
        width: 250,
      },
      {
        headerName: "Dispatcher Name",
        field: "dispatcherName",
        width: 280,
      },
      {
        headerName: "GDN Status",
        field: "gdnStatus",
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

  public pageNavigation = "Sales Dispatch";
  public buttons = this.commonService.btnList;

  public ButtonAction() {

    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.GetSalesInvoiceMasterListForApproval();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      //this.GetSalesInvoiceMasterListForApproval();
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      if (this.master.EmployeeSelected == undefined || undefined) {
        this.toastrService.warning('Please select a Dispatcher Name', 'Msg');
        this.commonService.valueSet("create");
        return;
      }
      this.save();
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
      //this.commonService.valueSet("create");
    } else if (this.commonService.buttonClicked == "view") {
      this.show = false;
    } else if (this.commonService.buttonClicked == "reset") {
      //this.GetSalesInvoiceMasterListForApproval();
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      this.show = false;
    }
  }

  master: {
    distributionMasterId: number;
    employeeId: number;
    startDate: Date;
    approvalStatus: string;
    lstMasterViewModel: any[];
    lstProductListViewModel: any[];
    EmployeeSelected: {};
  };

  public getMaster() {
    this.isUpdate = false;
    this.master = {
      distributionMasterId: 0,
      employeeId: 0,
      approvalStatus: "",
      lstMasterViewModel: [],
      lstProductListViewModel: [],
      startDate: new Date(),
      EmployeeSelected: null
    };
    //this.GetSalesInvoiceMasterListForApproval();
  }

  public EmployeeList = [];
  public getEmployee() {
    this.master.EmployeeSelected = null;
    this.employeeinformationService.GetDispatcher().subscribe((retuns: any) => {
      if (retuns.success) {
        this.EmployeeList = retuns.data.map((val: any) => ({
          id: val.employeeId,
          name: val.empName,
        }));
      }
    })
  }

  AddProduct(e, salesInvoiceId) {
    if (e.target.checked) {
      //alert(salesInvoiceId);
      this.salesinvoiceService.GetSalesInvoiceDetailsByIdForApproval(salesInvoiceId).subscribe((data: any) => {
        //debugger;
        if (data.success) {
          data.data.forEach((value, index) => {
            if (this.master.lstProductListViewModel.length == 0) {
              this.master.lstProductListViewModel.push(value);
            } else {
              var indexu = this.master.lstProductListViewModel.findIndex(
                (x) =>
                  x.productWiseSpecificationId == value.productWiseSpecificationId
              );
              if (indexu > -1) {
                this.master.lstProductListViewModel[indexu].invoiceQty += value.invoiceQty;
              } else {
                this.master.lstProductListViewModel.push(value);
              }
            }
          });
        }
      });
    } else {
      this.salesinvoiceService.GetSalesInvoiceDetailsByIdForApproval(salesInvoiceId).subscribe((data: any) => {
        //debugger;
        if (data.success) {
          data.data.forEach((value, index) => {
            var indexu = this.master.lstProductListViewModel.findIndex(
              (x) =>
                x.productWiseSpecificationId == value.productWiseSpecificationId
            );
            if (indexu > -1) {
              this.master.lstProductListViewModel[indexu].invoiceQty -= value.invoiceQty;
              if (this.master.lstProductListViewModel[indexu].invoiceQty <= 0) {
                this.master.lstProductListViewModel.splice(indexu, 1);
              }
              // this.master.lstProductListViewModel.forEach((value, index) => {
              //   if (value.invoiceQty == 0) this.master.lstProductListViewModel.splice(index, 1);
              // });
            }
          });
        }
      });

    }
    //console.log(this.master.lstProductListViewModel);
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
    if (
      this.ApprovalStatusSelected == null ||
      this.ApprovalStatusSelected["name"] == ""
    ) {
      this.toastrService.warning("Please select a Approval Status.", "Message");
      // this.commonService.valueSet("create");
      return false;
    }

    let count: number = 0;
    this.master.lstMasterViewModel.forEach((e) => {
      if (e.isSelect == 1) count++;
    });

    if (count == 0) {
      this.toastrService.warning(
        "Please select a invoice for approval.",
        "Message"
      );
      // this.commonService.valueSet("create");
      return false;
    }

    return true;
  }

  private save() {
    //console.log(this.master);

    if (this.master.employeeId == 0 && this.master.employeeId == null) {
      this.toastrService.danger("Please Select Dispatcher", "Message");
      return false;
    }
    if (!this.isUpdate) {
      let count: number = 0;
      this.master.lstMasterViewModel.forEach((e) => {
        if (e.isSelect == 1) count++;
      });
      if (count == 0) {
        this.toastrService.warning("Please select SALES PICKING  for Dispatch", "Message");
        return false;
      }

    }


    this.master.startDate = this.commonService.DateFormat(this.master.startDate);
    var button = this.commonService.buttonClicked;
    this.show = true;
    this.salesinvoiceService
      .SetSalesDispatch(this.master)
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
          this.loadGridData();
        }
        else {
          this.toastrService.warning(
            this.commonService.failedmsg,
            "Message"
          );
        }
      });
    this.getMaster();
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
    if (data == "edit") {

      let gdnStatus = event.node.data.gdnStatus;
      // if(gdnStatus && gdnStatus=="Confirmed"){
      //   this.toastrService.info("GND Status Already Confirmed! You Can not Change the Dispatcher's Name and Date!", 'Info')
      //   return;
      // }
      this.getMaster();
      //this.agEdit(event);
      this.toastrService.info('Not Allowed', 'Info')
      //this.show = false;
    } else if (data == "view") {
      this.commonService.valueSet("showlist");
      this.toastrService.info('Not Allowed', 'Info')
      //this.agEdit(event);
      //this.show = false;
      //this.disabled = true;
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
      if (confirm('Are you sure to delete?')) {
        //this.toastrService.warning('Not Allowed', 'Info')
        this.agDelete(event);
      }
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }

  private agEdit(event) {


    this.disabled = false;
    this.isUpdate = true;
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
      this.master.distributionMasterId = event.node.data.dispatchMasterId;
      this.master.startDate = new Date(event.node.data.dispatchDate);
      this.master.EmployeeSelected = { id: event.node.data.dispatcherId, name: event.node.data.dispatcherName };
      this.master.employeeId = event.node.data.dispatcherId;
      this.toastrService.info('You only Change Dispatcher Name and Date!', 'Info')
      //alert(generalPolicyId);
      this.salesinvoiceService.GetSalesDispatchDetailsbyId(this.master.distributionMasterId).subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0];

          //this.master.fromDate = new Date(data.data[0].fromDate);
          // this.master.endDate = new Date(data.data[0].endDate);
          // this.partiesSelected = { id: data.data[0].partyId, name: data.data[0].partyName };

          console.log(this.master);
        }
      });
      this.ngOnInit();
    }
  }

  private agDelete(event) {

    let gdnStatus = event.node.data.gdnStatus;
    if (gdnStatus && gdnStatus == "Confirmed") {
      this.toastrService.info("GND Status Already Confirmed! You can not Change the Dispatcher's Name and Date!", 'Info')
      return;
    }

    if (window.confirm("Do you really want to Delete?")) {
      this.salesinvoiceService.DeleteDispatch(event.data.dispatchMasterId).subscribe((data: any) => {
        if (data.success) {
          this.toastrService.success(this.commonService.deletedmsg, 'Info')
          this.loadGridData();
        }
        else {
          this.toastrService.warning(this.commonService.deleteFailedMsg, 'Info')
        }
      });
    }

  }

  private agReport(event) {
    // this.getReportData(event.data.dispatchMasterId);
    // this.generateReport1(event.data.dispatchMasterId, "print");
    this.GetReport(event.data.dispatchMasterId);
  }

  private GetReport(masterId) {
    let userInfo = this.commonService.GetUserProfileJson();
    this.apiUrl = `SalesInvoiceReport/GetDispatchReport?reportFormat=Pdf&userId=${userInfo[0].employeeid}&masterId=${masterId}`;
    debugger;
    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        console.log(res.message);
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }

  public generateReport1(collectionMasterId, buttonAction: any) {
    var fileName = this.pageNavigation + ".pdf";
    //this.getReportData(collectionMasterId);
    const content = document.getElementById("reportHeader");
    this.generateReport(buttonAction, fileName, content, this.datalength);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.loadGridData();
  }
  loadGridData() {
    this.salesinvoiceService
      .GetSalSpGetAllSalesDispatchJson(this.commonService.DateFormat(this.loadFromDateShow), this.commonService.DateFormat(this.loadToDateShow)).subscribe((data: any) => {
        if (data.success) {
          this.rowData = data.data;
        }
      });
  }
  isSelectAll: boolean = false;
  ToggleChange(event: any) {
    let isChecked: boolean = false;
    isChecked = event.target.checked;
    this.master.lstMasterViewModel.forEach(element => {
      element.isSelect = isChecked;
    });
  }

  LoadAllDropdown() {
    this.getEmployee();
    this.loadApprovalStatusList();
  }

  GetSalesInvoiceMasterListForApproval() {
    //this.commonService.valueSet("create");
    this.salesinvoiceService
      .GetSalesPickingMasterListJson(0)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.master.lstMasterViewModel = returns.data;
          console.log(this.master.lstMasterViewModel);
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
  //   {
  //   // salesInvoiceId: 0,
  //   // grandTotal: 0,
  //   // salesInvoiceNo: '',
  //   // salesInvoiceDate: '',
  //   // partyName: '',
  //   // address: '',
  //   // mobileNo: '',
  //   lstDetailsViewModel: any[],
  // };
  GetSalesInvoiceDetails(salesInvoiceId: number) {
    this.salesinvoiceService
      .GetSalesInvoiceDetailsByIdForApproval(salesInvoiceId)
      .subscribe((data: any) => {
        if (data.success) {
          //console.log(data.data);

          this.SalesModel = data.data;
          this.salesInvoiceId = data.data[0].salesInvoiceId;
          this.grandTotal = data.data[0].grandTotal;
          this.salesInvoiceNo = data.data[0].salesInvoiceNo;
          this.salesInvoiceDate = data.data[0].salesInvoiceDate;
          this.partyName = data.data[0].partyName;
          this.mobileNo = data.data[0].mobileNo;

          //console.log(this.SalesModel);
        }
      });
  }


  public calculateTotal(index: any) {
    let totalPrice = 0;
    let invoiceQty =
      (this.SalesModel[index].invoiceQty == null || this.SalesModel[index].invoiceQty == undefined || this.SalesModel[index].invoiceQty == "")
        ? 0
        : this.SalesModel[index].invoiceQty;
    this.SalesModel[index].invoiceQty = invoiceQty;

    let price =
      this.SalesModel[index].price == ""
        ? 0
        : this.SalesModel[index].price;
    let vat =
      this.SalesModel[index].vat == ""
        ? 0
        : this.SalesModel[index].vat;
    let ait =
      this.SalesModel[index].ait == ""
        ? 0
        : this.SalesModel[index].ait;
    let discountAmount =
      this.SalesModel[index].discountAmount == ""
        ? 0
        : this.SalesModel[index].discountAmount;

    totalPrice = invoiceQty * price;
    vat = totalPrice * (vat / 100);
    ait = totalPrice * (ait / 100);
    discountAmount = totalPrice * (discountAmount / 100);

    this.SalesModel[index].total =
      totalPrice + vat + ait - discountAmount;
    this.calculateGrandTotal();
  }
  calculateGrandTotal() {
    this.grandTotal = 0;
    this.SalesModel.forEach((row) => {
      this.grandTotal += row.total == "" ? 0 : row.total;
    });

    // let totalVat = this.master.totalVat == null ? 0 : this.master.totalVat;
    // let totalDiscountAmount =
    //   this.master.totalDiscountAmount == null
    //     ? 0
    //     : this.master.totalDiscountAmount;
    // totalVat = totalVat - totalDiscountAmount;
    // let totalAit = this.master.totalAit == null ? 0 : this.master.totalAit;
    // let shippingCost =
    //   this.master.shippingCost == null ? 0 : this.master.shippingCost;

    // this.master.totalGross = totalGross;
    // this.master.grandTotal = totalGross + totalVat + totalAit + shippingCost;
  }

  UpdateSalesInvoiceDetails() {
    this.salesinvoiceService
      .UpdateSalesInvoiceDetails(this.SalesModel)
      .subscribe((returns: any) => {
        if (returns.success) {
          //this.master.lstMasterViewModel = returns.data;
          this.toastrService.success(returns.message, 'Message');

          this.GetSalesInvoiceMasterListForApproval();
        }
        else {
          this.toastrService.warning(returns.message, 'Warning');
        }
      });
  }

  msg = "";
  names: any;
  ViewDetails(dialog: TemplateRef<any>, salesInvoiceId: number) {
    debugger;
    this.GetSalesInvoiceDetails(salesInvoiceId);

    this.dialogService.open(dialog, {
      context: [],
    });
  }

  // openWithDataModel() {
  //   this.dialogService
  //     .open(DialogNamePromptComponent)
  //     .onClose.subscribe((name) => name && this.names.push(name));
  // }

  ApprovalStatusList: {};
  ApprovalStatusSelected: {};
  loadApprovalStatusList() {
    this.ApprovalStatusList = [
      // {
      //   id: 0,
      //   name: "select one",
      // },
      {
        id: 1,
        name: "Approve",
      },
      {
        id: 0,
        name: "Pending",
      },
      {
        id: 2,
        name: "Rejected",
      },
    ];
  }

  public datalength: number;
  private getReportData(collectionId) {
    this.bodyData = [];
    this.apiUrl = `SalesInvoice/GetSalSpGetAllSalesDispatchByIdJson?masterId=${collectionId}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        //console.log(returns.data);
        this.datalength = returns.data.length * 50;
        this.bodyData = returns.data;
        this.dispatchNo = returns.data[0].dispatchNo;
        this.dispatchDate = returns.data[0].dispatchDate;
        this.dispatcherName = returns.data[0].fullName;
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
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
      height: 60,
      totalheight: 60 + datalength,
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
    doc.html(content, {
      callback: function (doc) {
        autoTable(doc, {
          html: "#header_table_top",
          startY: legend.height + 20,
          styles: { font: "Meta", fontSize: 15, halign: "center" },
          bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });
        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 60,
          styles: { font: "Meta" },
          bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });
        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 120,
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


}
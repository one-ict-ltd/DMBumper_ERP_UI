import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup, NgForm } from "@angular/forms";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
import { PurchaserequisitionService } from "app/pages/purchase/settings/purchaserequisition.service";
import { ProductService } from 'app/services/inventory/product.service';
import {
  NbComponentStatus,
  NbDialogService,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { CommoncomboService } from "app/services/commoncombo.service";
import { PartyService } from "app/services/party.service";
import { EmployeeinformationService } from "app/services/hrm/employeeinformation.service";
import { FieldforcemasterService } from "app/services/fieldforcetracking/fieldforcemaster.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: 'ngx-charge',
  templateUrl: './charge.component.html',
  styleUrls: ['./charge.component.scss']
})
export class ChargeComponent implements OnInit {

  master: {
    ImpBankInsuranceChargeMasterId: number;
    ImpLCInfoMasterId: number;
    chargeTypeId: number;
    chargeFlag: boolean;
    lstReqDetailsViewModel: any[];
    referenceSelected: {};
    preLcId: number;
    lcNo: string;
    lcaNo: string;
    totalLcAmount: number;
    frightAmount: number;
    bankSelected: {};
    bankId: number;
    documentNo: string;
    bankChargeDate: Date;
    lcOpenDate: Date;
    remarks: string;
    lcAmount: number;
    insuranceNo: string,
    insuranceDate: Date;
    insuranceAmount: number;
    insuranceCompany: string;
    insuranceBranch: string;
    openBankName: string;


    particularBankId: number;
    particularBankSelected: {};
    insurenceCompanySelected: {};
    particularName: string;
    amount: number;
    refNo: string;
    isActive: boolean;
    chargeType: string
    chargeSelected: {};
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
  description: string;
  selectedRow: any;

  ngOnInit() {
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Bank and Insurance Charge";
  public buttons = this.commonService.btnList;
  public temperatureMode = "SIGHT";
  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      //this.openConfirmPopup("");
      this.save();
     // this.show = true;
    } else if (this.commonService.buttonClicked == "update") {
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
  public getMaster() {
    this.master = {
      ImpBankInsuranceChargeMasterId: 0,
      ImpLCInfoMasterId: null,
      chargeTypeId: null,
      chargeType: null,
      chargeFlag: true,
      lstReqDetailsViewModel: [],
      referenceSelected: null,
      preLcId: 0,
      lcNo: "",
      lcaNo: "",
      totalLcAmount: 0,
      frightAmount: 0,
      bankSelected: null,
      bankId: null,
      documentNo: "",
      bankChargeDate: new Date(),
      lcOpenDate: new Date(),
      remarks: "",
      lcAmount: 0,
      insuranceNo: null,
      insuranceDate: new Date(),
      insuranceAmount: 0,
      insuranceCompany: "",
      insuranceBranch: "",
      openBankName: "",
      particularBankId: 0,
      particularBankSelected: null,
      insurenceCompanySelected: null,
      particularName: "",
      amount: 0,
      refNo: "",
      isActive: false,
      chargeSelected: null,

    };
    this.ToggleDissabled();
  }
  public zoneList = [];
  public getzone() {
    this.fieldforcemasterService.getZone(0).subscribe((retuns: any) => {
      if (retuns.length) {
        this.zoneList = retuns.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }
  public depotList = [];
  public getdepot() {
    var zoneId = 0;
    this.fieldforcemasterService.getZone(0).subscribe((retuns: any) => {
      if (retuns.length) {
        zoneId = retuns[0].ZoneID
      }
    })
    this.fieldforcemasterService.getDepo(zoneId).subscribe((retuns: any) => {
      if (retuns.success) {
        this.depotList = retuns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }



  /*
GetRegionByZoneCode( ZoneCode);GetRegionByZoneOrDepoCode
GetDepoByRegionCode( RegionCode)
GetAreaByDepoCode(DepoCode);
  */







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


  public refesh() {
    this.master.lstReqDetailsViewModel = [];
    this.toastrService.warning(this.commonService.warningmsg, "Message");
  }



  private save() {
    debugger;
    var button = this.commonService.buttonClicked;

    if (this.master.ImpLCInfoMasterId == 0 || this.master.ImpLCInfoMasterId == null) {
      this.toastrService.warning(`Please select reference no.`, 'Warning !')
      this.commonService.valueSet("create");
      return false;
    }

    // else if (this.master.creditLimit == null || this.master.creditLimit == 0) {
    //   this.toastrService.danger("Please insert credit limit amount", "Message");
    //   this.commonService.valueSet("create");
    //   return;
    // }
    // else if (this.master.creditDays == null || this.master.creditDays == 0) {
    //   this.toastrService.danger("Please insert credit days limit", "Message");
    //   this.commonService.valueSet("create");
    //   return;
    // }
    // else if (this.master.countData != 0) {
    //   this.toastrService.danger("Duplicate party name", "Message");
    //   this.commonService.valueSet("create");
    //   return false;
    // }

    // else if (this.master.territorySelected == null || this.master.territorySelected["id"] == null) {
    //   this.toastrService.danger("Please choose market structure", "Message");
    //   this.commonService.valueSet("create");
    //   return;
    // }
    // else if (this.master.contactNumber == '') {
    //   this.toastrService.danger("Please insert contact number", "Message");
    //   this.commonService.valueSet("create");
    //   return;
    // }

    //console.log('s ', this.master);

    debugger;
    if (this.master.chargeTypeId === 1) {
      this.master.chargeType = "bank";
    }
    if (this.master.chargeTypeId === 0) {
      this.master.chargeType = "insurance";
    }
    this.master.bankChargeDate = this.commonService.DateFormat(this.master.bankChargeDate);
    this.master.insuranceDate = this.commonService.DateFormat(this.master.insuranceDate);
    this.show = true;
    this.purchaserequisitionService.saveBankInsuranceCharge(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        }
        else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }

        this.commonService.valueSet('showlist');
        this.purchaserequisitionService.getBankInsuranceChargeData(0).subscribe((data: any) => {
          if (data.success) {
            this.rowData = data.data;
          }
        })
      }
      else {
        this.toastrService.danger(this.commonService.failedmsg, "Message")
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

  readonly profile = [];
  dissabledForDepot: boolean = false;
  constructor(
    private http: HttpClient,
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private partyService: PartyService,
    private comboService: CommoncomboService,
    private employeeinformationService: EmployeeinformationService,
    private fieldforcemasterService: FieldforcemasterService,
    private productrequisitionService: ProductrequisitionService,
    private purchaserequisitionService: PurchaserequisitionService,
    private productService: ProductService
  ) {
    this.commonService.valueSet('showlist');

    //this.getReferenceList();
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
        headerName: "LC No",
        field: "lcNo",
        //filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "Bank Charge Date",
        field: "bankChargeDate",
        //  filter: "agTextColumnFilter",
        width: 200,
      },

      // {
      //   headerName: "LCA No",
      //   field: "lcaNo",
      //   //filter: "agTextColumnFilter",
      // },
      {
        headerName: "Charge Type",
        field: "chargeType",
        //filter: "agTextColumnFilter",
      },
      {
        headerName: "Is Active?",
        field: "isActive",
      },
      {
        field: "action",
        cellRenderer: "btnCellRenderer",
        cellRendererParams: {
          clicked: function (field: any) {
            //localStorage.setItem("Token", user.auth_token);
            localStorage.setItem("button", field);
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
    this.getBank();
    this.loadChargeList();
    this.loadparticularListforBankData();
    this.loadChargeHeadList();
    this.getPreLcIdListFromLcMasterTable();

    this.profile = this.commonService.GetUserProfileJson();

  }

  ToggleDissabled() {
    debugger;
    if (this.profile.length > 0) {
      let POSTING_LOCATION = this.profile[0].POSTING_LOCATION;
      //if (this.master.partyId > 0 && (POSTING_LOCATION != undefined || null) && POSTING_LOCATION == 'D')
      if ((POSTING_LOCATION != (undefined || null)) && POSTING_LOCATION == 'D')
        this.dissabledForDepot = true;
      else
        this.dissabledForDepot = false;
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.purchaserequisitionService.getBankInsuranceChargeData(0).subscribe((data: any) => {
      if (data.success) {
        this.rowData = data.data;
      }
    })
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
      debugger;
      this.selectedRows.push(event.node.data);
      this.selectedRow = event.node.data;
      var ImpBankInsuranceChargeMasterId = event.node.data.ImpBankInsuranceChargeMasterId;
      this.purchaserequisitionService.getBankInsuranceChargeData(ImpBankInsuranceChargeMasterId).subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0];
          //console.log("Edit after:==============================", this.master);
          this.master.bankSelected = {
            id: data.data[0].bankId,
            name: data.data[0].openBankName,
          };
          this.master.referenceSelected = {
            id: data.data[0].preLcId,
            name: data.data[0].refNo
          }

          this.master.insurenceCompanySelected = {
            id: data.data[0].insuranceCompany,
            name: data.data[0].insuranceCompany
          }
          //console.log("charge type==================", this.master.chargeType);

          if (this.master.chargeType === "bank") {

            this.master.chargeFlag = true;
            this.master.chargeSelected = {
              id: 1,
              name: "Bank Charge",
            }
          }
          if (this.master.chargeType === "insurance") {
            this.master.chargeSelected = {
              id: 0,
              name: "Insurance Charge",
            }
            this.master.chargeFlag = false;
          }


          this.purchaserequisitionService.getBankInsuranceChargeDetailsInfoByMasterId(ImpBankInsuranceChargeMasterId).subscribe((returns: any) => {
            if (returns.success) {
              this.master.lstReqDetailsViewModel = returns.data;
            }
          })


        }
      })

      this.ngOnInit();
    }
  }
  private agReport(event) {
    this.getReportData(event.node.data.ImpBankInsuranceChargeMasterId);
    // this.toastrService.info("Print button clicked", "Message");
  }
  private agDelete(event) {
    var result = confirm("Are you sure you want to delete that?");
    if (result) {
      let chargeId = event.data.ImpBankInsuranceChargeMasterId;
      // this.master.ImpLCInfoMasterId = chargeId;
      if (result) {
        this.purchaserequisitionService.deletebankInsuranceChargeInfo(chargeId).subscribe((returns: any) => {
          if (returns.success) {
            this.toastrService.success(this.commonService.deletedmsg, "Message");
            this.purchaserequisitionService.getBankInsuranceChargeData(0).subscribe((returns: any) => {
              if (returns.success) {
                this.rowData = returns.data;
              }
            })
          }
        })
      }
    }
  }


  rptHeader = "Charge Info";
  datalength: number;
  refNo: string = "";
  lcNo: string = "";
  lcaNo: string = "";

  lcOpenDate: Date = new Date();
  bankChargeDate: Date = new Date();

  chargeType: string = "";
  lcOpenBank: string = "";
  documentNo: string = "";


  insuranceNo: string = "";
  insuranceCompany: string = "";
  insuranceBranch: string = "";
  insuranceDate: Date = new Date();
  insuranceAmount: number = 0;

  bodyData = [];
  headerData = [];
  params = [];
  gTotal: number = 0.00;
  public preLcDetailData = [];
  public productNameforReport: string = '';
  reportflag: boolean = true;
  //public preLcId:number=0;

  public getReportData(chargeId) {
    this.purchaserequisitionService.getBankInsuranceChargeData(chargeId).subscribe((data: any) => {
      if (data.success) {
        this.master = data.data[0];
        // this.preLcId=data.data[0].ImpPreLCInfoMasterId;
        console.log("master data for Report=====================", data.data[0]);
        this.refNo = data.data[0].refNo;
        this.lcNo = data.data[0].lcNo;
        this.lcaNo = data.data[0].lcaNo;
        this.lcOpenDate = data.data[0].lcOpenDate;
        if (data.data[0].chargeType == "bank") {
          this.chargeType = "Bank Charge";
          this.reportflag = true;
        }
        else {
          this.chargeType = "Insurance Charge";
          this.reportflag = false;
        }
        this.lcOpenBank = data.data[0].openBankName;
        this.bankChargeDate = data.data[0].bankChargeDate;
        this.documentNo = data.data[0].documentNo;
        this.insuranceNo = data.data[0].insuranceNo;
        this.insuranceDate = data.data[0].insuranceDate;
        this.insuranceAmount = data.data[0].insuranceAmount;
        this.insuranceCompany = data.data[0].insuranceCompany;
        this.insuranceBranch = data.data[0].insuranceBranch;


        this.purchaserequisitionService.getBankInsuranceChargeDetailsInfoByMasterId(chargeId).subscribe((returns: any) => {
          if (returns.success) {
            this.preLcDetailData = returns.data;
            console.log("report PM requisiton Data Detail:======================", data.data);
            var fileName = this.rptHeader + ".pdf";
            const content = document.getElementById("reportHeader");
            this.generateReport("print", fileName, content, this.datalength);
          }
          else {
            this.toastrService.danger("Message", this.commonService.nodatafound);
          }
        })


      }
    })
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

  chargeList: any = [];
  insurenceList: any = [];
  CsSelected: any[] = [];
  partySelected: any[] = [];
  loadChargeList() {
    this.chargeList = [
      {
        id: 1,
        name: "Bank Charge",
      },
      {
        id: 0,
        name: "Insurance Charge",
      },
    ];
  }

  public bankList = [];
  public getBank() {
    this.comboService.getBank(0, 0).subscribe((returns: any) => {
      this.bankList = returns.data.map((val) => ({
        id: val.bankId,
        name: val.bankName,
      }));
    });

    // this.purchaserequisitionService.getAdviceBank(0).subscribe((returns:any)=>{
    //     this.adviceBankList = returns.data.map((val)=>({
    //       id:val.adviceBankId,
    //       name:val.adviceBankName,
    //     }))      
    // });

    this.purchaserequisitionService.GetInsurenceCompanyById(0).subscribe((returns: any) => {
      this.insurenceList = returns.data.map((val) => ({
        id: val.insuranceCompanyName,
        name: val.insuranceCompanyName,
      }))
    })

    //console.log("Advice Bank List:", this.adviceBankList)
  }

  public particularListforBank = [];
  public particularListforInsurance = [];

  public loadparticularListforBankData() {
    this.particularListforBank = [
      {
        id: 1,
        name: "Margin"
      },
      {
        id: 2,
        name: "Swift"
      }, {
        id: 3,
        name: "Commision"
      },
      {
        id: 4,
        name: "VAT on Commision"
      }, {
        id: 5,
        name: "Adhesive stamp"
      },
      {
        id: 6,
        name: "Printing & stationary"
      },
      {
        id: 7,
        name: "Misc"
      },
      {
        id: 8,
        name: "Vat"
      },
      {
        id: 9,
        name: "Stamp"
      },
      {
        id: 10,
        name: "Marine"
      },
    ]
  }
  public chargeheadList = [];
  public loadChargeHeadList() {
    this.purchaserequisitionService.getChargeHead(0).subscribe((returns: any) => {
      if (returns.success) {
        this.chargeheadList = returns.data.map((val) => ({
          id: val.chargeHeadId,
          name: val.chargeHeadName,
        }))
      }
    })

    console.log("Charge head list:======================", this.chargeheadList);
  }



  public addDetails(dialog) {
    debugger
    let flag = 0;
    //console.log(this.master.productSelected);
    if (
      this.master.particularBankId == 0 ||
      this.master.particularBankId == null
    ) {
      this.toastrService.danger("Please select product.", "Message");

      return false;
    }

    let detail = {
      // ImpPreLCInfoMasterId:this.master.ImpPreLCInfoMasterId,
      ChargeDetailsId: 0,
      particularName: this.master.particularName,
      amount: this.master.amount,
      paticularId: this.master.particularBankId,
      ImpChargeHeadId: 0
    };
    let presentData = this.master.lstReqDetailsViewModel;
    if (presentData.length > 0) {
      for (let i = 0; i < presentData.length; i++) {

        if (presentData[i].paticularId == detail.paticularId) {
          this.toastrService.danger("This Items already exits in List", "Message");
          flag = 1;
          return;

        }
      }
    }
    if (flag == 0) {
      // if (detail.unitPrice >= 0 ) {
      //   this.master.lstReqDetailsViewModel.push(detail);
      // } else {
      //   this.toastrService.danger("Quantity is zero.", "Message");
      //   return;
      // }
      this.master.lstReqDetailsViewModel.push(detail);
      this.master.particularBankSelected = null;
      this.master.amount = 0;
      this.master.particularBankId = 0
    }

  }


  public getProductById(id) {
    debugger;
    // console.log(this.master.productSelected);
    // this.productService.getProductById(id).subscribe((data: any) => {
    //   if (data.success) {
    //     this.master.uomName = this.master.productSelected["uomName"];
    //   }
    // });

    this.master.particularName = this.master.particularBankSelected["name"];
    // this.GetCurrentStock();
  }

  public deleteDetail(index: any) {
    debugger;
    if (confirm('Are You Sure?')) {
      this.selectedRow = this.master.lstReqDetailsViewModel[index];
      let chargeDetialsid = this.selectedRow.ChargeDetailsId;

      if (chargeDetialsid > 0) {
        this.purchaserequisitionService.deleteChargeDetailsById(chargeDetialsid).subscribe((data: any) => {
          if (data.success) {
            this.master.lstReqDetailsViewModel.splice(index, 1);
            this.toastrService.success("Items Deleted Successfully", "Message");
            //this.purchaserequisitionService.getBankInsuranceChargeDetailsInfoByMasterId().s
          }
        })
      }
      else {
        this.master.lstReqDetailsViewModel.splice(index, 1);
      }

      // this.master.lstReqDetailsViewModel = [];
    }
  }

  getChargeType(id) {
    debugger;
    if (id == 1) {
      this.master.chargeFlag = true;
      this.master.chargeTypeId = 1;

    }
    else {
      this.master.chargeFlag = false;
      this.master.chargeTypeId = 0;
    }
  }

  public referenceList = [];
  public finalRerernceList = [];
  // public getReferenceList()
  // {

  //   debugger;
  //   this.purchaserequisitionService.getPreLcInfo(0).subscribe((returns:any)=>{
  //     if(returns.success)
  //     {

  //       this.referenceList = returns.data.map((val)=>({
  //         id:val.ImpPreLCInfoMasterId,
  //         name:val.refNo,
  //       }))

  //       this.preLcIdList.forEach( idlist  => {
  //         this.referenceList= this.referenceList.filter(item=>item.id !=idlist.preLcId);
  //        })


  //     }

  //     //console.log("final reference list:=====================",this.finalRerernceList);
  //    // console.log(" reference list:=====================",this.referenceList);
  //   })

  // }

  public listdata = [];
  public getPreLcAndLcData(id) {
    this.listdata = [];
    debugger
    this.master.lcNo = "";
    this.master.lcaNo = "";
    this.master.lcAmount = 0;
    this.master.totalLcAmount = 0;
    this.master.lcOpenDate = null;
    this.master.frightAmount = 0;
    this.master.chargeFlag = true;
    this.master.referenceSelected = null,
      this.master.bankSelected = null,

      this.purchaserequisitionService.getPreLcandLcInfo(id).subscribe((returns: any) => {
        if (returns.success) {
          console.log("lc open data:==================", returns.data[0].lcOpenDate);
          //this.master=returns.data[0];
          this.master.ImpLCInfoMasterId = returns.data[0].ImpLCInfoMasterId;
          this.master.preLcId = returns.data[0].preLcId;
          this.master.lcNo = returns.data[0].lcNo;
          this.master.lcaNo = returns.data[0].lcaNo;
          this.master.lcAmount = returns.data[0].lcAmount;
          this.master.totalLcAmount = returns.data[0].totalLcAmount;
          this.master.lcOpenDate = returns.data[0].lcOpenDate;
          this.master.frightAmount = returns.data[0].frightAmount;
          this.master.chargeFlag = true;
          this.master.referenceSelected = {
            id: returns.data[0].ImpPreLCInfoMasterId,
            name: returns.data[0].refNo,
          }
          this.master.bankSelected = {
            id: returns.data[0].bankId,
            name: returns.data[0].openBankName,
          }
          // this.master.lcNo=this.genLcNo;

          //console.log("after call master data is==================",this.master);
        }
      })

    //  this.purchaserequisitionService.getPreLcDetailsInfoByMasterId(id).subscribe((returns:any)=>{
    //   if(returns.success)
    //   {
    //     this.listdata=returns.data;
    //     console.log("details data is==============",this.listdata);
    //   }
    // });
  }
  public preLcIdList = [];
  public getPreLcIdListFromLcMasterTable() {
    this.preLcIdList = [];
    this.referenceList = [];
    this.purchaserequisitionService.getPrelcIdListFromLcMasterTable(0).subscribe((returns: any) => {
      if (returns.success) {
        this.preLcIdList = returns.data;
        // console.log("Pre lc id list:====================",this.preLcIdList);
        this.referenceList = returns.data.map((val) => ({
          id: val.preLcId,
          name: val.refNo,
        }))
      }
    })

  }

}


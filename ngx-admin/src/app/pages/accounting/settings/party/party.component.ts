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


interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: "ngx-party",
  templateUrl: "./party.component.html",
  styleUrls: ["./party.component.scss"],
})
export class PartyComponent implements OnInit {
  ///////////////////
  master: {
    partyId: number;
    partyCode: string;
    partyName: string;
    aliasName: string;
    tradeLicense: string
    drugLicense: string
    creditDays: number;
    addressLine: string;
    contactNumber: string;
    contactPerson: string;
    email: string;
    partyTypeId: number;
    companyId: number;
    sbuId: number;
    isActive: number;
    officeName: string;
    ownerName: string;
    fatherName: string;
    motherName: string;
    nid: string;
    gender: string;
    businessStartDateShow: Date;
    businessStartDate: string;
    companyCategoryId: number;
    creditLimit: number;
    creditLimitWord: string;
    isApproved: number;
    isHold: number;

    companiesSelected: {};
    sbusSelected: {};
    partiesSelected: {};
    companyCategorySelected: {};
    genderSelected: {};
    addressTypeSelected: {};
    divisionSelected: {};
    districtSelected: {};
    thanaSelected: {};
    bankSelected: {};

    countData: number;

    lstPartyContact: any[];
    partyContactId: number;
    mobileOne: string;
    mobileTwo: string;
    emailAddress: string;
    managerName: string;
    managerContact: string;
    isContactUpdated: number;

    lstPartyAddress: any[];
    partyAddressId: number;
    addressType: string;
    division: string;
    district: string;
    thana: string;
    postOffice: string;
    policeStation: string;
    houseStreet: string;
    isAddressUpdated: number;

    lstPartyBank: any[];
    partyBankId: number;
    bankId: number;
    bankBranchName: string;
    bankAccName: string;
    bankAccNo: string;
    isBankUpdated: number;

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

  public pageNavigation = "Party Management";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      //this.openConfirmPopup("");
      this.save();
      //this.show = true;
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
      partyId: 0,
      partyCode: "",
      partyName: "",
      aliasName: "",
      addressLine: "",
      contactNumber: "",
      contactPerson: "",
      email: "",
      partyTypeId: 0,
      companyId: 0,
      sbuId: 0,
      isActive: 1,
      officeName: "",
      ownerName: "",
      fatherName: "",
      motherName: "",
      nid: "",
      gender: "",
      businessStartDateShow: new Date(),
      businessStartDate: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
      companyCategoryId: null,
      creditLimit: 0,
      creditDays: 0,
      creditLimitWord: "",
      tradeLicense: "",
      drugLicense: "",
      isApproved: 0,
      isHold: 0,

      companiesSelected: null,
      sbusSelected: null,
      partiesSelected: null,
      companyCategorySelected: null,
      genderSelected: null,
      addressTypeSelected: null,
      divisionSelected: null,
      districtSelected: null,
      thanaSelected: null,
      bankSelected: null,

      countData: 0,

      lstPartyContact: [],
      partyContactId: 0,
      mobileOne: "",
      mobileTwo: "",
      emailAddress: "",
      managerName: "",
      managerContact: "",
      isContactUpdated: 0,

      lstPartyAddress: [],
      partyAddressId: 0,
      addressType: "",
      division: "",
      district: "",
      thana: "",
      postOffice: "",
      policeStation: "",
      houseStreet: "",
      isAddressUpdated: 0,

      lstPartyBank: [],
      partyBankId: 0,
      bankId: 0,
      bankBranchName: "",
      bankAccName: "",
      bankAccNo: "",
      isBankUpdated: 0,

      index: -1,
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

  //////////////////////////////////////////////CRUD////////////////////////////
  public companies = [];
  public sbus = [];
  public parties = [];
  public companyCategoryItems = [];
  public genderItems = [];
  public addressTypeItems = [];
  public divisionItems = [];
  public districtItems = [];
  public thanaItems = [];
  public bankItems = [];

  public getDropdownData() {
    ////////// Call common service for dropdown data/////////

    this.comboService.getCompany().subscribe((returns: any) => {
      this.companies = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
    });

    this.comboService.GetCompanyCategory().subscribe((returns: any) => {
      this.companyCategoryItems = returns.data.map((val) => ({
        id: val.companyCategoryId,
        name: val.categoryName,
      }));
    });

    this.comboService.getPartyType().subscribe((returns: any) => {
      this.parties = returns.data.map((val) => ({
        id: val.partyTypeId,
        name: val.partyTypeName,
      }));
    });

    this.comboService.getGender().subscribe((returns: any) => {
      this.genderItems = returns.data.map((val) => ({
        id: val.Name,
        name: val.Name,
      }));
    });

    this.comboService.getAddressType().subscribe((returns: any) => {
      this.addressTypeItems = returns.data.map((val) => ({
        id: val.addressTypeId,
        name: val.Name,
      }));
    });

    this.comboService.getDivision().subscribe((returns: any) => {
      this.divisionItems = returns.data.map((val) => ({
        id: val.divisionsId,
        name: val.divisionName,
      }));
    });

    this.comboService.getBank(0, 0).subscribe((returns: any) => {
      this.bankItems = returns.data.map((val) => ({
        id: val.bankId,
        name: val.bankName,
      }));
    });

  }

  public getActualDate(event: any) {
    debugger;
    let dateCon = event.toLocaleDateString() + " " + event.toLocaleTimeString();
    if (dateCon != '') {
      this.master.businessStartDate = dateCon;
    }
  }

  public getSBU(companyId) {
    this.master.sbusSelected = null;
    this.comboService.getSBU(companyId).subscribe((returns: any) => {
      this.sbus = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
    });
  }

  public getDistrict(divisionId) {
    //this.master.sbusSelected = null;
    this.comboService.getDistrict(divisionId).subscribe((returns: any) => {
      this.districtItems = returns.data.map((val) => ({
        id: val.districtsId,
        name: val.districtName,
      }));
    });
  }

  public getThana(districtsId) {
    //this.master.sbusSelected = null;
    this.comboService.getThana(districtsId).subscribe((returns: any) => {
      this.thanaItems = returns.data.map((val) => ({
        id: val.thanasId,
        name: val.thanaName,
      }));
    });
  }

  public getDuplicate() {
    //debugger;
    this.partyService.getDuplicateParty(this.master.partyId, this.master.partyName).subscribe((returns: any) => {
      //debugger;
      this.master.countData = returns.data[0].countData;
    });
  }

  private save() {
    var button = this.commonService.buttonClicked;
    if (this.master.partyTypeId == 0 || this.master.partyTypeId == null) {
      this.toastrService.danger("Please select party type", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.companyId == 0 || this.master.companyId == null) {
      this.toastrService.danger("Please select company", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.sbuId == 0 || this.master.sbuId == null) {
      this.toastrService.danger("Please select sbu", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.partyName == '' || this.master.partyName == null) {
      this.toastrService.danger("Please insert party name", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.countData != 0) {
      this.toastrService.danger("Duplicate party name", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    this.partyService.saveParty(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        this.show = true;
        //////////////Grid Refresh ///////////////////
        this.partyService.getParty().subscribe((data: any) => {
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
    private partyService: PartyService,
    private comboService: CommoncomboService
  ) {
    this.commonService.valueSet('showlist');
    this.getDropdownData();
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
        headerName: "Name",
        field: "partyName",
        filter: "agTextColumnFilter",
        width: 350,
      },
      {
        headerName: "Party Type",
        field: "partyTypeName",
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Company Name",
        field: "companyName",
        filter: "agTextColumnFilter",
      },
      {
        headerName: "SBU Name",
        field: "sbuName",
        filter: "agTextColumnFilter",
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
    //debugger;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.partyService.getpartyAccount().subscribe((data: any) => {
      //debugger;
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
      var partyId = event.node.data.partyId;

      this.partyService.getPartyById(partyId).subscribe((data: any) => {
        if (data.success) {
          //debugger;
          this.master = data.data[0];
          this.master.companiesSelected = {
            id: data.data[0].companyId,
            name: data.data[0].companyName,
          };

          this.getSBU(data.data[0].companyId);

          this.master.sbusSelected = {
            id: data.data[0].sbuId,
            name: data.data[0].sbuName,
          };
          this.master.partiesSelected = {
            id: data.data[0].partyTypeId,
            name: data.data[0].partyTypeName,
          };
          this.master.genderSelected = {
            id: data.data[0].Name,
            name: data.data[0].Name,
          };
          this.master.companyCategorySelected = {
            id: data.data[0].companyCategoryId,
            name: data.data[0].categoryName,
          };

          this.getDuplicate();

          this.partyService.GetPartyContactByPartyId(partyId).subscribe((data: any) => {
            debugger;
            if (data.success) {
              this.master.lstPartyContact = data.data;
            }
          });

          this.partyService.GetPartyAddressByPartyId(partyId).subscribe((data: any) => {
            debugger;
            if (data.success) {
              this.master.lstPartyAddress = data.data;
            }
          });

          this.partyService.GetPartyBankByPartyId(partyId).subscribe((data: any) => {
            debugger;
            if (data.success) {
              this.master.lstPartyBank = data.data;
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
      //debugger;
      this.master.partyId = event.node.data.partyId;
      this.partyService.deleteParty(this.master).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          //////////////Grid Refresh ///////////////////
          this.partyService.getParty().subscribe((data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          });
          //////////////Grid Refresh ///////////////////
        }
      });
    }
  }

  public addContact(dialog: TemplateRef<any>) {
    debugger;
    if (this.master.mobileOne == '') {
      this.toastrService.danger("Please select mobile", "Message");
      return;
    }

    // var RowCount = this.master.lstPartyContact.length;
    // for (let i = 0; i < RowCount; i++) {
    //   debugger;
    //   var _mobileOne = this.master.lstPartyContact[i].mobileOne;
    //   if (_mobileOne == this.master.mobileOne) {
    //     this.toastrService.danger("You have already added this", "Message");
    //     return;
    //   }
    // }

    let detail = {
      mobileOne: this.master.mobileOne,
      mobileTwo: this.master.mobileTwo,
      emailAddress: this.master.emailAddress,
      managerName: this.master.managerName,
      managerContact: this.master.managerContact,
    };

    var indexu = this.master.lstPartyContact.findIndex(
      (x) =>
        x.partyContactId == this.master.partyContactId
    );
    if (indexu > -1) {
      this.master.lstPartyContact[indexu] = detail;
    } else {
      this.master.lstPartyContact.push(detail);
    }

    this.master.isContactUpdated = 1;
    this.ClearContact();
  }

  public DeleteContact(index: any) {
    debugger;
    this.selectedRow = this.master.lstPartyContact[index];
    this.master.lstPartyContact.splice(index, 1);

    var index1 = this.master.lstPartyContact.findIndex(x => x.mobileOne == this.master.mobileOne);
    if (index1 > -1) {
      this.master.lstPartyContact.splice(index1, 1);
    }
    this.master.isContactUpdated = 1;
    this.toastrService.danger(this.commonService.deletedmsg, "Message");
  }

  public EditContact(index: any) {
    //this.master.index = index;
    this.selectedRow = this.master.lstPartyContact[index];
    this.master.partyContactId = this.selectedRow.partyContactId;
    this.master.mobileOne = this.selectedRow.mobileOne;
    this.master.mobileTwo = this.selectedRow.mobileTwo;
    this.master.emailAddress = this.selectedRow.emailAddress;
    this.master.managerName = this.selectedRow.managerName;
    this.master.managerContact = this.selectedRow.managerContact;
    this.master.isContactUpdated = 1;
  }

  public ClearContact() {
    this.master.mobileOne = "";
    this.master.mobileTwo = "";
    this.master.emailAddress = "";
    this.master.managerName = "";
    this.master.managerContact = "";
  }

  public isContactUpdated(index: any) {
    this.master.isContactUpdated = 1;
  }

  public addAddress(dialog: TemplateRef<any>) {
    debugger;
    if (this.master.addressType == '') {
      this.toastrService.danger("Please select address type", "Message");
      return;
    }

    var RowCount = this.master.lstPartyAddress.length;
    for (let i = 0; i < RowCount; i++) {
      debugger;
      var _addressType = this.master.lstPartyAddress[i].addressType;
      if (_addressType == this.master.addressType) {
        this.toastrService.danger("You have already added this", "Message");
        return;
      }
    }
    var addressType = '';
    var division = '';
    var district = '';
    var thana = '';
    if (this.master.addressTypeSelected != null) {
      addressType = this.master.addressTypeSelected['name'];
    }
    if (this.master.divisionSelected != null) {
      division = this.master.divisionSelected['name'];
    }
    if (this.master.districtSelected != null) {
      district = this.master.districtSelected['name'];
    }
    if (this.master.thanaSelected != null) {
      thana = this.master.thanaSelected['name'];
    }

    let detailAddress = {
      addressType: addressType,
      division: division,
      district: district,
      thana: thana,
      postOffice: this.master.postOffice,
      policeStation: this.master.policeStation,
      houseStreet: this.master.houseStreet,
    };

    var indexu = this.master.lstPartyAddress.findIndex(
      (x) =>
        x.partyAddressId == this.master.partyAddressId
    );
    if (indexu > -1) {
      this.master.lstPartyAddress[indexu] = detailAddress;
    } else {
      this.master.lstPartyAddress.push(detailAddress);
    }
    // var index = this.master.lstPartyAddress.findIndex(
    //   (x) => x.partyAddressId == this.master.partyAddressId
    // );
    // if (index > -1) {
    //   this.master.lstPartyAddress.splice(index, 1);
    // }

    this.master.isAddressUpdated = 1;
    this.ClearAddress();
  }

  public ClearAddress() {
    // this.master.addressTypeSelected = null;
    // this.master.division = null;
    // this.master.district = null;
    // this.master.thana = null;
    this.master.postOffice = "";
    this.master.policeStation = "";
    this.master.houseStreet = "";
  }

  public DeleteAddress(index: any) {
    debugger;
    this.selectedRow = this.master.lstPartyAddress[index];
    this.master.lstPartyAddress.splice(index, 1);

    var index1 = this.master.lstPartyAddress.findIndex(x => x.addressType == this.master.addressType);
    if (index1 > -1) {
      this.master.lstPartyAddress.splice(index1, 1);
    }
    this.master.isAddressUpdated = 1;
    this.toastrService.danger(this.commonService.deletedmsg, "Message");
  }

  public editAddress(index: any) {
    //debugger;
    this.master.index = index;
    this.selectedRow = this.master.lstPartyAddress[index];

    this.master.partyAddressId = this.selectedRow.partyAddressId;
    this.master.postOffice = this.selectedRow.postOffice;
    this.master.policeStation = this.selectedRow.policeStation;
    this.master.houseStreet = this.selectedRow.houseStreet;

    this.master.addressTypeSelected = {
      id: 0,
      name: this.selectedRow.addressType,
    };

    if (this.selectedRow.division != '') {
      this.master.divisionSelected = {
        id: 0,
        name: this.selectedRow.division,
      };
    }

    this.getDistrict(this.selectedRow.divisionsId);
    if (this.selectedRow.district != '') {
      this.master.districtSelected = {
        id: 0,
        name: this.selectedRow.district,
      };
    }

    this.getThana(this.selectedRow.districtsId);
    if (this.selectedRow.thana != '') {
      this.master.thanaSelected = {
        id: 0,
        name: this.selectedRow.thana,
      };
    }
    this.master.isAddressUpdated = 1;
  }

  public isAddressUpdated(index: any) {
    this.master.isAddressUpdated = 1;
  }

  public addBank(dialog: TemplateRef<any>) {
    debugger;
    if (this.master.bankId == null || this.master.bankId == 0) {
      this.toastrService.danger("Please select bank", "Message");
      return;
    }

    // var RowCount = this.master.lstPartyContact.length;
    // for (let i = 0; i < RowCount; i++) {
    //   debugger;
    //   var _mobileOne = this.master.lstPartyContact[i].mobileOne;
    //   if (_mobileOne == this.master.mobileOne) {
    //     this.toastrService.danger("You have already added this", "Message");
    //     return;
    //   }
    // }

    let detailBank = {
      partyBankId: -1,
      bankId: this.master.bankId,
      bankName: this.master.bankSelected['name'],
      bankBranchName: this.master.bankBranchName,
      bankAccName: this.master.bankAccName,
      bankAccNo: this.master.bankAccNo,
    };

    var indexu = this.master.lstPartyBank.findIndex(
      (x) =>
        x.partyBankId == this.master.partyBankId
    );
    if (indexu > -1) {
      this.master.lstPartyBank[indexu] = detailBank;
    } else {
      this.master.lstPartyBank.push(detailBank);
    }
    this.master.isBankUpdated = 1;
    this.ClearBank();
  }

  public ClearBank() {
    //this.master.bankSelected = null;
    this.master.bankBranchName = "";
    this.master.bankAccName = "";
    this.master.bankAccNo = "";
  }

  public EditBank(index: any) {
    this.master.index = index;

    this.selectedRow = this.master.lstPartyBank[index];

    this.master.bankSelected = {
      id: this.selectedRow.bankId,
      name: this.selectedRow.bankName,
    };
    this.master.bankBranchName = this.selectedRow.bankBranchName;
    this.master.bankAccName = this.selectedRow.bankAccName;
    this.master.bankAccNo = this.selectedRow.bankAccNo;
    this.master.isBankUpdated = 1;
  }

  public DeleteBank(index: any) {
    debugger;
    this.selectedRow = this.master.lstPartyBank[index];
    this.master.lstPartyBank.splice(index, 1);

    var index1 = this.master.lstPartyBank.findIndex(x => x.bankId == this.master.bankId);
    if (index1 > -1) {
      this.master.lstPartyBank.splice(index1, 1);
    }

    this.master.isBankUpdated = 1;
    this.toastrService.danger(this.commonService.deletedmsg, "Message");
  }

  public isBankUpdated(index: any) {
    this.master.isBankUpdated = 1;
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



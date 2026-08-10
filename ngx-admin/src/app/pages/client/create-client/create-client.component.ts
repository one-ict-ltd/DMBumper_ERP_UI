import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { CommonService } from "../../../@core/mock/common.service";
import { DialogNamePromptComponent } from "../dialog-name-prompt/dialog-name-prompt.component";
import { HttpClient } from "@angular/common/http";
import { ClientService } from "../../../services/client.service";
import { CommoncomboService } from "../../../services/commoncombo.service";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { DialogConfirmComponent } from "../dialog-confirm/dialog-confirm.component";

@Component({
  selector: "ngx-create-client",
  templateUrl: "./create-client.component.html",
  styleUrls: ["./create-client.component.scss"],
})
export class CreateClientComponent implements OnInit {
  master: {
    helpId: number;
    text: string;
    dropDownId: number;
    ddlSelected: {};
    date: string;
    popUp: string;
    checkBox: boolean;
    textArea: string;
    radio: number;
    isActive: number;
    isDelete: number;
    multiseletobj: any[];
    image: string;
    lstdetailmodel: any[];
    lstmultimodel: any[];
    lstimagemodel: any[];
  };
  details: any;
  disabled: boolean = false;
  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private clientService: ClientService,
    private comboService: CommoncomboService
  ) {


    this.getClient();
    this.getDropdownData();
    this.getColumnDefs();
    this.frameworkComponents = { btnCellRenderer: BtnCellRenderer };
    this.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: true,
      //editable: true,
    };
  }

  ngOnInit() { }
  /////Dynamic Button section (Do Not Edit)///////
  @Output() myEvent = new EventEmitter();
  public show: boolean = true;
  public pageNavigation = "Cleint";
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
      helpId: 0,
      text: "",
      dropDownId: 0,
      ddlSelected: null,
      date: "",
      popUp: "",
      checkBox: false,
      textArea: "",
      radio: null,
      isActive: 1,
      isDelete: 0,
      multiseletobj: [],
      image: "",
      lstdetailmodel: [],
      lstmultimodel: [],
      lstimagemodel: [],
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

  ////////////////////////Master Section Start /////////////////////

  ///////////////Page Property Add related object here/////////

  public vouchertype = [];
  public curency = [];
  public radioGroupValue = "This is value 2";

  ///////////////End of Page Property Add related object here/////////

  ////////ddl///////

  public getDropdownData() {
    ////////// Call common service for dropdown data/////////
    this.comboService.getVoucherType().subscribe((returns: any) => {
      this.vouchertype = returns.data.map((val) => ({
        id: val.voucherTypeId,
        name: val.voucherTypeName,
      }));
    });

    this.comboService.getCurrency().subscribe((returns: any) => {
      this.curency = returns.data.map((val) => ({
        id: val.currencyId,
        name: val.currencyName,
      }));
      this.curency.push({
        id: 2,
        name: 'Dollar $',
      })
    });
  }

  ///// open popup //////
  public openMasterPopup(index) {
    this.dialogService
      .open(DialogNamePromptComponent)
      .onClose.subscribe((obj) => {
        this.master.popUp = obj;
      });
  }
  public openConfirmPopup(index) {
    this.dialogService.open(DialogConfirmComponent).onClose.subscribe((obj) => {
      if (obj == "save") {
        this.save();
        this.show = true;
      } else {
      }
    });
  }

  ////// file Upload///////
  public formData = new FormData();
  public ReqJson: any = {};
  public url: string | ArrayBuffer;
  public imagePath: any;
  public myFiles: string[] = [];
  public urls = [];
  // public uploadFiles(file, index) {
  //   if (file.length === 0) return;

  //   const mimeType = file[0].type;
  //   if (mimeType.match(/image\/*/) == null) {
  //     //this.message = "Only images are supported.";
  //     return;
  //   }

  //   const reader = new FileReader();
  //   this.imagePath = file;
  //   reader.readAsDataURL(file[0]);
  //   reader.onload = (_event) => {
  //     this.url = reader.result;
  //   };
  //   // console.log("file", file);
  //   // for (let i = 0; i < file.length; i++) {
  //   //   this.formData.append("file", file[i], file[i]["name"]);
  //   // }
  // }
  onFileChange(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;

      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        this.formData.append(
          "file",
          event.target.files[i],
          event.target.files[i]["name"]
        );

        reader.onload = (event: any) => {
          //this.myFiles.push(event.target.files[i]);
          this.urls.push(event.target.result);
        };
        reader.readAsDataURL(event.target.files[i]);
      }
    } else {
      this.urls = [];
      this.master.lstimagemodel;
    }

    // for (var i = 0; i < event.target.files.length; i++) {
    //   const reader = new FileReader();
    //   this.imagePath = event.target.files[i]
    //   reader.readAsDataURL(event.target.files[i]);
    //   reader.onload = (_event) => {
    //     this.url = reader.result;
    //   };
    //   this.myFiles.push(event.target.files[i]);
    //
    // }
  }

  public setMultiSelect() {
    this.master.lstmultimodel = [];
    this.curency;
    this.master.lstmultimodel = this.master.multiseletobj.map((node) => {
      //debugger;
      return {
        multiId: 0,
        selectedId: node.id,
        helpId: this.master.helpId,
        isActive: 1,
        isDelete: 0,
      };
    });

    // this.master.multiseletobj.forEach((item: any) => {
    //   this.master.lstmultimodel.push({
    //     multiId: item.id,
    //     helpId: this.master.helpId,
    //     isActive: 1,
    //   });
    // });
    console.log(this.master.lstmultimodel);
  }
  ////////////////////////End Master Section /////////////////////

  ///////////////////////// details Section Start /////////////////////

  ////Add data to detail table
  public addDetails() {
    let detail = {
      helpDetailId: 0,
      helpId: 0,
      dtext: "",
      ddropdownId: "",
      ddropdownName: "",
      ddate: "",
      dpopup: "",
      checkbox: "",
      dradio: 0,
      dtextarea: "",
      dImage: "",
      isActive: 1,
      isDelete: 0,
      multiseletobj: [],
      dropdown: this.vouchertype,
      multiselet: this.vouchertype,
    };
    //this.selectdetailRows.push(detail);
    this.master.lstdetailmodel.push(detail);
    this.toastrService.success(this.commonService.successmsg, "Message");
  }
  /// refresh detail table
  public refesh() {
    this.master.lstdetailmodel = [];
    this.toastrService.warning(this.commonService.warningmsg, "Message");
  }
  // Delete from detail
  public deleteDetail(index: any) {
    //debugger;
    this.selectedRow = this.master.lstdetailmodel[index];
    this.master.lstdetailmodel.splice(index, 1);
    if (this.selectedRow.helpDetailId > 0) {
      //this.selectdetailRows[0][index].isDelete = 1;
      //this.selectdetailRows[0].push(this.selectedRow);
    }
    this.toastrService.danger(this.commonService.deletedmsg, "Message");
  }
  ///for test dont remove
  public addSelected(detail) { }

  public uploadFileDetail(file, index) {
    if (file.length === 0) return;
    const mimeType = file[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    this.imagePath = file;
    reader.readAsDataURL(file[0]);
    reader.onload = (_event) => {
      //this.url = reader.result;
      this.master.lstdetailmodel[index].url = reader.result;
    };
    // console.log("file", file);
    // for (let i = 0; i < file.length; i++) {
    //   this.formData.append("file", file[i], file[i]["name"]);
    // }
  }
  //For openning popup for details
  public openDetailPopup(index) {
    this.dialogService
      .open(DialogNamePromptComponent)
      .onClose.subscribe(
        (obj) => (this.master.lstdetailmodel[index].dpopUp = obj)
      );
  }
  //////////////////////////////// End Detail Section //////////////////////////

  //////////////////////////////////////////////CRUD////////////////////////////

  private getClient() {
    this.clientService.getClients().subscribe((data: any) => {
      if (data.success) {
        //this.master.lstdetailmodel = data.lstdetailmodel
        this.master = data.master[0];
        this.master.lstdetailmodel = data.lstdetailmodel;
        console.log(data.master[0]);
      }
    });
  }
  private save() {
    var button = this.commonService.buttonClicked;
    if (button == "update") {
      this.master.lstdetailmodel = [];
      this.selectdetailRows[0].filter((v, i) => {
        this.master.lstdetailmodel.push(v);
      });
    }

    this.clientService.saveClients(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
      }
    });
  }
  private reset() {
    this.getMaster();
  }

  //////////////////////////////// End CRUD /////////////////////////////////////////

  //////////////////////////////////Ag Grid Data Load/////////////////////////////////

  name: string;
  selectedRow: any;
  public selectdetailRows = [];
  public selectedRows = [];
  public gridApi;
  public gridColumnApi;
  public modules: Module[] = AllCommunityModules;
  public columnDefs;
  public defaultColDef;
  public rowData: [];
  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };

  getColumnDefs() {
    this.columnDefs = [
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.rowIndex + 1",
        pinned: "left",
        filter: false,
        width: 50,
      },  /// Dont Change
      {
        headerName: "Text",
        field: "text",
        filter: "agTextColumnFilter",
      },
      {
        headerName: "TextArea",
        field: "textArea",
        filter: "agTextColumnFilter",
      },
      {
        headerName: "PopUp",
        field: "popUp",
      },
      {
        headerName: "DropDown Name",
        field: "dropDownName",
      },
      {
        headerName: "Date",
        field: "date",
      },
      {
        headerName: "Check Box",
        field: "checkBox",
      },
      {
        filter: false,
        field: "action",
        cellRenderer: "btnCellRenderer",
        pinned: "right",
        cellRendererParams: {
          clicked: function (field: any) {
          },
        },
        width: 200,
        editable: false,
      },// Dont Change
    ];
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.clientService.getClients().subscribe((data: any) => {
      if (data.success) {
        this.rowData = data.master;
        this.master.lstdetailmodel = data.lstdetailmodel;
      }
    });
  }

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
      var helpid = event.node.data.helpId;

      this.clientService.getClientByID(helpid).subscribe((data: any) => {
        if (data.success) {
          var item = data.master[0];
          this.master = item;
          this.master.ddlSelected = {
            id: item.dropDownId,
            name: item.dropDownName,
          };

          this.master.multiseletobj = data.lstmultimodel.map((item) => {
            return { id: item.selectedId, name: item.selectedName, multiId: 0 };
          });
          this.selectdetailRows = [];
          this.selectdetailRows.push(data.lstdetailmodel);
          this.master.lstdetailmodel = data.lstdetailmodel;
          this.details = data.lstdetailmodel;
          //this.details.ddlSelected = [];
          this.master.lstdetailmodel.map((detail) => {
            return (detail.ddlSelected = {
              id: detail.ddropdownId,
              name: detail.ddropdownName,
            });
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
    //debugger;
    this.master.helpId = event.node.data.helpId;
    this.clientService.deleteClients(this.master).subscribe((returns: any) => {
      if (returns.success) {
        this.toastrService.success(this.commonService.deletedmsg, "Message");

        //////////////Grid Refresh ///////////////////
        this.clientService.getClients().subscribe((data: any) => {
          if (data.success) {
            this.rowData = data.master;
            this.master.lstdetailmodel = data.lstdetailmodel;
          }
        });
        //////////////Grid Refresh ///////////////////
      }
    });
  }
  //////////////////////////////////End of Ag Grid Data Load/////////////////////////////////

  ////////////////////////////////////// ag grid event/////////////////////////////////////////

  public deleteRow(state, action) {
    const nodeIdToRemove = action.payload;
    const filteredData = state.rowData.filter(
      (node) => node.id !== nodeIdToRemove
    );
    return {
      ...state,
      rowData: [...filteredData],
    };
  }

  ////////////////////////////////////// end of ag grid event /////////////////////////////////////////
}

// vlucherForm: FormGroup;
// submitted: boolean;
// saveupdate: string = "Save";
// gridbutton: string = "";
// description: string;

// onEditGrid() {
//   const d = this.gridApi.getEditingCells();
//   if (this.gridApi.getSelectedRows().length == 0) {
//     this.toastrService.danger("error", this.commonService.selectdata);
//     return;
//   }
//   var row = this.gridApi.getSelectedRows();
//   this.selectedRow = row[0];
//   this.ngOnInit();

//   this.saveupdate = "Update";
//   //this.toastrService.success("success", this.commonService.successmsg);
//   this.voucherService.updateVouchertype(row[0]).subscribe((data: any) => {
//     this.toastrService.success("success", data);
//     this.ngOnInit();
//   });
// }
// getSelectedRowData() {
//   let selectedNodes = this.gridApi.getSelectedNodes();
//   let selectedData = selectedNodes.map((node) => node.data);
//   alert(`${JSON.stringify(selectedData)}`);
//   this.name = selectedData[0].currencyName;
//   return selectedData;
// }
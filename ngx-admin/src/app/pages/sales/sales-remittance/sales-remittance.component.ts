import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { CommonService } from 'app/@core/mock/common.service';
import { CommoncomboService } from 'app/services/commoncombo.service';
import { SalesRemittanceService } from 'app/services/sales/sales-remittance.service';
import { debounceTime, take } from 'rxjs/operators';
import { SalesRemittanceSlip } from '../models/sales-remittance-slip.model';
import { SalesRemittance } from '../models/sales-remittance.model';
import { BtnCellRenderer } from '../settings/common/btn-cell-renderer.component';
import { NbDateService } from '@nebular/theme';
import { BillcollectionService } from 'app/services/sales/billcollection.service';
import { formatDate } from '@angular/common';
import { Observable, ReplaySubject } from 'rxjs';

@Component({
  selector: 'ngx-sales-remittance',
  templateUrl: './sales-remittance.component.html',
  styleUrls: ['./sales-remittance.component.scss']
})
export class SalesRemittanceComponent implements OnInit {

  formSalesRemittance: FormGroup;
  pageNavigation = "Remittance";
  show = true;
  previousTransNo: string;

  private gridApi;
  private gridColumnApi;
  public bodyData: any[];

  public columnDefs;
  public defaultColDef;
  public rowData: [];
  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };

  loadFromDateShow: Date = this.dateService.addDay(this.dateService.today(), 0);
  loadToDateShow: Date = this.dateService.today();

  depotList: any[] = [];
  bankList: any[] = [];
  branchList: any[] = [];
  rsTypeList: any[] = [];
  disabled: boolean = false;
  submitted: boolean = false;
  bankBranchIsRequired: boolean = false;
  selectedRow: any;

  minRsDate: Date;
  maxRsDate: Date;
  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private remittanceService: SalesRemittanceService,
    private comboService: CommoncomboService,
    protected dateService: NbDateService<Date>,
    private billcollectionService: BillcollectionService,
  ) {
    // this.minRsDate = this.dateService.addDay(this.dateService.today(), -0);
    // this.maxRsDate = this.dateService.today();
    //this.minRsDate = new Date(Date.parse('2022-05-31'));
    this.getServerDateTime();
    this.detailsAmountTotal = 0.00;
    this.getAllBranchList();
  }

  minDate: Date = new Date();
  maxDate: Date = new Date();
  currentDate: Date = new Date();

  getServerDateTime() {
    let apiUrl = `menu/getServerDateTime`;
    this.commonService.getApiData(apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        //console.log(returns);
        this.currentDate = new Date(returns.data[0].currentDate);
        // this.minDate = this.dateService.addDay(new Date(returns.data[0].minDate), 0);
        this.minDate = this.dateService.addDay(new Date(returns.data[0].minRemDate), -0);
        this.maxDate = this.dateService.addDay(new Date(returns.data[0].maxRemDate), 0);
      } else {
        this.currentDate = new Date();
        this.minDate = new Date();
        this.maxDate = new Date();
      }
    });
  }

  ngOnInit(): void {
    this.commonService.valueSet("showlist");
    this.createSalesRemittanceForm();
    this.loadDropDowns();
    this.setColumnDef();
  }

  loadDropDowns(): void {
    this.getBankList();
    this.getDepotList();
    this.getRsTypeList();
  }

  ttlDepositAmount: number = 0;
  createSalesRemittanceForm(remittance: SalesRemittance = new SalesRemittance()): void {
    this.formSalesRemittance = this.formBuilder.group({
      remittanceId: new FormControl(remittance.remittanceId),
      cashInHand: new FormControl(0),
      remittanceDate: new FormControl(remittance.remittanceDate),
      remittanceNo: new FormControl(remittance.remittanceNo),
      remittanceTypeId: new FormControl(remittance.remittanceTypeId),
      oplTranNo: new FormControl(remittance.oplTranNo, [Validators.required]),
      depotCode: new FormControl(remittance.depotCode),
      depositDate: new FormControl(remittance.depositDate),
      bankId: new FormControl(remittance.bankId),
      bankBranchId: new FormControl(remittance.bankBranchId),
      depositRefNo: new FormControl(remittance.depositRefNo),
      depositAmount: new FormControl(remittance.depositAmount, [Validators.required]),
      remarks: new FormControl(remittance.remarks),
      salesRemittanceSlips: this.formBuilder.array([]),
      //selectedAmount: new FormControl(remittance.selectedAmount, [Validators.required, Validators.min(1)]),
      selectedAmount: new FormControl(remittance.selectedAmount),
      salesRemittanceDetails: this.formBuilder.array([]),
    });

    remittance.salesRemittanceSlips.forEach((item) => {
      this.salesRemittanceSlips.push(this.createSalesRemittanceSlipForm(item));
    });
    this.submitted = false;


  }

  get salesRemittanceSlips(): FormArray {
    return this.formSalesRemittance.get('salesRemittanceSlips') as FormArray;
  }
  get salesRemittanceDetails(): FormArray {
    return this.formSalesRemittance.get('salesRemittanceDetails') as FormArray;
  }


  isShowDetails = false;
  detailsAmountTotal: number = 0.00;
  addMasterToDetails(): void {
    //debugger
    const masterData = this.formSalesRemittance.value;

    // Check if the remittanceId already exists in the details array
    const exists = this.salesRemittanceDetails.controls.some((control: AbstractControl) =>
      control.get('oplTranNo').value === masterData.oplTranNo
    );

    if (masterData.depositAmount <= 0) {
      this.toastrService.warning('Please enter a valid remittance amount to add into details.', "Message");
      return;
    }

    if (exists) {
      // Optionally, you can show an error message or handle duplicates here
      this.toastrService.warning('This Transaction No. already exists in the details.', "Message");
      return;
    }

    if (!this.formSalesRemittance.valid) {
      this.toastrService.warning('Form is invalid! Please input all required fields.', "Message");
      return;
    }
    let cinh = Number(this.formSalesRemittance.get('cashInHand')?.value);
    let damt = Number(this.formSalesRemittance.get('depositAmount')?.value);
    let tdamt = Number(this.ttlDepositAmount) + damt;
    if (tdamt > cinh) {
      this.toastrService.warning('Total Remittance amount should not be greater than cash in hand.', "Message");
      return;
    }

    const detailGroup = this.formBuilder.group({
      remittanceId: new FormControl(masterData.remittanceId),
      remittanceDate: new FormControl(this.commonService.DateFormat(masterData.remittanceDate), [Validators.required]),
      depositDate: new FormControl(this.commonService.DateFormat(masterData.depositDate), [Validators.required]),
      remittanceNo: new FormControl(masterData.remittanceNo),
      remittanceTypeId: new FormControl(masterData.remittanceTypeId),
      oplTranNo: new FormControl(masterData.oplTranNo, [Validators.required]),
      depotCode: new FormControl(masterData.depotCode, [Validators.required]),
      bankId: new FormControl(masterData.bankId),
      bankBranchId: new FormControl(masterData.bankBranchId),
      depositRefNo: new FormControl(masterData.depositRefNo),
      depositAmount: new FormControl(masterData.depositAmount),
      remarks: new FormControl(masterData.remarks),
      selectedAmount: new FormControl(masterData.selectedAmount),
    });

    this.salesRemittanceDetails.push(detailGroup);
    this.detailsAmountTotal += masterData.depositAmount;
    this.isShowDetails = true;
    //this.formSalesRemittance.reset();

    // this.formSalesRemittance.patchValue({
    //   cashInHand: null,
    // });   
    this.GetTotalDepositAmount();
  }

  GetTotalDepositAmount() {
    this.ttlDepositAmount = 0;

    this.salesRemittanceDetails.controls.forEach(el => {
      this.ttlDepositAmount += el.get("depositAmount").value;
    });
  }

  GetTotalCollectionAmount() {
    let totalAmount: number = 0;

    this.bodyData.forEach(el => {
      if (el.isSelect) totalAmount += el.collectionAmount;
    });

    this.formSalesRemittance.get('selectedAmount').patchValue(totalAmount);
  }

  setBankValidation(selectedValue) {
    // if (selectedValue === 1 || selectedValue === 6) {
    //   this.formSalesRemittance.controls['bankId'].setValidators(Validators.required);
    //   this.formSalesRemittance.controls['bankBranchId'].setValidators(Validators.required);
    //   this.formSalesRemittance.controls['bankId'].updateValueAndValidity();
    //   this.formSalesRemittance.controls['bankBranchId'].updateValueAndValidity();
    //   this.bankBranchIsRequired = true;
    // } else {
    //   this.formSalesRemittance.controls['bankId'].clearValidators();
    //   this.formSalesRemittance.controls['bankBranchId'].clearValidators();
    //   this.formSalesRemittance.controls['bankId'].updateValueAndValidity();
    //   this.formSalesRemittance.controls['bankBranchId'].updateValueAndValidity();
    //   this.bankBranchIsRequired = false;
    // }
    // this.formSalesRemittance.updateValueAndValidity();



    this.formSalesRemittance.controls['bankId'].setValidators(Validators.required);
    this.formSalesRemittance.controls['bankBranchId'].setValidators(Validators.required);
    this.formSalesRemittance.controls['bankId'].updateValueAndValidity();
    this.formSalesRemittance.controls['bankBranchId'].updateValueAndValidity();
    this.bankBranchIsRequired = true;
    this.formSalesRemittance.updateValueAndValidity();

  }

  createSalesRemittanceSlipForm(remittanceSlip: SalesRemittanceSlip = new SalesRemittanceSlip()): FormGroup {
    return this.formBuilder.group({
      remittanceSlipId: new FormControl(remittanceSlip.remittanceSlipId),
      remittanceId: new FormControl(remittanceSlip.remittanceId),
      fileString: new FormControl(remittanceSlip.fileString),
      resourceUrl: new FormControl(remittanceSlip.resourceUrl),
      fileName: new FormControl(remittanceSlip.fileName),
      ext: new FormControl(remittanceSlip.ext)
    });
  }
  createSalesRemittanceDetailsForm(remittanceDetail: SalesRemittance): FormGroup {
    return this.formBuilder.group({
      remittanceId: new FormControl(remittanceDetail.remittanceId),
      remittanceDate: new FormControl(remittanceDetail.remittanceDate),
      remittanceNo: new FormControl(remittanceDetail.remittanceNo),
      remittanceTypeId: new FormControl(remittanceDetail.remittanceTypeId),
      oplTranNo: new FormControl(remittanceDetail.oplTranNo),
      depotCode: new FormControl(remittanceDetail.depotCode),
      depositDate: new FormControl(remittanceDetail.depositDate),
      bankId: new FormControl(remittanceDetail.bankId),
      bankBranchId: new FormControl(remittanceDetail.bankBranchId),
      depositRefNo: new FormControl(remittanceDetail.depositRefNo),
      depositAmount: new FormControl(remittanceDetail.depositAmount),
      remarks: new FormControl(remittanceDetail.remarks),
      //selectedAmount: new FormControl(remittanceDetail.selectedAmount, [Validators.required, Validators.min(1)]),
      salesRemittanceSlips: this.formBuilder.array([]),
      salesRemittanceDetails: this.formBuilder.array([])
    });
  }

  addRemittanceDetail(): void {
    const newRemittanceDetail = new SalesRemittance(); // Create a new instance
    this.salesRemittanceDetails.push(this.createSalesRemittanceDetailsForm(newRemittanceDetail));
  }
  getRemittanceTypeName(id: any): string {
    const remittanceType = this.rsTypeList.find(item => item.value === id);
    return remittanceType ? remittanceType.text : '';

  }
  getSelectedBank(id: any): string {
    const bank = this.allBanks.find(x => x.value == id);
    return bank ? bank.text : '';
  }
  allBanks: any[];

  getSelectedDepot(id: any): string {
    const depot = this.depotList.find(x => x.value == id);
    return depot ? depot.text : '';
  }
  allBranches = [];
  getAllBranchList(): void {
    // this.formSalesRemittance.patchValue({
    //   bankBranchId: null
    // })
    this.allBranches = []
    this.comboService.getBranchByBankId(0).pipe(take(1)).subscribe(
      (returns: any) => {
        if (returns.success) {
          const bankBranchDropdown = returns.data.map((val) => ({
            value: val.bankBranchId,
            text: val.bankBranchName,
          }));
          this.allBranches = [...bankBranchDropdown];
        }
      }
    )
  }
  getSelectedBankBranch(branchId: any): string {
    //debugger
    const branch = this.allBranches.find(x => x.value == branchId);
    return branch ? branch.text : '';

  }


  public ButtonAction(): void {
    if (this.commonService.buttonClicked == "create") {
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.createSalesRemittanceForm();
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      this.save();
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
    } else if (this.commonService.buttonClicked == "view") {
      this.show = false;
    } else if (this.commonService.buttonClicked == "reset") {
      this.reset();
      this.commonService.valueSet('create');
    } else if (this.commonService.buttonClicked == "edit") {
      this.show = false;
    }
  }

  public agButtonAction(): void {
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

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.GetGridData();
  }

  GetGridData(remittanceId: number = 0) {
    this.remittanceService.GetRemittanceList(remittanceId, this.commonService.DateFormat(this.loadFromDateShow), this.commonService.DateFormat(this.loadToDateShow))
      .pipe(take(1)).subscribe((data: any) => {
        if (data.success) {
          this.rowData = data.data;
        }
      });
  }

  public onRowClicked(event) {
    this.selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked;
    this.commonService.agButtonClicked = "";
    if (data == "edit") {
      this.commonService.valueSet("showlist");
      this.toastrService.info("Access denied!", "Message");
      return;
      //Note: do not allow edit for this page. if needed all insert SP must be modify for edit specilly "SalSpUpdateHasRemittanceOfCollection"
      this.agEdit(event);
      this.show = false;
      this.disabled = false;
      this.formSalesRemittance.enable();
    } else if (data == "view") {
      this.agEdit(event);
      this.show = false;
      this.disabled = true;
      this.formSalesRemittance.disable();
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
      let userGroupIds = this.commonService.getUserGroup().split(',');
      if (userGroupIds[0] == '2' || userGroupIds[0] == '1') {
        this.agDelete(event);
      }
      else {
        this.toastrService.info("Access Denied", "Message");
      }//
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }

  agReport(event: any) {
    const masterId = event.data.remittanceId;
    let userInfo = this.commonService.GetUserProfileJson();
    let apiUrl = `SalesInvoiceReport/GetSalesRemittanceReport?reportFormat=Pdf&userId=${userInfo[0].employeeid}&masterId=${masterId}`;

    this.commonService.GetCrystalReportData(apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        console.log(res);
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }

  agEdit(event) {
    const remittanceId = event.data.remittanceId;
    this.remittanceService.GetRemittanceById(remittanceId).pipe(take(1)).subscribe((data: any) => {
      if (data.success) {
        let remittanceData = data.data[0];

        remittanceData.remittanceDate = new Date(remittanceData.remittanceDate);
        remittanceData.depositDate = new Date(remittanceData.depositDate);
        //console.log(remittanceData);
        const remittance = remittanceData as SalesRemittance;
        //this.getBranchList(remittance.bankId);
        this.createSalesRemittanceForm(remittance);
        //this.getCashInHand(remittance.depotCode);
      }
    });
  }

  agDelete(event) {
    const remittanceId = event.data.remittanceId;
    if (confirm('Are you sure?')) {
      this.remittanceService.DeleteRemittance(remittanceId).pipe(take(1)).subscribe((data: any) => {
        if (data.success) {
          this.reset();
        }
      });
    }
  }

  getOplTranNoStatus(value: string): void {
    if (this.previousTransNo !== value) {
      const remittanceId = this.formSalesRemittance.get('remittanceId').value;
      this.remittanceService.GetOplTranNoStatus(value, remittanceId).pipe(take(1)).subscribe(
        (returns: any) => {
          if (returns.data[0].status !== 'unique') {
            this.formSalesRemittance.get('oplTranNo').setErrors({ notUnique: true });
          } else {
            this.formSalesRemittance.get('oplTranNo').updateValueAndValidity();
          }
        }
      );
    }
    this.previousTransNo = value;
  }

  addNewFileUpload(): void {
    this.salesRemittanceSlips.push(this.createSalesRemittanceSlipForm());
  }

  deleteFileUpload(index: number) {
    this.salesRemittanceSlips.removeAt(index);
  }

  save(): void {
    this.submitted = true;
    //debugger;


    if (this.formSalesRemittance.valid) {
      if (this.ttlDepositAmount != this.formSalesRemittance.get('selectedAmount').value) {
        this.toastrService.warning("Selected collection amount is not equal total given amount!", "Message");
        this.commonService.valueSet("create");
        return;
      }

      const remittance = this.formSalesRemittance.getRawValue() as SalesRemittance;
      //const salesRemittanceDetails = this.tsalesRemittanceDetails.getRawValue() as SalesRemittance;

      //console.log('Before: ', remittance);
      remittance.remittanceDate = this.commonService.DateFormat(remittance.remittanceDate);
      //remittance.depositDate = this.commonService.DateFormat(remittance.depositDate);
      console.log('After: ', remittance);

      //return;
      this.remittanceService.SaveRemittance(remittance).pipe(take(1)).subscribe(
        (returns: any) => {
          if (returns.success) {
            this.reset();
            this.toastrService.success(returns.message, 'Message');
            this.show = true;
            this.updateHasRemittanceOfCollection(returns.MasterId);

          } else {
            this.show = false;
            this.toastrService.danger(returns.message, 'Message');
            this.commonService.valueSet('create');
          }
        }
      );
    } else {
      this.show = false;
      this.toastrService.warning('Data is not valid.', 'Message');
      this.commonService.valueSet('create');
    }
  }
  updateHasRemittanceOfCollection(remittanceMasterId: any) {
    //debugger
    let selectedCollections = this.bodyData
      .filter(x => x.isSelect === true)
      .map(x => ({
        remittanceId: remittanceMasterId,
        collectionMasterId: x.collectionMasterId,
        collectionNumber: x.collectionNumber,
        isSelect: x.isSelect
      }));
    this.remittanceService.UpdateHasRemittanceOfCollectionMaster(selectedCollections).subscribe((res: any) => {
      if (res.success) {
        //this.toastrService.success('Remittance updated successfully!', 'Message');
      }
      //else this.toastrService.danger('Remittance not updated successfully!', 'Message');
    })


  }

  reset(): void {
    this.commonService.valueSet("showlist");
    this.createSalesRemittanceForm();
    this.GetGridData();
    this.loadDropDowns();
  }

  getBankList(): void {
    this.comboService.getBank(0, 0).pipe(take(1)).subscribe(
      (returns: any) => {
        if (returns.success) {
          const bankDropdown = returns.data.map((val) => ({
            value: val.bankId,
            text: val.bankName,
          }));
          this.bankList = [...bankDropdown];
          this.allBanks = [...bankDropdown];
        }
      }
    )
  }

  getBranchList(bankId: number): void {
    this.formSalesRemittance.patchValue({
      bankBranchId: null
    })
    this.comboService.getBranchByBankId(bankId).pipe(take(1)).subscribe(
      (returns: any) => {
        if (returns.success) {
          const bankBranchDropdown = returns.data.map((val) => ({
            value: val.bankBranchId,
            text: val.bankBranchName,
          }));
          this.branchList = [...bankBranchDropdown];
        }
      }
    )
  }

  getDepotList(): void {
    this.comboService.GetDepotList().pipe(take(1)).subscribe(
      (returns: any) => {
        if (returns.success) {
          const depotDropdown = returns.data.map((val) => ({
            value: val.depotCode,
            text: val.depotName,
          }));
          this.depotList = [...depotDropdown];
        }
      }
    )
  }

  getRsTypeList(): void {
    this.billcollectionService.getpaymentMode().pipe(take(1)).subscribe(
      (returns: any) => {
        if (returns.success) {
          const rsTypeDropdown = returns.data.map((val) => ({
            value: val.paymentModeId,
            text: val.paymentMode,
          }));
          this.rsTypeList = [...rsTypeDropdown];
        }
      }
    )
  }

  getCashInHand(depotCode: string): void {
    //debugger
    const rsDate = this.formSalesRemittance.get('remittanceDate').value;
    this.remittanceService.GetCashInHandByDepotCode(depotCode, rsDate).pipe(take(1)).subscribe(
      (returns: any) => {
        if (returns.success) {
          const cashInHand = returns.data[0].cashInHand;
          this.formSalesRemittance.get('cashInHand').patchValue(cashInHand);
          //this.getDepotwiseCollection(depotCode);
        }
      }
    )
    // to get collections and amount


  }
  getDepotwiseCollection(depotCode: string) {
    //debugger
    // this.formSalesRemittance.get('selectedAmount').value = 0;
    this.formSalesRemittance.get('selectedAmount').patchValue(0);
    this.remittanceService.GetDepotWiseCollections(depotCode).subscribe((res: any) => {
      if (res.success) {
        this.bodyData = res.data;
      }
      else {
        this.bodyData = [];
      }
    })
  }

  setColumnDef(): void {
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
        headerName: "R.S. No",
        field: "remittanceNo",
        width: 150,
      },
      {
        headerName: "R.S. Date",
        field: "remittanceDate",
        width: 140,
        valueFormatter: (params) => formatDate(params.data.remittanceDate, 'dd-MM-yyyy', 'en')
      },
      {
        headerName: "R.S. Type",
        field: "remittanceTypeName",
        width: 120,
      },
      {
        headerName: "OPL Trxn No",
        field: "oplTranNo",
        width: 140,
      },
      {
        headerName: "D. Date",
        field: "depositDate",
        width: 120,
        valueFormatter: (params) => formatDate(params.data.depositDate, 'dd-MM-yyyy', 'en')
      },
      {
        headerName: "Amount",
        field: "depositAmount",
        width: 120,
        valueFormatter: (params) =>
          this.commonService.currencyFormatter(params.data.depositAmount),
        type: "rightAligned",
      },
      {
        headerName: "Bank",
        field: "bankName",
        width: 250,
      },
      {
        headerName: "Branch",
        field: "bankBranchName",
        width: 180,
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
  }

  getFileName(event: any, fileIndex: number) {
    const files = event.target.files[0] as File;
    let fileName = 'Choose Files ...';
    if (files !== null) {
      const fileName = files.name;
      const ext = fileName.split('.').pop();
      const fileSupported: string[] = this.commonService.voucherUploadSupportedExt;
      if (ext && fileSupported.indexOf(ext.toLowerCase()) > -1) {
        this.fileToBase64String(files).pipe(take(1)).subscribe(baseString => {
          this.salesRemittanceSlips.at(fileIndex).patchValue({
            fileString: baseString,
            fileName: fileName,
            ext: ext
          });
        });
      } else {
        this.toastrService.info('File Format is not supported.', 'Message');
      }
    }
  }

  downloadFile(remittanceSlipId: number) {
    this.remittanceService.DownloadRemittanceSlip(remittanceSlipId).pipe(take(1)).subscribe(
      (returns: any) => {
        if (returns.success !== undefined && !returns.success) {
          this.toastrService.warning(returns.message, 'Message');
          return false;
        }
        const ext = returns.fileName.split('.').pop();
        if (ext) {
          const downloadLink = document.createElement('a');
          const blob = this.commonService.b64toBlob(returns.fileString, returns.contentType);
          const blobUrl = URL.createObjectURL(blob);
          downloadLink.href = blobUrl;
          downloadLink.download = returns.fileName;
          downloadLink.click();
        } else {
          this.toastrService.warning('Please Try Again.', 'Message');
        }
      }
    );
  }

  fileToBase64String(filepath: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsDataURL(filepath);
    reader.onload = (event) => result.next(reader.result.toString());
    return result;
  }

  isSelectAll: boolean = false;
  checkCounter: number = 0;
  checkChange(e: any) {
    //debugger
    let isChecked: boolean = false;
    isChecked = e.target.checked;

    this.bodyData.forEach(element => {
      element.isSelect = isChecked;
    });
  }
  // selectedAmount = 0.00;
  // onCheckBoxChange(e: any, rowIndex: number) {
  //   //debugger
  //   if (e.target.checked) {
  //     this.bodyData[rowIndex].isSelect = true;
  //     this.selectedAmount += this.bodyData[rowIndex].collectionAmount;
  //     this.selectedAmount = parseFloat(this.selectedAmount.toFixed(2));
  //   }
  //   else {
  //     this.bodyData[rowIndex].isSelect = false;
  //     this.selectedAmount -= this.bodyData[rowIndex].collectionAmount;
  //     this.selectedAmount = parseFloat(this.selectedAmount.toFixed(2));
  //   }


  // }
  onCheckBoxChange(e: any, rowIndex: number) {
    /*
        const control = this.formSalesRemittance.get('selectedAmount');
    
        if (!control) {
          return; // Safeguard in case the control is not found
        }
    
        if (e.target.checked) {
          this.bodyData[rowIndex].isSelect = true;
          const newAmount = control.value + this.bodyData[rowIndex].collectionAmount;
          control.setValue(parseFloat(newAmount.toFixed(2)));
        } else {
          this.bodyData[rowIndex].isSelect = false;
          const newAmount = control.value - this.bodyData[rowIndex].collectionAmount;
          control.setValue(parseFloat(newAmount.toFixed(2)));
        }
    */
    this.GetTotalCollectionAmount();
  }

  removeDetail(index: number): void {
    //debugger
    //this.detailsAmountTotal -= this.salesRemittanceDetails[index].depositAmount;
    this.salesRemittanceDetails.removeAt(index);

    this.GetTotalDepositAmount();
  }


}

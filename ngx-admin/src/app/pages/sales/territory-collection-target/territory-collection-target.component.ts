import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { CommonService } from 'app/@core/mock/common.service';
import { SalesinvoiceService } from 'app/services/sales/salesinvoice.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { take } from 'rxjs/operators';
import { BtnCellRenderer } from '../settings/common/btn-cell-renderer.component';

@Component({
  selector: 'ngx-territory-collection-target',
  templateUrl: './territory-collection-target.component.html',
  styleUrls: ['./territory-collection-target.component.scss']
})
export class TerritoryCollectionTargetComponent implements OnInit {

  pageNavigation = 'Territory Collection Target';
  rReportHeader = 'Territory Collection Target';
  show: boolean = true;
  disabled: boolean = true;

  private gridApi;
  private gridColumnApi;

  public columnDefs;
  public defaultColDef;
  public rowData: [];
  public bodyData: any[] = [];
  public totalAmount=0;
  private selectedTerrColTargetDetailId = 0;
  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };

  depotItems: any[] = [];
  territoryItems: any[] = [];
  collectionTargetForm: FormGroup;
  selectedRow: any;
  params = [];

  constructor(
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private salesinvoiceService: SalesinvoiceService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.commonService.valueSet("showlist");
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
        headerName: "Depot Code",
        field: "depotCode",
        width: 200,
      },
      {
        headerName: "Depot Name",
        field: "depotName",
        width: 350,
      },
      {
        headerName: "Start Date",
        field: "startDate",
        filter: "agDateColumnFilter",
        valueFormatter: (params) => this.datePipe.transform(params.data.startDate,'dd-MM-yyyy'),
        type: "rightAligned",
        width: 200,
      },
      {
        headerName: "End Date",
        field: "endDate",
        filter: "agDateColumnFilter",
        valueFormatter: (params) => this.datePipe.transform(params.data.endDate,'dd-MM-yyyy'),
        type: "rightAligned",
        width: 200,
      },
      {
        headerName: "Amount",
        field: "targetAmount",
        filter: "agNumberColumnFilter",
        valueFormatter: (params) => this.commonService.currencyFormatter(params.data.targetAmount),
        type: "rightAligned",
        width: 220,
      },
      {
        field: "action",
        cellRenderer: "btnCellRenderer",
        cellRendererParams: {
          clicked: function (field: any) { },
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
  }

  ngOnInit(): void {
    this.createForm();
    this.LoadAllDropdown();
  }

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.createForm();
      this.show = false;
      this.disabled = false;
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

  reset() {
    this.createForm();
    this.collectionTargetForm.controls['depotCode'].enable();
    this.collectionTargetForm.controls['startDate'].enable();
    this.collectionTargetForm.updateValueAndValidity();
  }

  save() {
    const button = this.commonService.buttonClicked;
    this.collectionTargetForm.get('amount').clearValidators();
    this.collectionTargetForm.get('amount').updateValueAndValidity();
    if (this.collectionTargetForm.valid && this.terrColTargetDetails.length > 0) {
      const formValue = this.collectionTargetForm.getRawValue();
      formValue.startDate = this.commonService.DateFormat(formValue.startDate);
      formValue.endDate = this.commonService.DateFormat(formValue.endDate);
      this.salesinvoiceService.SaveTerritoryCollectionTarget(formValue).subscribe(
        (ret: any) => {
          if (ret.success) {
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
            this.show = true;
          } else {
            this.commonService.valueSet("create");
            this.toastrService.danger("Data not saved!", "Message");
          }
        },
        (err) => {
          this.commonService.valueSet("create");
          console.error(err);
        }
      )
    } else {
      this.commonService.valueSet("create");
      this.toastrService.warning("Please add at least one territory.", "Message");
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getTerritoryCollectionTargetData();
  }


  getTerritoryCollectionTargetData(): void {
    this.salesinvoiceService.GetTerritoryCollectionTarget().pipe(take(1)).subscribe((data: any) => {
      if (data.success) {
        this.rowData = data.data;
      }
    });
  }



  onRowClicked(event) {
    const selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked; //localStorage.getItem("button");
    if (data == "edit") {
      this.agEdit(selectedRow.terrColTargetMasterId);
      this.show = false;
    } else if (data == "view") {
      this.agEdit(selectedRow.terrColTargetMasterId);
      this.show = false;
      this.disabled = true;
    } else if (data == "transectionreport") {
      this.agReport(selectedRow.terrColTargetMasterId);
    } else if (data == "delete") {
      this.agDelete(selectedRow.terrColTargetMasterId);
    } else {
      //this.toastrService.info("Please Click Any Button", "Message");
    }
  }

  deleteDetails(index: number) {
    this.terrColTargetDetails.removeAt(index);
    if (this.terrColTargetDetails.length > 0) {
      this.collectionTargetForm.controls['depotCode'].disable();
      this.collectionTargetForm.controls['startDate'].disable();
    } else {
      this.collectionTargetForm.controls['depotCode'].enable();
      this.collectionTargetForm.controls['startDate'].enable();
    }
  }

  addToDetailsGrid() {
    const formValue = this.collectionTargetForm.getRawValue();
    if (formValue.territoryCode != '' && formValue.amount > 0) {
      const territoryName = this.territoryItems.filter(x => x.id == formValue.territoryCode)[0]?.name ?? '';
      const existsTerritory = formValue.terrColTargetDetails.filter(x=> x.territoryCode == formValue.territoryCode);
      if(!(existsTerritory.length > 0)) {
        const val = {
          terrColTargetDetailId: this.selectedTerrColTargetDetailId,
          territoryCode: formValue.territoryCode,
          targetAmount: formValue.amount,
          territoryName: territoryName
        }
        this.terrColTargetDetails.push(this.createDetailsForm(val));
        this.collectionTargetForm.patchValue({
          territoryCode: null,
          amount: null
        });
        this.selectedTerrColTargetDetailId = 0;
      } else {
        this.toastrService.warning('Duplicate item found.','Message');
      }

    } else {
      this.toastrService.warning('Please fill amount and select territory.','Message');
    }
    if (this.terrColTargetDetails.length > 0) {
      this.collectionTargetForm.controls['depotCode'].disable();
      this.collectionTargetForm.controls['startDate'].disable();
    } else {
      this.collectionTargetForm.controls['depotCode'].enable();
      this.collectionTargetForm.controls['startDate'].enable();
    }
    this.collectionTargetForm.updateValueAndValidity();

  }

  LoadAllDropdown() {
    this.getAllDepot();
  }

  getAllDepot() {
    const apiUrl = `SalesInvoice/GetAllDepot`;
    this.commonService.getApiData(apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.depotItems = returns.data.map((val: any) => ({
          id: val.depotCode,
          name: val.depotName,
        }));
      }
    });
  }


  getAllTerritory(depotCode: any = '') {
    this.salesinvoiceService.GetAllTerritoryForDepot(depotCode).subscribe((returns: any) => {
      if (returns.success) {
        this.territoryItems = returns.data.map((val: any) => ({
          id: val.TerritoryCode,
          name: val.TerritoryName,
        }));
      }
    });
  }

  createForm() {
    this.collectionTargetForm = this.formBuilder.group({
      terrColTargetMasterId: new FormControl('0'),
      depotCode: new FormControl('', [Validators.required]),
      territoryCode: new FormControl(''),
      amount: new FormControl(''),
      startDate: new FormControl(this.getFirstDateOfTheMonth(), [Validators.required]),
      endDate: new FormControl(this.datePipe.transform(this.getLastDateOfTheMonth(), 'MMM d, yyyy'), [Validators.required]),
      terrColTargetDetails: new FormArray([])
    });

    this.collectionTargetForm.get('startDate').valueChanges.subscribe(
      (val) => {
        const firstDate = this.getFirstDateOfTheMonth(val);
        if (!(val.getFullYear() === firstDate.getFullYear() && val.getMonth() === firstDate.getMonth() && val.getDate() === firstDate.getDate())) {
          this.assignFirstDayOfMonth();
        }
        this.assignLastDayOfMonth();
      }
    );
  }

  assignFirstDayOfMonth(): void {
    const date = this.collectionTargetForm.get('startDate').value;
    this.collectionTargetForm.patchValue({
      startDate: this.getFirstDateOfTheMonth(date),
      endDate: this.datePipe.transform(this.getLastDateOfTheMonth(date), 'MMM d, yyyy')
    })
  }

  assignLastDayOfMonth(): void {
    const date = this.collectionTargetForm.get('startDate').value;
    this.collectionTargetForm.patchValue({
      endDate: this.datePipe.transform(this.getLastDateOfTheMonth(date), 'MMM d, yyyy')
    })
  }

  getFirstDateOfTheMonth(date: Date = new Date()) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
  }

  getLastDateOfTheMonth(date: Date = new Date()) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0));
  }


  agDelete(terrColTargetMasterId: number): void {
    if (confirm('Are you sure?')) {
      this.salesinvoiceService.DeleteTerritoryCollectionTarget(terrColTargetMasterId).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, 'Message');
          this.getTerritoryCollectionTargetData();
        } else {
          this.toastrService.danger(this.commonService.deleteFailedMsg, 'Message');
        }
      });
    }
  }

  agEdit(terrColTargetMasterId: number): void {
    this.disabled = false;
    this.createForm();
    this.salesinvoiceService.GetTerritoryCollectionTarget(terrColTargetMasterId).pipe(take(1)).subscribe((data: any) => {
      if (data.success) {
        const singleData = data.data[0];
        this.collectionTargetForm.patchValue({
          terrColTargetMasterId: singleData.terrColTargetMasterId,
          depotCode: singleData.depotCode,
          startDate: new Date(singleData.startDate),
          endDate: this.datePipe.transform(singleData.endDate, 'MMM d, yyyy'),
        });
        singleData.terrColTargetDetails.forEach(element => {
          this.terrColTargetDetails.push(this.createDetailsForm(element));
        });
        this.getAllTerritory(singleData.depotCode);
      }
    });
  }

  agReport(terrColTargetMasterId: number) {
    this.salesinvoiceService.GetTerritoryCollectionTarget(terrColTargetMasterId).pipe(take(1)).subscribe((data: any) => {
      if (data.success) {
        const singleData = data.data[0];
        this.bodyData = [...singleData.terrColTargetDetails];
        this.totalAmount = singleData.targetAmount;

        this.params = [];
        this.params.push({
          leftLabel: "Depot Code",
          leftValue: singleData.depotCode,
          rightLabel: "Depot Name",
          rightValue: singleData.depotName,
        });
        this.params.push({
          leftLabel: "From Date",
          leftValue: `${this.datePipe.transform(singleData.startDate,'dd-MM-yyyy')}`,
          rightLabel: "To Date",
          rightValue: `${this.datePipe.transform(singleData.endDate,'dd-MM-yyyy')}`,
        });

        const content = document.getElementById("reportHeader");
        this.generateAttReport(this.rReportHeader, this.pageNavigation, content);
      } else {
        this.toastrService.danger('Data Not Found','Message');
      }
    });
  }


  public generateAttReport(
    buttonAction: any,
    fileName: string,
    content: any
  ) {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(5); //optional
    doc.setTextColor(50); //optional
    const legend = {
      height: 100,
    };
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

    doc.html(content, {
      callback: function (doc) {
        autoTable(doc, {
          html: "#header_table",
          startY: legend.height,// + 20,
          styles: { font: "Meta" },
          headStyles: {
            halign: "center",
            valign: "top",
            fontStyle: "bold",
            textColor: 50,
            fontSize: 20,
            fillColor: [255, 255, 255],
          },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 120,
          theme: "grid",
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.75,
          styles: {
            font: "Meta",
            lineColor: [44, 62, 80],
            lineWidth: 0.55,
          },
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
            fontSize: 11,
          },
          bodyStyles: {
            textColor: 50,
            valign: "middle",
          },
          columnStyles: {
            2: { halign: "right" },
          },
        });

        addFooters(doc);

        ////////////PRINT ////////////
        if (buttonAction == "pdf") {
          doc.save(fileName);
        } else {
          window.open(URL.createObjectURL(doc.output("blob")), "_blank");
          doc.close();
        }
      },
    });

  }

  get terrColTargetDetails(): FormArray {
    return this.collectionTargetForm.get('terrColTargetDetails') as FormArray;
  }

  createDetailsForm(value: any = null): FormGroup {
    return this.formBuilder.group({
      terrColTargetDetailId: new FormControl(value?.terrColTargetDetailId),
      territoryCode: new FormControl(value?.territoryCode),
      territoryName: new FormControl(value?.territoryName),
      targetAmount: new FormControl(value?.targetAmount ?? 0)
    });
  }

}

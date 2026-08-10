import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
  ElementRef,
  ViewChild,
} from "@angular/core";
// import { FormControl } from "@angular/forms";
import { NbToastrService, NbDatepickerModule } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";
import { DomSanitizer } from "@angular/platform-browser";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
import { take } from "rxjs/operators";
import * as ExcelJS from "exceljs/dist/exceljs.min.js";
import * as FileSaver from "file-saver";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";

import * as XLSX from "xlsx-js-style";

@Component({
  selector: 'ngx-customer-wise-sales-report',
  templateUrl: './customer-wise-sales-report.component.html',
  styleUrls: ['./customer-wise-sales-report.component.scss']
})
export class CustomerWiseSalesReportComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  reportId : string = '3';

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-sales-pmd-report',
  templateUrl: './sales-pmd-report.component.html',
  styleUrls: ['./sales-pmd-report.component.scss']
})
export class SalesPmdReportComponent implements OnInit {
  reportId: string;
  constructor() { }

  ngOnInit(): void {
    this.reportId = '6';
  }

}

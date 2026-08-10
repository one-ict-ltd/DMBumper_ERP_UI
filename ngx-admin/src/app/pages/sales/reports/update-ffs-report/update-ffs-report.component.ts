import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-update-ffs-report',
  templateUrl: './update-ffs-report.component.html',
  styleUrls: ['./update-ffs-report.component.scss']
})
export class UpdateFfsReportComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  reportId : string = '4';
}

import {
  Component,
  OnInit,
} from "@angular/core";
// import { FormControl } from "@angular/forms";


@Component({
  selector: 'ngx-sal-ff-wise-report',
  templateUrl: './sal-ff-wise-report.component.html',
  styleUrls: ['./sal-ff-wise-report.component.scss']
})
export class SalFfWiseReportComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  reportId: string = '2';

}

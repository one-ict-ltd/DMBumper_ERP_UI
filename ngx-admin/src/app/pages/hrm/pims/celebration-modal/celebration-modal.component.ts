import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeinformationService } from 'app/services/hrm/employeeinformation.service';

@Component({
  selector: 'ngx-celebration-modal',
  templateUrl: './celebration-modal.component.html',
  styleUrls: ['./celebration-modal.component.scss']
})
export class CelebrationModalComponent implements OnInit {
  title: string;
  name: string;
  designation: string;
  department: string;

  constructor(
    protected ref: NbDialogRef<CelebrationModalComponent>,
    private activatedRoute: ActivatedRoute,
    private employeeinformationService: EmployeeinformationService,
  ) { }

  cancel() {
    this.ref.close();
  }

  submit(name) {
    this.ref.close(name);
  }
  public bodyDataCel: any = [];
  ngOnInit() {
    // Perform any initialization or data processing here if needed.
    this.title = "Celebration"
    this.activatedRoute.queryParams.subscribe(params => {
      this.employeeinformationService.GetCelebtationForESSJson().subscribe((data: any) => {
        if (data.success) {
          this.bodyDataCel = data.data
        }
      });
    });
  }
}

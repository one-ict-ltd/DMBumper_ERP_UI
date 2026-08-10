import { Component, OnInit, TemplateRef } from "@angular/core";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";
import { ActivatedRoute } from '@angular/router';
import { EmployeeinformationService } from "app/services/hrm/employeeinformation.service";
import { EmployeeotherinfoService } from "app/services/hrm/employeeotherinfo.service";
import { take } from "rxjs/operators";
import { Observable, ReplaySubject } from "rxjs";

@Component({
  selector: 'ngx-empallinfo',
  templateUrl: './empallinfo.component.html',
  styleUrls: ['./empallinfo.component.scss']
})
export class EmpallinfoComponent implements OnInit {
  imageUrl: string = '';
  tempImageUrl: string = '';

  master: {
    employeeId: number;
    employeeNo: string;
    fullName: string;
    currentDesignation: string;
    mobileNo: string;
    emailId: string;
    imageUrl: string;
    extension: string;
    tempImageUrl: string;

  };

  public getMaster() {
    this.master = {
      employeeId: 0,
      employeeNo: '',
      fullName: '',
      currentDesignation: '',
      mobileNo: '',
      emailId: '',
      imageUrl: '',
      extension: '',
      tempImageUrl: ''
    };
  }
  public pageNavigation = "Employee's Personal Information";

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private employeeinformationService: EmployeeinformationService,
    private activatedRoute: ActivatedRoute,
    private dialogService: NbDialogService,
    private employeeRelatedOthersInfo: EmployeeotherinfoService
  ) {

    this.getMaster();
  }

  ngOnInit(): void {
    debugger
    this.activatedRoute.queryParams.subscribe(params => {
      this.master.employeeId = params['employeeId'];
      this.employeeinformationService.GetEmployeeBasicInfoById(this.master.employeeId).subscribe((data: any) => {
        if (data.success) {

          this.master.employeeId = this.master.employeeId;
          this.master.employeeNo = data.data[0].employeeNo;
          this.master.fullName = data.data[0].fullName;
          this.master.currentDesignation = data.data[0].currentDesignation;
          this.master.mobileNo = data.data[0].mobileNo;
          this.master.emailId = data.data[0].emailId;
          this.master.imageUrl = "http://103.106.236.93:9115/" + data.data[0].imageUrl;
          //this.master.imageUrl = "http://localhost:8099/" + data.data[0].imageUrl;
        }
      });
    });

  }

  public RptButtonAction() {
    const clicked = this.commonService.buttonClicked;
    if (clicked == "preview") {
      this.onPreview();
    } else if (clicked == "pdf") {
      this.generateReport("pdf");
    } else if (clicked == "print") {
      this.generateReport("print");
    } else if (clicked == "csv") {
      this.onExportCSV();
    } else if (clicked == "refresh") {
      this.onRefresh();
    } else if (clicked == "email") {
      this.onEmail();
    } else {
      this.toastrService.warning("Message", "please clicked any button");
    }
  }

  private onRefresh() {
    this.toastrService.warning("Message", "refresh button clicked");
  }

  private onPreview() {
    this.toastrService.warning("Message", "preview button clicked");
  }

  public generateReport(buttonAction: any) {

  }

  private onExportCSV() {

  }

  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }
  public OpenModal(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
      context: [], //this.data,
    });
  }
  resetImage() {
    this.tempImageUrl = null;
  }
  onSelectImage(event: any) {

    if (event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        //this.imageUrl = event.target.result;
        this.tempImageUrl = event.target.result;
      }
    }
  }


  getFileName(event: any) {
    const files = event.target.files[0] as File;
    let fileName = 'Choose Files ...';
    if (files !== null) {
      fileName = files.name;
      const ext = fileName.split('.').pop();
      const fileSupported: string[] = this.commonService.voucherUploadSupportedExt;
      if (ext && fileSupported.indexOf(ext.toLowerCase()) > -1) {
        this.fileToBase64String(files).pipe(take(1)).subscribe(baseString => {
          this.master.tempImageUrl = baseString;
          this.master.extension = ext;
        });
      } else {
        this.toastrService.info('File Format is not supported.', 'Message');
      }
    }
  }

  fileToBase64String(filepath: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsDataURL(filepath);
    reader.onload = (event) => result.next(reader.result.toString());
    return result;
  }
  public uploadImage() {
    this.employeeRelatedOthersInfo.SaveEmployeeAttachment(this.master).subscribe((res) => {
      if (res.success) {
        this.imageUrl = this.tempImageUrl;
        this.toastrService.success("Message", "Photo uploaded successfully!");
        this.ngOnInit();
      }
      else {
        this.toastrService.warning("Message", "Photo was not uploaded successfully!");
      }

    })
  }


}

import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { CommonService } from 'app/@core/mock/common.service';
import { CommoncomboService } from 'app/services/commoncombo.service';
import { FieldforcemasterService } from 'app/services/fieldforcetracking/fieldforcemaster.service';

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

@Component({
  selector: 'ngx-examresult',
  templateUrl: './examresult.component.html',
  styleUrls: ['./examresult.component.scss']
})
export class ExamresultComponent implements OnInit {


  public pageNavigation = "Exam Result";
  public showBody = false;
  public examList: any[] = [];
  public examSelected = null;
  public examName ='';
  public bodyData =[];
  public params = [];
  public tableHeader = [
    "employeeNo",
    "fullName",
    "territoryCode",
    "Area",
    "Region",
    "Marks",
  ];

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private fieldforcemasterService: FieldforcemasterService,
    private comboService: CommoncomboService
  ) { }

  ngOnInit(): void {
    this.getExamData();
  }

  public RptButtonAction() {
    const clicked = this.commonService.buttonClicked;
    if (clicked == "preview") {
      this.onPreview();
    } else if (clicked == "pdf") {
      this.generateReport("pdf");
      //this.generateCrReport("pdf");
    } else if (clicked == "print") {
      this.generateReport("pdf");
      //this.generateCrReport("pdf");
    } else if (clicked == "csv") {
      //this.onExportCSV();
      //this.generateCrReport("Excel");
      this.toastrService.warning("Message", "please clicked any button");
    } else if (clicked == "refresh") {
      this.onRefresh();
    } else if (clicked == "email") {
      this.onEmail();
    } else {
      this.toastrService.warning("Message", "please clicked any button");
    }
  }

  public getExamData() {
    this.fieldforcemasterService.getExamByContentId(0).subscribe((returns: any) => {
      if (returns.status) {
        this.examList = returns.data.map((val) => ({
          value: val.CmnExamID,
          //name: val.partyName,
          name: val.name,
        }));
      }
    });
  }

  private onPreview() {
    this.getReportData();
    this.showBody = true;
  }
  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }
  private onExportCSV() {

  const apiUrl = `Schedule/GetExamResultByExamId?examId=${this.examSelected.value}`;
  this.commonService.getReportData(apiUrl).subscribe((returns: any) => {
    if (returns.success) {
      this.bodyData = returns.data;
      console.log(this.bodyData);
      const fileName = this.pageNavigation + ".xlsx";
      this.commonService.GenerateExcelSheet(this.bodyData, this.tableHeader, fileName);
    } else {
      this.toastrService.danger("Message", this.commonService.nodatafound);
    }
  });
  }
  public setParam() {
    this.params = [];
    this.params.push({
      leftLabel: "Customer Name",
      leftValue: this.examSelected.name,
    });
  }
  public datalength = 0;
  public generateReport(buttonAction: any) {
    //this.setParam();
    var fileName = this.pageNavigation + ".pdf";
    this.getReportData();
    const content = document.getElementById("reportHeader");
    this.datalength = 0;
    this.datalength =
      this.bodyData.length;

    if (this.datalength > 0)
      this.generatePdfExamResult(
        buttonAction,
        fileName,
        content,
        this.datalength
      );
  }

  private getReportData() {
     const apiUrl = `Schedule/GetExamResultByExamId?examId=${this.examSelected.value}`;

    this.commonService.getReportData(apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.bodyData = returns.data;
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }

  public generatePdfExamResult(
    buttonAction: any,
    fileName: string,
    content: any,
    datalength: number
  ) {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(5); //optional
    doc.setTextColor(40); //optional

    let lTableHeight = 0;
    let rTableHeight = 0;

    let legend = {
      height: 100,
      totalheight: datalength * 100,
    };
    //debugger;
    const addFooters = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      //var a = doc.internal.setFont("helvetica", "italic");
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

    //////////// TABLE DATA ////////////
    // legend.totalheight=legend.height+this.datalength;
    doc.html(content, {
      callback: function (doc) {
        autoTable(doc, {
          html: "#header_table_top",
          startY: legend.height + 30,
          styles: { font: "Meta", fontSize: 15, halign: "center" },
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
            fillColor: [250, 250, 250],
            fontSize: 11,
            halign: "center",
            textColor: 50,
          },
          bodyStyles: {
            fillColor: [250, 250, 250],
            textColor: 50,
            // halign:"right"
          },
          columnStyles: {
            //  0: { halign: "center" },
            // 3: { halign: "right" },
            2: { halign: "right" },
          },

          alternateRowStyles: {
            fillColor: [250, 250, 250],
          },
          didDrawPage: function (d) {
            lTableHeight = d.cursor.y;
          },
        });


        legend.totalheight =
          lTableHeight > rTableHeight ? lTableHeight : rTableHeight;

        addFooters(doc);
        ////////////PRINT ////////////
        if (buttonAction == "pdf") {
          doc.save(fileName);
        } else {
          window.open(URL.createObjectURL(doc.output("blob")), "_blank"); //doc.output("dataurlnewwindow");
          doc.close();
        }
      },
    });
  }

  private onRefresh() {
    this.examSelected = null;
    this.bodyData = [];
    this.showBody = false;
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonService } from 'app/@core/mock/common.service';
import { FieldforcemasterService } from 'app/services/fieldforcetracking/fieldforcemaster.service';
import * as XLSX from 'xlsx';

type AOA = any[][];

@Component({
  selector: 'ngx-plan-upload',
  templateUrl: './plan-upload.component.html',
  styleUrls: ['./plan-upload.component.scss']
})
export class PlanUploadComponent implements OnInit {
  constructor(
    private fieldforcemasterService: FieldforcemasterService,
    private commonService:CommonService
    ) { 

    
  }

  ngOnInit(): void {
  }
  data: AOA = [[1, 2], [3, 4]];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';

  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      console.log("data:",this.data);
      this.data.map(res=>{
        if(res[0] === "no"){
          console.log(res[0]);
        }else{
          console.log(res[0]);
        }
      })
    };
    reader.readAsBinaryString(target.files[0]);
  }
  public SetUploaddata() {
    var myJsonString = JSON.stringify(this.data);
    debugger;
    this.fieldforcemasterService.savePlan(myJsonString).subscribe((retuns: any) => {
      if (retuns) {
      
      }
    })
    

  }
  public fromdateSelected = new Date();
  public todateSelected = new Date();
  public addDetails() {
    //debugger
   // console.log(this.data);
 
   this.SetUploaddata();
    this.refesh();
  }
  public refesh() {
    this.data= [[], []];
    this.fileName="";
  }
  public apiUrl = "";
  export(): void {
    // /* generate worksheet */
    // const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);

    // /* generate workbook and add the worksheet */
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // /* save to file */
    // XLSX.writeFile(wb, this.fileName);
  
    this.apiUrl = `Schedule/ProcessPlan?fromDate=${this.fromdateSelected.toString().substring(3, 15)}&toDate=${this.todateSelected
      .toString().substring(3, 15)}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns) {
   
      }
    });
    


  }

}
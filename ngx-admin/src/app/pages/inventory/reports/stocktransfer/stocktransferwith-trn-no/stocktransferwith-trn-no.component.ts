import { Component, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { CommonService } from "app/@core/mock/common.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { ProducttransferService } from "app/services/inventory/producttransfer.service";
import { StockinService } from "app/services/inventory/stockin.service";
import { MenuService } from "app/services/menu.service";

@Component({
  selector: 'ngx-stocktransferwith-trn-no',
  templateUrl: './stocktransferwith-trn-no.component.html',
  styleUrls: ['./stocktransferwith-trn-no.component.scss']
})
export class StocktransferwithTrnNoComponent implements OnInit {
  public pageNavigation = "Product (Stock) Transfer Challan";
  public tableHeader = ["Transfer No.", "Transfer Date", "#", "Product Specification", "Transfer Qty.", "UOM"];
  public apiUrl = "";
  public htmlBodyData: string = "";
  public bodyData: any = [];
  public bodyDatashow: any = [];
  public params = [];
  public companies = [];
  public sbuList = [];
  public storeList = [];
  public TRNList = [];
  public fromStoreId: number = 0;
  public showbody: boolean = false;

  master: {
    fromSbuId: number;
    fromStoreId: number;
    fromDate: Date;
    toDate:Date;
    prodTrnfrId:number;
    fromSbuSelected: {};
    fromStoreSelected:{};
    fromTRNSelected:{};
  };

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private menuService: MenuService,
    private stockinService: StockinService,
    private producttransferService: ProducttransferService,
  ) {
    this.getDropdownData();
    this.getMaster();
  }

  public getMaster() {
    this.master = {
      fromSbuId: 0,
      fromStoreId: 0,
      fromDate: new Date(),
      toDate: new Date(),
      prodTrnfrId:0,
      fromSbuSelected: null,
      fromStoreSelected: null,
      fromTRNSelected: null,
    };
  }


  ngOnInit(): void { }
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

  public setParam() {
    this.params = [];
    this.params.push({
      leftLabel: "SBU Name:",
      leftValue: this.master.fromSbuSelected == null? 'All' : this.master.fromSbuSelected['name'],
      rightLabel: "Store Name:",
      rightValue: this.master.fromStoreSelected == null? 'All' : this.master.fromStoreSelected['name'],
    });

    //  this.params.push({
    //   leftLabel: "SBU Name:",
    //   leftValue: this.master.fromSbuSelected['name'],
    //   rightLabel: "Store Name:",
    //   rightValue: this.master.fromStoreSelected['name'],
    // });

    this.params.push({
      leftLabel: "From Transfer Date:",
      leftValue: this.master.fromDate.toDateString().substring(0, 15),
      rightLabel: "To Transfer Date:",
      rightValue: this.master.toDate.toDateString().substring(0, 15),
    });
  }

  private getDropdownData() {
    this.comboService.getSBU(0).subscribe((returns: any) => {
      this.sbuList = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
    });
  }

  public getStores(fromsbuId) {
    this.storeList = [];
    this.stockinService.getStore(fromsbuId, 0).subscribe((returns: any) => {
      this.storeList = returns.data.map((val) => ({
        id: val.storeId,
        name: val.storeName,
      }));
    });
  }

  public getTRNNo() {
    this.TRNList = [];
    this.stockinService.getTRNNo(this.master.fromStoreId,this.master.fromDate.toDateString().substring(4, 15),this.master.toDate.toDateString().substring(4, 15)).subscribe((returns: any) => {
      this.TRNList = returns.data.map((val) => ({
        id: val.prodTrnfrId,
        name: val.prodTrnNo,
      }));
    });
  }

  public natureName = "";
  public groupCode = "";
  public groupName = "";
  public fromDate = new Date();
  public toDate = new Date();

  private getReportData() {
    this.apiUrl = `stock/getStockTransferReportData?fromDate=${this.master.fromDate.toDateString().substring(4, 15)}&toDate=${this.master.toDate.toDateString().substring(4, 15)}&fromSbuId=${this.master.fromSbuId}&fromStoreId=${this.master.fromStoreId}&prodTrnfrId=${this.master.prodTrnfrId}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.bodyData = [];
        this.bodyData = returns.data;
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }

  public renderHtml(bodyData: any[]) {
    this.htmlBodyData = '';

    for (let index = 0; index < bodyData.length; index++) {
      const element = bodyData[index];
      this.htmlBodyData += '<tr> <td rowspan = "' + element.rowMerge + '" ' + element.hidden + '>' + element.prodTrnNo + '</td> <td rowspan = "' + element.rowMerge + '" ' + element.hidden + '>' + element.prodTrnDate + '</td> <td>' + index + 1 + '</td> <td>' + element.productName + '</td> <td>' + element.transferQty + '</td> <td>' + element.uomName + '</td> </tr>'
    }
  }

  private onRefresh() {
    this.bodyData = [];
    this.htmlBodyData = '';
    this.showbody = false;
  }

  private onPreview() {
    this.getReportData();
    this.showbody = true;
  }

  private onExportCSV() {
    this.getReportData();
    var fileName = this.pageNavigation + ".xlsx";
    this.commonService.generateExcel(this.bodyData, this.tableHeader, fileName);
  }

  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  public generateReport(buttonAction: any) {
    this.setParam();
    var fileName = this.pageNavigation + ".pdf";
    this.getReportData();
    const content = document.getElementById("reportHeader");
    this.commonService.generateReport(buttonAction, fileName, content);
  }


}


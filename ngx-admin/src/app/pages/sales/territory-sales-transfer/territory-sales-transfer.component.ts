import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { CommonService } from 'app/@core/mock/common.service';
import { CommoncomboService } from 'app/services/commoncombo.service';
import { SalesinvoiceService } from 'app/services/sales/salesinvoice.service';

@Component({
  selector: 'ngx-territory-sales-transfer',
  templateUrl: './territory-sales-transfer.component.html',
  styleUrls: ['./territory-sales-transfer.component.scss']
})
export class TerritorySalesTransferComponent implements OnInit {

  show: boolean = true;

  constructor(private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private salesinvoiceService: SalesinvoiceService) {
    debugger
    this.getMaster();
    this.GetTerritory();
  }

  ngOnInit(): void {
  }
  public pageNavigation = "Territory Sales Transfer";
  public RptButtonAction() {
    const clicked = this.commonService.buttonClicked;
    if (clicked == "preview") {
      //this.onPreview();
    } else if (clicked == "pdf") {
      //this.generateReport("pdf");
    } else if (clicked == "print") {
      //this.generateReport("print");
    } else if (clicked == "csv") {
      //this.onExportCSV();
    } else if (clicked == "refresh") {
      //this.onRefresh();
    } else if (clicked == "email") {
      //this.onEmail();
    } else {
      this.toastrService.warning("Message", "please clicked any button");
    }
  }


  master: {
    FromTerritoryDetails: string;
    ToTerritoryDetails: string;
    FromDepo: string;
    ToDepo: string;
    FromTerritorySelected: {};
    ToTerritorySelected: {};
    fromTerritoryCode: string;
    toTerritoryCode: string;
  };
  public getMaster() {
    this.master = {

      FromTerritorySelected: null,
      ToTerritorySelected: null,
      FromDepo: "",
      ToDepo: "",
      FromTerritoryDetails: "",
      ToTerritoryDetails: "",
      fromTerritoryCode: "",
      toTerritoryCode: "",
    };
  }
  public TerritoryList = [];
  public GetTerritory() {
    debugger
    this.salesinvoiceService.getTerritoryForTerritoryTransfer(0).subscribe((retuns: any) => {
      if (retuns.success) {
        this.TerritoryList = retuns.data.map((val: any) => ({
          id: val.Code,
          name: ` ${val.Code} - ${val.Name}`,
          AreaCode: val.AreaCode,
          AreaName: val.AreaName,
          RegionCode: val.RegionCode,
          RegionName: val.RegionName,
          ZoneCode: val.ZoneCode,
          DepotCode: val.DepotCode,
          ZoneName: val.ZoneName,
          DepotName: val.DepotName,
          details: ` ${'Depot'} : ${val.DepotCode}- ${val.DepotName} ; ${'Area'} : ${val.AreaCode}- ${val.AreaName} ; ${'Region'} : ${val.RegionCode}- ${val.RegionName} ; ${'Zone'} :${val.ZoneCode}- ${val.ZoneName} `
        }))
      }
    })
  }

  public GetFromTerritoryDetails(event: any) {
    this.master.FromTerritoryDetails = event.details;
    this.master.FromDepo = event.DepotCode;
  }
  public GetToTerritoryDetails(event: any) {
    this.master.ToTerritoryDetails = event.details;
    this.master.ToDepo = event.DepotCode;
  }
  public Transfer() {
    debugger
    if (this.master.fromTerritoryCode == this.master.toTerritoryCode) {
      this.toastrService.warning("Both Territory are same!", "Message");
      return false;
    }
    if (this.master.FromDepo != this.master.ToDepo) {
      this.toastrService.warning("Both Depo are not same!", "Message");
      return false;
    }
    debugger
    this.salesinvoiceService.TransferTerritoryData(this.master).subscribe((returns: any) => {
      if (returns.success) {
        this.toastrService.success(
          "Transfered Successfully", "Message");
      }
      this.getMaster();
    });
  }
}

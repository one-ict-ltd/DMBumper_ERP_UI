import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  NbActionsModule,
  NbAlertModule,
  NbAutocompleteModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule,
  NbIconModule,
  NbInputModule,
  NbOptionModule,
  NbRadioModule,
  NbSelectModule,
  NbTabsetModule,
  NbToastrModule,
  NbUserModule,
} from "@nebular/theme";
import { ThemeModule } from "app/@theme/theme.module";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from "@ng-select/ng-select";
import { HttpClientModule } from "@angular/common/http";
import { AgGridModule } from "ag-grid-angular";

import { AuthRoutingModule } from "app/auth/auth-routing.module";
import { InventoryRoutingModule } from './inventory-routing.module';
import { ProductComponent } from './product/product.component';
import { CommonButtonComponent } from "./settings/common/common-button/common-button.component";
import { ProductcategoryComponent } from "./settings/productcategory/productcategory.component";
import { ProductsubcategoryComponent } from "./settings/productsubcategory/productsubcategory.component";
import { ProductbrandComponent } from "./settings/productbrand/productbrand.component";
import { ProductmodelComponent } from "./settings/productmodel/productmodel.component";
import { ProductuomComponent } from "./settings/productuom/productuom.component";
import { ProductdiscounttypeComponent } from './settings/productdiscounttype/productdiscounttype.component';
import { ProducttypeComponent } from './settings/producttype/producttype.component';
import { ProductcolorComponent } from './settings/productcolor/productcolor.component';
import { ProductsizeComponent } from './settings/productsize/productsize.component';
import { SuppliertermsconditionsComponent } from './settings/suppliertermsconditions/suppliertermsconditions.component';
import { StockinComponent } from './stock/stockin/stockin.component';
import { StockoutComponent } from './stock/stockout/stockout.component';
import { StockinwithoutpoComponent } from './stock/stockinwithoutpo/stockinwithoutpo.component';
import { TestComponent } from "./inventory settings/test/test.component";
import { StoreComponent } from "./inventory settings/store/store.component";
import { ProductpricingComponent } from "./product/productpricing/productpricing.component";
import { CurrentstockComponent } from './reports/currentstock/currentstock.component';
import { ReportButtonComponent } from "./settings/common/report-button/report-button.component";
import { RptFooterComponent } from "./settings/common/rpt-footer/rpt-footer.component";
import { RptHeaderComponent } from "./settings/common/rpt-header/rpt-header.component";
import { RptHeaderLandscapeComponent } from "./settings/common/rpt-header-landscape/rpt-header-landscape.component";
import { StockTransferComponent } from './reports/stocktransfer/stocktransfer/stocktransfer.component';
import { StockinreportComponent } from './reports/stockinreport/stockinreport.component';
import { StockoutreportComponent } from './reports/stockoutreport/stockoutreport.component';
import { StocktransferwithTrnNoComponent } from './reports/stocktransfer/stocktransferwith-trn-no/stocktransferwith-trn-no.component';
import { StocktransferreceiveComponent } from './reports/stocktransfer/stocktransferreceive/stocktransferreceive.component';
import { StockinwithbarcodeComponent } from './stock/stockinwithbarcode/stockinwithbarcode.component';
import { NgxBarcodeModule } from "ngx-barcode";
import { StockoutbybarcodeComponent } from './stock/stockoutbybarcode/stockoutbybarcode.component';
import { ProductsetComponent } from './productset/productset.component';
import { DamageGoodsComponent } from './stock/damage-goods/damage-goods.component';
import { ProductwisecolorComponent } from './productwisecolor/productwisecolor.component';
import { StockInDetailsSearchReportComponent } from './reports/stock-in-details-search-report/stock-in-details-search-report.component';
import { NewproductpricingComponent } from "./product/newproductpricing/newproductpricing.component";
import { ProducttransferComponent } from "./producttransfer/producttransfer.component";
import { StockreceiveComponent } from "./stockreceive/stockreceive.component";
import { DepottodepottransferComponent } from "./depottodepottransfer/depottodepottransfer.component";
import { DepottodepotreceiveComponent } from "./depottodepotreceive/depottodepotreceive.component";
import { DepottofactorytransferComponent } from "./depottofactorytransfer/depottofactorytransfer.component";
import { DepottofactoryreceiveComponent } from "./depottofactoryreceive/depottofactoryreceive.component";
import { ProducttransferV2Component } from './producttransfer-v2/producttransfer-v2.component';
//import { PromoRequisitionFileUploadComponent } from "./promo-requisition-file-upload/PromoRequisitionFileUploadComponent";
import { PromoRequisitionComponent } from './promo-requisition/promo-requisition.component';
import { PacketDistributionComponent } from './packet-distribution/packet-distribution.component';
import { DepotPromoReceivedComponent } from './depot-promo-received/depot-promo-received.component';
import { DepotPromoDistributionComponent } from './depot-promo-distribution/depot-promo-distribution.component';
import { PromoPacketingComponent } from './promo-packeting/promo-packeting.component';
import { TerritoryWisePromoReportComponent } from './reports/Promo/territory-wise-promo-report/territory-wise-promo-report.component';
import { FactoryFGStockComponent } from "./stock/factory-fgstock/factory-fgstock.component";
import { InventoryComponent } from "./inventory.component";
import { StockInfromProductionComponent } from './stock/stock-infrom-production/stock-infrom-production.component';
import { FactoryFCQCComponent } from './stock/factory-fcqc/factory-fcqc.component';
import { StockInPromoSampleComponent } from './stock/stock-in-promo-sample/stock-in-promo-sample.component';
import { PromoProductUploadComponent } from './product/promo-product-upload/promo-product-upload.component';
import { PromoRequisitionFileUploadComponent } from "./promo-requisition-file-upload/promo-requisition-file-upload.component";
import { PromoDisburseSummaryReportComponent } from './reports/Promo/promo-disburse-summary-report/promo-disburse-summary-report.component';
import { PromoDisburseDetailsReportComponent } from './reports/Promo/promo-disburse-details-report/promo-disburse-details-report.component';
import { PromoInvStockReportComponent } from './reports/promo-inv-stock-report/promo-inv-stock-report.component';
import { RmPmDirectStockInComponent } from './stock/rm-pm-direct-stock-in/rm-pm-direct-stock-in.component';
import { CreateMaterialComponent } from './product/create-material/create-material.component';
import { PromoPacketProcessComponent } from './promo-packet-process/promo-packet-process.component';
import { PromoBulkPacketingComponent } from './promo-bulk-packeting/promo-bulk-packeting.component';
import { MiscellaneousReqComponent } from './miscellaneous-req/miscellaneous-req.component';
import { MiscellaneousIssueComponent } from './miscellaneous-issue/miscellaneous-issue.component';
import { ProducttransferV2WithoutBatchComponent } from './producttransfer-v2-without-batch/producttransfer-v2-without-batch.component';
import { PromoDisburseDetailsRegionWiseReportComponent } from './reports/Promo/promo-disburse-details-region-wise-report/promo-disburse-details-region-wise-report.component';
import { EmployeeWisePromoDisburseSummaryComponent } from './reports/Promo/employee-wise-promo-disburse-summary/employee-wise-promo-disburse-summary.component';
import { StationariesProductTransferComponent } from './stationaries-product-transfer/stationaries-product-transfer.component';
import { StationariesProductReceiveComponent } from './stationaries-product-receive/stationaries-product-receive.component';
import { StationariesProductConsumeComponent } from './stationaries-product-consume/stationaries-product-consume.component';
import { ProductspecinfoComponent } from './settings/productspecinfo/productspecinfo.component';
import { BatchWiseSerialNoUploadComponent } from './stock/batch-wise-serial-no-upload/batch-wise-serial-no-upload.component';
import { ProductEntryComponent } from './product/product-entry/product-entry.component';


const MODULES = [
  ThemeModule,
  CommonModule,
  FormsModule,
  NbInputModule,
  NbButtonModule,
  NbActionsModule,
  NbUserModule,
  NbCheckboxModule,
  NbDatepickerModule,
  NbSelectModule,
  NbOptionModule,
  NbIconModule,
  NbAutocompleteModule,
  NbRadioModule,
  NbTabsetModule,
  NgSelectModule,
  Ng2SmartTableModule,
  FormsModule,
  HttpClientModule,
  AgGridModule.withComponents([]),
  NbToastrModule,
  AuthRoutingModule,
  NbAlertModule,
  NbCardModule,
  InventoryRoutingModule,
  NgxBarcodeModule,
];

const COMPONENTS = [
  InventoryComponent,
  CommonButtonComponent,
  ReportButtonComponent,
  RptHeaderComponent,
  RptFooterComponent,
  RptHeaderLandscapeComponent,
  ProductComponent,
  ProductcategoryComponent,
  ProductsubcategoryComponent,
  ProductbrandComponent,
  ProductmodelComponent,
  ProductuomComponent,
  ProductdiscounttypeComponent,
  ProducttypeComponent,
  ProductcolorComponent,
  ProductsizeComponent,
  SuppliertermsconditionsComponent,
  StockinComponent,
  StockoutComponent,
  TestComponent,
  StoreComponent,
  ProductpricingComponent,
  StockinwithoutpoComponent,
  ProducttransferComponent,
  CurrentstockComponent,
  StockTransferComponent,
  StockinreportComponent,
  StockoutreportComponent,
  StocktransferwithTrnNoComponent,
  StockreceiveComponent,
  StocktransferreceiveComponent,
  StockinwithbarcodeComponent,
  StockoutbybarcodeComponent,
  ProductsetComponent,
  DamageGoodsComponent,
  ProductwisecolorComponent,
  StockInDetailsSearchReportComponent,
  NewproductpricingComponent,
  DepottodepottransferComponent,
  DepottodepotreceiveComponent,
  DepottofactorytransferComponent,
  DepottofactoryreceiveComponent,
  PromoRequisitionFileUploadComponent,
  PromoRequisitionComponent,
  PacketDistributionComponent,
  DepotPromoReceivedComponent,
  DepotPromoDistributionComponent,
  ProducttransferV2Component,
  FactoryFGStockComponent,
  PromoPacketingComponent,
  TerritoryWisePromoReportComponent,
  StockInfromProductionComponent,
  FactoryFCQCComponent,
  StockInPromoSampleComponent,
  PromoDisburseSummaryReportComponent,
  CreateMaterialComponent
];
const SERVICES = [];

@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS, PromoProductUploadComponent, PromoDisburseDetailsReportComponent, PromoInvStockReportComponent, RmPmDirectStockInComponent, PromoPacketProcessComponent, PromoBulkPacketingComponent, MiscellaneousReqComponent, MiscellaneousIssueComponent, ProducttransferV2WithoutBatchComponent, PromoDisburseDetailsRegionWiseReportComponent, EmployeeWisePromoDisburseSummaryComponent, StationariesProductTransferComponent, StationariesProductReceiveComponent, StationariesProductConsumeComponent, ProductspecinfoComponent, BatchWiseSerialNoUploadComponent, ProductEntryComponent],
  providers: [...SERVICES],
})

export class InventoryModule { }

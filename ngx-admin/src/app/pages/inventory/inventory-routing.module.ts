import { NgModule } from '@angular/core';
import { InventoryComponent } from "./inventory.component";
import { Routes, RouterModule } from '@angular/router';
import { DepottodepotreceiveComponent } from './depottodepotreceive/depottodepotreceive.component';
import { DepottodepottransferComponent } from './depottodepottransfer/depottodepottransfer.component';
import { DepottofactoryreceiveComponent } from './depottofactoryreceive/depottofactoryreceive.component';
import { DepottofactorytransferComponent } from './depottofactorytransfer/depottofactorytransfer.component';
import { StoreComponent } from './inventory settings/store/store.component';
import { TestComponent } from './inventory settings/test/test.component';
import { NewproductpricingComponent } from './product/newproductpricing/newproductpricing.component';
import { ProductComponent } from './product/product.component';
import { ProductpricingComponent } from './product/productpricing/productpricing.component';
import { ProductsetComponent } from './productset/productset.component';
import { ProducttransferComponent } from './producttransfer/producttransfer.component';
import { ProductwisecolorComponent } from './productwisecolor/productwisecolor.component';
import { CurrentstockComponent } from './reports/currentstock/currentstock.component';
import { StockInDetailsSearchReportComponent } from './reports/stock-in-details-search-report/stock-in-details-search-report.component';
import { StockinreportComponent } from './reports/stockinreport/stockinreport.component';
import { StockoutreportComponent } from './reports/stockoutreport/stockoutreport.component';
import { StockTransferComponent } from './reports/stocktransfer/stocktransfer/stocktransfer.component';
import { StocktransferreceiveComponent } from './reports/stocktransfer/stocktransferreceive/stocktransferreceive.component';
import { StocktransferwithTrnNoComponent } from './reports/stocktransfer/stocktransferwith-trn-no/stocktransferwith-trn-no.component';
import { ProductbrandComponent } from './settings/productbrand/productbrand.component';
import { ProductcategoryComponent } from './settings/productcategory/productcategory.component';
import { ProductcolorComponent } from './settings/productcolor/productcolor.component';
import { ProductdiscounttypeComponent } from './settings/productdiscounttype/productdiscounttype.component';
import { ProductmodelComponent } from './settings/productmodel/productmodel.component';
import { ProductsizeComponent } from './settings/productsize/productsize.component';
import { ProductsubcategoryComponent } from './settings/productsubcategory/productsubcategory.component';
import { ProducttypeComponent } from './settings/producttype/producttype.component';
import { ProductuomComponent } from './settings/productuom/productuom.component';
import { SuppliertermsconditionsComponent } from './settings/suppliertermsconditions/suppliertermsconditions.component';
import { DamageGoodsComponent } from './stock/damage-goods/damage-goods.component';
import { StockinComponent } from './stock/stockin/stockin.component';
import { StockinwithbarcodeComponent } from './stock/stockinwithbarcode/stockinwithbarcode.component';
import { StockinwithoutpoComponent } from './stock/stockinwithoutpo/stockinwithoutpo.component';
import { StockoutComponent } from './stock/stockout/stockout.component';
import { StockoutbybarcodeComponent } from './stock/stockoutbybarcode/stockoutbybarcode.component';
import { StockreceiveComponent } from './stockreceive/stockreceive.component';
import { ProducttransferV2Component } from './producttransfer-v2/producttransfer-v2.component';
//import { PromoRequisitionFileUploadComponent } from "./promo-requisition-file-upload/PromoRequisitionFileUploadComponent";
import { PromoRequisitionComponent } from './promo-requisition/promo-requisition.component';
import { PacketDistributionComponent } from './packet-distribution/packet-distribution.component';
import { DepotPromoReceivedComponent } from './depot-promo-received/depot-promo-received.component';
import { DepotPromoDistributionComponent } from './depot-promo-distribution/depot-promo-distribution.component';
import { PromoPacketingComponent } from './promo-packeting/promo-packeting.component';
import { TerritoryWisePromoReportComponent } from './reports/Promo/territory-wise-promo-report/territory-wise-promo-report.component';
import { FactoryFGStockComponent } from './stock/factory-fgstock/factory-fgstock.component';
import { StockInfromProductionComponent } from './stock/stock-infrom-production/stock-infrom-production.component';
import { FactoryFCQCComponent } from './stock/factory-fcqc/factory-fcqc.component';
import { StockInPromoSampleComponent } from './stock/stock-in-promo-sample/stock-in-promo-sample.component';
import { PromoProductUploadComponent } from './product/promo-product-upload/promo-product-upload.component';
import { PromoRequisitionFileUploadComponent } from './promo-requisition-file-upload/promo-requisition-file-upload.component';
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

const routes: Routes = [{
  path: '',
  component: InventoryComponent,
  children: [
    {
      path: 'product',
      component: ProductComponent,
    },
    {
      path: 'product-entry',
      component: ProductEntryComponent,
    },
    {
      path: 'productcategory',
      component: ProductcategoryComponent,
    },
    {
      path: 'productsubcategory',
      component: ProductsubcategoryComponent,
    },
    {
      path: 'productbrand',
      component: ProductbrandComponent,
    },
    {
      path: 'productuom',
      component: ProductuomComponent,
    },
    {
      path: 'productmodel',
      component: ProductmodelComponent,
    },
    {
      path: 'productdiscounttype',
      component: ProductdiscounttypeComponent,
    },
    {
      path: 'producttype',
      component: ProducttypeComponent,
    },
    {
      path: 'productcolor',
      component: ProductcolorComponent,
    },
    {
      path: 'productsize',
      component: ProductsizeComponent,
    },
    {
      path: 'suppliertermsconditions',
      component: SuppliertermsconditionsComponent,
    },
    {
      path: 'stockin',
      component: StockinComponent,
    },
    {
      path: 'stockinwithoutpo',
      component: StockinwithoutpoComponent,
    },
    {
      path: 'stockout',
      component: StockoutComponent,
    },
    {
      path: 'store',
      component: StoreComponent,
    },
    {
      path: 'productpricingwithbarcode',
      component: ProductpricingComponent,
    },
    {
      path: 'productpricing',
      component: NewproductpricingComponent,
    },
    {
      path: 'producttransfer',
      component: ProducttransferComponent,
    },
    {
      path: 'currentstock',
      component: CurrentstockComponent,
    },
    {
      path: 'stocktransfer',
      component: StockTransferComponent,
    },
    {
      path: 'stockinreport',
      component: StockinreportComponent,
    },
    {
      path: 'stockoutreport',
      component: StockoutreportComponent,
    },
    {
      path: 'stocktransferwith-trn-no',
      component: StocktransferwithTrnNoComponent,
    },
    {
      path: 'stockreceive',
      component: StockreceiveComponent,
    },
    {
      path: 'stocktransferreceive',
      component: StocktransferreceiveComponent,
    },
    {
      path: 'Stockinwithbarcode',
      component: StockinwithbarcodeComponent,
    },
    {
      path: 'Stockoutbybarcode',
      component: StockoutbybarcodeComponent,
    },
    {
      path: 'Productset',
      component: ProductsetComponent,
    },
    {
      path: 'damage-goods',
      component: DamageGoodsComponent,
    },
    {
      path: 'productwisecolor',
      component: ProductwisecolorComponent,
    },
    {
      path: 'depottodepottransfer',
      component: DepottodepottransferComponent,
    },
    {
      path: 'stock-in-details-search-report',
      component: StockInDetailsSearchReportComponent,
    },
    {
      path: 'depottodepotreceive',
      component: DepottodepotreceiveComponent,
    },
    {
      path: 'product-transfer-v2', component: ProducttransferV2Component,
    },
    {
      path: 'product-transfer-v2-without-batch', component: ProducttransferV2WithoutBatchComponent,
    },
    {
      path: 'stock-in-promo-sample', component: StockInPromoSampleComponent,
    },
    {
      path: 'depottofactorytransfer',
      component: DepottofactorytransferComponent,
    },
    {
      path: 'depottofactoryreceive',
      component: DepottofactoryreceiveComponent,
    },
    {
      path: 'promo-requisition-file-upload',
      component: PromoRequisitionFileUploadComponent,
    },
    {
      path: 'promo-requisition',
      component: PromoRequisitionComponent,
    },
    {
      path: 'packet-distribution',
      component: PacketDistributionComponent,
    },
    {
      path: 'depot-promo-received',
      component: DepotPromoReceivedComponent,
    },
    {
      path: 'depot-promo-distribution',
      component: DepotPromoDistributionComponent,
    },
    {
      path: 'promo-packeting',
      component: PromoPacketingComponent,
    },
    {
      path: 'territoryWise-promo-report',
      component: TerritoryWisePromoReportComponent
    },
    {
      path: 'factory-fg-stock',
      component: FactoryFGStockComponent,
    },
    {
      path: 'stock-in-production',
      component: StockInfromProductionComponent,
    },
    {
      path: 'production-qc',
      component: FactoryFCQCComponent,
    },
    {
      path: 'promo-product-upload',
      component: PromoProductUploadComponent
    },
    {
      path: 'promo-disburse-summary-report',
      component: PromoDisburseSummaryReportComponent
    },
    { path: 'promo-disburse-details-report', component: PromoDisburseDetailsReportComponent },
    { path: 'promo-inv-stock-report', component: PromoInvStockReportComponent },
    { path: 'rm-pm-direct-stock-in', component: RmPmDirectStockInComponent },
    { path: 'create-material', component: CreateMaterialComponent },
    { path: 'promo-packet-process', component: PromoPacketProcessComponent },
    { path: 'promo-bulk-packeting', component: PromoBulkPacketingComponent },
    { path: 'miscellaneous-req', component: MiscellaneousReqComponent },
    { path: 'miscellaneous-issue', component: MiscellaneousIssueComponent },
    { path: "promo-disburse-details-region-wise-report", component: PromoDisburseDetailsRegionWiseReportComponent },
    { path: "employee-wise-promo-disburse-summary", component: EmployeeWisePromoDisburseSummaryComponent },
    { path: "stationaries-product-transfer", component: StationariesProductTransferComponent },
    { path: "stationaries-product-receive", component: StationariesProductReceiveComponent },
    { path: "stationaries-product-consume", component: StationariesProductConsumeComponent },
    { path: "productspecinfo", component: ProductspecinfoComponent },
    { path: "batch-wise-serial-no-upload", component: BatchWiseSerialNoUploadComponent },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }

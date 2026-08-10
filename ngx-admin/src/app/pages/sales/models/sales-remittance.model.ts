import { SalesRemittanceSlip } from "./sales-remittance-slip.model";

export class SalesRemittance {
  constructor() {
    this.remittanceId = 0;
    this.remittanceDate = new Date();
    this.remittanceNo = 0;
    this.remittanceTypeId = null;
    this.oplTranNo = '';
    this.depotCode = null;
    this.depositDate = new Date();
    this.bankId = null;
    this.bankBranchId = null;
    this.depositRefNo = '';
    this.depositAmount = 0.00;
    this.selectedAmount = 0.00;
    this.remarks = '';
    this.salesRemittanceSlips = [];
    this.remittanceDetails = [];
    // this.remitanceCollections = [];
  }
  remittanceId: number;
  remittanceDate: Date;
  remittanceNo: number;
  remittanceTypeId: number;
  oplTranNo: string;
  depotCode: string;
  depositDate: Date;
  bankId: number;
  bankBranchId: number;
  depositRefNo: string;
  depositAmount: number;
  selectedAmount: number;
  remarks: string;
  salesRemittanceSlips: Array<SalesRemittanceSlip>;
  remittanceDetails: Array<SalesRemittanceDetail>;
  //remitanceCollections: Array<RemittanceCollection>;
}
export class SalesRemittanceDetail {
  constructor() {
    this.remittanceId = 0;
    this.remittanceDate = new Date();
    this.remittanceNo = 0;
    this.remittanceTypeId = null;
    this.oplTranNo = '';
    this.depotCode = null;
    this.depositDate = new Date();
    this.bankId = null;
    this.bankBranchId = null;
    this.depositRefNo = '';
    this.depositAmount = 0.00;
    //this.selectedAmount = 0.00;
    this.remarks = '';
  }
  remittanceId: number;
  remittanceDate: Date;
  remittanceNo: number;
  remittanceTypeId: number;
  oplTranNo: string;
  depotCode: string;
  depositDate: Date;
  bankId: number;
  bankBranchId: number;
  depositRefNo: string;
  depositAmount: number;
  // selectedAmount: number;
  remarks: string;
  // salesRemittanceSlips: Array<SalesRemittanceSlip>;
}
export class RemittanceCollection {
  constructor() {
    this.remittanceId = 0;
    this.collectionMasterId = 0
  }
  remittanceId: number;
  collectionMasterId: number;
}

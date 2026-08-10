export class SalesRemittanceSlip {
  constructor() {
    this.remittanceSlipId = 0;
    this.remittanceId = 0;
    this.fileString = '';
    this.resourceUrl = '';
    this.ext = '';
    this.fileName = 'Choose File...';
  }
  remittanceSlipId: number;
  remittanceId: number;
  fileString: string;
  resourceUrl: string;
  fileName: string;
  ext: string;
}

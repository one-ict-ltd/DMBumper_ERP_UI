import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";

@Injectable({
  providedIn: "root",
})

export class CommoncomboService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getVoucherType() {
    return this.http.get<any>(
      `${this.apiUrl}VoucherType/getVoucherType?voucherTypeId=0`,
      this.httpOptions
    );
  }
  public getCurrency() {
    return this.http.get<any>(
      `${this.apiUrl}Currency/GetCurrency`,
      this.httpOptions
    );
  }
  public getGroupNature() {
    return this.http.get<any>(
      `${this.apiUrl}GroupNature/getgroupNature?groupNatureId=0`,
      this.httpOptions
    );
  }
  public getAccountGroupByNature(groupNatureId: any) {
    return this.http.get<any>(
      `${this.apiUrl}AccountGroup/getaccountGroup?accountGroupId=0&groupNatureId=${groupNatureId}`,
      this.httpOptions
    );
  }
  public GetParentChildAccountGroup(groupNatureId) {
    return this.http.get<any>(
      `${this.apiUrl}AccountGroup/GetParentChildAccountGroup?groupNatureId=${groupNatureId}`,
      this.httpOptions
    );
  }

  public GetAllPartysByTypeId(
    partyTypeId: any,
    sbuId: any = 0
  ) {
    return this.http.get<string>(
      `${this.apiUrl}SalesInvoice/GetAllPartysByTypeId?partyTypeId=${partyTypeId}&sbuId=${sbuId}`,
      this.httpOptions
    );
  }

  public GetAllMIOByTerritory(
    territoryCode: any
  ) {
    return this.http.get<string>(
      `${this.apiUrl}SalesInvoice/GetAllMIOByTerritory?territoryCode=${territoryCode}`,
      this.httpOptions
    );
  }

  public GetAccountGroupSubGroup(groupNatureId: number = 0, accountGroupId: number = 0) {
    return this.http.get<any>(
      `${this.apiUrl}AccountGroup/GetAccountGroupSubGroup?groupNatureId=${groupNatureId}&accountGroupId=${accountGroupId}`,
      this.httpOptions
    );
  }

  public GetSubGroupByAccountGroupIds(groupNatureId: number = 0, accountGroupIds: number = 0) {
    return this.http.get<any>(
      `${this.apiUrl}AccountGroup/GetSubGroupByAccountGroupIds?groupNatureId=${groupNatureId}&accountGroupIds=${accountGroupIds}`,
      this.httpOptions
    );
  }

  public AccSpGetAccountLedgerAccessByUser(groupNatureId: number = 0, accountGroupId: number = 0, employeeId: number = 0) {
    return this.http.get<any>(
      `${this.apiUrl}AccountGroup/AccSpGetAccountLedgerAccessByUser?groupNatureId=${groupNatureId}&accountGroupId=${accountGroupId}&employeeId=${employeeId}`,
      this.httpOptions
    );
  }

  public AccSpGetAccountUserWiseLedger(employeeId: number = 0) {
    return this.http.get<any>(
      `${this.apiUrl}AccountGroup/AccSpGetAccountUserWiseLedger?employeeId=${employeeId}`,
      this.httpOptions
    );
  }

  public getLedgertype() {
    return this.http.get<any>(
      `${this.apiUrl}LedgerType/getledgerType?ledgerTypeId=0`,
      this.httpOptions
    );
  }
  public getLedgers() {
    return this.http.get<any>(
      `${this.apiUrl}Ledgers/getledger?ledgerId=0&accountGroupId=0&groupNatureId=0&companyId=0&sbuId=0&ledgerTypeId=0`,
      this.httpOptions
    );
  }
  public getLedgersbyGroupId(groupId) {
    return this.http.get<any>(
      `${this.apiUrl}Ledgers/getledger?ledgerId=0&accountGroupId=${groupId}&groupNatureId=0&companyId=0&sbuId=0&ledgerTypeId=0`,
      this.httpOptions
    );
  }
  // public getLedgersForVoucher(companyId, sbuId) {
  //   return this.http.get<any>(
  //     `${this.apiUrl}Ledgers/getledger?ledgerId=0&accountGroupId=0&groupNatureId=0&companyId=${companyId}&sbuId=${sbuId}&ledgerTypeId=0`,
  //     this.httpOptions
  //   );
  // }
  public getLedgersForVoucher(companyId, sbuId) {
    return this.http.get<any>(
      `${this.apiUrl}Ledgers/GetLedgersForVoucherCreate?companyId=${companyId}&sbuId=${sbuId}`,
      this.httpOptions
    );
  }
  public getLedgersForNoteDetails(companyId, sbuId, groupNatureId, accountGroupId, ledgerTypeId) {
    return this.http.get<any>(
      `${this.apiUrl}Ledgers/getledger?ledgerId=0&accountGroupId=${accountGroupId}&groupNatureId=${groupNatureId}&companyId=${companyId}&sbuId=${sbuId}&ledgerTypeId=${ledgerTypeId}`,
      this.httpOptions
    );
  }
  public getParty() {
    return this.http.get<any>(
      `${this.apiUrl}Party/getparty?partyId=0`,
      this.httpOptions
    );
  }

  public GetPartyForAccountingByIdJson() {
    return this.http.get<any>(
      `${this.apiUrl}Party/GetPartyForAccountingByIdJson?partyId=0`,
      this.httpOptions
    );
  }

  public GetPartyForDropdownJson() {
    return this.http.get<any>(
      `${this.apiUrl}Party/GetPartyForDropdownJson?partyId=0`,
      this.httpOptions
    );
  }
  public GetSupplierForDropdown() {
    return this.http.get<any>(
      `${this.apiUrl}Party/GetSupplierForDropdown?partyId=0`,
      this.httpOptions
    );
  }

  public GetTypeWisePartyInfo(
    partyId: any = 0,
    partyTypeId: any
  ) {
    return this.http.get<string>(
      `${this.apiUrl}Party/GetTypeWisePartyInfo?partyTypeId=${partyTypeId}&partyId=${partyId}`,
      this.httpOptions
    );
  }
  public getVisaParty() {
    return this.http.get<any>(
      `${this.apiUrl}Party/getVisaParty?visaPartyId=0`,
      this.httpOptions
    );
  }
  public getTransactionMode() {
    return this.http.get<any>(
      `${this.apiUrl}TransactionMode/getTransactionMode?transactionModeId=0`,
      this.httpOptions
    );
  }
  public getCompany() {
    return this.http.get<any>(
      `${this.apiUrl}Company/getCompnay?companyId=0`,
      this.httpOptions
    );
  }

  public getProbationPeriod() {
    return this.http.get<any>(
      `${this.apiUrl}Company/getProbationPeriod`,
      this.httpOptions
    );
  }
  public getSeparationType() {
    return this.http.get<any>(
      `${this.apiUrl}Company/getSeparationType`,
      this.httpOptions
    );
  }
  public getCompanybyId() {
    return this.http.get<any>(
      `${this.apiUrl}Company/getCompnay?companyId=1`,
      this.httpOptions
    );
  }

  public GetSalaryLocationJson() {
    return this.http.get<any>(
      `${this.apiUrl}Sbu/GetSalaryLocationJson`,
      this.httpOptions
    );
  }

  public getSBU(companyId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Sbu/getSbu?sbuId=0&companyId=${companyId}`,
      this.httpOptions
    );
  }
  public getSpecialBranchUnitBySpecificSbuIdJson(companyId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Sbu/getSpecialBranchUnitBySpecificSbuIdJson?sbuId=0&companyId=${companyId}`,
      this.httpOptions
    );
  }

  // getSBUForRequisition
  public getSBUForPurchaseRequisition(companyId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Sbu/getSBUForPurchaseRequisition?sbuId=0&companyId=${companyId}`,
      this.httpOptions
    );
  }
  public getSbuForAccounting(companyId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Sbu/getSbuForAccounting?sbuId=0&companyId=${companyId}`,
      this.httpOptions
    );
  }

  public getSBUALL(companyId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Sbu/getSbuAll?sbuId=0&companyId=${companyId}`,
      this.httpOptions
    );
  }

  public getSbuWhithoutSelf(companyId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Sbu/getSbuWhithoutSelf?sbuId=0&companyId=${companyId}`,
      this.httpOptions
    );
  }

  public getpurchaseOrderFrom(companyId: any) {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeInformation/getEmployee?companyId=${companyId}&sbuId=0`,
      this.httpOptions
    );
  }

  public getPartyType() {
    return this.http.get<any>(
      `${this.apiUrl}Party/getpartyType`,
      this.httpOptions
    );
  }
  public getFundSource() {
    return this.http.get<any>(
      `${this.apiUrl}FundSource/getfundSource?fundSourceId=0&companyId=0&sbuId=0`,
      this.httpOptions
    );
  }
  public getCostCentre(sbuId: any) {
    return this.http.get<any>(
      `${this.apiUrl}CostCentre/getcostCentreBranchMapping?costCentreMappingId=0&costCentreId=0&companyId=0&sbuId=${sbuId}`,
      this.httpOptions
    );
  }
  public getCostCentreMaster() {
    return this.http.get<any>(
      `${this.apiUrl}CostCentre/getcostCentre?costCentreId=0`,
      this.httpOptions
    );
  }
  public getModule() {
    return this.http.get<any>(
      `${this.apiUrl}Menu/getModule?moduleId=0`,
      this.httpOptions
    );
  }
  public getMenuType() {
    return this.http.get<any>(
      `${this.apiUrl}Menu/getMenuTypes?menuTypeId=0`,
      this.httpOptions
    );
  }

  public getParentMenu(moduleId) {
    return this.http.get<any>(
      `${this.apiUrl}Menu/getMenus?id=0&moduleId=${moduleId}&isparent=1`,
      this.httpOptions
    );
  }

  public getDefaultMenu(moduleId) {
    return this.http.get<any>(
      `${this.apiUrl}Menu/getMenus?id=0&moduleId=${moduleId}&isparent=0`,
      this.httpOptions
    );
  }

  public getNoteMaster(companyId, sbuId, noteMasterId, noteType) {
    return this.http.get<any>(
      `${this.apiUrl}NoteMaster/getNoteMaster?companyId=${companyId}&sbuId=${sbuId}&noteMasterId=${noteMasterId}&noteType=${noteType}`,
      this.httpOptions
    );
  }
  public getCmnDropDown(dropdownId, type) {
    return this.http.get<any>(
      `${this.apiUrl}CmnDropDown/getCmnDropDown?dropDownId=${dropdownId}&type=${type}`,
      this.httpOptions
    );
  }

  public getBudgetMainHead(companyId, sbuId, budgetMainHeadId) {
    return this.http.get<any>(
      `${this.apiUrl}Budget/getBudgetMainHead?companyId=${companyId}&sbuId=${sbuId}&budgetMainHeadId=${budgetMainHeadId}`,
      this.httpOptions
    );
  }

  public getBudgetSubHead(budgetMainHeadId, budgetSubHeadId) {
    return this.http.get<any>(
      `${this.apiUrl}Budget/getBudgetSubHead?budgetMainHeadId=${budgetMainHeadId}&budgetSubHeadId=${budgetSubHeadId}`,
      this.httpOptions
    );
  }

  public getBudgetHead(companyId, sbuId, budgetMainHeadId, budgetSubHeadId, budgetHeadMasterId) {
    return this.http.get<any>(
      `${this.apiUrl}Budget/getBudgetHeadMaster?companyId=${companyId}&sbuId=${sbuId}&budgetMainHeadId=${budgetMainHeadId}&budgetSubHeadId=${budgetSubHeadId}&budgetHeadMasterId=${budgetHeadMasterId}`,
      this.httpOptions
    );
  }

  public getFiscalYear(companyId, sbuId, fiscalYearId) {
    return this.http.get<any>(
      `${this.apiUrl}Budget/getFiscalYear?companyId=${companyId}&sbuId=${sbuId}&fiscalYearId=${fiscalYearId}`,
      this.httpOptions
    );
  }

  public getEmployee(companyId, employeeId) {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeInformation/getEmployee?companyId=${companyId}&employeeId=${employeeId}`,
      this.httpOptions
    );
  }
  public GetPayrollEmployeeById(companyId, employeeId) {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeInformation/GetPayrollEmployeeById?companyId=${companyId}&employeeId=${employeeId}`,
      this.httpOptions
    );
  }

  public GetEmployeeInfoLoadByIdAndCompany(companyId, employeeId) {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeInformation/GetEmployeeInfoLoadByIdAndCompany?companyId=${companyId}&employeeId=${employeeId}`,
      this.httpOptions
    );
  }

  public getAutoVoucherName() {
    return this.http.get<any>(
      `${this.apiUrl}VoucherType/getAutoVoucherName?autoVoucherNameId=0`,
      this.httpOptions
    );
  }

  public getVisaWorkOrder() {
    return this.http.get<any>(
      `${this.apiUrl}Dahmashi/getVisaWorkOrder?visaWorkOrderId=0&isProcessed=ALL`,
      this.httpOptions
    );
  }

  public getVisaCompany() {
    return this.http.get<any>(
      `${this.apiUrl}Dahmashi/getVisaCompany?visaCompanyId=0`,
      this.httpOptions
    );
  }

  public getVisaTrade() {
    return this.http.get<any>(
      `${this.apiUrl}Dahmashi/getVisaTrade?visaTradeId=0`,
      this.httpOptions
    );
  }

  public getVisaAgency() {
    return this.http.get<any>(
      `${this.apiUrl}Dahmashi/getVisaAgency`,
      this.httpOptions
    );
  }

  public getReportType() {
    return this.http.get<any>(
      `${this.apiUrl}Menu/getReportType?reportTypeId=0`,
      this.httpOptions
    );
  }

  public getReportByUserPermission(reportType) {
    return this.http.get<any>(
      `${this.apiUrl}Menu/getReportByUserPermission?reportType=${reportType}`,
      this.httpOptions
    );
  }

  public getDdlRptReportType() {
    return this.http.get<any>(
      `${this.apiUrl}Menu/getDdlRptReportType`,
      this.httpOptions
    );
  }

  public getPartyByPartyType(partyId, partyTypeId) {
    return this.http.get<any>(
      `${this.apiUrl}Party/getPartyByPartyType?partyId=${partyId}&partyTypeId=${partyTypeId}`,
      this.httpOptions
    );
  }

  public GetCompanyCategory() {
    return this.http.get<any>(
      `${this.apiUrl}Company/GetCompanyCategory`,
      this.httpOptions
    );
  }

  public getGender() {
    return this.http.get<any>(
      `${this.apiUrl}Gender/getGender?genderId=0`,
      this.httpOptions
    );
  }

  public getAddressType() {
    return this.http.get<any>(
      `${this.apiUrl}Division/GetAddressType`,
      this.httpOptions
    );
  }

  public getDivision() {
    return this.http.get<any>(
      `${this.apiUrl}Division/getDivision`,
      this.httpOptions
    );
  }

  public getDistrict(divisionId) {
    return this.http.get<any>(
      `${this.apiUrl}District/getDistrict?divisionId=${divisionId}`,
      this.httpOptions
    );
  }

  public getThana(districtsId) {
    return this.http.get<any>(
      `${this.apiUrl}Thana/getThanas?districtsId=${districtsId}`,
      this.httpOptions
    );
  }

  public getBank(bankId, bankTypeId) {
    return this.http.get<any>(
      `${this.apiUrl}CmnDropDown/GetCmnBank?bankId=${bankId}&bankTypeId=${bankTypeId}`,
      this.httpOptions
    );
  }
  public getBranchByBankId(bankId: number) {
    return this.http.get<any>(
      `${this.apiUrl}CmnDropDown/GetCmnBankBranch?bankId=${bankId}`,
      this.httpOptions
    );
  }
  public getOriginCountries(countryId: any) {
    return this.http.get<any>(
      `${this.apiUrl}CmnDropDown/GetCmnOriginCountries?countryId=${countryId}`,
      this.httpOptions
    );
  }
  public GetNoteParentByType(noteType) {
    return this.http.get<any>(
      `${this.apiUrl}NoteMaster/GetNoteParentByType?noteType=${noteType}`,
      this.httpOptions
    );
  }

  public GetTransactionType(noteType) {
    return this.http.get<any>(
      `${this.apiUrl}NoteMaster/GetNoteParentByType?noteType=${noteType}`,
      this.httpOptions
    );
  }

  public GetDepotList() {
    return this.http.get<any>(
      `${this.apiUrl}CmnDropDown/GetCmnDepot`,
      this.commonService.getHttpOptions()
    );
  }
  public getNoteMasterNew(noteType: any) {
    return this.http.get<any>(
      `${this.apiUrl}NoteMaster/getNoteMasterNew?noteType=${noteType}`,
      this.httpOptions
    );
  }

}

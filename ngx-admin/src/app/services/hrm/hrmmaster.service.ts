import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";
import { NbDialogService, NbToastrService } from "@nebular/theme";

@Injectable({
  providedIn: "root",
})
export class HrmmasterService {
  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;
  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    private toastrService: NbToastrService
  ) { }

  //#region   activity type -------------------------------------------------------------------
  public getActivityType(activityTypeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}ActivityType/getActivityType?activityTypeId=${activityTypeId}`,
      this.httpOptions
    );
  }

  public deleteActivityType(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ActivityType/deleteActivityType`,
      master,
      this.httpOptions
    );
  }

  public saveActivityType(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ActivityType/setActivityType`,
      master,
      this.httpOptions
    );
  }

  public GetLoanCategory() {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeInformation/GetLoanCategory`,
      this.httpOptions
    );
  }

  public GetEmployeeWithLoan(loanCategoryId: any) {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeInformation/GetEmployeeWithLoan?loanCategoryId=${loanCategoryId}`,
      this.httpOptions
    );
  }
  public CancelLoan(loanId: any) {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeInformation/CancelLoan?loanId=${loanId}`,
      this.httpOptions
    );
  }

  public GetInterestType() {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeInformation/GetInterestType`,
      this.httpOptions
    );
  }

  //#region   Employee status  --------------------------------------------------

  public saveEmployeeStatus(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}EmployeeStatus/setEmployeeStatus`,
      master,
      this.httpOptions
    );
  }

  public getEmployeeStatus(employeeStatusId: any) {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeStatus/getEmployeeStatus?employeeStatusId=${employeeStatusId}`,
      this.httpOptions
    );
  }

  public deleteEmployeeStatus(employeeStatusId): Observable<string> {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeStatus/deleteEmployeeStatus?employeeStatusId=${employeeStatusId}`,
      this.httpOptions
    );
  }


  //#region department------------------
  public saveDepartment(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Department/setDepartment`,
      master,
      this.httpOptions
    );
  }

  public getDepartment(departmentId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Department/getDepartment?departmentId=${departmentId}`,
      this.httpOptions
    );
  }

  public deleteDepartment(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Department/deleteDepartment`,
      master,
      this.httpOptions
    );
  }

  //#region designation --------------
  public saveDesignation(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Designation/setDesignation`,
      master,
      this.httpOptions
    );
  }
  public getDesignationBySalarySlabId(salarySlabId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Designation/getDesignationBySalarySlabId?salarySlabId=${salarySlabId}`,
      this.httpOptions
    );
  }
  public getDesignationByEmployeeId(employeeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Designation/getEmployeeDesignationByEmployeeId?employeeId=${employeeId}`,
      this.httpOptions
    );
  }
  public getDesignation(designationId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Designation/getDesignation?designationId=${designationId}`,
      this.httpOptions
    );
  }

  public deleteDesignation(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Designation/deleteDesignation`,
      master,
      this.httpOptions
    );
  }
  public DeleteSlabDesignation(slabDesignationId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Designation/DeleteSlabDesignation`,
      slabDesignationId,
      this.httpOptions
    );
  }
  public GetSlabDesignationById(slabDesignationId: number) {
    return this.http.get<any>(
      `${this.apiUrl}Designation/GetSlabDesignationById?slabDesignationId=${slabDesignationId}`,
      this.httpOptions
    );
  }

  //#region Employee Type --------------
  public saveEmployeeType(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}EmployeeType/setEmployeeType`,
      master,
      this.httpOptions
    );
  }

  public getEmployeeType(employeeTypeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeType/getEmployeeType?employeeTypeId=${employeeTypeId}`,
      this.httpOptions
    );
  }

  public deleteEmployeeType(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}EmployeeType/deleteEmployeeType`,
      master,
      this.httpOptions
    );
  }

  //#region Employee Relation --------------
  public saveEmployeeRelation(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Relation/setEmployeeRelation`,
      master,
      this.httpOptions
    );
  }

  public getEmployeeRelation(relationId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Relation/getEmployeeRelation?relationId=${relationId}`,
      this.httpOptions
    );
  }

  public deleteEmployeeRelation(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Relation/deleteEmployeeRelation`,
      master,
      this.httpOptions
    );
  }

  //#region Employee Religion ----------
  public saveEmployeeReligion(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Religion/setEmployeeReligion`,
      master,
      this.httpOptions
    );
  }

  public getEmployeeReligion(religionId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Religion/getEmployeeReligion?religionId=${religionId}`,
      this.httpOptions
    );
  }

  public deleteEmployeeReligion(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Religion/deleteEmployeeReligion`,
      master,
      this.httpOptions
    );
  }

  //#region Division  -------
  public saveDivision(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Division/setDivision`,
      master,
      this.httpOptions
    );
  }

  public getDivision(divisionsId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Division/getDivision?divisionsId=${divisionsId}`,
      this.httpOptions
    );
  }

  public deleteDivision(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Division/deleteDivision`,
      master,
      this.httpOptions
    );
  }

  public GetCountry(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductOriginCountry?countryId=${0}`,
      this.httpOptions
    );
  }

  //#region   District ------------
  public GetDropDownDivision(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Division/getDivision?divisionsId=${0}`,
      this.httpOptions
    );
  }

  public saveDistrict(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}District/setDistrict`,
      master,
      this.httpOptions
    );
  }

  public getDistrict(divisionsId: any) {
    return this.http.get<any>(
      `${this.apiUrl}District/getDistrict?divisionsId=${divisionsId}`,
      this.httpOptions
    );
  }

  public deleteDistrict(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}District/deleteDistrict`,
      master,
      this.httpOptions
    );
  }

  //#region   Thanas ------------
  public GetDropDownDistrict(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}District/getDistrict?districtsId=${0}`,
      this.httpOptions
    );
  }

  public saveThanas(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Thana/setThanas`,
      master,
      this.httpOptions
    );
  }

  public getThanas(thanasId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Thana/getThanas?thanasId=${thanasId}`,
      this.httpOptions
    );
  }

  public deleteThanas(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Thana/deleteThanas`,
      master,
      this.httpOptions
    );
  }

  //#region   MunicipilityLocation ------------
  public saveMunicipilityLocation(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}MunicipilityLocation/setMunicipilityLocation`,
      master,
      this.httpOptions
    );
  }

  public getMunicipilityLocation(MunicipilityLocationId: any) {
    return this.http.get<any>(
      `${this.apiUrl}MunicipilityLocation/getMunicipilityLocation?MunicipilityLocationId=${MunicipilityLocationId}`,
      this.httpOptions
    );
  }

  public deleteMunicipilityLocation(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}MunicipilityLocation/deleteMunicipilityLocation`,
      master,
      this.httpOptions
    );
  }

  //#region   Gender ------------
  public saveGender(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Gender/setGender`,
      master,
      this.httpOptions
    );
  }

  public getGender(genderId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Gender/getGender?genderId=${genderId}`,
      this.httpOptions
    );
  }

  public deleteGender(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Gender/deleteGender`,
      master,
      this.httpOptions
    );
  }

  //#region Blood Group----------
  public saveBloodGroup(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}BloodGroup/setBloodGroup`,
      master,
      this.httpOptions
    );
  }

  public getBloodGroup(bloodGroupId: any) {
    return this.http.get<any>(
      `${this.apiUrl}BloodGroup/getBloodGroup?bloodGroupId=${bloodGroupId}`,
      this.httpOptions
    );
  }

  public deleteBloodGroup(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}BloodGroup/deleteBloodGroup`,
      master,
      this.httpOptions
    );
  }

  //#region Unique Identity
  public saveUniqueIdentity(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}UniqueIdentity/setUniqueIdentity`,
      master,
      this.httpOptions
    );
  }

  public getUniqueIdentity(bloodGroupId: any) {
    return this.http.get<any>(
      `${this.apiUrl}UniqueIdentity/getUniqueIdentity?uniqueIdentityId=${bloodGroupId}`,
      this.httpOptions
    );
  }

  public deleteUniqueIdentity(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}UniqueIdentity/deleteUniqueIdentity`,
      master,
      this.httpOptions
    );
  }

  //#region TrainingType

  public SaveTrainingType(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Training/SaveTrainingType`,
      master,
      this.httpOptions
    );
  }

  public GetTrainingTypeById(trainingTypeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Training/GetTrainingTypeById?trainingTypeId=${trainingTypeId}`,
      this.httpOptions
    );
  }

  public DeleteTrainingTypeById(trainingTypeId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Training/DeleteTrainingTypeById`,
      trainingTypeId,
      this.httpOptions
    );
  }

  //#endregion

  //#region LevelOfEducation

  public SaveLevelOfEducation(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}LevelOfEducation/SaveLevelOfEducation`,
      master,
      this.httpOptions
    );
  }

  public GetLevelOfEducationById(LevelOfEducationId: any) {
    return this.http.get<any>(
      `${this.apiUrl}LevelOfEducation/GetLevelOfEducationById?LevelOfEducationId=${LevelOfEducationId}`,
      this.httpOptions
    );
  }

  public DeleteLevelOfEducationById(
    LevelOfEducationId: any
  ): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}LevelOfEducation/DeleteLevelOfEducationById`,
      LevelOfEducationId,
      this.httpOptions
    );
  }

  //#endregion

  //#region Degree

  public SaveDegree(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Degree/SaveDegree`,
      master,
      this.httpOptions
    );
  }

  public GetDegreeById(degreeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Degree/GetDegreeById?DegreeId=${degreeId}`,
      this.httpOptions
    );
  }

  public DeleteDegreeById(degreeId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Degree/DeleteDegreeById`,
      degreeId,
      this.httpOptions
    );
  }

  //#endregion

  //#region EducationalSubject

  public SaveEducationalSubject(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}EducationalSubject/SaveEducationalSubject`,
      master,
      this.httpOptions
    );
  }

  public GetEducationalSubjectById(subjectId: any) {
    return this.http.get<any>(
      `${this.apiUrl}EducationalSubject/GetEducationalSubjectById?subjectId=${subjectId}`,
      this.httpOptions
    );
  }

  public DeleteEducationalSubjectById(subjectId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}EducationalSubject/DeleteEducationalSubjectById`,
      subjectId,
      this.httpOptions
    );
  }

  //#endregion

  //#region DegreeSubject

  public SaveDegreeSubject(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}DegreeSubject/SaveDegreeSubject`,
      master,
      this.httpOptions
    );
  }

  public GetDegreeSubjectById(degreeSubjectId: any) {
    return this.http.get<any>(
      `${this.apiUrl}DegreeSubject/GetDegreeSubjectById?degreeSubjectId=${degreeSubjectId}`,
      this.httpOptions
    );
  }

  public DeleteDegreeSubjectById(degreeSubjectId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}DegreeSubject/DeleteDegreeSubjectById`,
      degreeSubjectId,
      this.httpOptions
    );
  }

  //#endregion

  //#region Salary Location
  public saveSalaryLocation(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalaryLocation/setSalaryLocation`,
      master,
      this.httpOptions
    );
  }
  public getSalaryLocation(salaryLocationId: any) {
    return this.http.get<any>(
      `${this.apiUrl}SalaryLocation/getSalaryLocation?salaryLocationId=${salaryLocationId}`,
      this.httpOptions
    );
  }

  public deleteSalaryLocation(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalaryLocation/deleteSalaryLocation`,
      master,
      this.httpOptions
    );
  }

  //#endregion
  //#region Final Settlement

  public GetPayableList() {
    return this.http.get<any>(
      `${this.apiUrl}FinalSettlement/GetPayableList?`,
      this.httpOptions
    );
  }
  public GetReceivableList() {
    return this.http.get<any>(
      `${this.apiUrl}FinalSettlement/GetReceivableList?`,
      this.httpOptions
    );
  }
  public GetEmployeeInfoForFinalSettlement(employeeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}FinalSettlement/GetEmployeeInfoForFinalSettlement?employeeId=${employeeId}`,
      this.httpOptions
    );
  }
  public GetMarketOutstanding(fDate: any, tDate: any, employeeNo: any) {
    return this.http.get<any>(
      `${this.apiUrl}FinalSettlement/GetMarketOutstanding?fDate=${fDate}&tDate=${tDate}&employeeNo=${employeeNo}`,
      this.httpOptions
    );
  }
  public SaveEmployeeFinalSettlement(master: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}FinalSettlement/SaveEmployeeFinalSettlement`,
      master,
      this.httpOptions
    );
  }
  public GetEmployeeFinalSettlementbyId(finalSettlementMasterId: any) {
    return this.http.get<any>(
      `${this.apiUrl}FinalSettlement/GetEmployeeFinalSettlementbyId?finalSettlementMasterId=${finalSettlementMasterId}`,
      this.httpOptions
    );
  }
  public GetEmployeeFinalSettlementDetailsById(finalSettlementMasterId: any) {
    return this.http.get<any>(
      `${this.apiUrl}FinalSettlement/GetEmployeeFinalSettlementDetailsById?finalSettlementMasterId=${finalSettlementMasterId}`,
      this.httpOptions
    );
  }
  public GetEmployeeFinalSettlementSignatoryById(finalSettlementMasterId: any) {
    return this.http.get<any>(
      `${this.apiUrl}FinalSettlement/GetEmployeeFinalSettlementSignatoryById?finalSettlementMasterId=${finalSettlementMasterId}`,
      this.httpOptions
    );
  }
  public DeleteEmployeeFinalSettlement(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}FinalSettlement/DeleteEmployeeFinalSettlement`,
      master,
      this.httpOptions
    );
  }
  public DeleteSignatoryListById(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}FinalSettlement/DeleteSignatoryListById`,
      master,
      this.httpOptions
    );
  }
  public GetfinalSettlementDataForApproval() {
    debugger
    return this.http.get<any>(
      `${this.apiUrl}FinalSettlement/GetfinalSettlementDataForApproval?`,
      this.httpOptions
    );
  }
  public SaveEmployeeFinalSettlementApproval(master: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}FinalSettlement/SaveEmployeeFinalSettlementApproval`,
      master,
      this.httpOptions
    );
  }
  //#endregion
}

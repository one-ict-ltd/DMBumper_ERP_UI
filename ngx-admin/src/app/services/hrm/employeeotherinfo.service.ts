import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EmployeeotherinfoService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public SaveEmployeeAddress(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}EmployeeRelatedOtherInfo/SaveEmployeeAddress`,
      master,
      this.httpOptions
    );
  }

  public GetEmployeeAddressById(employeeAddressId, employeeId) {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeRelatedOtherInfo/GetEmployeeAddressById?employeeAddressId=${employeeAddressId}&employeeId=${employeeId}`,
      this.httpOptions
    );
  }

  public GetDuplicateEmployeeAddress(employeeAddressId, employeeId, addressTypeId) {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeRelatedOtherInfo/GetDuplicateEmployeeAddress?employeeAddressId=${employeeAddressId}&employeeId=${employeeId}&addressTypeId=${addressTypeId}`,
      this.httpOptions
    );
  }

  public DeleteEmployeeAddressById(employeeAddressId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}EmployeeRelatedOtherInfo/DeleteEmployeeAddressById`,
      employeeAddressId,
      this.httpOptions
    );
  }
  public GetEmployeeEducationById(educationalQualificationId, employeeId){
    return this.http.get<any>(
      `${this.apiUrl}EmployeeRelatedOtherInfo/GetEmployeeEducationById?educationalQualificationId=${educationalQualificationId}&employeeId=${employeeId}`,
      this.httpOptions
    );
  }
  public GetLevelOfEducation():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}EmployeeRelatedOtherInfo/GetAllLevelOfEducation`, this.httpOptions);
  }
  public getDegree(levelOfEducationId:any):Observable<any>{
    debugger
    return this.http.get<any>(
      `${this.apiUrl}EmployeeRelatedOtherInfo/GetDegreeByLevelOfEducationId?levelOfEducationId=${levelOfEducationId}`,
      this.httpOptions
    );
  }

  public getMejorById(degreeId:any):Observable<any>{
    return this.http.get<any>(
      `${this.apiUrl}EmployeeRelatedOtherInfo/GetMejorById?degreeId=${degreeId}`,
      this.httpOptions
    );
  }
  getResultTypes():Observable<any>{
    return this.http.get<any>(
      `${this.apiUrl}EmployeeRelatedOtherInfo/GetResultTypes`,
      this.httpOptions
    );
  }

  public SaveEmployeeEducation(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}EmployeeRelatedOtherInfo/SaveEmployeeEducation`,
      master,
      this.httpOptions
    );
  }
  public DeleteEmployeeEducationById(educationalQualificationId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}EmployeeRelatedOtherInfo/DeleteEmployeeEducationById`,
      educationalQualificationId,
      this.httpOptions
    );
  }
  public GetEmployeeAllRelation(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeRelatedOtherInfo/GetEmployeeAllRelations`,
      this.httpOptions
    );
  }
  public GetEmployeeFamilyInfoById(employeeFamilyInfoId, employeeId) {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeRelatedOtherInfo/GetEmployeeFamilyInfoById?familyInfoId=${employeeFamilyInfoId}&employeeId=${employeeId}`,
      this.httpOptions
    );
  }
  public SaveEmployeeFamillyInfo(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}EmployeeRelatedOtherInfo/SaveEmployeeFamillyInfo`,
      master,
      this.httpOptions
    );
  }
  public DeleteEmployeeFamilyInfoById(familyInfoId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}EmployeeRelatedOtherInfo/DeleteEmployeeFamilyInfoById`,
      familyInfoId,
      this.httpOptions
    );
  }
  public GetEmployeeEmergencyContactById(employeeFamilyInfoId, employeeId) {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeRelatedOtherInfo/GetEmployeeEmergencyContactById?familyInfoId=${employeeFamilyInfoId}&employeeId=${employeeId}`,
      this.httpOptions
    );
  }
  public GetEmployeeReferenceById(employeeFamilyInfoId, employeeId) {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeRelatedOtherInfo/GetEmployeeReferenceById?familyInfoId=${employeeFamilyInfoId}&employeeId=${employeeId}`,
      this.httpOptions
    );
  }
  public SaveEmployeeAttachment(master: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}EmployeeRelatedOtherInfo/UploadHrmEmployeeAttachment`,
      master,
      this.httpOptions
    );
  }
  public GetEmployeeExperienceById(employeeExperienceId, employeeId) {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeRelatedOtherInfo/GetEmployeeExperienceById?employeeExperienceId=${employeeExperienceId}&employeeId=${employeeId}`,
      this.httpOptions
    );
  }
  public SaveEmployeeExperience(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}EmployeeRelatedOtherInfo/SaveEmployeeExperience`,
      master,
      this.httpOptions
    );
  }
  public DeleteEmployeeExperienceById(employeeExperinceId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}EmployeeRelatedOtherInfo/DeleteEmployeeExperienceById`,
      employeeExperinceId,
      this.httpOptions
    );
  }
  public SaveEmployeeJobDescription(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}EmployeeRelatedOtherInfo/SaveEmployeeJobDescription`,
      master,
      this.httpOptions
    );
  }

  public GetEmployeeJobDescriptionById(employeeJobDescriptionId, employeeId) {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeRelatedOtherInfo/GetEmployeeJobDescriptionById?employeeJobDescriptionId=${employeeJobDescriptionId}&employeeId=${employeeId}`,
      this.httpOptions
    );
  }

  public DeleteEmployeeJobDescriptionById(employeeJobDescriptionId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}EmployeeRelatedOtherInfo/DeleteEmployeeJobDescriptionById`,
      employeeJobDescriptionId,
      this.httpOptions
    );
  }
}

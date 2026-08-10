import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ShiftgroupService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public SaveShiftGroupMaster(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Attendance/SaveShiftGroupMaster`,
      master,
      this.httpOptions
    );
  }

  public GetShiftGroupMasterById(shiftMasterId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Attendance/GetShiftGroupMasterById?shiftMasterId=${shiftMasterId}`,
      this.httpOptions
    );
  }

  public GetDuplicateShiftGroupMaster(shiftMasterId, shiftName) {
    return this.http.get<any>(
      `${this.apiUrl}Attendance/GetDuplicateShiftGroupMaster?shiftMasterId=${shiftMasterId}&shiftName=${shiftName}`,
      this.httpOptions
    );
  }

  public DeleteShiftGroupMasterById(shiftMasterId): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Attendance/DeleteShiftGroupMasterById`,
      shiftMasterId,
      this.httpOptions
    );
  }

  public GetShiftGroupDetailByMasterId(shiftMasterId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Attendance/GetShiftGroupDetailByMasterId?shiftMasterId=${shiftMasterId}`,
      this.httpOptions
    );
  }


}

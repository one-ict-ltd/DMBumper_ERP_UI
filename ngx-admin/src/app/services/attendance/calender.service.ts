import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CalenderService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public GetFullMonthCalender(year, month) {
    return this.http.get<any>(
      `${this.apiUrl}Attendance/GetFullMonthCalender?year=${year}&month=${month}`,
      this.httpOptions
    );
  }

  public SaveCalender(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Attendance/SaveCalender`,
      master,
      this.httpOptions
    );
  }

  public GetCalender(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Attendance/GetCalender`,
      this.httpOptions
    );
  }

  public GetCalenderByMonth(year, month): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Attendance/GetCalenderByMonth?year=${year}&month=${month}`,
      this.httpOptions
    );
  }

  public DeleteCalender(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Attendance/DeleteCalenderByMonth`,
      master,
      this.httpOptions
    );
  }


}

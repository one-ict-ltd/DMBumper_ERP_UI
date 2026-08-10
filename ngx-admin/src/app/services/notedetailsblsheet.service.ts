import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NotedetailsblsheetService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getNoteDetails(noteType) {
    return this.http.get<any>(
      `${this.apiUrl}NoteMaster/getNoteDetails?noteDetailsId=0&noteType=${noteType}`,
      this.httpOptions
    );
  }
  public getNoteDetailsById(noteDetailsId: any) {
    return this.http.get<any>(
      `${this.apiUrl}NoteMaster/getNoteDetails?noteDetailsId=${noteDetailsId}&noteType=All`,
      this.httpOptions
    );
  }
  public saveNoteDetails(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}NoteMaster/setNoteDetails`,
      master,
      this.httpOptions
    );
  }
  public deleteNoteDetails(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}NoteMaster/deleteNoteDetails`,
      master,
      this.httpOptions
    );
  }
  public getDuplicateNoteDetail(noteDetailsId, ledgerId, noteType) {
    return this.http.get<any>(
      `${this.apiUrl}NoteMaster/getDuplicateNoteDetail?noteDetailsId=${noteDetailsId}&ledgerId=${ledgerId}&noteType=${noteType}`,
      this.httpOptions
    );
  }
}

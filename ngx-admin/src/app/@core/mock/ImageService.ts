import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(private http: HttpClient) {}

  getImages(imagePaths: string[]): Observable<Blob[]> {
    debugger;
    return forkJoin(imagePaths.map(imagePath =>
      this.http.get(imagePath, { responseType: 'blob' })
    ));
  }
}

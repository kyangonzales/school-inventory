import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../envinronment';

interface Item {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
 

  constructor(private http: HttpClient) {}

  BROWSE(type:string): Observable<any> {
    return this.http.get<any>(`${environment.ENDPOINT}/reports?type=${type}`).pipe(
      catchError((error) => {
        console.error('Error fetching items', error);
        return 'no fetched';
      })
    );
  }
}

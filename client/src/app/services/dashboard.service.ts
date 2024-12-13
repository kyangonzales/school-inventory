
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../envinronment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {


  constructor(private http: HttpClient) {}

  BROWSE(): Observable<any> {
    return this.http.get<any>(`${environment.ENDPOINT}/dashboard`).pipe(
      catchError((error) => {
        console.error('Error fetching dashboard', error);
        return 'no fetched';
      })
    );
  }


}

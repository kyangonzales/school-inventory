import { Injectable } from '@angular/core';
import { catchError, of, tap, Observable } from 'rxjs';

interface ItemServiceMethods {
  BROWSE: () => Observable<any>;
  SAVE: () => Observable<any>;
  DESTROY: () => Observable<any>;
  UPDATE: () => Observable<any>;
}

@Injectable({
  providedIn: 'root',
})
export class apiService {
  constructor() {}

  fetch = (
    service: any, //ito yung service mo example ItemService
    action: keyof ItemServiceMethods = 'BROWSE', //so ito kung anong method yung tatawagin mo sa service mo
    data: any //
  ): Observable<any> => {
    if (service[action]) {
      return service[action](data).pipe(
        tap((response) => {
          return response;
        }),
        catchError((error) => {
          console.error(`Error in ${action} method:`, error);
          return of([]);
        })
      );
    } else {
      return of([]);
    }
  };
}

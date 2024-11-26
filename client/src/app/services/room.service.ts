import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../envinronment';

interface Item {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient) {}
  
  roomArray = [
    { _id: 1, name: 'Computer Laboratory 1' },
    { _id: 2, name: 'Computer Laboratory 2' },
    { _id: 3, name: 'Registrar' },
    { _id: 4, name: 'Library' },
    // { _id: 5, name: 'Audio Visual Room' },
    { _id: 6, name: 'Room 1' },
    { _id: 7, name: 'Room 2' },
    // { _id: 8, name: 'Room 3' }
  ];
  
  getRoom() {
    return this.roomArray;
  }

  DESTROY(item: Item): Observable<any> {
    return this.http
      .put<any>(`${environment.ENDPOINT}/rooms/destroy`, item)
      .pipe(
        catchError((error) => {
          console.error('Error fetching rooms', error);
          return 'no fetched';
        })
      );
  }

  UPDATE(item: Item): Observable<any> {
    return this.http
      .put<any>(`${environment.ENDPOINT}/rooms/update`, item)
      .pipe(
        catchError((error) => {
          console.error('Error fetching rooms', error);
          return 'no fetched';
        })
      );
  }

  SAVE(item: Item): Observable<any> {
    return this.http.post<any>(`${environment.ENDPOINT}/rooms/save`, item).pipe(
      catchError((error) => {
        console.error('Error fetching rooms', error);
        return 'no fetched';
      })
    );
  }

  BROWSE(): Observable<any> {
    return this.http.get<any>(`${environment.ENDPOINT}/rooms`).pipe(
      catchError((error) => {
        console.error('Error fetching rooms', error);
        return 'no fetched';
      })
    );
  }

}



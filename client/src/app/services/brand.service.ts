import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../envinronment';

interface Brand {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root',
})
export class BrandService {

  constructor(private http: HttpClient) {}

  brandArray = [
    { __id: 1, name: 'Logitech' },
    { _id: 2, name: 'Dell' },
    { _id: 3, name: 'HP' },
    { _id: 4, name: 'Asus' },
    { _id: 5, name: 'Samsung' },
    { _id: 6, name: 'Lenovo' },
    { _id: 7, name: 'Acer' },
    { _id: 8, name: 'Toshiba' },
    { _id: 9, name: 'Seagate' },
    { _id: 10, name: 'Kingston' },
  ];

  getItems() {
    return this.brandArray;
  }

  addBrand(brand: any) {
    const newBrand = { ...brand, _id: this.brandArray.length + 1 };
    return newBrand;
  }

  DESTROY(brand: Brand): Observable<any> {
    return this.http
      .put<any>(`${environment.ENDPOINT}/brands/destroy`, brand)
      .pipe(
        catchError((error) => {
          console.error('Error fetching brand', error);
          return 'no fetched';
        })
      );
  }

  UPDATE(brand: Brand): Observable<any> {
    return this.http
      .put<any>(`${environment.ENDPOINT}/brands/update`, brand)
      .pipe(
        catchError((error) => {
          console.error('Error fetching brand', error);
          return 'no fetched';
        })
      );
  }

  SAVE(brand: Brand): Observable<any> {
    return this.http.post<any>(`${environment.ENDPOINT}/brands/save`, brand).pipe(
      catchError((error) => {
        console.error('Error fetching brand', error);
        return 'no fetched';
      })
    );
  }

  BROWSE(): Observable<any> {
    return this.http.get<any>(`${environment.ENDPOINT}/brands`).pipe(
      catchError((error) => {
        console.error('Error fetching brand', error);
        return 'no fetched';
      })
    );
  }
}

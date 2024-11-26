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
export class ItemService {
  private itemsArray = [
    {
      _id: 1,
      item: 'Mouse',
      brand: 'Logitech',
      room: 'Room 1',
      barcode: '24214111',
      quantity: 5,
    },
    {
      _id: 2,
      item: 'Keyboard',
      brand: 'HP',
      room: 'Room 2',
      barcode: '24214112',
      quantity: 5,
    },
    {
      _id: 3,
      item: 'Monitor',
      brand: 'Samsung',
      room: 'Room 3',
      barcode: '24214113',
      quantity: 5,
    },
    {
      _id: 4,
      item: 'Laptop',
      brand: 'Dell',
      room: 'Room 4',
      barcode: '24214114',
      quantity: 10,
    },
    {
      _id: 5,
      item: 'Projector',
      brand: 'Epson',
      room: 'Audio Visual Room',
      barcode: '24214115',
      quantity: 3,
    },
    {
      _id: 6,
      item: 'Whiteboard',
      brand: 'Ace',
      room: 'Library',
      barcode: '24214116',
      quantity: 2,
    },
    {
      _id: 7,
      item: 'Speaker',
      brand: 'Bose',
      room: 'Computer Laboratory 1',
      barcode: '24214117',
      quantity: 4,
    },
    {
      _id: 8,
      item: 'Printer',
      brand: 'Canon',
      room: 'Computer Laboratory 2',
      barcode: '24214118',
      quantity: 2,
    },
  ];

  constructor(private http: HttpClient) {}

  getItems() {
    return this.itemsArray;
  }
  // getItemByBarcode(barcode: string) {
  //   return this.itemsArray.find((item) => item.barcode === barcode);
  // }
  // addItem(item: any) {
  //   const newItem = { ...item, _id: this.itemsArray.length + 1 };
  //   this.itemsArray.unshift(newItem);
  //   return newItem;
  // }

  DESTROY(item: Item): Observable<any> {
    return this.http
      .put<any>(`${environment.ENDPOINT}/items/destroy`, item)
      .pipe(
        catchError((error) => {
          console.error('Error fetching items', error);
          return 'no fetched';
        })
      );
  }

  UPDATE(item: Item): Observable<any> {
    return this.http
      .put<any>(`${environment.ENDPOINT}/items/update`, item)
      .pipe(
        catchError((error) => {
          console.error('Error fetching items', error);
          return 'no fetched';
        })
      );
  }

  SAVE(item: Item): Observable<any> {
    return this.http.post<any>(`${environment.ENDPOINT}/items/save`, item).pipe(
      catchError((error) => {
        console.error('Error fetching items', error);
        return 'no fetched';
      })
    );
  }

  BROWSE(): Observable<any> {
    return this.http.get<any>(`${environment.ENDPOINT}/items`).pipe(
      catchError((error) => {
        console.error('Error fetching items', error);
        return 'no fetched';
      })
    );
  }
}

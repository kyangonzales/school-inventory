import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor() { }
  logArray = [
    { _id: 1, item: 'Mouse', brand: 'A4tech', quantity: '4', status: 'Good', registrar: 'Rowel', date: 'Jul 18, 2024 | 12:49PM' },
    { _id: 2, item: 'Keyboard', brand: 'Logitech', quantity: '2', status: 'Missing', registrar: 'Rowel', date: 'Jul 18, 2024 | 01:05PM' },
    { _id: 3, item: 'Monitor', brand: 'HP', quantity: '3', status: 'Missing', registrar: 'Rowel', date: 'Jul 18, 2024 | 01:20PM' },
    { _id: 4, item: 'Headphones', brand: 'Sony', quantity: '5', status: 'Good', registrar: 'Rowel', date: 'Jul 18, 2024 | 01:35PM' },
    { _id: 5, item: 'Printer', brand: 'Canon', quantity: '1', status: 'Good', registrar: 'Rowel', date: 'Jul 18, 2024 | 01:50PM' },
    { _id: 6, item: 'Laptop', brand: 'Dell', quantity: '2', status: 'Damaged', registrar: 'Rowel', date: 'Jul 18, 2024 | 02:10PM' },
    { _id: 7, item: 'Flash Drive', brand: 'SanDisk', quantity: '10', status: 'Good', registrar: 'Rowel', date: 'Jul 18, 2024 | 02:30PM' },
    { _id: 8, item: 'Webcam', brand: 'Logitech', quantity: '3', status: 'Missing', registrar: 'Rowel', date: 'Jul 18, 2024 | 02:45PM' },
    { _id: 9, item: 'Router', brand: 'TP-Link', quantity: '4', status: 'Good', registrar: 'Rowel', date: 'Jul 18, 2024 | 03:00PM' },
    { _id: 10, item: 'External HDD', brand: 'Seagate', quantity: '6', status: 'Good', registrar: 'Rowel', date: 'Jul 18, 2024 | 03:10PM' },
    { _id: 11, item: 'Projector', brand: 'BenQ', quantity: '2', status: 'Good', registrar: 'Rowel', date: 'Jul 18, 2024 | 03:30PM' },
    { _id: 12, item: 'Mouse Pad', brand: 'A4tech', quantity: '8', status: 'Good', registrar: 'Rowel', date: 'Jul 18, 2024 | 03:45PM' },
    { _id: 13, item: 'Speakers', brand: 'JBL', quantity: '5', status: 'Good', registrar: 'Rowel', date: 'Jul 18, 2024 | 04:00PM' },
    { _id: 14, item: 'Tablet', brand: 'Samsung', quantity: '4', status: 'Good', registrar: 'Rowel', date: 'Jul 18, 2024 | 04:15PM' },
    { _id: 15, item: 'Charger', brand: 'Apple', quantity: '7', status: 'Good', registrar: 'Rowel', date: 'Jul 18, 2024 | 04:30PM' }
  ]
  getInventory() {
    return this.logArray;
  }
  addInventory(log: any) {
    const newLog = { ...log, _id: this.logArray.length + 1 }; 
    this.logArray.unshift(newLog); 
    return newLog;
  }
}

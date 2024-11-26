import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StocksService {

  constructor() { }
  stocksArray = [
    { _id: 1, name: 'A4tech', good: '54', missing: '3', damage: '3', total: '60' },
    { _id: 2, name: 'Logitech', good: '40', missing: '5', damage: '1', total: '46' },
    { _id: 3, name: 'HP', good: '30', missing: '2', damage: '5', total: '37' },
    { _id: 4, name: 'Dell', good: '25', missing: '4', damage: '3', total: '32' },
    { _id: 5, name: 'Samsung', good: '45', missing: '1', damage: '4', total: '50' },
    { _id: 6, name: 'JBL', good: '55', missing: '0', damage: '2', total: '57' },
    { _id: 7, name: 'SanDisk', good: '60', missing: '1', damage: '0', total: '61' },
    { _id: 8, name: 'Canon', good: '20', missing: '6', damage: '4', total: '30' },
    { _id: 9, name: 'Sony', good: '50', missing: '3', damage: '2', total: '55' },
    { _id: 10, name: 'TP-Link', good: '35', missing: '2', damage: '3', total: '40' },
    { _id: 11, name: 'Epson', good: '15', missing: '3', damage: '2', total: '20' },
    { _id: 12, name: 'Seagate', good: '48', missing: '4', damage: '1', total: '53' },
    { _id: 13, name: 'Blue Yeti', good: '28', missing: '2', damage: '0', total: '30' },
    { _id: 14, name: 'NVIDIA', good: '22', missing: '1', damage: '4', total: '27' },
    { _id: 15, name: 'Samsung', good: '50', missing: '0', damage: '2', total: '52' }
  ]
  getStocks() {
    return this.stocksArray;
  }
}

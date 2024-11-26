import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  private items: any[] = [];
  totalItems: number = 0;
  itemsPerPage: number = 5;
  currentPage: number = 1;
  filteredItems: any[] = [];

  setItems(items: any[]) {
    this.items = items;
    this.totalItems = items.length;
    this.updateFilteredItems();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get start(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get end(): number {
    return this.start + this.itemsPerPage;
  }

  changeItemsPerPage(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = Math.min(this.currentPage, this.totalPages); 
    this.updateFilteredItems();
  }

  changePage(page: number) {
    this.currentPage = page;
    this.updateFilteredItems();
  }

  updateFilteredItems() {
    this.filteredItems = this.items.slice(this.start, this.end);
  }

  getFilteredItems(): any[] {
    return this.filteredItems;
  }
}

import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../component/header/header.component';
import { StocksService } from '../../services/stocks.service';
import { PaginationService } from '../../services/pagination.service';
import { PaginationComponent } from '../../component/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { PdfService } from '../../services/pdf.service';

@Component({
  selector: 'app-stocks',
  standalone: true,
  imports: [FormsModule, HeaderComponent, PaginationComponent, CommonModule],
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.css'
})
export class StocksComponent {
  pageTitle = 'Stock List';
  private stocksService = inject(StocksService);
  paginationService = inject(PaginationService);
  stocks = this.stocksService.getStocks(); // galing db to
  filteredStocks: any[] = [];

  modalFields: any[] = [];
  
  constructor(private pdfService:PdfService) {
    this.paginationService.setItems(this.stocks);
    this.updateFilteredStocks();
  }
  handleAddStock(formValue: any) {} // para to sa header ko yung may eventmitter

  currentStock: any = null;
  isModalOpen = false; 

  onStocksPerPageChange(stocksPerPage: number) {
    this.paginationService.changeItemsPerPage(stocksPerPage);
    this.updateFilteredStocks();
  }

  onPageChange(page: number) {
    this.paginationService.changePage(page);
    this.updateFilteredStocks();
  }

  updateFilteredStocks() {
    this.filteredStocks = this.paginationService.getFilteredItems();
  }

  onSearch(query: string) { 
    this.filteredStocks = this.stocks.filter(stock => 
      stock.name.toLowerCase().includes(query.toLowerCase()) || 
      stock.good.toLowerCase().includes(query.toLowerCase()) ||
      stock.missing.toLowerCase().includes(query.toLowerCase()) ||
      stock.damage.toLowerCase().includes(query.toLowerCase()) || 
      stock.total.toLowerCase().includes(query.toLowerCase())
    ); 
  }
  exportStock() {
    this.pdfService.exportPdf(this.filteredStocks, 'stocks'); 
  }
}

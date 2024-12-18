import { PaginationService } from './../../services/pagination.service';
import { PdfService } from './../../services/pdf.service';
import { apiService } from './../../services/api.service';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportsService } from '../../services/reports.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../component/header/header.component';
import { DatePipe } from '@angular/common';
import { PaginationComponent } from '../../component/pagination/pagination.component';
@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, HeaderComponent, PaginationComponent],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers: [DatePipe],
})
export class ReportComponent implements OnInit {
  private ReportsService = inject(ReportsService);
  private apiService = inject(apiService);
  private pdfService = inject(PdfService);
  paginationService = inject(PaginationService);
  type: string | null = null;
  items: any[] = [];
  collections: any[] = [];
  pageTitle = '';
  startDate: any;
  endDate: any;
  filterItemsByDate(startDate: string, endDate: string): any[] {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return this.collections.filter((item) => {
      const createdAt = new Date(item.createdAt);
      createdAt.setHours(0, 0, 0, 0);
      return createdAt >= start && createdAt <= end;
    });
  }

  handleStart(date: string) {
    const _endDate = this.endDate;
    if (_endDate) {
      const filteredItems = this.filterItemsByDate(date, _endDate);
      this.items = filteredItems;
    }
    this.startDate = date;
  }
  handleEnd(date: string) {
    const _startDate = this.startDate;
    if (_startDate) {
      const filteredItems = this.filterItemsByDate(_startDate, date);
      this.items = filteredItems;
    }
    this.endDate = date;
  }

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.BROWSE(data['reportType']);
      data['reportType'] == 'All'
        ? (this.pageTitle = 'Good, Missing, Damaged')
        : (this.pageTitle = data['reportType']);
    });
  }

  BROWSE = (type: string) => {
    this.apiService
      .fetch(this.ReportsService, 'BROWSE', type)
      .subscribe(({ payload = [] }) => {
        this.items = payload;
        this.collections = payload;
        console.log(payload);
        this.paginationService.setItems(this.items);
        this.updateFilteredItems();
      });
  };

  // exportItemsPdf() {
  //   localStorage.setItem('date',JSON.stringify({startDate:this.startDate,endDate:this.endDate}))
  //   this.pdfService.exportPdf(this.items, 'report', true);
  // }

  exportItemsPdf() {
    const url = '/printOut';

    const popup = window.open(
      url,
      'PDFReport',
      'width=800,height=600,scrollbars=yes,resizable=yes'
    );

    localStorage.setItem(
      'printOut',
      JSON.stringify({ items: this.collections })
    );

    if (popup) {
      popup.focus();
    } else {
      alert('Popup blocker is enabled! Please allow popups for this site.');
    }
  }

  onSearch(query: string) {
    this.items = this.items.filter(
      (item: any) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.brand?.name.toLowerCase().includes(query.toLowerCase()) ||
        item.barcode?.toLowerCase().includes(query.toLowerCase())
    );
  }
  onItemsPerPageChange(itemsPerPage: number) {
    this.paginationService.changeItemsPerPage(itemsPerPage);
    this.updateFilteredItems();
  }

  onPageChange(page: number) {
    this.paginationService.changePage(page);
    this.updateFilteredItems();
  }

  updateFilteredItems() {
    this.items = this.paginationService.getFilteredItems();
  }
}

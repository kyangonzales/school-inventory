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

interface Room {
  _id: string;
  name: string;
  createdAt: string;
}

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
  rooms: any[] = [];
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
      this.rooms = filteredItems;
    }
    this.startDate = date;
  }
  handleEnd(date: string) {
    const _startDate = this.startDate;
    if (_startDate) {
      const filteredItems = this.filterItemsByDate(_startDate, date);
      this.rooms = filteredItems;
    }
    this.endDate = date;
  }

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.BROWSE();
  }

  BROWSE = () => {
    this.apiService
      .fetch(this.ReportsService, 'BROWSE', '')
      .subscribe(({ payload = [] }) => {
        if (payload.length > 0) {
          const arrangeByRooms = [...payload].reduce((acc, curr) => {
            const { room } = curr;
            const index = acc.findIndex((r: Room) => r._id === room._id);

            if (index > -1) {
              acc[index].items.push(curr);
            } else {
              acc.push({ ...room, items: [curr] });
            }
            return acc;
          }, []);
          this.rooms = arrangeByRooms;
        }

        this.collections = payload;
        this.paginationService.setItems(this.rooms);
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
      `width=${window.innerWidth},height=${window.innerHeight},scrollbars=yes,resizable=yes`
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
    this.rooms = this.rooms.filter(
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
    this.rooms = this.paginationService.getFilteredItems();
  }
}

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
  providers: [DatePipe]
})
export class ReportComponent implements OnInit {
  private ReportsService = inject(ReportsService);
  private apiService = inject(apiService);
  private pdfService = inject(PdfService);
  paginationService = inject(PaginationService)
  type: string | null = null;
  items: any[] = [];
  pageTitle = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.BROWSE(data['reportType']);
      data['reportType']=='All' ? this.pageTitle = "Good, Missing, Damaged" : this.pageTitle = data['reportType'];
    });
  }

  BROWSE = (type: string) => {
    this.apiService.fetch(this.ReportsService, 'BROWSE', type).subscribe(({ payload = [] }) => {
      this.items = payload;
      console.log(payload);
      this.paginationService.setItems(this.items);
      this.updateFilteredItems();
    });
  };

  exportItemsPdf() {
    this.pdfService.exportPdf(this.items, 'item');
  }

  onSearch(query: string) {
    this.items = this.items.filter((item: any) =>
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
      console.log("kyan", this.items)
    }

}

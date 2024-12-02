import { PdfService } from './../../services/pdf.service';
import { apiService } from './../../services/api.service';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportsService } from '../../services/reports.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../component/header/header.component';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit {
  private ReportsService = inject(ReportsService);
  private apiService = inject(apiService);
  private pdfService = inject(PdfService);
  type: string | null = null;
  items: any[] = [];
  pageTitle = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.BROWSE(data['reportType']);
      this.pageTitle = data['reportType'];
    });
  }

  BROWSE = (type: string) => {
    this.apiService.fetch(this.ReportsService, 'BROWSE', type).subscribe(({ payload = [] }) => {
      this.items = payload;
      console.log(payload);
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
}

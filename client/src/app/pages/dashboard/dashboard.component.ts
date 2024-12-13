import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ChartModule } from 'primeng/chart';
import { RoomComponent } from '../room/room.component';
import { apiService } from '../../services/api.service';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChartModule, CommonModule, LucideAngularModule, RoomComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  private apiService = inject(apiService)
  private dashboardService = inject(DashboardService)
  value: string | undefined;
  allStatus:any
  inventoryData: any;
  combinedConditionData: any;
  brandData: any;
  options: any;
  barOptions: any;

  ngOnInit() {

    this.BROWSE()


    this.brandData = {
      labels: ['Logitech', 'A4tech', 'Epson', 'Panorama'],
      datasets: [
        {
          data: [20, 30, 25, 25],
          backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#9333ea'],
        },
      ],
    };

    this.options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: '#333',
          },
        },
      },
    };

    this.barOptions = {
      scales: {
        x: {
          stacked: false, 
          beginAtZero: true,
        },
        y: {
          beginAtZero: true,
        },
      },
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
    };
  }

  BROWSE = () => {
    this.apiService
      .fetch(this.dashboardService, 'BROWSE', '')
      .subscribe(({ payload = {} }) => {
        const {allStatus={} }= payload
        console.log(allStatus)
        this.handlePie(allStatus)
        this.handleBar()
      });
  }

  handlePie(allStatus:any){
    this.combinedConditionData = {
      labels: Object.keys(allStatus),
      datasets: [
        {
          data: Object.values(allStatus),
          backgroundColor: ['#10b981','#f87171', '#fbbf24' ],
        },
      ],
    };
  }

  handleBar(){
    this.inventoryData = {
      labels: ['Printers', 'Computers', 'Laptops', 'Chairs', 'Projectors'],
      datasets: [
        {
          label: 'Good',
          data: [8, 45, 28, 95, 19],
          backgroundColor: '#10b981',
        },
        {
          label: 'Damaged',
          data: [2, 5, 1, 3, 0],
          backgroundColor: '#f87171',
        },
        {
          label: 'Missing',
          data: [0, 0, 1, 2, 5],
          backgroundColor: '#fbbf24',
        },
      ],
    };

  }

}

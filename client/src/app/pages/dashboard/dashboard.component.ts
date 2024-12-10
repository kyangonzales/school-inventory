import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ChartModule } from 'primeng/chart';
import { RoomComponent } from '../room/room.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChartModule, CommonModule, LucideAngularModule, RoomComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  value: string | undefined;

  inventoryData: any;
  combinedConditionData: any;
  brandData: any;
  options: any;
  barOptions: any;

  ngOnInit() {
    // Inventory items data (Grouped Bar Chart)
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

    // Combined Condition data for Damaged, Good, Missing items (Pie Chart)
    this.combinedConditionData = {
      labels: ['Damaged Items', 'Good Items', 'Missing Items'],
      datasets: [
        {
          data: [11, 195, 8],
          backgroundColor: ['#f87171', '#10b981', '#fbbf24'],
        },
      ],
    };

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
          stacked: false, // Disable stacked bars to show separate columns
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
}

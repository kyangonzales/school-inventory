import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import the CommonModule
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-print-out',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './print-out.component.html',
  styleUrl: './print-out.component.css',
})
export class PrintOutComponent {
  rooms: any = [];
  ngOnInit() {
    const itemsString = localStorage.getItem('printOut');
    if (itemsString) {
      const parseItems = JSON.parse(itemsString)?.items;
      const arrangeItems = parseItems?.reduce((acc: any = [], curr: any) => {
        const index = acc.findIndex(
          (item: any) => item?._id === curr?.room?._id
        );

        if (index > -1) {
          acc[index]?.items?.push(curr);
        } else {
          acc.push({ ...curr.room, items: [curr] });
        }
        return acc;
      }, []);

      console.log(arrangeItems);
      this.rooms = arrangeItems;
    }
  }

  handlePrints = () => {
    const body = document.getElementById('body');
    const printContent = document.getElementById('printContent');
    const headerView = document.getElementById('header-for-print');
    const headerPrint = document.getElementById('header-for-view');

    if (body && printContent && headerPrint && headerView) {
      headerPrint.classList.remove('hidden');
      headerView.classList.add('hidden');
    }
  };
}

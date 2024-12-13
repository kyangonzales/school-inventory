import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterLink, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
@Component({
  selector: 'sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, LucideAngularModule ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})

export class SidebarComponent {
  sidebarItems = [
    { id:1, label: 'Dashboard', icon: 'LayoutDashboard', path:{name:'dashboard', value: "dashboard"}  },
    { id:2, label: 'Items', icon: 'PackageOpen', path:{name:'items', value: "items"}  },
    { id:3, label: 'Brands', icon: 'ShoppingBasket', path:{name:'brand', value: "brand"} },
    { id:4, label: 'Stocks', icon: 'Layers', path:{name:'stocks', value: "stocks"}  },
    { id:6, label: 'Rooms', icon: 'MapPinned', path:{name:'room', value: "room"} },
    { 
      id:5, label: 'Reports', icon: 'NotebookPen', path:{name:'all', value: "good"}, 
      submenu: [
        { id:7, label: 'Good', path:{name:'good', value: "good"} },
        { id:8, label: 'Damaged', path:{name:'damage', value: "damage"}},
        { id:9, label: 'Missing', path:{name:'missing', value: "missing"} }
      ]   
    }
  ]; 

  isSubmenuOpen = false;

  toggleSubmenu() {
    this.isSubmenuOpen = !this.isSubmenuOpen;
  }
}


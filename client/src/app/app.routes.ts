import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { StocksComponent } from './pages/stocks/stocks.component';
import { BrandComponent } from './pages/brand/brand.component';
import { ItemsComponent } from './pages/items/items.component';
import { RoomComponent } from './pages/room/room.component';
import { AuthGuard } from './auth.guard';
import { NotFoundComponent } from './pages/not-found/not-found.component'
import { ReportComponent } from './pages/report/report.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'stocks',
    component: StocksComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'brand',
    component: BrandComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'items',
    component: ItemsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'inventory',
    component: InventoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'room',
    component: RoomComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'report',
    component: ReportComponent,
    canActivate: [AuthGuard]
  }
  ,
  {
    path: 'good',
    component: ReportComponent,
    canActivate: [AuthGuard]
  }
  ,
  {
    path: 'damage',
    component: ReportComponent,
    canActivate: [AuthGuard]
  }
  ,
  {
    path: 'missing',
    component: ReportComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', component: NotFoundComponent}
];

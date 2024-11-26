import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import {
  LucideAngularModule,
  ArrowUpRight,
  File,
  Home,
  Menu,
  UserCheck,
  User,
  LayoutDashboard,
  ShoppingBasket,
  Layers,
  NotebookPen,
  PackageOpen,SquareCheck,
  Pencil,
  Trash2,
  ChevronsLeft,
  ChevronsRight,
  FileDown,
  Download,
  MapPinned,
  Eye, EyeOff, Mail, Lock, OctagonAlert, Building, ChevronDown, XCircle, TriangleAlert, CircleCheckBig  
} from 'lucide-angular';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(
      LucideAngularModule.pick({
        File,
        Home,
        Menu,
        UserCheck,
        ArrowUpRight,
        User,
        LayoutDashboard,
        ShoppingBasket,
        Layers,
        NotebookPen,
        PackageOpen,
        Pencil,
        Trash2,
        ChevronsLeft,
        ChevronsRight,
        FileDown,
        Download,
        MapPinned, Eye, EyeOff, Mail, Lock, OctagonAlert , Building, ChevronDown, SquareCheck, XCircle, TriangleAlert, CircleCheckBig  
      })
    ),
  ],
};

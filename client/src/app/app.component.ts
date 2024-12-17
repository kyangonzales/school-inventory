import { Component, HostListener, OnInit } from '@angular/core';
import {
  RouterOutlet,
  Router,
  NavigationEnd,
  ActivatedRoute,
} from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, CommonModule, LucideAngularModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  // Implement OnInit
  dropdownVisible: boolean = false;
  isPrintOut: boolean = false;
  isScrolled: boolean = false;
  fullName: string = '';
  constructor(
    public authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    this.isScrolled = scrollTop > 0; // Adjust the threshold as needed
  }

  ngOnInit(): void {
    this.loadUserInfo();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        let currentRoute = this.activatedRoute.root;
        this.isPrintOut = false; // Default na value
        this.loadUserInfo();
        while (currentRoute.firstChild) {
          currentRoute = currentRoute.firstChild;
          if (currentRoute.snapshot.data['isPrintOut']) {
            this.isPrintOut = true;
          }
        }
      });
  }
  loadUserInfo() {
    const info = this.authService.info();
    this.fullName = info?.fullName;
    console.log(info);
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }
  logout() {
    this.dropdownVisible = false;
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

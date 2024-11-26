import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, CommonModule, LucideAngularModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  dropdownVisible: boolean = false;  
  constructor(public authService: AuthService, private router: Router){}
  toggleDropdown() { 
    this.dropdownVisible = !this.dropdownVisible; 
  } 
  logout() {
    this.authService.setLoggedIn(false);
    this.dropdownVisible=false;
    localStorage.removeItem('userFullName');
    this.router.navigate(['/login']); 
  }
  
}

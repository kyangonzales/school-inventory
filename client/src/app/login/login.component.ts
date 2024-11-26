import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core'; 
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
@Component({
  selector: 'Login',
  standalone: true,
  imports: [
            ReactiveFormsModule, 
            CommonModule,
            LucideAngularModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: any;
  // data: any = null;
  showPassword: boolean = false;
  message: string = '';
  constructor(
              private fb: FormBuilder, 
              private AuthService: AuthService, 
              private router: Router
            ) {}
    backgroundImages: string[] = [
              'assets/page1.jpg',
              'assets/inventory.jpeg',
            ];
    currentBackground: string = this.backgroundImages[0];
    intervalTime = 4000; 
          
           
    ngOnInit() {
      this.loginForm = this.fb.group(
        {
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required]]
        },
        {
          updateOn: 'blur' // Ilagay dito ang updateOn configuration
        }
      );
    
      let index = 0;
      setInterval(() => {
        index = (index + 1) % this.backgroundImages.length;
        this.currentBackground = this.backgroundImages[index];
      }, this.intervalTime);
    }
    
  
  togglePassword() {
    this.showPassword = !this.showPassword;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    passwordInput.type = this.showPassword ? 'text' : 'password';
  }
  
  async onSubmit() {
    if (!this.loginForm.valid) {
      this.message = 'Please fill in all required fields.'
      return
    }
    const { email, password } = this.loginForm.value
    const result = await this.AuthService.login(email, password)
    if (!result) {
      this.message = 'Login failed. Please check your credentials.'
      return; 
    }
    this.message = 'Login successful!'
    const userFullName = localStorage.getItem('userFullName') || ''
    if (!userFullName) {
      this.message = 'Please log in.'
      return; 
    }
    const fullName = JSON.parse(userFullName);
    this.message = `Welcome back, ${fullName.fname} ${fullName.lname}!`
    
     this.router.navigate(['/dashboard']);
  }
  
  get email (){
    return this.loginForm.controls['email'];
  }

}

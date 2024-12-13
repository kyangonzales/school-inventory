

import { AuthService } from './../services/auth.service';
import { Component, OnInit, inject } from '@angular/core'; 
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { apiService } from '../services/api.service';
import { UsersService } from '../services/users.service';
import Swal from 'sweetalert2';
interface RegisterForm{
  fullname:string,
  email:string,
  password:string, 
  confirmPasswword: string
}
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
  showRegister: boolean = false; 
  message: string = '';
  registerForm: any;
  private apiService = inject(apiService)
  private userService = inject(UsersService)
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
          updateOn: 'blur' 
        }
      );

    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
    
      let index = 0;
      setInterval(() => {
        index = (index + 1) % this.backgroundImages.length;
        this.currentBackground = this.backgroundImages[index];
      }, this.intervalTime);
    }

  

    handleRegister = () => {
      const {password, confirmPassword } = this.registerForm.value
      const errorMessageElement = document.getElementById('errorMessage');
      if (errorMessageElement) {
        if (password !== confirmPassword) {
          errorMessageElement.innerHTML = "Password and Confirm Password do not match";
          return
        }  
        if(password.length<8){
          errorMessageElement.innerHTML="Shorter Password, Minimun 8 characters long"
          return
        }
      }
        this.apiService
          .fetch(this.userService,  'SAVE', this.registerForm.value)
          .subscribe(({ payload = {} }) => {
            console.log(payload);
            const {duplicateEmail=false}=payload

            Swal.fire({
              title: duplicateEmail ? 'Warning!' : 'Success!',
              text: duplicateEmail ? 'Email is already exist!' : 'Successfully Registered!',
              icon: duplicateEmail ? 'warning' : 'success',
              confirmButtonText: 'OK'
            });
            this.showRegister=duplicateEmail
          });  
    };
    
  
  togglePassword() {
    this.showPassword = !this.showPassword;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    passwordInput.type = this.showPassword ? 'text' : 'password';
  }
  
  async onSubmit() {
    this.apiService
    .fetch(this.AuthService,  'SAVE', this.loginForm.value)
    .subscribe(({ payload = {}, error='', message='', success='', isSuccess=false }) => {
console.log(isSuccess)
      Swal.fire({
        title: isSuccess ?  'Success!'  : error,
        text: isSuccess ? success : message,
        icon: isSuccess ? 'success' : 'warning',
        confirmButtonText: 'OK'
      });
      if(isSuccess){
        localStorage.setItem("auth", JSON.stringify(payload))
        this.router.navigate(['/dashboard']);
      }

    });  
    
  }
  
  get email (){
    return this.loginForm.controls['email'];
  }

}


  import { Injectable } from '@angular/core';

  @Injectable({
    providedIn: 'root',
  })
  export class AuthService {
    private loggedInStatus = JSON.parse(localStorage.getItem('loggedIn') || 'false');
  
    login(email: string, password: string): Promise<boolean> {
      return new Promise((resolve) => {
        const response = {
          _id: '1',
          fullName: { fname: 'Rowel', lname: 'Tangalin' },
          isSuccess: true,
        };
        const {isSuccess = false } = response;

        if (isSuccess) {
          this.setLoggedIn(true); 
          localStorage.setItem('userFullName', JSON.stringify(response.fullName)); 
          resolve(true);
        }
        // if (email === 'test@example.com' && password === 'password') {
        //   if (response.isSuccess) {
        //     this.setLoggedIn(true);
        //     localStorage.setItem('userFullName', JSON.stringify(response.fullName));
        //     resolve(true);
        //   } else {
        //     resolve(false);
        //   }
        // } else {
        //   resolve(false);
        // }
      });
    }
  
    setLoggedIn(value: boolean) {
      this.loggedInStatus = value;
      localStorage.setItem('loggedIn', value ? 'true' : 'false');
    }
  
    isLoggedIn(): boolean {
      return this.loggedInStatus;
    }
  }
  

  // async BROWSE(): Promise<any> {
  //   try {
  //     const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     const data = await response.json();
  //     return data;
  //   } catch (error) {
  //     console.error('Fetch error:', error);
  //     return null;
  //   }
  // }

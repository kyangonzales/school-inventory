import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../envinronment';

interface User {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {


  constructor(private http: HttpClient) {}

  SAVE(user: User): Observable<any> {
    return this.http.post<any>(`${environment.ENDPOINT}/auth/login`, user).pipe(
      catchError((error) => {
        console.error('Error fetching users', error);
        return 'no fetched';
      })
    );
  }

  info(){
    const fakeStorage=localStorage.getItem('auth')
    if(fakeStorage){
      return JSON.parse(fakeStorage)
    }
  }

    isLoggedIn(): boolean {
      return localStorage.getItem("auth")?true:false
    }
 
}

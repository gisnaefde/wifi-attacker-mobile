import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://172.15.3.99/api';
  // private apiUrl = 'https://gerry.intek.co.id/api';

  constructor(private http: HttpClient) { }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (token){
      return true
    }else{
      return false
    }
  }

  login(email: string, password: string) {
    const body = { email, password };
    return this.http.post(`${this.apiUrl}/login`, body);
  }
}

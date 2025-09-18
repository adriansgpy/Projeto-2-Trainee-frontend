import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }  

  login(username: string, password: string): Observable<any> {
    if(username === 'teste' && password === '123456'){
      return of({ token: 'fake-jwt-token' });
    } else {
      return of({ error: 'Usuário ou senha incorretos' });
    }
  }

  register(username: string, password: string): Observable<any> {
    return of({ success: true });
  }

  logout() {
    localStorage.removeItem('auth_token');
  }
}


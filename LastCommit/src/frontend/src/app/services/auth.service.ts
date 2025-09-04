import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    // Exemplo fake, substitua pelo backend
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

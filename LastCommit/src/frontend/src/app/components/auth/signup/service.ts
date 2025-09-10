// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioModel } from './usuarioModel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000'; 

  constructor(private http: HttpClient) {}

  signup(usuario: UsuarioModel): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/auth/signup`, usuario);
  }
}

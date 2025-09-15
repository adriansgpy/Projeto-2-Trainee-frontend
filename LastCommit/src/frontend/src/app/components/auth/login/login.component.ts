import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule]
})
export class LoginComponent {
  usuario: string = '';
  senha: string = '';
  resposta: string | null = null;
  erro: string | null = null;

  private apiUrl = 'http://127.0.0.1:8000/auth'; 

  constructor(private http: HttpClient, private router: Router) {}

  gotosignup() {
    this.router.navigate(['/signup']);
  }

  fazerLogin() {
    this.http.post(`${this.apiUrl}/login`, {
      nomeUsuario: this.usuario,
      senha: this.senha,
    }).subscribe({
      next: (res: any) => {
        this.resposta = 'Login realizado com sucesso!';
        this.erro = null;
        console.log('api:', res);

        if (res.access_token) {
          localStorage.setItem('token', res.access_token);
        }

        this.router.navigate(['/homepage']);
      },
      error: (err) => {
        this.erro = 'Deu ruim';
        this.resposta = null;
        console.log('usuario:', this.usuario)
        console.log('usuario:', this.senha)

        console.error('Erro:', err);
      }
    });
  }
}

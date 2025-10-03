import { Component, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit { // Adicionado 'implements OnInit'
  usuario: string = '';
  senha: string = '';
  resposta: string | null = null;
  erro: string | null = null;

  // Modais
  showInvalidCredentialsModal = false;
  showEmptyFieldsModal = false;

  private apiUrl = 'http://127.0.0.1:8000/auth'; 

  constructor(
    private http: HttpClient,
    private router: Router,

  ) {}
  
  ngOnInit() {
 

  // Login automático se houver token
  const token = localStorage.getItem('token');
  if (token) {
    this.router.navigate(['/homepage']); 
    return; 
  }

  const fullscreenHandler = () => {
    this.enterFullscreen();
    document.removeEventListener('click', fullscreenHandler);
  };
  document.addEventListener('click', fullscreenHandler);
  }


  enterFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if ((elem as any).webkitRequestFullscreen) { 
      (elem as any).webkitRequestFullscreen();
    } else if ((elem as any).msRequestFullscreen) {
      (elem as any).msRequestFullscreen();
    }
  }

  gotosignup() {
    this.router.navigate(['/signup']);
  }

  closeInvalidCredentialsModal() {
    this.showInvalidCredentialsModal = false;
  }

  closeEmptyFieldsModal() {
    this.showEmptyFieldsModal = false;
  }

  fazerLogin() {
    // 1. Validação de campos obrigatórios
    if (!this.usuario || !this.senha) {
      this.showEmptyFieldsModal = true;
      return;
    }

    // 2. Chamada de API para login
    this.http.post(`${this.apiUrl}/login`, {
      nomeUsuario: this.usuario,
      senha: this.senha,
    }).subscribe({
      next: (res: any) => {
        this.resposta = 'Login realizado com sucesso!';
        this.erro = null;

        if (res.access_token) {
          localStorage.setItem('token', res.access_token);
        }

        this.router.navigate(['/homepage']);
      },
      error: (err) => {
        console.error('Erro ao tentar login:', err);

        // Se o backend retornar 401 ou 400 (credenciais inválidas), mostra modal específico
        if (err.status === 401 || err.status === 400) {
          this.showInvalidCredentialsModal = true;
        } else {
          this.erro = 'Ocorreu um erro ao tentar fazer login.';
        }

        this.resposta = null;
      }
    });
  }
}
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AudioService } from '../../../services/soundtrack.service';

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

  // Modais
  showInvalidCredentialsModal = false;
  showEmptyFieldsModal = false;

  private apiUrl = 'http://127.0.0.1:8000/auth'; 

  constructor(
    private http: HttpClient,
    private router: Router,
    private audioService: AudioService
  ) {}
  
  ngOnInit() {
    this.audioService.playMusic('assets/soundtrack/bms.mp3');

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
    } else if ((elem as any).webkitRequestFullscreen) { /* Safari */
      (elem as any).webkitRequestFullscreen();
    } else if ((elem as any).msRequestFullscreen) { /* IE11 */
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
    // Verifica campos obrigatórios
    if (!this.usuario || !this.senha) {
      this.showEmptyFieldsModal = true;
      return;
    }

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

        this.audioService.stopMusic();
        this.router.navigate(['/homepage']);
      },
      error: (err) => {
        console.error('Erro:', err);

        // Se o backend retornou 401 ou 400, mostra modal de credenciais inválidas
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

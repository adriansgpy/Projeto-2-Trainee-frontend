// signup.component.ts
import { Component, Injectable } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './service';
import { UsuarioModel } from './UsuarioModel';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class SignupComponent {
  nome = '';
  usuario = '';
  senha = '';
  confirmarSenha = '';
  resposta: string | null = null;
  erro: string | null = null;

  // Modais
  showUserExistsModal = false;
  showSuccessModal = false;
  isSubmitting = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
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

  gotologin() {
    this.router.navigate(['/login']);
  }

  registrar(): void {
    const nomeRegex = /^[A-Za-záàâãéèêíóôõúçÁÀÂÃÉÈÍÓÔÕÚÇ\s'-]+$/;
    const loginRegex = /^[a-z0-9_]{4,20}$/;
    const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Validações
    /*if (!this.nome || !this.usuario || !this.senha || !this.confirmarSenha) {
      this.erro = 'Por favor, preencha todos os campos obrigatórios.';
      this.resposta = null;
      return;
    }

    if (this.senha !== this.confirmarSenha) {
      this.erro = 'As senhas não coincidem.';
      this.resposta = null;
      return;
    }

    if (!nomeRegex.test(this.nome.trim())) {
      this.erro = 'Nome inválido. Use apenas letras (com acentos), espaços, hífen e apóstrofo.';
      this.resposta = null;
      return;
    }

    if (!loginRegex.test(this.usuario)) {
      this.erro = 'Login inválido. Use apenas letras minúsculas, números, underline (_) e entre 4 e 20 caracteres.';
      this.resposta = null;
      return;
    }

    if (!senhaRegex.test(this.senha)) {
      this.erro = 'A senha deve ter no mínimo 8 caracteres, contendo 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial (@ $ ! % * ? &).';
      this.resposta = null;
      return;
    }*/

    this.erro = null;
    this.resposta = null;
    this.isSubmitting = true;

    const usuarioModel = new UsuarioModel(this.nome, this.usuario, this.senha);

    this.authService.signup(usuarioModel).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.resposta = res.msg;
        this.showSuccessModal = true; // Mostra modal de sucesso
      },
      error: (err) => {
        this.isSubmitting = false;
        if (err.error?.detail === 'Usuário já existe') {
          this.showUserExistsModal = true; // Mostra modal de usuário existente
        } else {
          this.erro = err.error?.detail || 'Erro ao cadastrar. Tente novamente.';
        }
      }
    });
  }

  // Fechar modal de usuário existente
  closeUserExistsModal() {
    this.showUserExistsModal = false;
  }

  // Fechar modal de sucesso e ir para login
  goToLogin() {
    this.showSuccessModal = false;
    this.router.navigate(['/login']);
  }
}

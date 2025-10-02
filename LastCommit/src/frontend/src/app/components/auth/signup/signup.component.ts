import { Component, Injectable, OnInit } from '@angular/core';
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
export class SignupComponent implements OnInit {
  nome = '';
  usuario = '';
  senha = '';
  confirmarSenha = '';
  resposta: string | null = null;
  erro: string | null = null; // Mensagem de erro para o modal genérico

  // Modais de estado
  showUserExistsModal = false;
  showSuccessModal = false;
  showGenericErrorModal = false; // Novo modal para erros de validação e erros gerais da API
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

  // Função auxiliar para mostrar o modal de erro genérico
  private showValidationErrorMessage(message: string) {
    this.erro = message;
    this.showGenericErrorModal = true;
    this.resposta = null;
  }

  registrar(): void {
    const nomeRegex = /^[A-Za-záàâãéèêíóôõúçÁÀÂÃÉÈÍÓÔÕÚÇ\s'-]+$/;
    const loginRegex = /^[a-z0-9_]{4,20}$/;
    const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Limpa status de erro/resposta antes de começar
    this.erro = null;
    this.resposta = null;
    this.showGenericErrorModal = false;
    this.showUserExistsModal = false;

    // 1. Validações de Campos
    /*if (!this.nome || !this.usuario || !this.senha || !this.confirmarSenha) {
      this.showValidationErrorMessage('Por favor, preencha todos os campos obrigatórios para continuar.');
      return;
    }

    if (this.senha !== this.confirmarSenha) {
      this.showValidationErrorMessage('As senhas não coincidem. Por favor, verifique.');
      return;
    }

    if (!nomeRegex.test(this.nome.trim())) {
      this.showValidationErrorMessage('Nome inválido. Use apenas letras (com acentos), espaços, hífen e apóstrofo.');
      return;
    }

    if (!loginRegex.test(this.usuario)) {
      this.showValidationErrorMessage('Login inválido. Use apenas letras minúsculas, números, underline (_), e tenha entre 4 e 20 caracteres.');
      return;
    }

    if (!senhaRegex.test(this.senha)) {
      this.showValidationErrorMessage('A senha deve ter no mínimo 8 caracteres, contendo pelo menos 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial (@ $ ! % * ? &).');
      return;
    }*/

    // Fim das validações, inicia submissão
    this.isSubmitting = true;

    const usuarioModel = new UsuarioModel(this.nome, this.usuario, this.senha);

    this.authService.signup(usuarioModel).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        this.resposta = res.msg || "Usuário registrado com sucesso!";
        this.showSuccessModal = true; // Mostra modal de sucesso
      },
      error: (err) => {
        this.isSubmitting = false;

        if (err.error?.detail === 'Usuário já existe') {
          this.showUserExistsModal = true; // Mostra modal de usuário existente
        } else {
          // Mostra erro genérico
          const errorMessage = err.error?.detail || 'Erro ao cadastrar. Tente novamente.';
          this.showValidationErrorMessage(errorMessage);
        }
      }
    });
  }

  // Fechar modal de usuário existente
  closeUserExistsModal() {
    this.showUserExistsModal = false;
  }

  // Fechar modal de erro genérico
  closeGenericErrorModal() {
    this.showGenericErrorModal = false;
    this.erro = null;
  }

  // Fechar modal de sucesso e ir para login
  goToLogin() {
    this.showSuccessModal = false;
    this.router.navigate(['/login']);
  }
}

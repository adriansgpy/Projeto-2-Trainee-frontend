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
  erro: string | null = null; 

  showUserExistsModal = false;
  showSuccessModal = false;
  showGenericErrorModal = false; 
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

  private showValidationErrorMessage(message: string) {
    this.erro = message;
    this.showGenericErrorModal = true;
    this.resposta = null;
  }

  registrar(): void {
    const nomeRegex = /^[A-Za-záàâãéèêíóôõúçÁÀÂÃÉÈÍÓÔÕÚÇ\s'-]+$/;
    const loginRegex = /^[a-zA-Z0-9]+$/;
    const senhaRegex = /^.{6,}$/;


    this.erro = null;
    this.resposta = null;
    this.showGenericErrorModal = false;
    this.showUserExistsModal = false;

    if (!this.nome || !this.usuario || !this.senha || !this.confirmarSenha) {
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
      this.showValidationErrorMessage('Login inválido. Use apenas letras e números.');
      return;
    }

    if (!senhaRegex.test(this.senha)) {
      this.showValidationErrorMessage('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    // Fim das validações, inicia submissão
    this.isSubmitting = true;

    const usuarioModel = new UsuarioModel(this.nome, this.usuario, this.senha);

    this.authService.signup(usuarioModel).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        this.resposta = res.msg || "Usuário registrado com sucesso!";
        this.showSuccessModal = true; 
      },
      error: (err) => {
        this.isSubmitting = false;

        if (err.error?.detail === 'Usuário já existe') {
          this.showUserExistsModal = true; 
        } else {
          const errorMessage = err.error?.detail || 'Erro ao cadastrar. Tente novamente.';
          this.showValidationErrorMessage(errorMessage);
        }
      }
    });
  }

  closeUserExistsModal() {
    this.showUserExistsModal = false;
  }

  closeGenericErrorModal() {
    this.showGenericErrorModal = false;
    this.erro = null;
  }

  goToLogin() {
    this.showSuccessModal = false;
    this.router.navigate(['/login']);
  }
}

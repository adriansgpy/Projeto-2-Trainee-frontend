import { Component, Injectable } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './service';
import { UsuarioModel } from './usuarioModel';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule]
})

export class SignupComponent {
  nome = '';
  usuario = '';
  senha = '';
  confirmarSenha = '';
  resposta: string | null = null;
  erro: string | null = null;

  constructor(private router: Router, private authService : AuthService) {}

  gotologin(){
    this.router.navigate(['/login'])
  }
  
  ngOnInit() {
     const fullscreenHandler = () => {
      this.enterFullscreen();
      // Remove o listener para não chamar de novo
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

  registrar(): void {
  const nomeRegex = /^[A-Za-záàâãéèêíóôõúçÁÀÂÃÉÈÍÓÔÕÚÇ\s'-]+$/;
  const loginRegex = /^[a-z0-9_]{4,20}$/; 
  const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!this.nome || !this.usuario || !this.senha || !this.confirmarSenha) {
    this.showErrorModal('Por favor, preencha todos os campos obrigatórios para continuar.');
    return; 
  }
  
  if (this.senha !== this.confirmarSenha) {
    this.showErrorModal('As senhas não coincidem. Por favor, verifique.');
    return; 
  }

  if (!nomeRegex.test(this.nome.trim())) { 
    this.showErrorModal('Nome inválido. Use apenas letras (com acentos), espaços, hífen e apóstrofo.');
    return;
  }

  if (!loginRegex.test(this.usuario)) {
    this.showErrorModal('Login inválido. Use apenas letras minúsculas, números, underline (_), e tenha entre 4 e 20 caracteres.');
    return;
  }

  if (!senhaRegex.test(this.senha)) {
    this.showErrorModal('A senha deve ter no mínimo 8 caracteres, contendo pelo menos 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial (@ $ ! % * ? &).');
    return;
  }

  let usuarioModel = new UsuarioModel(this.nome, this.usuario, this.senha);

  this.authService.signup(usuarioModel).subscribe({
    next: () => {
      this.resposta = "Usuário registrado com sucesso!";
      this.erro = null;
      this.closeErrorModal(); // caso estivesse aberto
    },
    error: (err) => {
      // pega a mensagem vinda do backend (FastAPI retorna detail)
      const mensagem = err.error?.detail || 'Erro ao cadastrar. Tente novamente.';
      this.showErrorModal(mensagem);
    }
  });
}
  

showErrorModal(mensagem: string) {
  this.erro = mensagem;
  const modal = document.getElementById("errorModal");
  if (modal) modal.style.display = "block";
}

closeErrorModal() {
  const modal = document.getElementById("errorModal");
  if (modal) modal.style.display = "none";
}


}
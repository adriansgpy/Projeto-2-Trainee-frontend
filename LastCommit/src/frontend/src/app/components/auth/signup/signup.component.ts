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
  } else if ((elem as any).webkitRequestFullscreen) { /* Safari */
    (elem as any).webkitRequestFullscreen();
  } else if ((elem as any).msRequestFullscreen) { /* IE11 */
    (elem as any).msRequestFullscreen();
  }
}

  // Dentro da classe SignupComponent
// Lembre-se de que as Regex podem ser definidas como propriedades da classe ou constantes

// No arquivo signup.component.ts (mantido como a versão anterior com validações)

registrar() : void{

    // ... (Regex definitions remain here) ...
    const nomeRegex = /^[A-Za-záàâãéèêíóôõúçÁÀÂÃÉÈÍÓÔÕÚÇ\s'-]+$/;
    const loginRegex = /^[a-z0-9_]{4,20}$/; 
    const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


    // 1. VERIFICAÇÃO DE CAMPOS VAZIOS (Abre o modal customizado se falhar)
    if (!this.nome || !this.usuario || !this.senha || !this.confirmarSenha) {
        this.erro = 'Por favor, preencha todos os campos obrigatórios para continuar.';
        this.resposta = null;
        return; 
    }
    
    // 2. VALIDAÇÃO DE REGEX E CONFIRMAÇÃO DE SENHA (Abre o modal customizado se falhar)
    if (this.senha !== this.confirmarSenha) {
      this.erro = 'As senhas não coincidem. Por favor, verifique.';
      this.resposta = null;
      return; 
    }

    if (!nomeRegex.test(this.nome.trim())) { 
        this.erro = 'Nome inválido. Use apenas letras (com acentos), espaços, hífen e apóstrofo.';
        this.resposta = null;
        return;
    }
    // ... (resto das validações de login e senha) ...

    if (!loginRegex.test(this.usuario)) {
        this.erro = 'Login inválido. Use apenas letras minúsculas, números, underline (_), e tenha entre 4 e 20 caracteres.';
        this.resposta = null;
        return;
    }

    if (!senhaRegex.test(this.senha)) {
        this.erro = 'A senha deve ter no mínimo 8 caracteres, contendo pelo menos 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial (@ $ ! % * ? &).';
        this.resposta = null;
        return;
    }


    // 3. CHAMADA AO SERVIÇO (Se tudo passou)
    this.erro = null; // Garante que o modal desapareça
    this.resposta = null;
    
    let usuarioModel = new UsuarioModel(this.nome, this.usuario, this.senha);

    this.authService.signup(usuarioModel).subscribe ({
        // ... (lógica de next/error) ...
        error: (err)=>{
            // Esta mensagem de erro do servidor TAMBÉM abrirá o modal customizado!
            this.erro = err.error?.message || 'Erro ao cadastrar. Tente novamente.'; 
            this.resposta = null;
        } 
    }); 
}
}
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

  private apiUrl = 'http://127.0.0.1:8000/auth'; 

  constructor(
    private http: HttpClient,
    private router: Router,
    private audioService: AudioService


  ) {}
  
  ngOnInit() {
    this.audioService.playMusic('assets/soundtrack/bms.mp3')  
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


  gotosignup() {
    this.router.navigate(['/signup']);
  }

fazerLogin() {
  // Regex: usuário só letras/números, senha mínimo 6 caracteres
  const usuarioRegex = /^[a-zA-Z0-9._-]{3,20}$/;
  const senhaRegex = /^.{6,}$/;

  if (!usuarioRegex.test(this.usuario)) {
    this.showErrorModal("O login deve ter entre 3 e 20 caracteres e não pode conter símbolos inválidos.");
    return;
  }

  if (!senhaRegex.test(this.senha)) {
    this.showErrorModal("A senha deve ter no mínimo 6 caracteres.");
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
    error: () => {
      this.showErrorModal("Usuário ou senha incorretos. Tente novamente.");
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

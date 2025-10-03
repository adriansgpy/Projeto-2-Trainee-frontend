// imports já existentes...
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [CommonModule, FormsModule], // <-- IMPORTA O FormsModule AQUI

})
export class ProfileComponent implements OnInit {
  nome = '';
  usuario = '';
  mostrarSenha = false;
  showSuccessModal: boolean = false;
  currentPasswordError: string = '';
  newPasswordError: string = '';
  currentPassword = '';
  newPassword = '';
  showChangePasswordModal = false;
  showCurrentPassword = false;
  showNewPassword = false;

  private apiUrl = 'http://127.0.0.1:8000/auth';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.http.get(`${this.apiUrl}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => {
        this.nome = res.nome;
        this.usuario = res.usuario;
      },
      error: () => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    });
  }


  
  closeSuccessModal() {
    this.showSuccessModal = false;
  }
  // abrir modal de trocar senha
  openChangePassword() {
    this.currentPassword = '';
    this.newPassword = '';
    this.showChangePasswordModal = true;
  }

  closeChangePassword() {
    this.showChangePasswordModal = false;
  }

  toggleShowCurrent() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleShowNew() {
    this.showNewPassword = !this.showNewPassword;
  }

  submitChangePassword() {
  const senhaRegex = /^.{6,}$/;

  // Limpa erros
  this.currentPasswordError = '';
  this.newPasswordError = '';
  let hasError = false;

  if (!this.currentPassword) { this.currentPasswordError = 'Digite a senha atual.'; hasError = true; }
  if (!this.newPassword) { this.newPasswordError = 'Digite a nova senha.'; hasError = true; }
  else if (!senhaRegex.test(this.newPassword)) { this.newPasswordError = 'A nova senha deve ter pelo menos 6 caracteres.'; hasError = true; }
  if (hasError) return;

  const token = localStorage.getItem('token'); // pega o token armazenado no login

  this.http.post(
    'http://127.0.0.1:8000/auth/change-password',
    {
      current_password: this.currentPassword,
      new_password: this.newPassword
    },
    {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    }
  ).subscribe({
    next: (res: any) => {
      this.showSuccessModal = true;
      this.closeChangePassword();
      this.currentPassword = '';
      this.newPassword = '';
    },
    error: (err) => {
      if (err.error?.detail?.includes("atual")) {
        this.currentPasswordError = err.error.detail;
      } else if (err.error?.detail?.includes("6 caracteres")) {
        this.newPasswordError = err.error.detail;
      } else {
        alert("Erro ao alterar senha. Tente novamente.");
      }
    }
  });
}



}

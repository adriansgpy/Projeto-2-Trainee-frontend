import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule]
})
export class SignupComponent {
  username = '';
  password = '';
  confirmPassword = '';
  isGlitching = false; 

  constructor(private router: Router) {}
  gotologin(){
    this.router.navigate(['/login'])
  }
 
  register() {
    if (this.password !== this.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    alert('Usuário registrado com sucesso!');
    this.router.navigate(['/login']);
  }

  
}

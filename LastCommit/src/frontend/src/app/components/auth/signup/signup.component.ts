import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SignupComponent implements OnInit {
  username = '';
  password = '';
  confirmPassword = '';
  isGlitching = false; // começa amigável

  constructor(private router: Router) {}

  ngOnInit() {
    this.startGlitchLoop();
  }
  

  back(){
    this.router.navigate(['/login']); 
  }

  register() {
    if (this.password !== this.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    alert('Usuário registrado com sucesso!');
    this.router.navigate(['/login']);
  }

  startGlitchLoop() {
    const glitchCycle = () => {
      // espera entre 5 e 10 segundos para iniciar glitch
      const delay = 3000 + Math.random() * 3000;
      setTimeout(() => {
        this.isGlitching = true; // ativa amaldiçoado
        // glitch dura entre 1 e 3 segundos
        setTimeout(() => {
          this.isGlitching = false; // volta ao normal
          glitchCycle(); // reinicia ciclo
        }, 500 + Math.random() * 1000);
      }, delay);
    };
    glitchCycle();
  }
}

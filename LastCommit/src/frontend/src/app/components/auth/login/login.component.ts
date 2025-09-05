import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule] 
})
export class LoginComponent implements AfterViewInit{
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngAfterViewInit() {
    this.animateGhostMessages();
    this.startGlitch();
  }

  //frases aleatórias na tela
  animateGhostMessages() {
  const messages = document.querySelectorAll('.ghost-msg');

  const animate = () => {
    messages.forEach(msg => {
      const msgEl = msg as HTMLElement;
      const maxX = window.innerWidth - msgEl.offsetWidth;
      const maxY = window.innerHeight - msgEl.offsetHeight;

      const x = Math.random() * maxX;
      const y = Math.random() * maxY;

      msgEl.style.left = `${x}px`;
      msgEl.style.top = `${y}px`;
    });

    setTimeout(() => requestAnimationFrame(animate), 2000 + Math.random() * 1000);
  };

  requestAnimationFrame(animate);
}

  // Glitch da tela
  startGlitch() {
    const glitch = document.querySelector('.tv-glitch') as HTMLElement;

    const loop = () => {
      const delay = 5000 + Math.random() * 5000; 
      setTimeout(() => {
        glitch.style.opacity = '1';
        glitch.style.animation = 'glitch-flicker 0.5s linear';
        setTimeout(() => {
          glitch.style.opacity = '0';
          glitch.style.animation = '';
        }, 500 + Math.random() * 500); 
        loop();
      }, delay);
    };

    loop();
  }


  createAccount() {
 
    this.router.navigate(['/signup']); 
  // abrir tela de cadastro
  }

}

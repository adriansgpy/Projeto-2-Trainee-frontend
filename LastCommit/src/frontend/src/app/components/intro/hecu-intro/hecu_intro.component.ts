import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { audioServiceHecuIntro } from '../../../services/audioServiceHecuIntro';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-campanha',
  templateUrl: './hecu_intro.component.html',
  styleUrls: ['./hecu_intro.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class HecuIntroComponent implements OnInit, AfterViewInit, OnDestroy {
fullText: string = `DATA: 13 de Novembro de 200X
HORA: 06:47 AM
LOCAL: Base Avançada H.E.C.U., Novo México

Soldados, atenção. O governo identificou uma situação crítica dentro da instalação Black Mesa. Um experimento interdimensional falhou, liberando **entidades desconhecidas e perigosas** dentro do laboratório. Cientistas e civis ainda estão presentes no local, mas **não há garantias de sobrevivência**.

Sua missão é **clara e prioritária**: eliminar todas as ameaças, humanas ou alienígenas, e **impedir qualquer registro do incidente**. Nenhum resgate será enviado. Nenhuma evacuação será realizada. O governo deseja **total sigilo**.

As forças H.E.C.U. devem avançar rapidamente, neutralizando qualquer resistência e assegurando que a instalação não represente risco externo. Helicópteros estarão disponíveis para inserção e extração, mas **a prioridade máxima é a neutralização completa de qualquer sobrevivente ou criatura hostil**.

Capitão Hughes, você e sua equipe sabem o que fazer. Cada passo, cada disparo, cada decisão será vital. **Nada pode falhar.**`;
  displayedText: string = '';
  showTitle: boolean = true;
  showContinue: boolean = false;
  private index: number = 0;
  private typingSpeed: number = 10;
  private typingTimeout: any;
  private imageInterval: any;

  images: string[] = [
    'hecu1.png',
    'hecu2.png',
    'hecu3.png'
  ];
  
  lights: any[] = [];
  
  currentImageIndex: number = 0;

  constructor(private router: Router, private audioService: audioServiceHecuIntro) {}

  ngOnInit() {
    setTimeout(() => {
      this.showTitle = false;
      setTimeout(() => {
        this.typeText();
        this.imageInterval = setInterval(() => this.nextImage(), 5000);
        this.audioService.playAudios([
          'assets/soundtrack/militray_convo.mp3',
          'assets/soundtrack/hecu_intro.mp3'
        ], 2000);
      }, 500);
    }, 3000);
  }

  ngAfterViewInit() {
    this.createParticles(50);
    this.createLights(10);
  }

  ngOnDestroy() {
    if (this.imageInterval) {
      clearInterval(this.imageInterval);
    }
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
  }

  createLights(count: number) {
    const container = document.querySelector('.light-container');
    if (container) {
      for (let i = 0; i < count; i++) {
        const light = document.createElement('div');
        light.className = 'light';
        light.style.left = `${Math.random() * 100}vw`;
        light.style.top = `${Math.random() * 100}vh`;
        light.style.animationDuration = `${Math.random() * 2 + 1}s`;
        container.appendChild(light);
      }
    }
  }

  typeText() {
    if (this.index < this.fullText.length) {
      this.displayedText += this.fullText[this.index];
      this.index++;
      this.typingTimeout = setTimeout(() => this.typeText(), this.typingSpeed);
    } else {
      this.showContinue = true;
      setTimeout(() => {
        const btn = document.querySelector('.btn-continue');
        if (btn) {
          btn.classList.add('show');
        }
      }, 200);
    }
  }

  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }

  continuar() {
    this.router.navigate(['/game']);
  }

  createParticles(count: number) {
    const container = document.querySelector('.particles');
    if (container) {
      for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.animationDelay = Math.random() * 4 + 's';
        container.appendChild(p);
      }
    }
  }
}
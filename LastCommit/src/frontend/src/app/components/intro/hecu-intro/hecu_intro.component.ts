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
  fullText: string = "Dia 13 de Novembro de 200X, 06:47 AM. Base Avançada da H.E.C.U., deserto do Novo México. A neblina da madrugada cobria a instalação de Black Mesa, mas a movimentação era intensa. Soldados equipavam seus coletes, verificavam armamentos e revisavam mapas digitais da instalação. O desastre interdimensional havia deixado rastros perigosos dentro do laboratório. O governo não queria sobreviventes, testemunhas ou qualquer registro do que havia acontecido. O pelotão H.E.C.U foi enviado para exterminar **tudo e todos** que cruzassem seu caminho — cientistas, alienígenas, civis, ninguém escaparia. O capitão Hughes reuniu a equipe: Nosso objetivo é claro: eliminar todas as ameaças. Não há resgate, não há evacuação. Cada ser vivo dentro de Black Mesa deve ser neutralizado. Entendido? Os soldados respiravam fundo. Cada passo, cada disparo, cada movimento estava cronometrado. Os helicópteros aguardavam nas plataformas, motores rugindo baixo. O frio da manhã misturava tensão e expectativa. De repente, a sirene do laboratório tocou. Era hora. A missão secreta das forças H.E.C.U começava. O destino da instalação dependia de sua eficiência letal. Nada poderia falhar.";
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
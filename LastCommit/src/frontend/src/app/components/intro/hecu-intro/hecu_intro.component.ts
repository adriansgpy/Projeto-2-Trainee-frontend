import { Component, OnInit, AfterViewInit, OnDestroy, Renderer2, ElementRef } from '@angular/core';
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
    'hecu3.png',
    'bmrf.png',
    'bmrf3.png',
    'bmrf5.png'
  ];

  currentImageIndex: number = 0;

  readonly NUM_LIGHTS = 60;
  readonly NUM_PARTICLES = 50;

  constructor(
    private router: Router,
    private audioService: audioServiceHecuIntro,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit() {
    
  this.startRandomImageCycle();

  setTimeout(() => {
    this.showTitle = false;
    setTimeout(() => {
      this.typeText();


      this.audioService.playAudios([
        'assets/soundtrack/militray_convo.mp3',
        'assets/soundtrack/hecu_intro.mp3'
      ], 2000);
    }, 0);
  }, 3000);
}

  ngAfterViewInit() {
    this.createParticles(this.NUM_PARTICLES);
    this.createLights(this.NUM_LIGHTS);
  }

  ngOnDestroy() {
    if (this.imageInterval) {
      clearInterval(this.imageInterval);
    }
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
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
        const btn = this.el.nativeElement.querySelector('.btn-continue');
        if (btn) {
          btn.classList.add('show');
        }
      }, 200);
    }
  }
private startRandomImageCycle() {
  this.imageInterval = setInterval(() => {
    let nextIndex = this.currentImageIndex;
    
    while (nextIndex === this.currentImageIndex) {
      nextIndex = Math.floor(Math.random() * this.images.length);
    }
    
    this.currentImageIndex = nextIndex;
  }, 2500);
}



  continuar() {
    this.router.navigate(['/game']);
  }

  private createLights(count: number) {
    const container = this.el.nativeElement.querySelector('.light-container');
    if (container) {
      for (let i = 0; i < count; i++) {
        const light = this.renderer.createElement('div');
        this.renderer.addClass(light, 'light');

        this.renderer.setStyle(light, 'left', Math.random() * 100 + 'vw');
        this.renderer.setStyle(light, 'height', 20 + Math.random() * 80 + 'px');
        const duration = (3 + Math.random() * 5).toFixed(2) + 's';
        const delay = (Math.random() * 5).toFixed(2) + 's';
        this.renderer.setStyle(light, '--animation-duration', duration);
        this.renderer.setStyle(light, 'animation-delay', delay);

        this.renderer.appendChild(container, light);
      }
    }
  }

  private createParticles(count: number) {
    const container = this.el.nativeElement.querySelector('.particles');
    if (container) {
      for (let i = 0; i < count; i++) {
        const particle = this.renderer.createElement('div');
        this.renderer.addClass(particle, 'particle');
        this.renderer.setStyle(particle, 'left', Math.random() * 100 + '%');
        this.renderer.setStyle(particle, 'top', Math.random() * 100 + '%');
        this.renderer.setStyle(particle, 'width', 2 + Math.random() * 5 + 'px');
        this.renderer.setStyle(particle, 'height', 2 + Math.random() * 5 + 'px');
        this.renderer.setStyle(particle, 'animation-delay', Math.random() * 4 + 's');

        this.renderer.appendChild(container, particle);
      }
    }
  }
}

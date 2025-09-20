import { Component, OnInit, AfterViewInit, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { audioServiceHecuIntro } from '../../../services/audioServiceHecuIntro';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blackmesa-intro',
  templateUrl: './cientista_intro.component.html',
  styleUrls: ['./cientista_intro.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class CientistaIntroComponent implements OnInit, AfterViewInit, OnDestroy {
  fullText: string = `DATA: 13 de Novembro de 200X
HORA: 06:47 AM
LOCAL: Instalação Black Mesa, Novo México

Gordon Freeman, você é o responsável pelo experimento que acabou de ser ativado. Uma falha crítica ocorreu, abrindo portais interdimensionais e liberando entidades desconhecidas dentro do laboratório.

Os cientistas estão em pânico. Alguns civis tentam escapar, mas o caminho está bloqueado. Sua missão é clara: sobreviver, coletar informações, e tentar conter o desastre antes que ele se torne irreversível.

Prepare-se, Gordon. Cada decisão será vital. Nada pode falhar.`;
  lights: any[] = [];
  displayedText: string = '';
  showTitle: boolean = true;
  showContinue: boolean = false;
  private index: number = 0;
  private typingSpeed: number = 10;
  private typingTimeout: any;
  private imageInterval: any;
  images: string[] = ['bm1.png', 'bm2.png', 'bm3.png'];
  currentImageIndex: number = 0;

  readonly NUM_LIGHTS = 50;
  readonly NUM_PARTICLES = 40;

  constructor(
    private router: Router,
    private audioService: audioServiceHecuIntro,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit() {
    this.currentImageIndex = Math.floor(Math.random() * this.images.length);
    this.startIntroSequence();
    this.createLights(30);
    setTimeout(() => {
      this.showTitle = false;
      setTimeout(() => {
        this.typeText();
        this.startRandomImageCycle();
        this.audioService.playAudios([
          'assets/soundtrack/blackmesa_intro.mp3'
        ], 2000);
      }, 0);
    }, 3000);
  }

  ngAfterViewInit() {
    this.createParticles(this.NUM_PARTICLES);
    this.createLights(this.NUM_LIGHTS);
  }

  ngOnDestroy() {
    if (this.imageInterval) clearInterval(this.imageInterval);
    if (this.typingTimeout) clearTimeout(this.typingTimeout);
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
        if (btn) btn.classList.add('show');
      }, 200);
    }
  }

  private startIntroSequence() {
    // Esconde o título após 3 segundos
        setTimeout(() => {
        this.showTitle = false;
        }, 3000); // 3000 milissegundos = 3 segundos
   }

  private startRandomImageCycle() {
    this.imageInterval = setInterval(() => {
      let nextIndex: number;
      do {
        nextIndex = Math.floor(Math.random() * this.images.length);
      } while (nextIndex === this.currentImageIndex);
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

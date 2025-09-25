import { Component, OnInit, AfterViewInit, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { audioServiceIntro } from '../../../services/audioServiceIntro';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blackmesa-intro',
  templateUrl: './cientista_intro.component.html',
  styleUrls: ['./cientista_intro.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class CientistaIntroComponent implements OnInit, AfterViewInit, OnDestroy {
  fullText  = `
  <h1>Black Mesa Research Facility</h1>
  <h2>Setor C – Materiais Anômalos</h2>
  Hoje, você foi designado para colaborar em um dos experimentos mais avançados já conduzidos na área de física de partículas. O objetivo é submeter uma amostra de cristal não identificado a um feixe de energia de alta intensidade. Sua tarefa é simples: inserir a amostra no espectrômetro rotacional e monitorar as leituras geradas pelos sensores. Vá e coloque a roupa de teste H.E.V para ficar protegido durante o experimento.
`;


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
    private audioService: audioServiceIntro,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

 ngOnInit() {
  this.currentImageIndex = Math.floor(Math.random() * this.images.length);
  this.startIntroSequence();
  this.createLights(30);
  this.audioService.playAudios([
        'assets/soundtrack/bms.mp3'
      ], 500);
  setTimeout(() => {
    this.showTitle = false;

    this.typeText();
    this.startRandomImageCycle();

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
    this.audioService.stopAll();
    this.router.navigate(['intro/HEV']);
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
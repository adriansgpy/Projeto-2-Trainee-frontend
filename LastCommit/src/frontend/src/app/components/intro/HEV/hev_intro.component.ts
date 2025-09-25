import { Component, OnInit, AfterViewInit, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { audioServiceIntro } from '../../../services/audioServiceIntro';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hev-intro',
  templateUrl: './hev_intro.component.html',
  styleUrls: ['./hev_intro.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class HevIntroComponent implements OnInit, AfterViewInit, OnDestroy {
  fullText: string[] = [
    `<h1>H.E.V</h1>`,
    `<h2>Vestiário</h2>`,
    `O Hazardous Environment Suit (H.E.V) é equipado com sistemas de proteção contra radiação, absorção de impacto, monitoração de sinais vitais e suprimento de energia para dispositivos integrados.`,
    `Possui uma bateria interna recarregável, sensores de nível de saúde e energia, e sistemas de alerta que indicam dano físico ou contaminação ambiental.`,
    `Lembre-se, enquanto a H.E.V estiver carregada você receberá menos dano.`
  ];

  displayedText: string = '';
  currentParagraph: number = 0;
  showTitle: boolean = true;
  showContinue: boolean = false;

  private typingSpeed: number = 15;
  private typingTimeout: any;
  private imageInterval: any;
  images: string[] = ['hev.png'];
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
      'assets/soundtrack/hev_intro.mp3'
    ], 500);

    setTimeout(() => {
      this.showTitle = false;
      this.typeNextParagraph();
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

  // ---------- Digitação por parágrafo ----------
  typeNextParagraph() {
    if (this.currentParagraph >= this.fullText.length) {
      this.showContinue = true;
      setTimeout(() => {
        const btn = this.el.nativeElement.querySelector('.btn-continue');
        if (btn) btn.classList.add('show');
      }, 200);
      return;
    }

    const chars = this.fullText[this.currentParagraph].split('');
    let idx = 0;

    const typeChar = () => {
      if (idx < chars.length) {
        this.displayedText += chars[idx];
        idx++;
        this.typingTimeout = setTimeout(typeChar, this.typingSpeed);
      } else {
        this.displayedText += '<br/>';
        this.currentParagraph++;
        this.typeNextParagraph();
      }
    };

    typeChar();
  }

  // ---------- Ciclo de imagens ----------
  private startIntroSequence() {
    setTimeout(() => {
      this.showTitle = false;
    }, 3000);
  }


  continuar() {
    this.audioService.stopAll();
    this.router.navigate(['/game']);
  }

  // ---------- Luzes ----------
  private createLights(count: number) {
    const container = this.el.nativeElement.querySelector('.light-container');
    if (!container) return;

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

  // ---------- Partículas ----------
  private createParticles(count: number) {
    const container = this.el.nativeElement.querySelector('.particles');
    if (!container) return;

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

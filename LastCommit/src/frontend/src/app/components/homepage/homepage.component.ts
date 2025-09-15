import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule, CommonModule]
})

export class HomepageComponent implements OnInit, OnDestroy {
  // O array de imagens deve ir aqui
  private backgroundImages = ['bmrf.png', 'bmrf3.png', 'bmrf4.png'];
  currentBackgroundImage = '';
  private imageInterval: any;

  constructor() { }

  ngOnInit(): void {
    // A lógica de iniciar a troca de imagens também deve ir aqui
    this.startImageRotation();
  }

  ngOnDestroy(): void {
    // E o timer deve ser limpo aqui
    clearInterval(this.imageInterval);
  }

  private startImageRotation(): void {
    let index = 0;
    this.currentBackgroundImage = this.backgroundImages[index];

    // Troca a imagem a cada 10 segundos
    this.imageInterval = setInterval(() => {
      index = (index + 1) % this.backgroundImages.length;
      this.currentBackgroundImage = this.backgroundImages[index];
    }, 10000);
  }
}

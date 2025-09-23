import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AudioService } from '../../services/soundtrack.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class HomepageComponent implements OnInit, OnDestroy {
  private backgroundImages = ['hev.png','bmrf.png', 'bmrf3.png', 'bmrf4.png', 'xen_bg.png', 'black_mesa_bg.jpg', 'black_mesa_bg2.jpg'];
  currentBackgroundImage = '';
  private imageInterval: any;

  constructor(private audioService : AudioService) { }

  ngOnInit(): void {
    this.startImageRotation();
    this.audioService.playMusic('assets/soundtrack/menu.mp3', true);
  }

  ngOnDestroy(): void {
    clearInterval(this.imageInterval);
  }

  private startImageRotation(): void {
    let index = 0;
    this.currentBackgroundImage = this.backgroundImages[index];

    this.imageInterval = setInterval(() => {
      index = (index + 1) % this.backgroundImages.length;
      this.currentBackgroundImage = this.backgroundImages[index];
    }, 5000);
  }
}

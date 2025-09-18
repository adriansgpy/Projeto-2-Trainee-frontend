import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule]
})

export class HomepageComponent implements OnInit, OnDestroy {
  private backgroundImages = ['bmrf.png', 'bmrf3.png', 'bmrf4.png'];
  currentBackgroundImage = '';
  private imageInterval: any;

  constructor() { }

  ngOnInit(): void {
    this.startImageRotation();
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
    }, 10000);
  }
}

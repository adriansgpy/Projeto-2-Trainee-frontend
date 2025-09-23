import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AudioService } from '../../services/soundtrack.service';
import { trigger, transition, style, animate, query, group } from '@angular/animations';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        query(':enter, :leave', style({ position: 'absolute', width: '100%', top: 0, left: 0 }), { optional: true }),
        group([
          query(':leave', [
            animate('400ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
          ], { optional: true }),
          query(':enter', [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ], { optional: true })
        ])
      ])
    ])
  ]
})
export class HomepageComponent implements OnInit, OnDestroy {
  private backgroundImages = ['hev.png','bmrf.png', 'bmrf3.png', 'bmrf4.png', 'xen_bg.png', 'black_mesa_bg.jpg', 'black_mesa_bg2.jpg'];
  currentBackgroundImage = '';
  private imageInterval: any;

  constructor(private audioService : AudioService) { }

  ngOnInit(): void {
    this.startImageRotation();
    this.audioService.playMusic('assets/soundtrack/menu.mp3', true)
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

  prepareRoute(outlet: RouterOutlet) {
  return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
}

}

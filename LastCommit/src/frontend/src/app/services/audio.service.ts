import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private clickSound = new Audio('assets/sounds/button_click.wav');
  private hoverSound = new Audio('assets/sounds/hover.mp3');

  constructor() {
    this.clickSound.volume = 0.6;
    this.hoverSound.volume = 0.4;
  }

  playClick() {
    this.clickSound.currentTime = 0; // reseta para evitar delay
    this.clickSound.play();
  }

  playHover() {
    this.hoverSound.currentTime = 0;
    this.hoverSound.play();
  }

  playCustom(path: string, volume: number = 0.6) {
    const audio = new Audio(path);
    audio.volume = volume;
    audio.play();
  }
}

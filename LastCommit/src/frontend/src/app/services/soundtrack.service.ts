import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio: HTMLAudioElement | null = null;

  playMusic(src: string, loop: boolean = true) {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }

    this.audio = new Audio(src);
    this.audio.loop = loop;
    this.audio.volume = 1; // volume inicial (0 a 1)
    this.audio.play().catch(err => console.warn('Erro ao tocar música:', err));
  }

  stopMusic() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
  }

  pauseMusic() {
    if (this.audio) {
      this.audio.pause();
    }
  }

  resumeMusic() {
    if (this.audio) {
      this.audio.play().catch(err => console.warn('Erro ao retomar música:', err));
    }
  }
}

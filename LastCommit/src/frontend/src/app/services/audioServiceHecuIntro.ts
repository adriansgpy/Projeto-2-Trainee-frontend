import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class audioServiceHecuIntro {
  private audioElements: HTMLAudioElement[] = [];

  constructor() {}

  // Toca múltiplos áudios simultaneamente
  playAudios(urls: string[], delay: number = 0) {
    setTimeout(() => {
      urls.forEach(url => {
        const audio = new Audio(url);
        audio.volume = 0.6; // ajuste conforme necessário
        audio.play().catch(err => console.error('Erro ao tocar áudio:', err));
        this.audioElements.push(audio);
      });
    }, delay);
  }

  // Para todos os áudios
  stopAll() {
    this.audioElements.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    this.audioElements = [];
  }

  // Para um áudio específico
  stopAudio(url: string) {
    const index = this.audioElements.findIndex(a => a.src.includes(url));
    if (index >= 0) {
      this.audioElements[index].pause();
      this.audioElements[index].currentTime = 0;
      this.audioElements.splice(index, 1);
    }
  }
}

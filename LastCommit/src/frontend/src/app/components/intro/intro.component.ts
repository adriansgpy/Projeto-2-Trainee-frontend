import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
})
export class IntroComponent implements AfterViewInit {

  private textLines: string[] = [
    "Bem-vindo à ToyCorp!",
    "Você foi contratado como programador de máquinas de montagem.",
    "Seu trabalho será garantir que os robôs criem brinquedos com precisão e eficiência...",
    "Prepare-se para entrar na fábrica e iniciar sua jornada!"
  ];

  private typingSpeed: number = 50; 

  ngAfterViewInit(): void {
    this.typeText(this.textLines, 'introText', 0, 0);
  }

  private typeText(lines: string[], elementId: string, lineIndex: number, charIndex: number) {
    const pre = document.getElementById(elementId);
    if (!pre) return;

    if (lineIndex < lines.length) {
      const line = lines[lineIndex];
      if (charIndex < line.length) {
        pre.textContent += line.charAt(charIndex);
        setTimeout(() => this.typeText(lines, elementId, lineIndex, charIndex + 1), this.typingSpeed);
      } else {
        pre.textContent += '\n';
        setTimeout(() => this.typeText(lines, elementId, lineIndex + 1, 0), this.typingSpeed);
      }
    }
  }
}

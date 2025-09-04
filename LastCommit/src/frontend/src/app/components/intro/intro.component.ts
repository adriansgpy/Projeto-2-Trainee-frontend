
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

  private darkLines: string[] = [
    "ToyCorp guarda segredos que nunca deveriam ser descobertos...",
    "Algumas máquinas não produzem brinquedos... produzem algo mais.",
    "Funcionários que perguntam demais desaparecem misteriosamente.",
    "O sorriso dos brinquedos esconde olhos que observam você..."
  ];

  private typingSpeed: number = 50; 

  ngAfterViewInit(): void {
    
    this.typeText(this.textLines, 'introText', 0, 0);
    this.typeText(this.darkLines, 'darkText', 0, 0, true);
  }


  private typeText(lines: string[], elementId: string, lineIndex: number, charIndex: number, cursed: boolean = false) {
    const pre = document.getElementById(elementId);
    if (!pre) return;

    if (lineIndex < lines.length) {
      const line = lines[lineIndex];
      if (charIndex < line.length) {
        const span = document.createElement('span');
        span.textContent = line.charAt(charIndex);

        if (cursed && Math.random() < 0.2) span.classList.add('glitch-char');

        pre.appendChild(span);
        setTimeout(() => this.typeText(lines, elementId, lineIndex, charIndex + 1, cursed), this.typingSpeed);
      } else {
        pre.appendChild(document.createElement('br'));
        setTimeout(() => this.typeText(lines, elementId, lineIndex + 1, 0, cursed), this.typingSpeed);
      }
    } else if (cursed) {
    
      pre.parentElement?.classList.add('dark-glitch-mode');
    }
  }
}

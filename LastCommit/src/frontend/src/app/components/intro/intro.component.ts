import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
})
export class IntroComponent implements AfterViewInit {

  constructor(private router: Router) {}

  private storyBlocks: string[][] = [
    [
      "Bem-vindo à ToyCorp!",
      "Você foi contratado como programador de máquinas de montagem."
    ],
    [
      "Seu trabalho será garantir que os robôs criem brinquedos com precisão e eficiência...",
      "Prepare-se para entrar na fábrica e iniciar sua jornada!"
    ],
    [
      "Cuidado, não faça nada errado lá dentro. ",
      "Venha, entre no nosso sistema!"
    ]
  ];

  currentBlockIndex: number = 0;
  isTyping: boolean = false;

  private typingSpeed: number = 50; 
  private currentTimeout: any; 
  ngAfterViewInit(): void {
    this.showBlock(this.currentBlockIndex);
  }

  showBlock(blockIndex: number) {
    const pre = document.getElementById('introText');
    if (!pre) return;

    pre.textContent = '';
    this.isTyping = true;

    const lines = this.storyBlocks[blockIndex];
    this.typeLines(lines, pre, 0, 0);
  }

  private typeLines(lines: string[], pre: HTMLElement, lineIndex: number, charIndex: number) {
    if (lineIndex < lines.length) {
      const line = lines[lineIndex];

      if (charIndex < line.length) {
        pre.textContent += line.charAt(charIndex);
        this.currentTimeout = setTimeout(() => this.typeLines(lines, pre, lineIndex, charIndex + 1), this.typingSpeed);
      } else {
        pre.textContent += '\n';
        this.currentTimeout = setTimeout(() => this.typeLines(lines, pre, lineIndex + 1, 0), this.typingSpeed);
      }

    } else {
      this.isTyping = false; 

      if (this.currentBlockIndex === this.storyBlocks.length - 1) {
        setTimeout(() => {
          this.router.navigate(['/login']); 
        }, 1000); 
      }

    }
  }

 nextBlock() {
  if (this.currentTimeout) clearTimeout(this.currentTimeout);

  const pre = document.getElementById('introText');
  if (pre) {
    const lines = this.storyBlocks[this.currentBlockIndex];
    pre.textContent = lines.join('\n'); 
  }
  this.isTyping = false;

  if (this.currentBlockIndex < this.storyBlocks.length - 1) {
   
    this.currentBlockIndex++;
    this.showBlock(this.currentBlockIndex);
  } else {
  
    this.router.navigate(['/login']);
  }
}

}

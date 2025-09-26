import { Component, OnInit } from '@angular/core';
import { LlmService } from '../../services/llm.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-jogo',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './jogo.component.html',
  styleUrls: ['./jogo.component.scss']
})

export class jogoComponent implements OnInit {

  chapterTitle: string = "Materiais Desconhecidos";
  chapterImage: string = "assets/bmib.png";

  player = {
    hp: 100,
    maxHp: 100,
    hevBattery: 80,
    inventory: ["Pistola", "Medkit", "Chave"]
  };

  narrative: string = "";
  choices: string[] = [];
  currentChapterIndex: number = 0;

  chapters = [

    {
      titulo: "Caos instalado",
      contexto: "Após chegar em Black Mesa e vestir a roupa H.E.V você volta para o corredor principal...",
       regras: [
        "O jogador ainda não pode sair de Black Mesa.",
        "Os inimigos iniciais são apenas headcrabs e alguns zumbis.",
        "Não introduza personagens de fora da instalação nesta fase.",
        "As armas disponíveis devem ser apenas pistola e crowbar.",
        "O capítulo deve ter inimigos e mortes APENAS depois da ressonancia em cascata",
        "Não conte nada ameaçador para o jogador antes que o desastre aconteça",
        "Me de as opções em ingles e conte a história em ingles"
      ]
    },

    {
      titulo: "Inesperadas",
      contexto: "O desastre já começou, você sai da área de teste destruída..."
    }

  ];

  constructor(private llmService: LlmService) {}

  ngOnInit() {
    this.loadChapter(this.currentChapterIndex);
  }

  loadChapter(index: number) {

    const chapter = this.chapters[index];
    if (!chapter) return;

    this.chapterTitle = chapter.titulo;

    this.llmService.startChapter({
      chapter: index,
      context: chapter.contexto,
       rules: chapter.regras || [],  
      player_state: this.player
    }).subscribe({
      next: (res) => {

        try {
          this.narrative = res.narrativa;
          this.choices = res.choices || [];
        } catch {
          this.narrative = "Erro ao interpretar narrativa inicial.";
          this.choices = [];
        }

      },
      error: (err) => console.error("Erro no LLM:", err)
    });
    
  }

  chooseAction(action: string) {

    const payload = {
      last_narrative: this.narrative,
      action,
      player_state: this.player,
      rules: this.chapters[this.currentChapterIndex]?.regras || []
    };

    this.llmService.turn(payload).subscribe({
    next: (res: any) => {
      this.narrative = res.narrativa;
      this.choices = res.choices || [];

      if (res.efeitos) {
        this.player.hp += res.efeitos.hp || 0;
        this.player.hevBattery += res.efeitos.hevBattery || 0;
        this.player.inventory.push(...(res.efeitos.inventarioAdd || []));
        this.player.inventory = this.player.inventory.filter(
          i => !(res.efeitos.inventarioRemove || []).includes(i)
        );
      }
    },
    error: (err) => console.error("Erro no LLM:", err)
  });

  }

}
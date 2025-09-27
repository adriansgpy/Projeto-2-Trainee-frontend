import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Lenda } from './lendas.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Player {
  nome: string;
  hp: number;
  maxHp: number;
  stamina: number;
  maxStamina: number;
  inventory: string[];
}

@Component({
  selector: 'app-jogo',
  templateUrl: './jogo.component.html',
  styleUrls: ['./jogo.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class jogoComponent implements OnInit {
  player: Player = {
    nome: '',
    hp: 0,
    maxHp: 0,
    stamina: 0,
    maxStamina: 0,
    inventory: []
  };

  enemy: Lenda & { hp: number; maxHp: number; stamina: number; maxStamina: number } = {} as any;

  chapterTitle: string = '';
  chapterImage: string = '';
  narrative: string = 'A batalha vai começar!';
  playerAction: string = '';
  choices: string[] = [];

  constructor(private router: Router) {}

  async ngOnInit() {
    // Tenta pegar state do Router
    const state = this.router.getCurrentNavigation()?.extras?.state as { personagem?: any; lenda?: Lenda } | undefined;

    const personagemData = state?.personagem ?? JSON.parse(localStorage.getItem('playerSelected') || 'null');
    const lendaData = state?.lenda ?? JSON.parse(localStorage.getItem('lendaSelected') || 'null');

    if (personagemData && lendaData) {
      // Configura jogador corretamente
      this.player = { 
        nome: personagemData.nome ?? 'Jogador',
        hp: personagemData.hpAtual ?? 100,
        maxHp: personagemData.maxHp ?? personagemData.hpAtual ?? 100,
        stamina: personagemData.staminaAtual ?? 100,
        maxStamina: personagemData.maxStamina ?? personagemData.staminaAtual ?? 100,
        inventory: personagemData.inventory ?? []
      };

      // Configura inimigo
      this.enemy = {
        ...lendaData,
        hp: lendaData.hp ?? 100,
        maxHp: lendaData.hp ?? 100,
        stamina: lendaData.stamina ?? 100,
        maxStamina: lendaData.stamina ?? 100
      };

      this.chapterTitle = lendaData.nome;
      this.chapterImage = lendaData.imagem ?? '';
      this.narrative = `Você encontra ${lendaData.nome}, pronto para a batalha!`;
    } else {
      this.narrative = 'Nenhum personagem ou lenda selecionada!';
    }

    await this.startGame();
  }

  sendAction() {
    if (!this.playerAction.trim()) return;

    this.narrative += `\nVocê decide: ${this.playerAction}`;
    this.simulateEnemyTurn();
    this.playerAction = '';
  }

  chooseAction(choice: string) {
    this.playerAction = choice;
    this.sendAction();
  }

  simulateEnemyTurn() {
    if (this.enemy.hp <= 0 || this.player.hp <= 0) return;

    // Dano baseado em inimigo, stamina reduzida a cada ataque
    const dano = Math.floor(Math.random() * 15) + 5;
    this.player.hp -= dano;
    if (this.player.hp < 0) this.player.hp = 0;

    this.enemy.stamina -= 10;
    if (this.enemy.stamina < 0) this.enemy.stamina = 0;

    this.narrative += `\n${this.enemy.nome} ataca e causa ${dano} de dano!`;

    if (this.player.hp === 0) {
      this.narrative += `\nVocê foi derrotado por ${this.enemy.nome}!`;
    }
  }

  async startGame() {
  const payload = {
    state: {
      player: {
        nome: this.player.nome,
        hp: this.player.hp,
        max_hp: this.player.maxHp,
        stamina: this.player.stamina,
        max_stamina: this.player.maxStamina,
        inventario: this.player.inventory
      },
      enemy: {
        nome: this.enemy.nome,
        hp: this.enemy.hp,
        max_hp: this.enemy.maxHp,
        stamina: this.enemy.stamina,
        max_stamina: this.enemy.maxStamina
      },
      chapter: this.chapterTitle,
      narrative: "",
      choices: []
    }
  };

  try {
    const response = await fetch('http://localhost:8000/llm/start_game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    this.narrative = data.narrative;
    this.choices = data.choices;
  } catch (err) {
    console.error("Erro ao iniciar o jogo:", err);
    this.narrative = "Erro ao iniciar o jogo...";
  }
}

}

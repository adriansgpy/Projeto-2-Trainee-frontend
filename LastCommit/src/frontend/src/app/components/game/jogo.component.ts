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

interface ChatMessage {
  from: 'player' | 'llm';
  text: string;
  formattedText: string;
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

  choices: string[] = [];
  playerAction: string = '';

  chat: ChatMessage[] = [];

  constructor(private router: Router) {}

  async ngOnInit() {
    const state = this.router.getCurrentNavigation()?.extras?.state as { personagem?: any; lenda?: Lenda } | undefined;

    const personagemData = state?.personagem ?? JSON.parse(localStorage.getItem('playerSelected') || 'null');
    const lendaData = state?.lenda ?? JSON.parse(localStorage.getItem('lendaSelected') || 'null');

    if (personagemData && lendaData) {
      this.player = {
        nome: personagemData.nome ?? 'Jogador',
        hp: personagemData.hpAtual ?? 100,
        maxHp: personagemData.maxHp ?? personagemData.hpAtual ?? 100,
        stamina: personagemData.staminaAtual ?? 100,
        maxStamina: personagemData.maxStamina ?? personagemData.staminaAtual ?? 100,
        inventory: personagemData.inventory ?? []
      };

      this.enemy = {
        ...lendaData,
        hp: lendaData.hp ?? 100,
        maxHp: lendaData.hp ?? 100,
        stamina: lendaData.stamina ?? 100,
        maxStamina: lendaData.stamina ?? 100
      };

      this.chapterTitle = lendaData.nome;
      this.chapterImage = lendaData.imagem ?? '';
      this.addChatMessage('llm', `Você encontra ${lendaData.nome}, pronto para a batalha!`);
    } else {
      this.addChatMessage('llm', 'Nenhum personagem ou lenda selecionada!');
    }

    await this.startGame();
  }

  addChatMessage(from: 'player' | 'llm', text: string) {
    this.chat.push({
      from,
      text,
      formattedText: text.replace(/\n/g, '<br>')
    });
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

      const narrativaArray = Array.isArray(data.narrativa) ? data.narrativa : [data.narrativa || ''];
      this.addChatMessage('llm', narrativaArray.join('\n'));

      this.choices = data.escolhas ?? [];

      if (data.status?.player) {
        this.player.hp = data.status.player.hp;
        this.player.stamina = data.status.player.stamina;
        this.player.inventory = data.status.player.inventario ?? this.player.inventory;
      }

      if (data.status?.enemy) {
        this.enemy.hp = data.status.enemy.hp;
        this.enemy.stamina = data.status.enemy.stamina;
      }

    } catch (err) {
      console.error("Erro ao iniciar o jogo:", err);
      this.addChatMessage('llm', 'Erro ao iniciar o jogo...');
    }
  }

  async processTurn(action: string) {
    this.addChatMessage('player', action);

    const payload = {
      action,
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
        choices: this.choices
      }
    };

    try {
      const response = await fetch('http://localhost:8000/llm/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      const narrativaArray = Array.isArray(data.narrativa) ? data.narrativa : [data.narrativa || ''];
      this.addChatMessage('llm', narrativaArray.join('\n'));

      this.choices = data.escolhas ?? [];

      if (data.status?.player) {
        this.player.hp = data.status.player.hp;
        this.player.stamina = data.status.player.stamina;
        this.player.inventory = data.status.player.inventario ?? this.player.inventory;
      }

      if (data.status?.enemy) {
        this.enemy.hp = data.status.enemy.hp;
        this.enemy.stamina = data.status.enemy.stamina;
      }

    } catch (err) {
      console.error("Erro ao processar turno:", err);
      this.addChatMessage('llm', 'Erro ao processar turno...');
    }
  }

  sendAction() {
    if (!this.playerAction.trim()) return;
    this.processTurn(this.playerAction);
    this.playerAction = '';
  }

  chooseAction(choice: string) {
    this.processTurn(choice);
  }
}

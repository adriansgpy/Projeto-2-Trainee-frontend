import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
// Importe Lenda, assumindo que ela ainda existe (mantido como comentário para evitar erro de importação não definida)
// import { Lenda } from './lendas.model'; 
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Definindo Lenda apenas para fins de tipagem, assumindo suas propriedades chave
interface Lenda {
    nome: string;
    descricao: string;
    imagem?: string;
    hp?: number;
    stamina?: number;
}

interface Player {
  nome: string;
  hp: number;
  maxHp: number;
  stamina: number;
  maxStamina: number;
  inventory: string[];
  classe : string;
}

interface ChatMessage {
  from: 'player' | 'llm' | 'system';
  text: string;
  formattedText: string;
  buttons?: { label: string; action: string }[];
}

@Component({
  selector: 'app-jogo',
  templateUrl: './jogo.component.html',
  styleUrls: ['./jogo.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class jogoComponent implements OnInit {
  player: Player = { nome: '', hp: 0, maxHp: 0, stamina: 0, maxStamina: 0, inventory: [], classe: '' };
  enemy: Lenda & { hp: number; maxHp: number; stamina: number; maxStamina: number } = {} as any;
  chapterTitle: string = '';
  chapterImage: string = '';
  choices: string[] = [];
  isGameOver: boolean = false;
  playerAction: string = '';
  chat: ChatMessage[] = [];

  // Modal de confirmação de saída
  showConfirmModal: boolean = false;

  constructor(private router: Router) {}

  async ngOnInit() {
    const state = this.router.getCurrentNavigation()?.extras?.state as { personagem?: any; lenda?: Lenda } | undefined;

    const personagemData = state?.personagem ?? JSON.parse(localStorage.getItem('playerSelected') || 'null');
    const lendaData = state?.lenda ?? JSON.parse(localStorage.getItem('lendaSelected') || 'null');

    if (personagemData && lendaData) {
      this.player = {
        nome: personagemData.nome ?? 'Jogador',
        classe: personagemData.classe ?? 'Guerreiro',
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

  addChatMessage(from: 'player' | 'llm' | 'system', text: string) {
    this.chat.push({ from, text, formattedText: text.replace(/\n/g, '<br>') });
  }

  // ---------------- MODAL DE SAÍDA ----------------
  confirmExit() {
    this.showConfirmModal = true;
  }

  exitGame() {
    this.showConfirmModal = false;
    this.router.navigate(['/homepage/campanhas']);
  }

  cancelExit() {
    this.showConfirmModal = false;
  }

  // ---------------- GAME LOGIC ----------------
  async startGame() {
    
    const payload = {
      state: {
        player: {
          nome: this.player.nome || "Jogador",
          classe: this.player.classe || "Guerreiro",
          hp: this.player.hp ?? 100,
          max_hp: this.player.maxHp ?? 100,
          stamina: this.player.stamina ?? 100,
          max_stamina: this.player.maxStamina ?? 100,
          inventario: this.player.inventory ?? []
        },
        enemy: {
          nome: this.enemy.nome || "Inimigo",
          descricao: this.enemy.descricao || "", 
          hp: this.enemy.hp ?? 100,
          max_hp: this.enemy.maxHp ?? 100,
          stamina: this.enemy.stamina ?? 100,
          max_stamina: this.enemy.maxStamina ?? 100
        },
        chapter: this.chapterTitle || "Capítulo 1",
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

    const gameStatePayload = {
        player: {
          nome: this.player.nome || "Jogador",
          classe: this.player.classe || "Guerreiro",
          hp: this.player.hp ?? 100,
          max_hp: this.player.maxHp ?? 100,
          stamina: this.player.stamina ?? 100,
          max_stamina: this.player.maxStamina ?? 100,
          inventario: this.player.inventory ?? []
        },
        enemy: {
          nome: this.enemy.nome || "Inimigo",
          descricao: this.enemy.descricao || "", 
          hp: this.enemy.hp ?? 100,
          max_hp: this.enemy.maxHp ?? 100,
          stamina: this.enemy.stamina ?? 100,
          max_stamina: this.enemy.maxStamina ?? 100
        },
        chapter: this.chapterTitle || "Capítulo 1",
        narrative: "",
        choices: []
      };
    
    // CORREÇÃO: Cria o payload final incluindo o campo 'action' e o objeto 'state' aninhado
    const payload = {
      action: action,
      state: gameStatePayload
    };


    console.log("Payload enviado em processTurn:", JSON.stringify(payload, null, 2));


    try {
      const response = await fetch('http://localhost:8000/llm/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      // narrativa do turno
      const narrativaArray = Array.isArray(data.narrativa) ? data.narrativa : [data.narrativa || ''];
      this.addChatMessage('llm', narrativaArray.join('\n'));

      // resultado numérico (hp/stamina changes)
      if (data.turn_result) {
        let resultText = '..............................\n\nRESULTADO\n\n';
        if (data.turn_result.enemy) {
          resultText += `${this.enemy.nome}:\n`;
          if (data.turn_result.enemy.hp_change)
            resultText += `${data.turn_result.enemy.hp_change > 0 ? '+' : ''}${data.turn_result.enemy.hp_change} HP\n`;
          // Stamina removida da exibição
          resultText += '\n';
        }
        if (data.turn_result.player) {
          resultText += `${this.player.nome}:\n`;
          if (data.turn_result.player.hp_change)
            resultText += `${data.turn_result.player.hp_change > 0 ? '+' : ''}${data.turn_result.player.hp_change} HP\n`;
          // Stamina removida da exibição
        }
        this.addChatMessage('llm', resultText);
      }

      // escolhas para o próximo turno
      this.choices = data.escolhas ?? [];

      // atualizar status do jogador (mantendo stamina para o próximo payload)
      if (data.status?.player) {
        this.player.hp = data.status.player.hp;
        this.player.stamina = data.status.player.stamina;
        this.player.inventory = data.status.player.inventario ?? this.player.inventory;
      }

      // atualizar status do inimigo (mantendo stamina para o próximo payload)
      if (data.status?.enemy) {
        this.enemy.hp = data.status.enemy.hp;
        this.enemy.stamina = data.status.enemy.stamina;
      }

      // verificar derrota
      if (this.enemy.hp <= 0) {
        this.enemy.hp = 0;
        this.gameOver(true);
        return;
      }

      if (this.player.hp <= 0) {
        this.player.hp = 0;
        this.gameOver(false);
        return;
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

  gameOver(vitoria: boolean) {
    this.isGameOver = true;

    if (vitoria) {
      this.addChatMessage('system', `🏆 Vitória! Você derrotou ${this.enemy.nome} com honra!`);
    } else {
      this.addChatMessage('system', `💀 Derrota... ${this.enemy.nome} acabou com você.`);
    }

    // Mensagem final com botões
    this.chat.push({
      from: 'system',
      text: '',
      formattedText: '',
      buttons: [
        { label: '🚪 O seu trabalho foi terminado. Volte pra casa.', action: 'exitToCampaigns' }
      ]
    });
  }

  handleButtonAction(action: string) {
    if (action === 'exitToCampaigns') {
      this.router.navigate(['/homepage/campanhas']);
    }
  }

  restartGame() {
    this.isGameOver = false;
    this.chat = [];
    this.player.hp = this.player.maxHp;
    this.player.stamina = this.player.maxStamina;
    this.enemy.hp = this.enemy.maxHp;
    
    this.enemy.stamina = this.enemy.maxStamina;
    this.addChatMessage('system', '⚔ Uma nova batalha começa!');
  }
}
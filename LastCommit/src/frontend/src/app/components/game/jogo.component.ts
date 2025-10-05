import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

/**
 * Representa uma lenda/inimigo do jogo.
 *
 * @interface Lenda
 * @property {string} nome - Nome da lenda (ex: "Saci").
 * @property {string} descricao - Descrição narrativa da lenda.
 * @property {string} [imagem] - URL ou caminho da imagem representativa.
 * @property {number} [hp] - HP base sugerido para a lenda.
 * @property {number} [stamina] - Stamina base sugerida.
 */
interface Lenda {
  nome: string;
  descricao: string;
  imagem?: string;
  hp?: number;
  stamina?: number;
}

/**
 * Representa o jogador controlado pelo usuário.
 *
 * @interface Player
 * @property {string} nome - Nome do jogador.
 * @property {number} hp - Pontos de vida atuais do jogador.
 * @property {number} maxHp - Pontos de vida máximos.
 * @property {number} stamina - Stamina atual do jogador.
 * @property {number} maxStamina - Stamina máxima.
 * @property {string[]} inventory - Itens do inventário.
 * @property {string} classe - Classe do personagem (ex: "Guerreiro").
 */
interface Player {
  nome: string;
  hp: number;
  maxHp: number;
  stamina: number;
  maxStamina: number;
  inventory: string[];
  classe: string;
}

/**
 * Estrutura de uma mensagem exibida no chat do jogo.
 *
 * @interface ChatMessage
 * @property {'player' | 'llm' | 'system'} from - Origem da mensagem.
 * @property {string} text - Texto bruto da mensagem.
 * @property {string} formattedText - Texto formatado (ex: com <br>).
 * @property {{ label: string; action: string }[]} [buttons] - Botões de ação exibidos junto com a mensagem.
 */
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
/**
 * Componente principal do jogo — controla estado do jogador, inimigo,
 * comunicação com o backend (LLM) e o fluxo de turnos.
 *
 * Implementa OnInit para carregar estado inicial (personagem/lenda).
 */
export class jogoComponent implements OnInit {
  /**
   * Estado do jogador.
   * Inicializado com valores base para evitar undefined.
   */
  player: Player = { nome: '', hp: 0, maxHp: 0, stamina: 0, maxStamina: 0, inventory: [], classe: '' };

  /**
   * Estado do inimigo (lenda) com atributos de combate.
   * Usa interseção para incluir campos de Lenda e campos de status.
   */
  enemy: Lenda & { hp: number; maxHp: number; stamina: number; maxStamina: number } = {} as any;

  /** Título do capítulo */
  chapterTitle: string = '';

  /** URL ou caminho da imagem do capitulo */
  chapterImage: string = '';

  /** Opções/ações que o jogador pode escolher. */
  choices: string[] = [];

  /** Indica se o jogo acabou */
  isGameOver: boolean = false;

  /** Texto digitado no input de ação */
  playerAction: string = '';

  /** Histórico de mensagens do chat entre jogador, system e LLM */
  chat: ChatMessage[] = [];

  /** Controle do modal de confirmação de saída */
  showConfirmModal: boolean = false;

  /**
   * Cria a instância do componente.
   *
   * @param {Router} router - Router para navegação entre rotas
   */
  constructor(private router: Router) {}

  /**
   * Ciclo de inicialização do componente.
   * Carrega personagem/lenda do Router state ou do localStorage,
   * popula os estados internos e inicia o jogo chamando startGame()
   *
   * @async
   * @returns {Promise<void>}
   */
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

  /**
   * Adiciona uma mensagem ao histórico de chat do jogo.
   *
   * @param {'player' | 'llm' | 'system'} from - Origem da mensagem.
   * @param {string} text - Texto da mensagem (que será convertido para formattedText).
   * @returns {void}
   */
  addChatMessage(from: 'player' | 'llm' | 'system', text: string) {
    this.chat.push({ from, text, formattedText: text.replace(/\n/g, '<br>') });
  }


  /**
   * Abre o modal de confirmação para sair do jogo.
   *
   * @returns {void}
   */
  confirmExit() {
    this.showConfirmModal = true;
  }

  /**
   * Executa a navegação para a lista de campanhas (fecha modal).
   *
   * @returns {void}
   */
  exitGame() {
    this.showConfirmModal = false;
    this.router.navigate(['/homepage/campanhas']);
  }

  /**
   * Cancela a saída, apenas fecha o modal.
   *
   * @returns {void}
   */
  cancelExit() {
    this.showConfirmModal = false;
  }

  // ---------------- COMEÇAR O JOGO ----------------

  /**
   * Envia o estado inicial do jogo ao backend (endpoint /llm/start_game),
   * recebe a narrativa inicial, atualiza escolhas (choices) e status dos personagens.
   *
   * Observações:
   * - Monta um payload com o estado atual do jogador e inimigo.
   * - Atualiza this.player e this.enemy com os dados retornados em data.status.
   *
   * @async
   * @returns {Promise<void>}
   */
  async startGame() {
    const payload = {
      state: {
        player: {
          nome: this.player.nome || 'Jogador',
          classe: this.player.classe || 'Guerreiro',
          hp: this.player.hp ?? 100,
          max_hp: this.player.maxHp ?? 100,
          stamina: this.player.stamina ?? 100,
          max_stamina: this.player.maxStamina ?? 100,
          inventario: this.player.inventory ?? []
        },
        enemy: {
          nome: this.enemy.nome || 'Inimigo',
          descricao: this.enemy.descricao || '',
          hp: this.enemy.hp ?? 100,
          max_hp: this.enemy.maxHp ?? 100,
          stamina: this.enemy.stamina ?? 100,
          max_stamina: this.enemy.maxStamina ?? 100
        },
        chapter: this.chapterTitle || 'Capítulo 1',
        narrative: '',
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
      console.error('Erro ao iniciar o jogo:', err);
      this.addChatMessage('llm', 'Erro ao iniciar o jogo...');
    }
  }

  /**
   * Processa o turno do jogador:
   * - Envia o estado atual e a ação para o endpoint /llm/turn
   * - Recebe narrativa do turno e atualiza status
   * - Atualiza as escolhas futuras e verifica condições do game over
   *
   * @async
   * @param {string} action - Ação escolhida pelo jogador
   * @returns {Promise<void>}
   */
  async processTurn(action: string) {
    this.addChatMessage('player', action);

    const gameStatePayload = {
      player: {
        nome: this.player.nome || 'Jogador',
        classe: this.player.classe || 'Guerreiro',
        hp: this.player.hp ?? 100,
        max_hp: this.player.maxHp ?? 100,
        stamina: this.player.stamina ?? 100,
        max_stamina: this.player.maxStamina ?? 100,
        inventario: this.player.inventory ?? []
      },
      enemy: {
        nome: this.enemy.nome || 'Inimigo',
        descricao: this.enemy.descricao || '',
        hp: this.enemy.hp ?? 100,
        max_hp: this.enemy.maxHp ?? 100,
        stamina: this.enemy.stamina ?? 100,
        max_stamina: this.enemy.maxStamina ?? 100
      },
      chapter: this.chapterTitle || 'Capítulo 1',
      narrative: '',
      choices: []
    };

    // PAYLOAD PARA ENVIAR AO LLM
    const payload = {
      action: action,
      state: gameStatePayload
    };

    console.log('Payload enviado em processTurn:', JSON.stringify(payload, null, 2));

    try {
      const response = await fetch('http://localhost:8000/llm/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      // recebendo narrativa do turno
      const narrativaArray = Array.isArray(data.narrativa) ? data.narrativa : [data.narrativa || ''];
      this.addChatMessage('llm', narrativaArray.join('\n'));

      // resultado do status 
      if (data.turn_result) {
        let resultText = '..............................\n\nRESULTADO\n\n';
        if (data.turn_result.enemy) {
          resultText += `${this.enemy.nome}:\n`;
          if (data.turn_result.enemy.hp_change)
            resultText += `${data.turn_result.enemy.hp_change > 0 ? '+' : ''}${data.turn_result.enemy.hp_change} HP\n`;
          resultText += '\n';
        }
        if (data.turn_result.player) {
          resultText += `${this.player.nome}:\n`;
          if (data.turn_result.player.hp_change)
            resultText += `${data.turn_result.player.hp_change > 0 ? '+' : ''}${data.turn_result.player.hp_change} HP\n`;
        }
        // Observação: resultado textual (resultText) está construído mas comentado para não poluir o chat.
        // Se quiser exibir no chat, descomente a linha abaixo:
        // this.addChatMessage('llm', resultText);
      }

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
      console.error('Erro ao processar turno:', err);
      this.addChatMessage('llm', 'Erro ao processar turno...');
    }
  }

  /**
   * Envia a ação digitada no input para processamento de turno
   *
   * @returns {void}
   */
  sendAction() {
    if (!this.playerAction.trim()) return;
    this.processTurn(this.playerAction);
    this.playerAction = '';
  }

  /**
   * Executa uma ação a partir de uma escolha
   *
   * @param {string} choice - Texto da escolha selecionada
   * @returns {void}
   */
  chooseAction(choice: string) {
    this.processTurn(choice);
  }

  /**
   * Finaliza o jogo exibindo mensagem de vitória ou derrota
   * e adiciona um botão de sistema que permite voltar às campanhas
   *
   * @param {boolean} vitoria - true se o jogador venceu e false se perdeu
   * @returns {void}
   */
  gameOver(vitoria: boolean) {
    this.isGameOver = true;

    if (vitoria) {
      this.addChatMessage('system', `🏆 Vitória! Você derrotou ${this.enemy.nome} com honra!`);
    } else {
      this.addChatMessage('system', `💀 Derrota... ${this.enemy.nome} acabou com você.`);
    }

    this.chat.push({
      from: 'system',
      text: '',
      formattedText: '',
      buttons: [
        { label: '🚪 O seu trabalho foi terminado. Volte pra casa.', action: 'exitToCampaigns' }
      ]
    });
  }

  /**
   * Lida com ações de botões incluídos em mensagens do tipo 'system'
   *
   * @param {string} action - Identificador da ação
   * @returns {void}
   */
  handleButtonAction(action: string) {
    if (action === 'exitToCampaigns') {
      this.router.navigate(['/homepage/campanhas']);
    }
  }

  /**
   * Reinicia o estado do jogo para recomeçar a batalha
   *
   * @returns {void}
   */
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

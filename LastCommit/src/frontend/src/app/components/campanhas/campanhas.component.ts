import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AudioService } from '../../services/soundtrack.service';
import { FormsModule } from '@angular/forms';

interface Capitulo {
  titulo: string;
  completo: boolean;
  ultimoEvento?: string | null;
  historicoLLM?: any[];
}

interface Personagem {
  _id: string;
  nome: string;
  inventario: string[];
  ultimoCapitulo: string | null;
  hpAtual: number;
  bateriaHEV: number;
  capitulos: Capitulo[];
}

interface Campanha {
  titulo: string;
  tipo?: string; 
  habilitado?: boolean;
  imagem?: string;
  concluido?: boolean;
}

@Component({
  selector: 'app-campanha',
  templateUrl: './campanhas.component.html',
  styleUrls: ['./campanhas.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class CampanhasComponent implements OnInit {
  campanhas: Campanha[] = [];
  personagens: Personagem[] = [];
  personagemGlobalSelecionado: Personagem | null = null;
  campanhaSelecionada: Campanha | null = null;
  private apiUrl = 'http://127.0.0.1:8000/personagens';

  constructor(
    private http: HttpClient,
    private router: Router,
    private audioService: AudioService
  ) {}

  ngOnInit() {
    this.campanhas = [
      { titulo: 'Materiais Desconhecidos', imagem: 'assets/bmib.png', habilitado: false },
      { titulo: 'Consequências Inesperadas', imagem: 'assets/unforeseen_consequences.jpg', habilitado: false },
      { titulo: 'Complexo Administrativo', imagem: 'assets/office.jpg', habilitado: false },
      { titulo: 'Hostis à Vista', imagem: 'assets/hostiles.png', habilitado: false },
      { titulo: 'Satélite', imagem: 'assets/rocket.jpg', habilitado: false },
      { titulo: 'Energia Ativada', imagem: 'assets/powerup.jpg', habilitado: false },
      { titulo: 'Nos Trilhos', imagem: 'assets/rail.jpg', habilitado: false },
      { titulo: 'Detenção', imagem: 'assets/bo.jpg', habilitado: false },
      { titulo: 'Processamento de Resíduos', imagem: 'assets/residue.jpg', habilitado: false },
      { titulo: 'Ética Duvidosa', imagem: 'assets/qe.jpeg', habilitado: false },
      { titulo: 'Superfície em batalha', imagem: 'assets/st.jpg', habilitado: false },
      { titulo: 'Perdas suficiente', imagem: 'assets/evacuate.png', habilitado: false },
      { titulo: 'Núcleo Lambda', imagem: 'assets/lambda.jpeg', habilitado: false },
      { titulo: 'Xênon', imagem: 'assets/xen.png', habilitado: false },
      { titulo: 'Covil de Gonarch', imagem: 'assets/gonarch.jpeg', habilitado: false },
      { titulo: 'Intruso', imagem: 'assets/interloper.jpg', habilitado: false },
      { titulo: 'Nihilanth', imagem: 'assets/nihilanth.png', habilitado: false },
      { titulo: 'O fim?', imagem: 'assets/gman.png', habilitado: false }
    ];

    this.loadPersonagens();
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: token ? `Bearer ${token}` : '' });
  }

  loadPersonagens() {
    const token = localStorage.getItem('token');

    this.http.get<Personagem[]>(this.apiUrl, { headers: { Authorization: `Bearer ${token}` } })
      .subscribe({
        next: (data) => {
          this.personagens = data.map(p => ({
            ...p,
            _id: (p as any)._id?.$oid ? (p as any)._id.$oid : (p as any)._id
          }));

          const saved = localStorage.getItem('personagemSelecionado');
          if (saved) {
            this.personagemGlobalSelecionado = this.personagens.find(p => p._id === saved) || null;
          } else if (this.personagens.length > 0) {
            this.personagemGlobalSelecionado = this.personagens[0];
          }

          this.atualizarCampanhas();
        },
        error: (err) => console.error('Erro ao carregar personagens:', err)
      });
  }

  onPersonagemChange(personagem: Personagem) {
    this.personagemGlobalSelecionado = personagem;
    localStorage.setItem('personagemSelecionado', personagem._id);
    this.atualizarCampanhas();
  }

  atualizarCampanhas() {
    if (!this.personagemGlobalSelecionado) return;

    const capitulos = this.personagemGlobalSelecionado.capitulos || [];
    let encontrouDesbloqueada = false;

    this.campanhas.forEach(campanha => {
      const cap = capitulos.find(c => c.titulo === campanha.titulo);

      if (cap?.completo) {
        campanha.habilitado = true;
        campanha.concluido = true;
      } else if (!encontrouDesbloqueada) {
        campanha.habilitado = true;
        campanha.concluido = false;
        encontrouDesbloqueada = true;
      } else {
        campanha.habilitado = false;
        campanha.concluido = false;
      }
    });
  }

  getTextoBotaoCampanha(camp: Campanha): string {
    if (!this.personagemGlobalSelecionado) return 'Bloqueada';

    const capitulos = this.personagemGlobalSelecionado.capitulos || [];
    const cap = capitulos.find(c => c.titulo === camp.titulo);

    if (cap?.completo) return 'Concluído';
    if (this.personagemGlobalSelecionado.ultimoCapitulo === camp.titulo) return 'Continuar';
    return 'Começar Campanha';
  }

  entrarCampanha(camp: Campanha) {
    if (!camp.habilitado || !this.personagemGlobalSelecionado) {
      alert('Selecione um personagem válido antes de entrar na campanha!');
      return;
    }

    const personagemId = this.personagemGlobalSelecionado._id;
    const payload = { ultimoCapitulo: camp.titulo };

    this.http.patch(`${this.apiUrl}/${personagemId}`, payload, { headers: this.getAuthHeaders() })
      .subscribe({
        next: (updated: any) => {
          this.personagemGlobalSelecionado!.ultimoCapitulo = camp.titulo;
          this.atualizarCampanhas();
          this.selecionarPersonagem(this.personagemGlobalSelecionado!);
        },
        error: (err) => console.error('Erro ao iniciar capítulo:', err)
      });
  }

  selecionarPersonagem(personagem: Personagem) {
    const rotaIntro = '/intro/cientista';
    this.audioService.stopMusic();
    this.router.navigateByUrl(rotaIntro, { state: { personagem } });
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AudioService } from '../../services/soundtrack.service';
import { FormsModule } from '@angular/forms';

interface Campanha {
  titulo: string;
  tipo?: string; 
  habilitado?: boolean;
  imagem?: string;
}

interface Personagem {
  _id: string;
  nome: string;
  inventario: string[];
  ultimoCapitulo: string;
  hpAtual: number;
  bateriaHEV: number;
}

@Component({
  selector: 'app-campanha',
  templateUrl: './campanhas.component.html',
  styleUrls: ['./campanhas.component.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule]
})
export class CampanhasComponent implements OnInit {
  campanhas: Campanha[] = [];
  personagens: Personagem[] = [];
  private apiUrl = 'http://127.0.0.1:8000/personagens';
  campanhaSelecionada: Campanha | null = null;
  personagemGlobalSelecionado: Personagem | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private audioService: AudioService
  ) {}

  ngOnInit() {
    this.campanhas = [
      { titulo: 'Materiais Desconhecidos', imagem: 'assets/bmib.png', habilitado: false },
      { titulo: 'Consequências Inesperadas', imagem: 'assets/unforeseen_consequences.jpg', habilitado: true },
      { titulo: 'Complexo Administrativo', imagem: 'assets/office.jpg', habilitado: true },
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


  getCampanhasPorTipo(tipo: string) {
  return this.campanhas.filter(c => c.tipo?.toLowerCase() === tipo.toLowerCase());
}
  onPersonagemChange(personagem: Personagem) {
    this.personagemGlobalSelecionado = personagem;
    localStorage.setItem('personagemSelecionado', personagem._id);
  }

  atualizarCampanhas() {
    const habilitado = this.personagens.length > 0;
    this.campanhas.forEach(c => c.habilitado = habilitado);
  }

  abrirSelecao(campanha: Campanha) {
    this.campanhaSelecionada = campanha;
  }

  fecharModal() {
    this.campanhaSelecionada = null;
  }

  selecionarPersonagem(personagem: Personagem) {
    if (!personagem) return;

    const rotaIntro = '/intro/cientista'; 
    this.audioService.stopMusic();
    this.router.navigateByUrl(rotaIntro, { state: { personagem } });
  }

  entrarCampanha(camp: Campanha) {
    if (!camp.habilitado || !this.personagemGlobalSelecionado) {
      alert('Selecione um personagem válido antes de entrar na campanha!');
      return;
    }
    this.campanhaSelecionada = camp;
    this.selecionarPersonagem(this.personagemGlobalSelecionado);
  }
}

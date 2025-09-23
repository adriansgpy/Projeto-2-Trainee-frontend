import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AudioService } from '../../services/soundtrack.service';

interface Campanha {
  titulo: string;
  tipo: 'cientista' | 'soldado h.e.c.u' | 'black ops' | 'g-man';
  habilitado?: boolean;
  imagem?: string;
}

interface Personagem {
  _id: string;
  name: string;
  role: string;
  age: number;
  image?: string;
  campaign: boolean;
}

@Component({
  selector: 'app-campanha',
  templateUrl: './campanhas.component.html',
  styleUrls: ['./campanhas.component.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule]
})
export class CampanhasComponent implements OnInit {
  campanhas: Campanha[] = [];
  personagens: Personagem[] = [];
  private apiUrl = 'http://127.0.0.1:8000/personagens';
  campanhaSelecionada: Campanha | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private audioService: AudioService
  ) {}

  ngOnInit() {
    // Aqui todos os capítulos já viram campanhas jogáveis
    this.campanhas = [
      {
        titulo: 'Materiais Desconhecidos',
        tipo: 'cientista',
        imagem: 'assets/bmib.png',
        habilitado: false
      },
      {
        titulo: 'Consequências Inesperadas',
        tipo: 'cientista',
        imagem: 'assets/unforeseen_consequences.jpg',
        habilitado: true
      },
      {
        titulo: 'Complexo Administrativo',
        tipo: 'cientista',
        imagem: 'assets/office.jpg',
        habilitado: true
      },
      {
        titulo: 'Hostis à Vista',
        tipo: 'cientista',
        imagem: 'assets/hostiles.png',
        habilitado: false
      },
      {
        titulo: 'Satélite',
        tipo: 'cientista',
        imagem: 'assets/rocket.jpg',
        habilitado: false
      },
      {
        titulo: 'Energia Ativada',
        tipo: 'cientista',
        imagem: 'assets/powerup.jpg',
        habilitado: false
      },
      {
        titulo: 'Nos Trilhos',
        tipo: 'cientista',
        imagem: 'assets/rail.jpg',
        habilitado: false
      },
      {
        titulo: 'Detenção',
        tipo: 'cientista',
        imagem: 'assets/bo.jpg',
        habilitado: false
      },
      {
        titulo: 'Processamento de Resíduos',
        tipo: 'cientista',
        imagem: 'assets/residue.jpg',
        habilitado: false
      },
      {
        titulo: 'Ética Duvidosa',
        tipo: 'cientista',
        imagem: 'assets/qe.jpeg',
        habilitado: false
      },
      {
        titulo: 'Superfície em batalha',
        tipo: 'cientista',
        imagem: 'assets/st.jpg',
        habilitado: false
      },
      {
        titulo: 'Perdas suficiente',
        tipo: 'cientista',
        imagem: 'assets/evacuate.png',
        habilitado: false
      },
      {
        titulo: 'Núcleo Lambda',
        tipo: 'cientista',
        imagem: 'assets/lambda.jpeg',
        habilitado: false
      },
      {
        titulo: 'Xênon',
        tipo: 'cientista',
        imagem: 'assets/xen.png',
        habilitado: false
      },
      {
        titulo: 'Covil de Gonarch',
        tipo: 'cientista',
        imagem: 'assets/gonarch.jpeg',
        habilitado: false
      },
      {
        titulo: 'Intruso',
        tipo: 'cientista',
        imagem: 'assets/interloper.jpg',
        habilitado: false
      },
      {
        titulo: 'Nihilanth',
        tipo: 'cientista',
        imagem: 'assets/nihilanth.png',
        habilitado: false
      },
      {
        titulo: 'O fim?',
        tipo: 'cientista',
        imagem: 'assets/gman.png',
        habilitado: false
      }
    ];

    this.loadPersonagens();
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  loadPersonagens() {
    const token = localStorage.getItem('token');

    this.http.get<Personagem[]>(this.apiUrl, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (data) => {
        this.personagens = data.map(p => ({
          ...p,
          _id: (p as any)._id?.$oid ? (p as any)._id.$oid : (p as any)._id
        }));
        this.atualizarCampanhas();
      },
      error: (err) => console.error('Erro ao carregar personagens:', err)
    });
  }

  atualizarCampanhas() {
    const tiposDisponiveis = new Set(
      this.personagens.map(p => p.role.toLowerCase())
    );

    this.campanhas.forEach(c => {
      c.habilitado = tiposDisponiveis.has(c.tipo);
    });
  }

  abrirSelecao(campanha: Campanha) {
    this.campanhaSelecionada = campanha;
  }

  fecharModal() {
    this.campanhaSelecionada = null;
  }

  selecionarPersonagem(personagem: any) {
    if (!personagem) return;

    let rotaIntro = '';

    switch (this.campanhaSelecionada?.tipo) {
      case 'soldado h.e.c.u':
        this.audioService.stopMusic();
        rotaIntro = '/intro/hecu';
        break;
      case 'cientista':
        this.audioService.stopMusic();
        rotaIntro = '/intro/cientista';
        break;
      default:
        console.error('Campanha sem introdução definida!');
        return;
    }

    this.router.navigateByUrl(rotaIntro, {
      state: { personagem }
    });
  }

  getPersonagensPorCampanha() {
    if (!this.campanhaSelecionada) return [];
    return this.personagens.filter(
      p => p.role.toLowerCase() === this.campanhaSelecionada!.tipo.toLowerCase()
    );
  }

  entrarCampanha(camp: Campanha) {
    if (!camp.habilitado) return;
    this.abrirSelecao(camp);
  }

  getCampanhasPorTipo(tipo: 'cientista' | 'soldado h.e.c.u') {
    return this.campanhas.filter(c => c.tipo === tipo);
  }
}

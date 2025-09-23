import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AudioService } from '../../services/soundtrack.service';

interface Campanha {
  titulo: string;
  descricao: string;
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
        descricao: 'Explore o laboratório e descubra os materiais experimentais que deram início ao desastre.',
        tipo: 'cientista',
        imagem: 'assets/bmib.png',
        habilitado: false
      },
      {
        titulo: 'Consequências Inesperadas',
        descricao: 'Após um experimento dar errado, o caos se instala no laboratório e você deve reagir.',
        tipo: 'cientista',
        imagem: 'assets/unforeseen_consequences.jpg',
        habilitado: true
      },
      {
        titulo: 'Complexo Administrativo',
        descricao: 'Percorra os escritórios e áreas administrativas enquanto o laboratório entra em colapso.',
        tipo: 'cientista',
        imagem: 'assets/office.jpg',
        habilitado: true
      },
      {
        titulo: 'Hostis à Vista',
        descricao: 'Enfrente os soldados H.E.C.U. enviados para conter o desastre e eliminar testemunhas.',
        tipo: 'cientista',
        imagem: 'assets/hostiles.png',
        habilitado: false
      },
      {
        titulo: 'Fossa de Explosão',
        descricao: 'Investigue a área de testes de foguetes e enfrentamentos com criaturas perigosas.',
        tipo: 'cientista',
        imagem: 'assets/rocket.jpg',
        habilitado: false
      },
      {
        titulo: 'Energia Ativada',
        descricao: 'Restaure o fornecimento de energia enquanto o caos continua se espalhando pelo laboratório.',
        tipo: 'cientista',
        imagem: 'assets/powerup.jpg',
        habilitado: false
      },
      {
        titulo: 'Nos Trilhos',
        descricao: 'Use os sistemas de transporte interno para se mover rapidamente entre as áreas do laboratório.',
        tipo: 'cientista',
        imagem: 'assets/rail.jpg',
        habilitado: false
      },
      {
        titulo: 'Detenção',
        descricao: 'Evite capturas e enfrente os soldados que patrulham o laboratório.',
        tipo: 'cientista',
        imagem: 'assets/bo.jpg',
        habilitado: false
      },
      {
        titulo: 'Processamento de Resíduos',
        descricao: 'Navegue pelas áreas de descarte e processamento químico enquanto enfrenta novas ameaças.',
        tipo: 'cientista',
        imagem: 'assets/residue.jpg',
        habilitado: false
      },
      {
        titulo: 'Ética Duvidosa',
        descricao: 'Descubra os segredos por trás dos experimentos e decida como prosseguir.',
        tipo: 'cientista',
        imagem: 'assets/qe.jpeg',
        habilitado: false
      },
      {
        titulo: 'Tensão na Superfície',
        descricao: 'A batalha se aproxima da superfície enquanto inimigos ainda tentam impedir sua fuga.',
        tipo: 'cientista',
        imagem: 'assets/st.jpg',
        habilitado: false
      },
      {
        titulo: 'Esqueça Freeman',
        descricao: 'Os soldados recebem ordens para eliminar qualquer sobrevivente; sua jornada fica crítica.',
        tipo: 'cientista',
        imagem: 'assets/evacuate.png',
        habilitado: false
      },
      {
        titulo: 'Núcleo Lambda',
        descricao: 'Alcance o coração do laboratório e descubra os experimentos mais secretos.',
        tipo: 'cientista',
        imagem: 'assets/lambda.jpeg',
        habilitado: false
      },
      {
        titulo: 'Xênon',
        descricao: 'Viaje para a dimensão alienígena Xênon e enfrente criaturas perigosas.',
        tipo: 'cientista',
        imagem: 'assets/xen.png',
        habilitado: false
      },
      {
        titulo: 'Covil de Gonarch',
        descricao: 'Enfrente o chefe alienígena Gonarch e lute por sobrevivência antes de retornar.',
        tipo: 'cientista',
        imagem: 'assets/gonarch.jpeg',
        habilitado: false
      },
      {
        titulo: 'Intruso',
        descricao: 'Explore Xênon enquanto enfrenta novas ameaças e descobre mais sobre o desastre.',
        tipo: 'cientista',
        imagem: 'assets/interloper.jpg',
        habilitado: false
      },
      {
        titulo: 'Nihilanth',
        descricao: 'Enfrente o poderoso Nihilanth, a mente por trás da invasão alienígena.',
        tipo: 'cientista',
        imagem: 'assets/nihilanth.png',
        habilitado: false
      },
      {
        titulo: 'O fim?',
        descricao: '...',
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

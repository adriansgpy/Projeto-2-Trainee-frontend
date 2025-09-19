import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

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
  constructor(private http: HttpClient, private router : Router) {}

  ngOnInit() {
    this.campanhas = [
      { titulo: 'Black Mesa', descricao: 'Faça parte do experimento mais temido do laboratório, examine o cristal de outro planeta com os dedos cruzados.', tipo: 'cientista', imagem: 'assets/black_mesa_outside.png' },
      { titulo: 'Força Oposta', descricao: 'Mandado pelo governo, as forças H.E.C.U terá que invadir a Black Mesa e apagar a existência desse desastre. Tenha certeza de que nenhum Alien ou Cientista escape com vida. Tudo deve ser mantido em segredo.', tipo: 'soldado h.e.c.u', imagem: 'assets/hecu.png' },
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
      console.log('Personagens carregados do backend:', data);

      this.personagens = data.map(p => ({
        ...p,
        _id: (p as any)._id?.$oid ? (p as any)._id.$oid : (p as any)._id
      }));

      console.log('Personagens processados:', this.personagens);

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

    console.log('Campanhas atualizadas:', this.campanhas);
  }

  abrirSelecao(campanha: any) {
    this.campanhaSelecionada = campanha;
  }

  fecharModal() {
    this.campanhaSelecionada = null;
  }
  
selecionarPersonagem(personagem: any) {
  if (!personagem) return;

  let rotaIntro = '';

  switch (this.campanhaSelecionada?.titulo) {
    case 'Força Oposta':
      rotaIntro = '/intro/hecu';
      break;
    case 'Black Mesa':
      rotaIntro = '/intro/cientista'  
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

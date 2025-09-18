import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Campanha {
  titulo: string;
  descricao: string;
  tipo: 'cientista' | 'hecu' | 'black ops' | 'gman';
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

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.campanhas = [
      { titulo: 'Black Mesa', descricao: 'Faça parte do experimento mais temido do laboratório, examine o cristal de outro planeta com os dedos cruzados.', tipo: 'cientista', imagem: 'assets/black_mesa_outside.png' },
      { titulo: 'XEN', descricao: 'O lugar que nenhum ser humano pode saber da existência, um lugar jamais visto por ninguém, a não ser a prórpia Black Mesa.', tipo: 'cientista', imagem: 'assets/xen.png' },
      { titulo: 'Amigos ou Inimigos?', descricao: 'Mandado pelo governo, as forças H.E.C.U terá que invadir a Black Mesa e apagar a existência desse desastre. Tenha certeza de que nenhum Alien ou Cientista escape com vida. Tudo deve ser mantido em segredo.', tipo: 'hecu', imagem: 'assets/hecu.png' },
      { titulo: 'Mande tudo pelos ares', descricao: 'Entre na Black Mesa com as forças especiais Black Ops, que são altamente treinada para operações perigosas de alto risco, para acabar com a instalação toda.', tipo: 'black ops', imagem: 'assets/blackops_img.png' },
      { titulo: 'G-MAN', descricao: '...', tipo: 'gman', imagem: 'assets/gman.png' },
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


  entrarCampanha(camp: Campanha) {
    if (!camp.habilitado) return;
    alert(`Entrando na campanha: ${camp.titulo}`);
  }

  getCampanhasPorTipo(tipo: 'cientista' | 'hecu' | 'black ops' | 'gman') {
    return this.campanhas.filter(c => c.tipo === tipo);
  }
}

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
      { titulo: 'Black Mesa', descricao: 'A origem de tudo, o maior desastre já visto pelos cientistas.', tipo: 'cientista', imagem: 'assets/black_mesa_outside.png' },
      { titulo: 'XEN', descricao: 'Descubra a origem das criaturas e tecnologia alienígena.', tipo: 'cientista', imagem: 'assets/xen.png' },
      { titulo: 'Capture o responsável!', descricao: 'Missão do governo: elimine testemunhas e cientistas.', tipo: 'hecu', imagem: 'assets/hecu.png' },
      { titulo: 'Elimine tudo e a todos', descricao: 'Destrua a Black Mesa e todas as evidências.', tipo: 'black ops', imagem: 'assets/blackops_img.png' },
      { titulo: 'G-MAN', descricao: '???', tipo: 'gman', imagem: 'assets/gman.png' },
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

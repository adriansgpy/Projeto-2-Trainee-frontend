import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AudioService } from '../../services/soundtrack.service';
import { FormsModule } from '@angular/forms';
import { LENDAS } from '../game/lendas.model';


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
  capitulos: Capitulo[];
}

interface Campanha {
  titulo: string;
  descricao: string;
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
  { 
    titulo: 'Mula sem Cabeça', 
    descricao: 'Lute contra uma ameaça flamejante, mas cuidado, ela é rápida e pode cuspir fogo...', 
    imagem: 'assets/mula.png', 
    habilitado: true 
  },
  { 
    titulo: 'Cabeça de Cuia', 
    descricao: 'Um espírito travesso que prega peças e confunde viajantes nas noites de lua cheia.', 
    imagem: 'assets/cabeca_cuia.png', 
    habilitado: true 
  },
  { 
    titulo: 'Pé Grande', 
    descricao: 'Uma criatura gigantesca e evasiva, cuja presença é anunciada apenas por pegadas misteriosas.', 
    imagem: 'assets/pe_grande.png', 
    habilitado: true 
  },
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

        },
        error: (err) => console.error('Erro ao carregar personagens:', err)
      });

  }

  onPersonagemChange(personagem: Personagem) {

    this.personagemGlobalSelecionado = personagem;
    localStorage.setItem('personagemSelecionado', personagem._id);
   

  }



 entrarCampanha(camp: Campanha) {
  if (!camp.habilitado || !this.personagemGlobalSelecionado) {
    alert('Selecione um personagem válido antes de entrar na campanha!');
    return;
  }

  const personagem = this.personagemGlobalSelecionado;
  const lenda = LENDAS.find(l => l.nome === camp.titulo);
  if (!lenda) return;

  // Salva no localStorage
  localStorage.setItem('playerSelected', JSON.stringify(personagem));
  localStorage.setItem('lendaSelected', JSON.stringify(lenda));

  // Navega para o jogo
  this.router.navigateByUrl('/game');
}


  selecionarPersonagem(personagem: Personagem) {
    const rotaIntro = '/game';
    this.audioService.stopMusic();
    console.log("personagem: " + personagem.nome)
    //this.router.navigateByUrl(rotaIntro, { state: { personagem } });
  }

}

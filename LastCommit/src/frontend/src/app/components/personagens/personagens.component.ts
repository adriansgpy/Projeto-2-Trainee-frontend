import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Personagem {
  _id: string;
  nome: string;
  role: string;
  hpAtual: number;
  stamina: number;
  ataqueEspecial: string;
  image?: string;
}

@Component({
  selector: 'app-personagens',
  templateUrl: './personagens.component.html',
  styleUrls: ['./personagens.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class PersonagensComponent implements OnInit {
  characters: Personagem[] = [];

  classesDisponiveis = [
    { nome: 'Mago', descricao: 'Mestre de magias folclóricas, frágil fisicamente.', hp: 80, stamina: 100, ataqueEspecial: 'Lança feitiços que alteram o ambiente ou inimigos' },
    { nome: 'Marombeiro', descricao: 'Forte e resistente, especialista em combate físico.', hp: 120, stamina: 80, ataqueEspecial: 'Golpe poderoso de curta distância' },
    { nome: 'Cientista Doido', descricao: 'Inventivo, pode manipular o ambiente ou objetos.', hp: 90, stamina: 100, ataqueEspecial: 'Cria gadgets que causam efeitos variados' },
    { nome: 'Ninja', descricao: 'Ágil e sorrateiro, especialista em movimentos rápidos.', hp: 85, stamina: 90, ataqueEspecial: 'Ataque furtivo e esquiva rápida' },
    { nome: 'Mestre de Artes Marciais', descricao: 'Equilibrado, ótimo corpo a corpo e defesa.', hp: 110, stamina: 90, ataqueEspecial: 'Combo de ataques que causa dano extra' },
    { nome: 'Espartano', descricao: 'Forte e resistente, foco em defesa e sobrevivência.', hp: 130, stamina: 80, ataqueEspecial: 'Defesa impenetrável por um turno' },
  ];

  newCharacter: Partial<Personagem> = {
    nome: '',
    role: '',
    hpAtual: 100,
    stamina: 100,
    ataqueEspecial: ''
  };

  private apiUrl = 'http://127.0.0.1:8000/personagens';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCharacters();
  }

  getClasseSelecionada() {
    if (!this.newCharacter.role) return null;
    return this.classesDisponiveis.find(c => c.nome === this.newCharacter.role) || null;
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: token ? `Bearer ${token}` : '' });
  }

  loadCharacters() {
    this.http.get<Personagem[]>(this.apiUrl, { headers: this.getAuthHeaders() }).subscribe({
      next: (data) => {
        // Garante que _id seja string simples
        this.characters = data.map(c => ({
          ...c,
          _id: (c as any)._id?.$oid ? (c as any)._id.$oid : c._id
        }));
      },
      error: (err) => console.error('Erro ao carregar personagens:', err)
    });
  }

  onClasseChange(classeNome: string) {
    const classe = this.classesDisponiveis.find(c => c.nome === classeNome);
    if (classe) {
      this.newCharacter.hpAtual = classe.hp;
      this.newCharacter.stamina = classe.stamina;
      this.newCharacter.ataqueEspecial = classe.ataqueEspecial;
      this.newCharacter.role = classe.nome;
    }
  }

  createCharacter() {
    if (!this.newCharacter.nome || !this.newCharacter.role) return;

    const payload: Personagem = {
      _id: '',
      nome: this.newCharacter.nome!,
      role: this.newCharacter.role!,
      hpAtual: this.newCharacter.hpAtual!,
      stamina: this.newCharacter.stamina!,
      ataqueEspecial: this.newCharacter.ataqueEspecial!
    };

    this.http.post<Personagem>(this.apiUrl, payload, { headers: this.getAuthHeaders() }).subscribe({
      next: (created) => {
        created._id = (created as any)._id?.$oid ? (created as any)._id.$oid : created._id;
        this.characters.push(created);

        
        this.newCharacter = {
          nome: '',
          role: '',
          hpAtual: 100,
          stamina: 100,
          ataqueEspecial: ''
        };
      },
      error: (err) => console.error('Erro ao criar personagem:', err)
    });
  }

  viewCharacter(character: Personagem) {
    console.log('Visualizar personagem:', character);
  }

  deleteCharacter(character: Personagem) {
    this.http.delete(`${this.apiUrl}/${character._id}`, { headers: this.getAuthHeaders() }).subscribe({
      next: () => {
        this.characters = this.characters.filter(c => c._id !== character._id);
      },
      error: (err) => console.error('Erro ao deletar personagem:', err)
    });
  }
}

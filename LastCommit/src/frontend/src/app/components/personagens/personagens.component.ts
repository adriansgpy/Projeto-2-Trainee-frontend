import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Capitulo {
  titulo: string;
  completo: boolean;
  ultimoEvento?: string | null;
  historicoLLM: any[];
}

interface Personagem {
  _id: string;
  nome: string;
  role: string;
  age: number;
  image?: string;
  hpAtual: number;
  bateriaHEV: number;
  inventario: string[];
  ultimoCapitulo?: string | null;
  capitulos: Capitulo[];
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

  newCharacter: Partial<Personagem> = {
    nome: '',
    inventario: [],
    hpAtual: 100,
    bateriaHEV: 100,
    ultimoCapitulo: null
  };

  private apiUrl = 'http://127.0.0.1:8000/personagens';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCharacters();
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: token ? `Bearer ${token}` : '' });
  }

  loadCharacters() {
    this.http.get<Personagem[]>(this.apiUrl, { headers: this.getAuthHeaders() }).subscribe({
      next: (data) => {
        this.characters = data.map(c => ({
          ...c,
          _id: c._id ? c._id : c._id
        }));
      },
      error: (err) => console.error('Erro ao carregar personagens:', err)
    });
  }

  addItemToInventory(item: string) {
    if (item) this.newCharacter.inventario?.push(item);
  }

  removeItemFromInventory(index: number) {
    this.newCharacter.inventario?.splice(index, 1);
  }

  createCharacter() {
    if (!this.newCharacter.nome) return;

    const payload = { nome: this.newCharacter.nome };

    this.http.post<Personagem>(this.apiUrl, payload, { headers: this.getAuthHeaders() }).subscribe({
      next: (created) => {
        created._id = created._id ? created._id : created._id;
        this.characters.push(created);

        
        this.newCharacter = {
          nome: '',
          inventario: [],
          hpAtual: 100,
          bateriaHEV: 100,
          ultimoCapitulo: null
        };
      },
      error: (err) => console.error('Erro ao criar personagem:', err)
    });
  }

  viewCharacter(character: Personagem) {
    console.log('Visualizar personagem', character);
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

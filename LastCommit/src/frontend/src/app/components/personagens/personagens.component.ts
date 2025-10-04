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

  newCharacter: Partial<Personagem> = {
    nome: '',
    role: '',
    hpAtual: 100,
    ataqueEspecial: ''
  };

  classesDisponiveis = [
    { nome: 'Mago', descricao: 'Mestre de magias folclóricas, frágil fisicamente.', hp: 80,  ataqueEspecial: 'Lança feitiços que alteram o ambiente ou inimigos' },
    { nome: 'Marombeiro', descricao: 'Forte e resistente, especialista em combate físico.', hp: 120,  ataqueEspecial: 'Golpe poderoso de curta distância' },
    { nome: 'Cientista Doido', descricao: 'Inventivo, pode manipular o ambiente ou objetos.', hp: 90,  ataqueEspecial: 'Cria gadgets que causam efeitos variados' },
    { nome: 'Ninja', descricao: 'Ágil e sorrateiro, especialista em movimentos rápidos.', hp: 85, ataqueEspecial: 'Ataque furtivo e esquiva rápida' },
    { nome: 'Mestre de Artes Marciais', descricao: 'Equilibrado, ótimo corpo a corpo e defesa.', hp: 110,  ataqueEspecial: 'Combo de ataques que causa dano extra' },
    { nome: 'Espartano', descricao: 'Forte e resistente, foco em defesa e sobrevivência.', hp: 130, ataqueEspecial: 'Defesa impenetrável por um turno' },
  ];

  showValidationModal = false;
  showCharacterExistsModal = false;
  showSuccessModal = false;
  isSubmitting = false;

  showDeleteConfirmModal = false;
  characterToDelete: Personagem | null = null;
  showModal: boolean = false;
  modalMessage: string = '';
  modalType: 'error' | 'success' = 'success';

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
      this.newCharacter.ataqueEspecial = classe.ataqueEspecial;
      this.newCharacter.role = classe.nome;
    }
  }

  createCharacter() {
    const vazioRegex = /^\s*$/;

    if (!this.newCharacter.nome || vazioRegex.test(this.newCharacter.nome) || !this.newCharacter.role) {
      this.showValidationModal = true;
      return;
    }

    this.isSubmitting = true;

    const payload = this.newCharacter;

    this.http.post<Personagem>(this.apiUrl, payload, { headers: this.getAuthHeaders() }).subscribe({
      next: (created) => {
        created._id = (created as any)._id?.$oid ? (created as any)._id.$oid : created._id;
        this.characters.push(created);

        this.newCharacter = {
          nome: '',
          role: '',
          hpAtual: 100,
          ataqueEspecial: ''
        };

        this.isSubmitting = false;
        this.showSuccessModal = true;
      },
      error: (err) => {
        this.isSubmitting = false;
        if (err.status === 400 && err.error?.detail === "Você já possui um personagem com esse nome") {
          this.showCharacterExistsModal = true;
        } else {
          console.error('Erro ao criar personagem:', err);
        }
      }
    });
  }

  closeCharacterExistsModal() {
    this.showCharacterExistsModal = false;
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }
  
  closeValidationModal() {
    this.showValidationModal = false;
  }

  confirmDeleteCharacter(character: Personagem) {
    this.characterToDelete = character;
    this.showDeleteConfirmModal = true;
  }

  closeDeleteConfirmationModal() {
    this.showDeleteConfirmModal = false;
    this.characterToDelete = null;
  }

  executeDelete() {
    if (!this.characterToDelete) {
      this.closeDeleteConfirmationModal();
      return;
    }
    
    const idToDelete = this.characterToDelete._id;

    this.http.delete(`${this.apiUrl}/${idToDelete}`, { headers: this.getAuthHeaders() }).subscribe({
      next: () => {
        this.characters = this.characters.filter(c => c._id !== idToDelete);
        this.openModal(`Personagem ${this.characterToDelete?.nome} deletado com sucesso.`, 'success'); 
        this.closeDeleteConfirmationModal(); 
      },
      error: (err) => {
        this.openModal(`Erro ao deletar ${this.characterToDelete?.nome}.`, 'error');
        console.error('Erro ao deletar personagem:', err);
        this.closeDeleteConfirmationModal(); 
      }
    });
  }
  
  openModal(message: string, type: 'error' | 'success' = 'success') {
    this.modalMessage = message;
    this.modalType = type;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.modalMessage = '';
  }
}
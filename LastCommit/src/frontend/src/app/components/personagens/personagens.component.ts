import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-personagens',
  templateUrl: './personagens.component.html',
  styleUrls: ['./personagens.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule] 
})
export class PersonagensComponent implements OnInit {
  characters: any[] = [];

  newCharacter = {
    name: '',
    role: '',
    age: null as number | null,
    image: '',
    campaign: false
  };

  private apiUrl = 'http://127.0.0.1:8000/personagens';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCharacters();
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  loadCharacters() {
    this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() }).subscribe({
      next: (data) => {
        this.characters = data.map(c => ({
          ...c,
          _id: c._id.$oid ? c._id.$oid : c._id
        }));
      },
      error: (err) => console.error('Erro ao carregar personagens:', err)
    });
  }

  updateCharacterImage() {
    if (this.newCharacter.role === 'Cientista') {
      this.newCharacter.image = 'assets/cientist_1.jpg';
    } else if (this.newCharacter.role === 'Soldado') {
      this.newCharacter.image = 'assets/soldier.jpg';
    } else if(this.newCharacter.role == 'Black Ops'){
      this.newCharacter.image = 'assets/black_ops.jpg';
    }else if(this.newCharacter.role == 'G-MAN'){
      this.newCharacter.image = 'assets/gman.png';
    }
  }

  createCharacter() {
    if (!this.newCharacter.name || !this.newCharacter.role || !this.newCharacter.age) return;

    this.updateCharacterImage();

    this.http.post<any>(this.apiUrl, this.newCharacter, { headers: this.getAuthHeaders() }).subscribe({
      next: (created) => {
        created._id = created._id.$oid ? created._id.$oid : created._id;
        this.characters.push(created);

        this.newCharacter = {
          name: '',
          role: '',
          age: null,
          image: '',
          campaign: false
        };
      },
      error: (err) => console.error('Erro ao criar personagem:', err)
    });
  }

  viewCharacter(character: any) {
    console.log('Visualizar personagem', character);
  }

  deleteCharacter(character: any) {
    this.http.delete(`${this.apiUrl}/${character._id}`, { headers: this.getAuthHeaders() }).subscribe({
      next: () => {
        this.characters = this.characters.filter(c => c._id !== character._id);
      },
      error: (err) => console.error('Erro ao deletar personagem:', err)
    });
  }
}

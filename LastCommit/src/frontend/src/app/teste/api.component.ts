import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-teste',
  template: `
    <h1>Teste Angular ↔ FastAPI</h1>
    
    <button (click)="testarApi()">Chamar API</button>

    <p *ngIf="resposta">Resposta: {{ resposta }}</p>
    <p *ngIf="erro" style="color: red;">Erro: {{ erro }}</p>
  `
})
export class ApiComponent {

  resposta: string | null = null; 
  erro: string | null = null;    

  private apiUrl = 'http://127.0.0.1:8000/ping'; 

  constructor(private http: HttpClient) {}

    
  

  testarApi(): void {
    this.http.get<{ message: string }>(this.apiUrl).subscribe({
      next: (res) => {
        this.resposta = res.message; 
        this.erro = null;         
      },
      error: (err) => {
        this.erro = err.message;     
        this.resposta = null;
      }
    });
  }


}

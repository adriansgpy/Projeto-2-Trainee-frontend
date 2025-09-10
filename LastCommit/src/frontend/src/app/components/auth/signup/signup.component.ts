import { Component, Injectable } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './service';
import { UsuarioModel } from './usuarioModel';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule]
})

export class SignupComponent {
  nome = '';
  usuario = '';
  senha = '';
  confirmarSenha = '';
  resposta: string | null = null;
  erro: string | null = null;

  constructor(private router: Router, private authService : AuthService) {}

  gotologin(){
    this.router.navigate(['/login'])
  }

  registrar() : void{

    let usuarioModel = new UsuarioModel(this.nome, this.usuario, this.senha);

    console.log(this.nome, this.usuario, this.senha, this.confirmarSenha);


    this.authService.signup(usuarioModel).subscribe ({
       next: (res) =>{
        this.resposta = res.message;
        this.erro = null;
        console.log(this.resposta);
        this.gotologin();
       },
       error: (err)=>{
        this.erro = err.error?.message || 'Erro ao cadastrar';
        this.resposta = null;
        console.log(this.erro);
       } 
    }); 
  }
}
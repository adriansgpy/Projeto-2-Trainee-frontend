export class UsuarioModel {
  nome: string;
  nomeUsuario: string;
  senha: string;

  constructor(nome: string, usuario: string, senha: string) {
    this.nome = nome;
    this.nomeUsuario = usuario;
    this.senha = senha;
  }
}

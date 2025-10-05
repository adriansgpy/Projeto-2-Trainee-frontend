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
  classe?: string;
  inventario: string[];
  ultimoCapitulo: string | null;
  hpAtual: number;
  capitulos: Capitulo[];
}

interface Campanha {
  titulo: string;
  descricao: string;
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
  showNoCharacterModal: boolean = false; 

  constructor(
    private http: HttpClient,
    private router: Router,
    private audioService: AudioService
  ) {}

  ngOnInit() {

this.campanhas = [
  {
    titulo: "Loira do Banheiro",
    imagem: 'assets/loira.png',
    habilitado: true,
    descricao: "Devido à inflação violenta, os donos das lojas Boticário Make B e L’Oréal estão reclamando que a Loira do Banheiro anda assaltando as lojas do Rio de Janeiro. Vá e coloque um fim nesse absurdo!"
  },
  {
    titulo: "Pé Grande",
    imagem: 'assets/pe_grande_bar.png',
    habilitado: true,
    descricao: "Insatisfeito com os jogos caros na Steam, o Pé Grande decidiu largar os jogos e abrir um bar na floresta para abrigar as outras lendas. Porém, eles estão tocando músicas em um volume muito alto, perturbando os moradores da região. Extermine o bar do Pé Grande para que os trabalhadores CLT possam descansar em paz."
  },
  {
    titulo: "Corpo Seco",
    habilitado: true,
    imagem: 'assets/corpo_seco_bombado.jpg',
    descricao: "Corpo Seco ou Corpo Bombado? Sim, ele mudou de vida. Cansado de sofrer bullying, o Corpo Seco agora está frequentando as academias de São Paulo sem pagar e ainda está roubando whey dos marombeiros que encontra. Renato Cariani está contando com você para acabar com esse absurdo."
  },
  {
    titulo: "Mula sem Cabeça",
    habilitado: true,
    imagem: 'assets/mula_sem_cabeca_rua.png',
    descricao: "Ao criar uma conta no TikTok, a Mula agora faz lives à meia-noite, dando cavalos de pau e queimando postes da cidade para ganhar seguidores. Vá e cancele a Mula, mas cuidado com o que você faz ou fala, pois pode ser cancelado pelos seguidores."
  },
  {
    titulo: "Lobisomem",
    habilitado: true,
    imagem: 'assets/lobisomem_politico.jpg',
    descricao: "O Lobisomem está tentando entrar na política e se candidatar à presidência. Porém, ele é meio 'inapropriado' para receber o cargo. Vá até Brasília e retire-o do Palácio da Alvorada, mas cuidado, ele realmente quer ficar lá."
  },
  {
    titulo: "Slenderman",
    habilitado: true,
    imagem: 'assets/slender_shopping.png',
    descricao: "Sendo alto demais, ele está furioso tentando fazer com que os alfaiates confeccionem um terno para seus incríveis 2,5 metros, e ainda não quer pagar. Vá até o shopping e retire-o de lá."
  },
  {
    titulo: "Chupa-Cabra",
    habilitado: true,
    imagem: 'assets/chupa_cabra_prof.png',
    descricao: "Esse ser andou dando aulas na Alura sobre bolsa de valores e economia, mas seus estudantes estão reclamando que ele apenas vendia cursos falsos até ser removido da plataforma. Enfurecido, ele está ameaçando professores de economia por não ensinarem o estilo 'Economia Chupada' para seus alunos. Vá e mostre para ele com quantos reais se faz uma conta poupança."
  },
  {
    titulo: "Bicho-Papão",
    habilitado: true,
    imagem: 'assets/papao.jpg',
    descricao: "Influenciado pelo Chupa-Cabra, o Bicho-Papão está fazendo dinheiro de forma meio suja, aplicando golpes em pessoas por meio de pirâmides que prometem lucro dobrado. Ele deve estar em São Paulo em algum lugar…"
  },
  {
    titulo: "Boi da Cara Preta",
    habilitado: true,
    imagem: 'assets/boi_hacker.jpg',
    descricao: "Após assistir Gustavo Guanabara e aprender Python, o Boi anda hackeando pequenas lojas e espalhando vírus nas redes Wi-Fi. Vá e quebre seu notebook."
  }
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
          _id: (p as any)._id?.$oid ? (p as any)._id.$oid : (p as any)._id,
          classe: (p as any).role || 'Guerreiro'  
        }));

        if (this.personagens.length === 0) {
          this.showNoCharacterModal = true; 
        } 

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

  localStorage.setItem('playerSelected', JSON.stringify(personagem));
  localStorage.setItem('lendaSelected', JSON.stringify(lenda));

  this.router.navigateByUrl('/game');
}


  selecionarPersonagem(personagem: Personagem) {
    const rotaIntro = '/game';
    this.audioService.stopMusic();
    console.log("personagem: " + personagem.nome)
  }

}

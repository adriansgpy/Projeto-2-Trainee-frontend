export interface Lenda {
  nome: string;
  descricao: string;
  hp: number;
  ataqueEspecial: string;
  imagem?: string;
}

export const LENDAS: Lenda[] = [
  {
    nome: 'Loira do Banheiro',
    descricao: 'Devido à inflação violenta, os donos das lojas Boticário Make B e L’Oréal estão reclamando que a Loira do Banheiro anda assaltando as lojas do Rio de Janeiro. Vá e coloque um fim nesse absurdo!',
    hp: 80,
    ataqueEspecial: 'Susto Mortal: assusta o jogador, causando perda de turno',
    imagem: 'assets/loira_do_banheiro.png'
  },
  {
    nome: 'Pé Grande',
    descricao: 'Insatisfeito com os jogos caros na Steam, o Pé Grande decide largar os jogos e abrir um bar na floresta para abrigar as outras lendas. Porém, eles estão tocando músicas em um volume muito alto, perturbando os moradores da região. Extermine o bar do Pé Grande para que os trabalhadores CLT possam descansar em paz.',
    hp: 200,
    ataqueEspecial: 'Pisada Titânica: causa dano massivo e derruba o adversário',
    imagem: 'assets/pe_grande.png'
  },
  {
    nome: 'Corpo Seco',
    descricao: 'Corpo Seco ou Corpo Bombado? Sim, ele mudou de vida. Cansado de sofrer bullying, o Corpo Seco agora está frequentando as academias de São Paulo sem pagar e ainda está roubando whey dos marombeiros que encontra. Renato Cariani está contando com você para acabar com esse absurdo.',
    hp: 150,
    ataqueEspecial: 'Flex Fatal: ataque físico baseado em força extrema',
    imagem: 'assets/corpo_seco.png'
  },
  {
    nome: 'Mula sem Cabeça',
    descricao: 'Ao criar uma conta no TikTok, a Mula agora faz lives à meia-noite, dando cavalos de pau e queimando postes da cidade para ganhar seguidores. Vá e cancele a Mula, mas cuidado com o que você faz ou fala, pois pode ser cancelado pelos seguidores.',
    hp: 160,
    ataqueEspecial: 'Cavalo de Pau: causa dano e derruba inimigos próximos',
    imagem: 'assets/mula.png'
  },
  {
    nome: 'Lobisomem',
    descricao: 'O Lobisomem está tentando entrar na política e se candidatar à presidência. Porém, ele é meio "inapropriado" para receber o cargo. Vá até Brasília e retire-o do Palácio da Alvorada, mas cuidado, ele realmente quer ficar lá.',
    hp: 180,
    ataqueEspecial: 'Uivo Devastador: dano em área e diminui a defesa do inimigo',
    imagem: 'assets/lobisomem.png'
  },
  {
    nome: 'Slenderman',
    descricao: 'Sendo alto demais, ele está furioso tentando fazer com que os alfaiates confeccionem um terno para seus incríveis 2,5 metros, e ainda não quer pagar. Vá até o shopping e retire-o de lá.',
    hp: 220,
    ataqueEspecial: 'Tentáculos Assustadores: imobiliza o jogador por 1 turno',
    imagem: 'assets/slenderman.png'
  },
  {
    nome: 'Chupa-Cabra',
    descricao: 'Esse ser andou dando aulas na Alura sobre bolsa de valores e economia, mas seus estudantes estão reclamando que ele apenas vendia cursos falsos até ser removido da plataforma. Enfurecido, ele está ameaçando professores de economia por não ensinarem o estilo "Economia Chupada" para seus alunos. Vá e mostre para ele com quantos reais se faz uma conta poupança.',
    hp: 140,
    ataqueEspecial: 'Soco Econômico: rouba stamina do inimigo',
    imagem: 'assets/chupa_cabra.png'
  },
  {
    nome: 'Bicho-Papão',
    descricao: 'Influenciado pelo Chupa-Cabra, o Bicho-Papão está fazendo dinheiro de forma meio suja, aplicando golpes em pessoas por meio de pirâmides que prometem lucro dobrado. Ele deve estar em São Paulo em algum lugar…',
    hp: 160,
    ataqueEspecial: 'Medo Contagioso: causa confusão e perda de turno',
    imagem: 'assets/bicho_papao.png'
  },
  {
    nome: 'Boi da Cara Preta',
    descricao: 'Após assistir Gustavo Guanabara e aprender Python, o Boi anda hackeando pequenas lojas e espalhando vírus nas redes Wi-Fi. Vá e quebre seu notebook.',
    hp: 190,
    ataqueEspecial: 'Chifre Letal: ataque físico devastador',
    imagem: 'assets/boi_cara_preta.png'
  }
];

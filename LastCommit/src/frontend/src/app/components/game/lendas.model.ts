export interface Lenda {
  nome: string;
  descricao: string;
  hp: number;
  stamina: number;
  ataqueEspecial: string;
  imagem?: string;
}

export const LENDAS: Lenda[] = [
  {
    nome: 'Mula sem Cabeça',
    descricao: 'Uma criatura flamejante e veloz, que pode cuspir fogo e assustar qualquer viajante. A lenda gosta muito de humilhar o jogador de forma engraçada.',
    hp: 150,
    stamina: 80,
    ataqueEspecial: 'Chama Ardente: cospe fogo causando dano contínuo',
    imagem: 'assets/mula.png'
  },
  {
    nome: 'Cabeça de Cuia',
    descricao: 'Estranha e sorrateira, essa lenda é capaz de desaparecer rapidamente e atacar de surpresa.',
    hp: 120,
    stamina: 100,
    ataqueEspecial: 'Golpe Sorrateiro: ataque crítico de surpresa',
    imagem: 'assets/cabeca_cuia.png'
  },
  {
    nome: 'Pé Grande',
    descricao: 'Gigante e musculoso, usa sua força bruta para esmagar qualquer coisa à sua frente. A lenda gosta muito de humilhar o jogador de forma engraçada.',
    hp: 200,
    stamina: 100,
    ataqueEspecial: 'Pisada Titânica: causa dano massivo e derruba o adversário',
    imagem: 'assets/pe_grande.png'
  }
];

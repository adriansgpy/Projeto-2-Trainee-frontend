import { Component } from '@angular/core';

@Component({
  selector: 'app-jogo',
  templateUrl: './jogo.component.html',
  styleUrls: ['./jogo.component.scss']
})
export class jogoComponent {
  chapterTitle: string = "Materiais Desconhecidos";
  chapterImage: string = "assets/bmib.png";

  player = {
    hp: 100,
    maxHp: 100,
    hevBattery: 80,
    inventory: ["Pistola", "Medkit", "Chave"]
  };



  chooseAction(action: string) {
    
  }


}

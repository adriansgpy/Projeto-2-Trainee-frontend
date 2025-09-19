import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rpg',
  templateUrl: './jogo.component.html',
  styleUrls: ['./jogo.component.scss'],
  standalone: true,
})
export class jogoComponent implements OnInit {
  storyLog: string[] = [
    "Você acorda em um corredor escuro da Black Mesa...",
    "O som distante de tiros ecoa pelos túneis.",
  ];

  actions: string[] = ["Avançar", "Examinar o local", "Esperar"];

  player = {
    hp: 100,
    energy: 50,
    inventory: ["Pistola", "Kit Médico"],
  };

  ngOnInit() {}

  chooseAction(action: string) {
    if (action === "Avançar") {
      this.storyLog.push("Você segue pelo corredor em direção ao som dos tiros...");
      this.actions = ["Atacar", "Se esconder"];
    } else if (action === "Examinar o local") {
      this.storyLog.push("Você encontra um rádio quebrado no chão.");
      this.player.inventory.push("Rádio quebrado");
      this.actions = ["Avançar", "Esperar"];
    } else if (action === "Esperar") {
      this.storyLog.push("O tempo passa... algo se aproxima!");
      this.player.hp -= 10;
    }
  }
}

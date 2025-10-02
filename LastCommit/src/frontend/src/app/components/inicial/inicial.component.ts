import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-inicial',
  templateUrl: './inicial.component.html',
  styleUrls: ['./inicial.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class InicialComponent implements OnInit, OnDestroy {
  currentDateTime: string;
  private dateTimeInterval: any;

  constructor(private router: Router) {
    this.currentDateTime = this.getFormattedDateTime();
  }

  ngOnInit(): void {
    this.dateTimeInterval = setInterval(() => {
      this.currentDateTime = this.getFormattedDateTime();
    }, 1000);
  }

  logout(): void {
    // Remove o token do localStorage
    localStorage.removeItem('token');

    // Redireciona para a tela inicial
    this.router.navigate(['/login']); // ou '/inicial', conforme sua rota
  }

  ngOnDestroy(): void {
    clearInterval(this.dateTimeInterval);
  }

  private getFormattedDateTime(): string {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    return now.toLocaleString('pt-BR', options);
  }
}

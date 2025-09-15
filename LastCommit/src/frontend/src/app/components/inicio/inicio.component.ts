import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule]
})
export class InicioComponent implements OnInit, OnDestroy {
  currentDateTime: string;
  private dateTimeInterval: any;

  constructor() {
    this.currentDateTime = this.getFormattedDateTime();
  }

  ngOnInit(): void {
    this.dateTimeInterval = setInterval(() => {
      this.currentDateTime = this.getFormattedDateTime();
    }, 1000);
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
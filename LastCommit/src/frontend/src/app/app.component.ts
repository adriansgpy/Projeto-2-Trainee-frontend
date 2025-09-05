import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Deixamos esse import
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'RPG-Trainee';
}
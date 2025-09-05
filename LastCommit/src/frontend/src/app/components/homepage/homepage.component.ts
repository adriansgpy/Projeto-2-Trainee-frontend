import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule]
})
export class HomepageComponent {
  username = '';
  password = '';
  confirmPassword = '';
  isGlitching = false; 

  constructor(private router: Router) {}
 
 
  

  
}

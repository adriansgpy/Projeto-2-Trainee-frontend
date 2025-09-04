import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
  standalone: true
})
export class IntroComponent { 

   constructor(private router: Router) { }

  goToLogin() {
    this.router.navigate(['/login']); 
  }
    
}

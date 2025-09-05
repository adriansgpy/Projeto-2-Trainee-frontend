import { AfterViewInit, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule] 
})
export class LoginComponent{
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}


   gotosignup(){
      this.router.navigate(['/signup'])
   }



  

}

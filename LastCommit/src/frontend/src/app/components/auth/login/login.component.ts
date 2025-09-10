import { AfterViewInit, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
  private apiUrl = 'http://127.0.0.1:8000/ping'; 
  resposta: string | null = null;
  erro: string | null = null; 
  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}
  gotosignup(){
    this.router.navigate(['/signup'])
  }

  testarApi(): void {
      event?.preventDefault();
      this.http.get<{ message: string }>(this.apiUrl).subscribe({
        next: (res) => {
          this.resposta = res.message; 
          this.erro = null;    
          console.log(this.resposta)      
        },
        error: (err) => {
          
          this.erro = err.message;   
          this.resposta = null;
          console.log(this.resposta)  
        }
      });
    }

  

}

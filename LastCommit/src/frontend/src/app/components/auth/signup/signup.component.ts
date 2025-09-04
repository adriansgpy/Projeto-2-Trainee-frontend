import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  signup() {
    if (this.password !== this.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    this.authService.register(this.username, this.password).subscribe(
      () => {
        alert('Conta criada com sucesso! Entre na escuridão...');
        this.router.navigate(['/login']);
      },
      () => {
        alert('Erro ao criar a conta.');
      }
    );
  }
}

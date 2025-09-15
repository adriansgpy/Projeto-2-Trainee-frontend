import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import {HomepageComponent} from './components/homepage/homepage.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { CampanhasComponent } from './components/campanhas/campanhas.component';
import { PersonagensComponent } from './components/personagens/personagens.component';

export const routes: Routes = [
  // Esta rota redireciona para o login por padrão
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // A HOMEPAGE AGORA É A ROTA PAI
  {
    path: 'homepage',
    component: HomepageComponent,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' }, // Rota padrão da homepage
      { path: 'inicio', component: InicioComponent },
      { path: 'campanhas', component: CampanhasComponent },
      { path: 'personagens', component: PersonagensComponent }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  
}
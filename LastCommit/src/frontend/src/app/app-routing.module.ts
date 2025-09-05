import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import {HomepageComponent} from './components/homepage/homepage.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { CampanhasComponent } from './components/campanhas/campanhas.component';
import { PersonagensComponent } from './components/personagens/personagens.component';

export const routes: Routes = [
  { path: 'inicio', component: InicioComponent },
  { path: 'campanhas', component: CampanhasComponent },
  { path: 'personagens', component: PersonagensComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {path : 'homepage', component : HomepageComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
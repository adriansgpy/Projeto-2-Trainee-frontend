import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { HevIntroComponent } from './components/intro/HEV/hev_intro.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  {
    path: 'homepage',
    component: HomepageComponent,
    children: [
      { path: '', redirectTo: 'inicial', pathMatch: 'full' },
      { path: 'inicial', loadComponent: () => import('./components/inicial/inicial.component').then(m => m.InicialComponent) },
      { path: 'campanhas', loadComponent: () => import('./components/campanhas/campanhas.component').then(m => m.CampanhasComponent) },
      { path: 'personagens', loadComponent: () => import('./components/personagens/personagens.component').then(m => m.PersonagensComponent) },
    ]
  },

  {
    path: 'intro/cientista',
    loadComponent: () => import('./components/intro/cientista-intro/cientista_intro.component').then(m => m.CientistaIntroComponent)
  },

  {
    path: 'game',
    loadComponent: () => import('./components/game/jogo.component').then(m => m.jogoComponent)
  },

  {
    path: 'intro/HEV',
    loadComponent: () => import('./components/intro/HEV/hev_intro.component').then(m => m.HevIntroComponent)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
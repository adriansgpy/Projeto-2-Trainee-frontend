import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { IntroComponent } from './components/intro/intro.component';

export const routes: Routes = [
  { path: '', component: IntroComponent },  
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent }
];

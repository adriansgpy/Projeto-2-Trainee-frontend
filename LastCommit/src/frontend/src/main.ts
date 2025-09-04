import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app-routing.module';

// Inicializa a aplicação com o AppComponent standalone
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes) // fornece as rotas para <router-outlet>
  ]
})
.catch(err => console.error(err));

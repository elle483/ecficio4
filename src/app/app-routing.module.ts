import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsHomeComponent } from './events-home/events-home.component';
import { EventsRegisterComponent } from './events-register/events-register.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { Page404Component } from './page404/page404.component';

const routes: Routes = [
  { path: '',    
    redirectTo: 'home',    
    pathMatch: 'full'    
  }, 
  { path: 'home', component: HomeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'eregister', component: EventsRegisterComponent},
  { path: 'header', component: HeaderComponent},
  { path: 'footer', component: FooterComponent},
  { path: 'ehome', component: EventsHomeComponent},
  { path: '404', component: Page404Component},
  { path:'**', 
    pathMatch: 'full', 
    redirectTo: '404',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

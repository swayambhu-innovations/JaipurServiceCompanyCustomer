import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NoInternetComponent } from './no-internet/no-internet.component';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'unauthorized/login',
    pathMatch: 'full'
  },
  {
    path: 'authorized',
    loadChildren: () => import('./authorized/authorized.module').then( m => m.AuthorizedPageModule)
  },
  {
    path: 'unauthorized',
    loadChildren: () => import('./unauthorized/unauthorized.module').then( m => m.UnauthorizedPageModule)
  },
  {
    path: 'no-internet',
    component: NoInternetComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

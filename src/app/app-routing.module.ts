import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

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
    loadChildren: () => import('./no-internet/no-internet.module').then( m => m.NoInternetPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

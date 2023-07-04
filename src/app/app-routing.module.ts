import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },  {
    path: 'select-slot',
    loadChildren: () => import('./select-slot/select-slot.module').then( m => m.SelectSlotPageModule)
  },
  {
    path: 'select-payment-method',
    loadChildren: () => import('./select-payment-method/select-payment-method.module').then( m => m.SelectPaymentMethodPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

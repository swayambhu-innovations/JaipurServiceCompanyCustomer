import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'fetch-address',
    pathMatch: 'full',
  },
  {
    path: 'authorized',
    loadChildren: () =>
      import('./authorized/authorized.module').then(
        (m) => m.AuthorizedPageModule
      ),
  },
  {
    path: 'unauthorized',
    loadChildren: () =>
      import('./unauthorized/unauthorized.module').then(
        (m) => m.UnauthorizedPageModule
      ),
  },
  {
    path: 'no-internet',
    loadChildren: () =>
      import('./no-internet/no-internet.module').then(
        (m) => m.NoInternetPageModule
      ),
  },
  {
    path: 'privacy-policy',
    loadChildren: () =>
      import(
        './authorized/footer-web/privacy-policy/privacy-policy.module'
      ).then((m) => m.PrivacyPolicyPageModule),
  },
  {
    path: 'tnc',
    loadChildren: () =>
      import('./authorized/footer-web/tnc/tnc.module').then(
        (m) => m.TncPageModule
      ),
  },
  {
    path: 'refund-policy',
    loadChildren: () =>
      import('./authorized/footer-web/refund-policy/refund-policy.module').then(
        (m) => m.RefundPolicyPageModule
      ),
  },
  {
    path: 'fetch-address',
    loadChildren: () =>
      import('./fetch-address/fetch-address.module').then(
        (m) => m.FetchAddressPageModule
      ),
  },
  {
    path: 'update-app',
    loadChildren: () =>
      import('./update-app/update-app.module').then(
        (m) => m.UpdateAppPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

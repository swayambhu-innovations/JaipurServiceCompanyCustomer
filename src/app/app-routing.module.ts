import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'select-address',
    loadChildren: () => import('./select-address/select-address.module').then(m => m.SelectAddressPageModule)
  },
  {
    path: 'refer-afriend',
    loadChildren: () => import('./refer-afriend/refer-afriend.module').then( m => m.ReferAfriendPageModule)
  },
  {
    path: 'no-notification',
    loadChildren: () => import('./Notification/no-notification/no-notification.module').then( m => m.NoNotificationPageModule)
  },
  {
    path: 'notification',
    loadChildren: () => import('./Notification/notification/notification.module').then( m => m.NotificationPageModule)
  },
  {
    path: 'new-address',
    loadChildren: () => import('./new-address/new-address.module').then( m => m.NewAddressPageModule)
  },
  {
    path: 'booking',
    loadChildren: () => import('./booking/booking.module').then( m => m.BookingPageModule)
  },
  {
    path: 'all-categories',
    loadChildren: () => import('./all-categories/all-categories.module').then( m => m.AllCategoriesPageModule)
  },
  
 

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AllCategoriesComponent } from './all-categories/all-categories.component';
import { AcRepairComponent } from './ac-repair/ac-repair.component';
import { NoNotificationComponent } from './Notification/no-notification/no-notification.component';
import { NotificationComponent } from './Notification/notification/notification.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  { path: 'All-Categories', component: AllCategoriesComponent },
  { path: 'Ac-Repair', component: AcRepairComponent },
  { path: 'No-Notification', component: NoNotificationComponent },
  { path: 'Notification', component: NotificationComponent },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

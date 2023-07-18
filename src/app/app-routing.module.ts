import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AllCategoriesComponent } from './all-categories/all-categories.component';

import { NoNotificationComponent } from './Notification/no-notification/no-notification.component';
import { NotificationComponent } from './Notification/notification/notification.component';
import { HomeComponent } from './home/home.component';
import { ReferAFriendComponent } from './refer-afriend/refer-afriend.component';
import { NewAddressComponent } from './new-address/new-address.component';
import { SelectAddressComponent } from './select-address/select-address.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: 'All-Categories', component: AllCategoriesComponent },
  { path: 'No-Notification', component: NoNotificationComponent },
  { path: 'Notification', component: NotificationComponent },
  { path: 'Refer-A-Friend', component: ReferAFriendComponent },
  {
    path: 'Add-Address', component: NewAddressComponent
  },
  {
    path: 'Select-Address', component: SelectAddressComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

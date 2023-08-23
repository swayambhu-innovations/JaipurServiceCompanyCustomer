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
    path: 'search',
    loadChildren: () => import('./search/search.module').then(m => m.SearchPageModule)
  },
  {
    path: 'select-slot',
    loadChildren: () => import('./select-slot/select-slot.module').then(m => m.SelectSlotPageModule)
  },
  {
    path: 'select-payment-method',
    loadChildren: () => import('./select-payment-method/select-payment-method.module').then(m => m.SelectPaymentMethodPageModule)
  },
  {
    path: 'confirm-booking',
    loadChildren: () => import('./confirm-booking/confirm-booking.module').then(m => m.ConfirmBookingPageModule)
  },
  {
    path: 'order-placed',
    loadChildren: () => import('./order-placed/order-placed.module').then(m => m.OrderPlacedPageModule)
  },
  {
    path: 'rating',
    loadChildren: () => import('./rating/rating.module').then(m => m.RatingPageModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.module').then(m => m.CartPageModule)
  },
  {
    path: 'select-address',
    loadChildren: () => import('./select-address/select-address.module').then(m => m.SelectAddressPageModule)
  },
  {
    path: 'offers',
    loadChildren: () => import('./offers/offers.module').then(m => m.OffersPageModule)
  },
  {
    path: 'offers',
    loadChildren: () => import('./offers/offers.module').then(m => m.OffersPageModule)
  },
  {
    path: 'empty-cart',
    loadChildren: () => import('./empty-cart/empty-cart.module').then(m => m.EmptyCartPageModule)
  },
  {
    path: 'new-address',
    loadChildren: () => import('./new-address/new-address.module').then(m => m.NewAddressPageModule)
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
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'reschedule',
    loadChildren: () => import('./reschedule/reschedule.module').then( m => m.ReschedulePageModule)
  },
 
  {
    path: 'booking-details',
    loadChildren: () => import('./booking/booking-details/booking-details.module').then( m => m.BookingDetailsPageModule)
  },  {
    path: 'booking-empty',
    loadChildren: () => import('./booking-empty/booking-empty.module').then( m => m.BookingEmptyPageModule)
  }

  
 

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

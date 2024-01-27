import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizedPage } from './authorized.page';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AuthorizedPage,
    children:[
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
        canActivate:[AuthGuard]
      },
      {
        path: 'search',
        loadChildren: () => import('./search/search.module').then(m => m.SearchPageModule),
        canActivate:[AuthGuard]
      },
      {
        path: 'select-slot',
        loadChildren: () => import('./select-slot/select-slot.module').then(m => m.SelectSlotPageModule),
        canActivate:[AuthGuard]
      },
      {
        path: 'select-payment-method',
        loadChildren: () => import('./select-payment-method/select-payment-method.module').then(m => m.SelectPaymentMethodPageModule),
        canActivate:[AuthGuard]
      },
      {
        path: 'confirm-booking',
        loadChildren: () => import('./confirm-booking/confirm-booking.module').then(m => m.ConfirmBookingPageModule),
        canActivate:[AuthGuard]
      },
      {
        path: 'order-placed',
        loadChildren: () => import('./order-placed/order-placed.module').then(m => m.OrderPlacedPageModule),
        canActivate:[AuthGuard]
      },
      {
        path: 'rating',
        loadChildren: () => import('./rating/rating.module').then(m => m.RatingPageModule),
        canActivate:[AuthGuard]
      },
      {
        path: 'cart/:mainCategoryId/:serviceId',
        loadChildren: () => import('./cart/cart.module').then(m => m.CartPageModule),
        canActivate:[AuthGuard]
      },
      {
        path: 'select-address',
        loadChildren: () => import('./select-address/select-address.module').then(m => m.SelectAddressPageModule),
        canActivate:[AuthGuard]
      },
      {
        path: 'offers',
        loadChildren: () => import('./offers/offers.module').then(m => m.OffersPageModule),
        canActivate:[AuthGuard]
      },
      // {
      //   path: 'offers',
      //   loadChildren: () => import('./offers/offers.module').then(m => m.OffersPageModule),
      //   canActivate:[AuthGuard]
      // },
      {
        path: 'empty-cart',
        loadChildren: () => import('./empty-cart/empty-cart.module').then(m => m.EmptyCartPageModule),
        canActivate:[AuthGuard]
      },
      {
        path: 'new-address',
        loadChildren: () => import('./new-address/new-address.module').then(m => m.NewAddressPageModule),
        canActivate:[AuthGuard]
      },
      {
        path: 'refer-afriend',
        loadChildren: () => import('./refer-afriend/refer-afriend.module').then( m => m.ReferAfriendPageModule),
        canActivate:[AuthGuard]
      },
      {
        path: 'no-notification',
        loadChildren: () => import('./Notification/no-notification/no-notification.module').then( m => m.NoNotificationPageModule),
        canActivate:[AuthGuard]
      },
      {
        path: 'notification',
        loadChildren: () => import('./Notification/notification/notification.module').then( m => m.NotificationPageModule),
        canActivate:[AuthGuard]
      },
      {
        path: 'booking',
        loadChildren: () => import('./booking/booking.module').then( m => m.BookingPageModule),
        canActivate:[AuthGuard]
      },
      {
        path: 'all-categories',
        loadChildren: () => import('./all-categories/all-categories.module').then( m => m.AllCategoriesPageModule),
        canActivate:[AuthGuard]
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule),
        canActivate:[AuthGuard]
      },
      {
        path: 'contact-us',
        loadChildren: () => import('./contact-us/contact-us.module').then( m => m.ContactUsModule),
        canActivate:[AuthGuard]
      },
      {
        path: 'faq',
        loadChildren: () => import('./faq/faq.module').then( m => m.FaqModule),
        canActivate:[AuthGuard]
      },
      {
        path: 'reschedule',
        loadChildren: () => import('./reschedule/reschedule.module').then( m => m.ReschedulePageModule),
        canActivate:[AuthGuard]
      },
     
      {
        path: 'booking-details',
        loadChildren: () => import('./booking/booking-details/booking-details.module').then( m => m.BookingDetailsPageModule),
        canActivate:[AuthGuard]
      },
      {
        path: 'booking-empty',
        loadChildren: () => import('./booking-empty/booking-empty.module').then( m => m.BookingEmptyPageModule),
        canActivate:[AuthGuard]
      },
      {
        path: 'sub-Categories/:mainCategoryId',
        loadChildren: () => import('./sub-categories/sub-categories.module').then(m => m.SubCategoryPageModule),
        // canActivate:[AuthGuard]
      },
      {
        path: 'category-services/:mainCategoryId/:categoryId',
        loadChildren: () => import('./sub-categories/sub-categories.module').then(m => m.SubCategoryPageModule),
        // canActivate:[AuthGuard]
      },
      {
        path: 'services/:mainCategoryId/:subCategoryId',
        loadChildren: () => import('./services/services.module').then( m => m.ServicesPageModule),
        canActivate:[AuthGuard]
      },
      {
        path: 'service-detail/:mainCategoryId/:subCategoryId/:serviceId',
        loadChildren: () => import('./service-detail/service-detail.module').then( m => m.ServiceDetailPageModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthorizedPageRoutingModule {}

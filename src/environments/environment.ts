// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'jaipurservicecompany',
    appId: '1:681472195786:web:719dc69aeaeac9dca84833',
    storageBucket: 'jaipurservicecompany.appspot.com',
    apiKey: 'AIzaSyB8ZRsNXh-riduNzJgC7ZmxJtk7zTm3QxE',
    authDomain: 'jaipurservicecompany.firebaseapp.com',
    messagingSenderId: '681472195786',
    measurementId: 'G-RCFP3GVMRL',
  },
  cloudFunctions : {
    createOrder: 'http://localhost:5001/jaipurservicecompany/us-central1/createOrder',
    capturePayment: 'http://localhost:5001/jaipurservicecompany/us-central1/capturePayments',
    createSubscription: 'http://localhost:5001/jaipurservicecompany/us-central1/createSubscription',
    verifySubscription:'http://localhost:5001/jaipurservicecompany/us-central1/verifySubscription',
    checkSubscriptionStatus:'http://localhost:5001/jaipurservicecompany/us-central1/checkSubscriptionStatus',
  },
  RAZORPAY_KEY_ID: 'rzp_test_8cTBlk022y2EDq',
  production: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

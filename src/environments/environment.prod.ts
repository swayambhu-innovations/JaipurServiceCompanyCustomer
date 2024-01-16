export const environment = {
  firebase: {
    projectId: 'jaipurservicecompany-demo',
    appId: '1:592897926378:web:745b9967d8c4c55442a393',
    storageBucket: 'jaipurservicecompany-demo.appspot.com',
    apiKey: 'AIzaSyC0PwTRC1PBl8Sd4jthJpO9htBnhBnZldA',
    authDomain: 'jaipurservicecompany-demo.firebaseapp.com',
    messagingSenderId: '592897926378',
    measurementId: 'G-51TVQ41FLB',
    functionURL: 'https://us-central1-jaipurservicecompany-demo.cloudfunctions.net/',
  },
  cloudFunctions : {
    createOrder: 'https://us-central1-jaipurservicecompany-demo.cloudfunctions.net/createOrder',
    getOrderById: 'https://us-central1-jaipurservicecompany-demo.cloudfunctions.net/getOrderById?id=',
    capturePayment: 'https://us-central1-jaipurservicecompany-demo.cloudfunctions.net/capturePayments',
    createSubscription: 'https://us-central1-jaipurservicecompany.cloudfunctions.net/createSubscription',
    verifySubscription:'https://us-central1-jaipurservicecompany.cloudfunctions.net/verifySubscription',
    checkSubscriptionStatus:'https://us-central1-jaipurservicecompany.cloudfunctions.net/checkSubscriptionStatus',
  },
  RAZORPAY_KEY_ID: 'rzp_live_bcGiIPGrH5iZE4',
  RAZORPAY_DOMAIN:'https://api.razorpay.com/v1/',
  production: true
};

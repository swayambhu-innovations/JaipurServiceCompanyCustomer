const functions = require('firebase-functions');
const Razorpay = require('razorpay');
let request = require('request');
const cryptoLib = require('crypto');

var corsOptions = {
  origin: function (origin: any, callback: any) {
    callback(null, true);
    // if (whitelist.indexOf(origin) !== -1) {
    //   callback(null, true);
    // } else {
    //   callback(new Error('Not allowed by CORS'));
    // }
  },
};
const cors = require('cors')(corsOptions);
// ---- Live keys ----
let key_id = 'rzp_test_8cTBlk022y2EDq';

let key_secret = 'ybRsi5dG5RbrftoA4uK9593s';
// // --- Live keys ----
// let key_id = 'rzp_live_8hEmHG2aEOtNa8';
// let key_secret = 'qfV59uWWXaI7gJBP1cSbSUyE';

let instance = new Razorpay({
  key_id: key_id,
  key_secret: key_secret,
});

exports.verifySubscription = functions.https.onRequest((req: any, res: any) => {
  return cors(req, res, () => {
    const hmac = cryptoLib.createHmac('sha256', key_secret);
    hmac.update(
      req.body.razorpay_payment_id + '|' + req.body.razorpay_subscription_id,
      key_secret
    );
    let generatedSignature = hmac.digest('hex');
    // const result = instance.payments.paymentVerification({
    //   'subscription_id':req.body.subscription_id,
    //   'payment_id':req.body.payment_id,
    //   'signature':req.body.signature,
    // },key_secret)
    // console.log(req.body.razorpay_signature);
    // console.log(generatedSignature);
    if (generatedSignature == req.body.razorpay_signature) {
      // console.log('Signature verified');
      res.status(200).send({ verified: true });
    } else {
      // console.log('Signature not verified');
      res.status(400).send({ verified: false });
    }
  });
  // console.log(result);
});
// exports.checkSubscriptionStatus = functions.https.onRequest(
//   (req: any, res: any) => {
//     // console.log(req.body);
//     return cors(req, res, () => {
//       // console.log(req.body);
//       instance.subscriptions
//         .fetch(req.body.subscriptionId)
//         .then((result: any) => {
//           res.status(200).send(result);
//         })
//         .catch((error: any) => {
//           res.status(400).send(error);
//         });
//     });
//   }
// );
exports.createOrder = functions.https.onRequest((req: any, res: any) => {
  return cors(req, res, () => {
    let options = {
      amount: req.body.amount,
      currency: 'INR',
      receipt: req.body.receipt,
    };
    instance.orders.create(options, (err: any, order: any) => {
      order ? res.status(200).send({...order,key:key_id}) : res.status(500).send(err);
    });
  });
});

exports.createSubscription = functions.https.onRequest((req: any, res: any) => {
  return cors(req, res, () => {
    let options = {
      plan_id: req.body.plan_id,
      total_count: 12,
      quantity: req.body.quantity,
      expire_by: req.body.expire_by,
      customer_notify: 1,
      notes: req.body.notes,
    };
    // console.log(options);
    instance.subscriptions.create(options, (err: any, order: any) => {
      order ? res.status(200).send(order) : res.status(500).send(err);
    });
  });
});

exports.capturePayments = functions.https.onRequest((req: any, res: any) => {
  return cors(req, res, () => {
    request(
      {
        method: 'POST',
        url: `https://${key_id}:${key_secret}@api.razorpay.com/v1/payments/${req.body.payment_id}/capture`,
        form: {
          amount: req.body.amount,
        },
      },
      (error: any, response: any, body: any) => {
        response
          ? res.status(200).send({
              res: response,
              req: req.body,
              body: body,
            })
          : res.status(500).send(error);
      }
    );
  });
});

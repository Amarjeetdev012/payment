import crypto from 'crypto';

export function validateWebhookSignature(body, signature, secret) {
  if (!isDefined(body) || !isDefined(signature) || !isDefined(secret)) {
    throw Error(
      'Invalid Parameters: Please give request body,' +
        'signature sent in X-Razorpay-Signature header and ' +
        'webhook secret from dashboard as parameters'
    );
  }
  body = body.toString();
  var expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  return expectedSignature === signature;
}

function isDefined(value) {
  return typeof value !== 'undefined';
}

export function validatePaymentVerification(
  { razorpayOrderId, razorpayPaymentId },
  signature,
  key_secret
) {
  var signature = signature;
  var secret = key_secret;
  var paymentId = razorpayPaymentId;
  if (!secret) {
    throw new Error('secret is mandatory');
  }
  if (isDefined(razorpayOrderId) === true) {
    var orderId = razorpayOrderId;
    var payload = orderId + '|' + paymentId;
  } else if (isDefined(params.subscription_id) === true) {
    var subscriptionId = params.subscription_id;
    var payload = paymentId + '|' + subscriptionId;
  } else if (isDefined(params.payment_link_id) === true) {
    var paymentLinkId = params.payment_link_id;
    var paymentLinkRefId = params.payment_link_reference_id;
    var paymentLinkStatus = params.payment_link_status;
    var payload =
      paymentLinkId +
      '|' +
      paymentLinkRefId +
      '|' +
      paymentLinkStatus +
      '|' +
      paymentId;
  } else {
    throw new Error('Either order_id or subscription_id is mandatory');
  }
  return validateWebhookSignature(payload, signature, secret);
}

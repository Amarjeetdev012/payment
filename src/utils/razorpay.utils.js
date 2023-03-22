import crypto from 'crypto';

export function validateWebhookSignature(body, signature, secret) {
  if (!isDefined(body) || !isDefined(signature) || !isDefined(secret)) {
    throw Error('error from verify signature');
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
  } else {
    throw new Error('Either order_id or subscription_id is mandatory');
  }
  return validateWebhookSignature(payload, signature, secret);
}

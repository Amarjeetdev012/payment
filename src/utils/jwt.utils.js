import jwt from 'jsonwebtoken';

export const generateToken = async (payload, secret) => {
  return await jwt.sign(payload, secret);
};

export const verifyToken = (token, secret) => {
  let decode;
  jwt.verify(token, secret, function (err, decoded) {
    if (err) {
      return resizeBy.status(400).send({ status: false, message: err });
    }
    decode = decoded;
  });
  return decode;
};

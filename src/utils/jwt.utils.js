import jwt from 'jsonwebtoken';

export const generateToken = async () => {
  let token;
  jwt.sign(payload, secret, (error, encoded) => {
    if (err) {
      return resizeBy.status(400).send({ status: false, message: err });
    }
    token = encoded;
  });
  return token;
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

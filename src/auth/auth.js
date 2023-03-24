import bcrypt from 'bcrypt';
import { jwt_secret } from '../config.js';
import { User } from '../model/user.model.js';
import { generateToken, verifyToken } from '../utils/jwt.utils.js';

export const register = async (req, res) => {
  try {
    let data = req.body;
    const { fname, lname, email, password } = data;
    const user = await User.findOne({ email: email });

    if (user) {
      return res
        .status(400)
        .send({ status: false, message: 'user already registered' });
    }
    const hashPassword = bcrypt.hashSync(password, 10);
    data.password = hashPassword;
    await User.create(data);
    data.password = undefined;
    return res
      .status(201)
      .send({ status: true, message: 'user created', data });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const login = async (req, res) => {
  try {
    const data = req.body;
    const { email, password } = data;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).send({ status: false, message: 'user not found' });
    }
    let token;
    bcrypt.compare(password, user.password, async (err, result) => {
      if (err) {
        return res
          .status(400)
          .send({ status: false, message: 'wrong password' });
      }
      if (user && jwt_secret) {
        token = await generateToken({ id: user._id, email: email }, jwt_secret);
      }
      // res.set('Authorization', `Bearer ${token}`);
      res.cookie('token', token, {
        maxAge: 864000,
        httpOnly: true,
      });
      return res
        .status(200)
        .send({ status: true, message: 'user login successfully', token });
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const validAdmin = async (req, res, next) => {
  try {
    const data = req.cookies.token;
    // const data = req.get('authorization');
    if (!data) {
      return res
        .status(400)
        .send({ status: false, message: 'invalid validation method' });
    }
    if (data) {
      //   const auth = data.split(' ');
      //   if (auth[0] !== 'Bearer') {
      //     return res.status(400).send(res, `invalid validation method`);
      //   }
      const token = verifyToken(data, jwt_secret);
      if (token) {
        next();
      }
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err });
  }
};

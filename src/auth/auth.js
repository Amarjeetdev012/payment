import { verifyToken } from '../utils/jwt.utils.js';
import { User } from '../model/user.model.js';
import { jwt_secret } from '../config.js';

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
    return res
      .status(201)
      .send({ status: true, message: 'user created', user });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const login = async (req, res) => {
  try {
    let data = req.body;
    const { email, password } = data;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).send({ status: false, message: 'user not found' });
    }
    let token;
    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        return res
          .status(400)
          .send({ status: false, message: 'wrong password' });
      }
      token = generateToken({ id: user._id, email: email }, jwt_secret);
    });
    return res
      .status(200)
      .send({ status: true, message: 'user login successfully', token });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const validAdmin = async (req, res, next) => {
  try {
    const data = req.get('authorization');
    if (data) {
      const auth = data.split(' ');
      if (auth[0] !== 'Bearer') {
        return res.status(400).send(res, `invalid validation method`);
      }
      const token = verifyToken(auth[1], jwt_secret);
      if (token) {
        next();
      }
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err });
  }
};

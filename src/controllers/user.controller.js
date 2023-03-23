import { User } from '../model/user.model.js';

export const register = async (req, res) => {
  let data = req.body;
  const { fname, lname, email, password } = data;
  const user = await User.findOne({ email: email });
  if (user) {
    return res
      .status(400)
      .send({ status: false, message: 'user already registered' });
  }
  await User.create(data);
  return res.status(201).send({ status: true, message: 'user created', user });
};

export const login = async(req,res) => {
    let data = req.body
    const {email,password} = data
    const user = await User.findOne({email:email})
    if(!user){
return res.status(404).send({status:false,message:'user not found'})
    }
    
}

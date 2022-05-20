const CreateError = require('http-errors');
const { User } = require('../models/User-model.js');
const { HTTP_STATUS_CODE, STATUS } = require('../helpers/constants.js');

const EmailService = require("../service/email/service");
const SenderSendgrid = require("../service/email/sender");
const HttpCode = require('../lib/constants.js');

///////signup


const signup = async (req, res) => {
  const { name, email, password } = req.body;

  const userExist = await User.findOne({ email });
  if (userExist) {
    throw new CreateError(`User with ${email} already exist`);
  }

  const newUser = new User({
    name,
    email
  });

  newUser.setHashPassword(password);
  newUser.setToken();
  newUser.save();

  const emailService = new EmailService(process.env.NODE_ENV, new SenderSendgrid())
  const isVerifyEmailSent = await emailService.sendVerifyEmail(email, name, newUser.verificationToken)

  return res.status(HTTP_STATUS_CODE.CREATED).json({
    status: STATUS.CREATED,
    code: HTTP_STATUS_CODE.CREATED,
    payload: {
      user: {
        name: newUser.name,
        email: newUser.email
      },
      isVerifyEmailSent: isVerifyEmailSent,
      token: newUser.token
    },
  });
};


//// login 

const login = async (req, res) => {
  const { email, password } = req.body;
  const userExist = await User.findOne({ email });

  if (!userExist || !userExist.comparePassword(password)) {
    throw new CreateError(`Invalid credentials`);
  }  
  else if (!userExist.verified) {
    res.json({ status: STATUS.FAIL, code: HttpCode.NOT_FOUND, message: "user was not verified" })
    return
  }

 
  userExist.save();

  res.json({
    status: STATUS.SUCCESS,
    code: HTTP_STATUS_CODE.OK,
    payload: {
      token: userExist.token,
      user: {
        name: userExist.name,
        email: userExist.email
      },
    },
  });
};



//// logout


const logout = async (req, res) => {
  const { id } = req.user;
  await User.findByIdAndUpdate(id, { token: null });

  res.json({
    status: STATUS.OK,
    code: HTTP_STATUS_CODE.NO_CONTENT,
    message: "logout successful"
  });
};

module.exports = { logout, login, signup };
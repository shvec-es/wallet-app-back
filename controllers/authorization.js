const CreateError = require('http-errors');
const { User } = require('../models/User-model.js');
const { HTTP_STATUS_CODE, STATUS } = require('../helpers/constants.js');

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
  newUser.save();

  return res.status(HTTP_STATUS_CODE.CREATED).json({
    status: STATUS.CREATED,
    code: HTTP_STATUS_CODE.CREATED,
    payload: {
      user: {
        name: newUser.name,
        email: newUser.email
      },
    },
  });
};


//// login 

const login = async (req, res) => {
  const { email, password } = req.body;
  const userExist = await User.findOne({ email });

  if (!userExist || !userExist.comparePassword(password)) {
    throw new CreateError(`Email or password is wrong`);
  }

  userExist.setToken();
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

  res.status(HTTP_STATUS_CODE.NO_CONTENT).json({
    status: STATUS.OK,
    code: HTTP_STATUS_CODE.NO_CONTENT,
  });
};

module.exports = { logout, login, signup };
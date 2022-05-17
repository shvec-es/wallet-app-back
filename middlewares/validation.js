const jwt = require('jsonwebtoken');
const Joi = require('joi');
const CreateError = require('http-errors');
const { HTTP_STATUS_CODE, MESSAGES, USER_NAME_LIMIT, USER_PASSWORD_LIMIT } = require('../helpers/constants.js');
const { regexName, regexEmail } = require('../helpers/regex');

const { User } = require('../models/User-model.js');

const { SECRET_KEY } = process.env;

const validateAuth = async (req, _, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization?.split(' ');

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    const checkingTokenBearerUser =
      bearer !== MESSAGES.BEARER || !user || !user.token;
    if (checkingTokenBearerUser) {
      throw new CreateError(MESSAGES.NOTAUTHORIZED);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.message === MESSAGES.INVALIDSIGNATURE || MESSAGES.JWTEXPIRED) {
      error.status = HTTP_STATUS_CODE.UNAUTHORIZED;
    }

    next(error);
  }
};

const validateBody = (scheme) => async (req, res, next) => {
    try {
        await scheme.validateAsync(req.body);
        next();
    } catch (error) {
        return res
            .status(400)
            .json({ status: "error", code: 400, message: error.message });
    }
};


const validationSignupUser = Joi.object({
  name: Joi.string()
    .pattern(regexName)
    .min(USER_NAME_LIMIT.MIN)
    .max(USER_NAME_LIMIT.MAX)
    .required()
    .messages({
      'any.required': 'Name is required',
      'string.empty': 'The name cannot be empty',
    }),
  email: Joi.string().pattern(regexEmail).required().messages({
    'any.required': 'Email is required',
    'string.empty': 'The email cannot be empty',
  }),
  password: Joi.string()
    .min(USER_PASSWORD_LIMIT.MIN)
    .max(USER_PASSWORD_LIMIT.MAX)
    .required()
    .messages({
      'any.required': 'Password is required',
      'string.empty': 'The password cannot be empty',
    })
});




const validationLoginUser = Joi.object({
  email: Joi.string().pattern(regexEmail).required().messages({
    'any.required': 'Email is required',
    'string.empty': 'The email cannot be empty',
  }),
  password: Joi.string()
    .min(USER_PASSWORD_LIMIT.MIN)
    .max(USER_PASSWORD_LIMIT.MAX)
    .required()
    .messages({
      'any.required': 'Password is required',
      'string.empty': 'The password cannot be empty',
    }),
});


module.exports = { validateAuth, validateBody, validationSignupUser, validationLoginUser };
import jwt from 'jsonwebtoken';
import CreateError from 'http-errors';
import { HTTP_STATUS_CODE, MESSAGES } from '../helpers/constants.js';

import { User } from '../models/User-model.js';

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

export { validateAuth };




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

export {validateBody}
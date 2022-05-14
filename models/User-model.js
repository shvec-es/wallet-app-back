import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { regexName, regexEmail } from '../helpers/regex.js';
import {
    USER_NAME_LIMIT,
    USER_EMAIL_LIMIT,
    USER_PASSWORD_LIMIT,
} from '../helpers/constants.js';

const {Schema, model} = mongoose


const validateName = name => regexName.test(name);
const validateEmail = email => regexEmail.test(email);

const userSchema = Schema(
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
      minlength: USER_NAME_LIMIT.MIN,
      maxlength: USER_NAME_LIMIT.MAX,
      required: [true, 'Name is required'],
      validate: [validateName, 'Please fill a valid name'],
      match: [regexName, 'Please fill a valid name'],
    },
    email: {
      type: String,
      index: true,
      trim: true,
      lowercase: true,
      minlength: USER_EMAIL_LIMIT.MIN,
      maxlength: USER_EMAIL_LIMIT.MAX,
      required: [true, 'Email  is required'],
      validate: [validateEmail, 'Please fill a valid email address'],
      match: [regexEmail, 'Please fill a valid email address'],
      unique: true,
    },
    password: {
      type: String,
      minlength: USER_PASSWORD_LIMIT.MIN,
      maxlength: USER_PASSWORD_LIMIT.MAX,
      required: [
        true,
        'Password is required and must be at least 6 characters long',
      ],
    },
    token: {
      type: String,
      required: [false, "Token isn't required"],
      default: null,
    },
  },
  { versionKey: false, timestamps: true },
);

userSchema.methods.setHashPassword = function (password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.setToken = function () {
  const { SECRET_KEY } = process.env;
  this.token = jwt.sign({ id: this._id }, SECRET_KEY, { expiresIn: '1h' });
};

userSchema.methods.updateSubscription = function (newSubscription) {
  this.subscription = newSubscription;
};

const User = model('user', userSchema);

export { User, userSchema };
const express = require("express")
const { login, logout, signup } = require("../../controllers/authorization.js");
const { validateAuth, validateBody, validationSignupUser, validationLoginUser } = require("../../middlewares/validation.js");
const { controlWrapper } = require("../../middlewares/controlWrapper.js");

const router = new express.Router();

router.post('/signup', validateBody(validationSignupUser), controlWrapper(signup));

router.post('/login', validateBody(validationLoginUser), controlWrapper(login));

router.get('/logout', validateAuth, controlWrapper(logout));

module.exports = router;

const express = require("express")
const { login, logout, signup } = require("../../controllers/authorization.js");
const { validateAuth } = require("../../middlewares/validation.js");
const { controlWrapper } = require("../../middlewares/controlWrapper.js");


const router = new express.Router();

router.post('/signup', controlWrapper(signup));

router.post('/login', controlWrapper(login));

router.get('/logout', validateAuth, controlWrapper(logout));

module.exports = router;

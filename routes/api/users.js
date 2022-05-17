const express = require("express")
const { validateAuth } = require("../../middlewares/validation.js");
const { controlWrapper } = require("../../middlewares/controlWrapper.js");
const { currentUser } = require("../../controllers/currentUser.js");

const { verifyUser, repeatEmailForVerifyUser } = require('../../controllers/verifyUsers')
const validateRepeatVerification = require('./usersValidation');


const router = new express.Router();


router.get("/current", validateAuth, controlWrapper(currentUser));

router.get('/verify/:token', verifyUser)
router.post('/verify', validateRepeatVerification, repeatEmailForVerifyUser)


module.exports = router;

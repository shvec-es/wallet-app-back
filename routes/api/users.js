const express = require("express")
const { validateAuth } = require("../../middlewares/validation.js");
const { controlWrapper } = require("../../middlewares/controlWrapper.js");
const { currentUser } = require("../../controllers/currentUser.js");


const router = new express.Router();


router.get("/current", validateAuth, controlWrapper(currentUser));


module.exports = router;

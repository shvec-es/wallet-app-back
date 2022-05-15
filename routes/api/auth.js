import express from "express"
import { login, logout, signup } from "../../controllers/authorization.js";
import { validateAuth } from "../../middlewares/validation.js";
import { controlWrapper } from "../../middlewares/controlWrapper.js";


const router = new express.Router();

router.post('/signup', controlWrapper(signup));

router.post('/login', controlWrapper(login));

router.get('/logout', validateAuth, controlWrapper(logout));

export default router;

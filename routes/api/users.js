import express from "express"
import { validateAuth } from "../../middlewares/validation.js";
import { controlWrapper } from "../../middlewares/controlWrapper.js";
import { currentUser } from "../../controllers/currentUser.js";


const router = new express.Router();


router.get("/current", validateAuth, controlWrapper(currentUser));


export default router;

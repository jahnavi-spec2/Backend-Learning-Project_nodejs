import {Router } from "express";
import {registerUser } from "../controllers/auth.controllers.js";
import {validate} from "../middlewares/validator.middleware.js";
import { userRegisterValidator } from "../validators/index.js";

const router=Router();

router.route("/register").post(userRegisterValidator(),
validate, registerUser);// note this userRegisterValidator fnc will run and so will extract all teh errors..
// and this errors collected needs too be passed to validate fnc inside mw.js
// validate is the mw...all the errrors are collected in the fnc used here...which is passed to validate the mw

router.route("/login").post(login);
export default router;
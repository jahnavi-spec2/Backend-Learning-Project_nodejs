import {Router } from "express";
import {registerUser,login ,logoutUser, getCurrentUser,verifyEmail,resendEmailVerification,forgotPasswordRequest,resetforgotPassword,refreshAccessToken,changeCurrentPassword} from "../controllers/auth.controllers.js";
import {validate} from "../middlewares/validator.middleware.js";
import { userForgotPasswordValidator,
 userChangeCurrentPasswordValidator,
  userRegisterValidator  ,userLoginValidator,userResetForgotPasswordValidator } from "../validators/index.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
const router=Router();

// secure rooutes
router.route("/register").post(userRegisterValidator(),
validate, registerUser);// note this userRegisterValidator fnc will run and so will extract all teh errors..
// and this errors collected needs too be passed to validate fnc inside mw.js
// validate is the mw...all the errrors are collected in the fnc used here...which is passed to validate the mw
// secure routes
router.route("/login").post(userLoginValidator(),validate,login);

router.route("/verify-email/:verificationToken").get(verifyEmail)

router.route("/refresh-token").post(refreshAccessToken)
router.route("/forgot-password ").post(userForgotPasswordValidator(), validate,forgotPasswordRequest)

router.route("/reset-password/:resetToken").post(userResetForgotPasswordValidator(), validate,resetforgotPassword)


// secure routes...need verification
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").post(verifyJWT,getCurrentUser);
router.route("/change-password").post(verifyJWT,userChangeCurrentPasswordValidator(),validate,changeCurrentPassword);
router.route("/resend-email-verification").post(verifyJWT,resendEmailVerification);


export default router;

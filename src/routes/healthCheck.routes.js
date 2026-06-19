import {Router } from "express";
import {healthCheck } from "../controllers/healthCheck.controllers.js";


const router=Router();

router.route("/").get(healthCheck);// cjeck in app.js section where we made a common route...act as home one  can add anything later ahead of it say instagram
// router.route("/instagram").get(healthCheck);

export default router;
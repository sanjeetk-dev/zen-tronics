import express from "express";
import passport from "passport";
import { loginSuccess, logout, getMe  } from "../controllers/auth.controller.js";
import {isAuthenticated} from '../middlewares/auth.middleware.js'
const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => res.redirect("/api/v1/auth/success")
);

router.get("/success", loginSuccess);
router.get("/logout",isAuthenticated, logout);
router.get('/me',isAuthenticated, getMe)

export default router;
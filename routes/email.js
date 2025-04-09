import express from "express";
import { generateEmailVerificationCode, resetPassword } from "../controllers/emailController.js";

const emailRouter = express.Router();

emailRouter.post("/request-reset-password", resetPassword);
emailRouter.post("/generate-verification-code", generateEmailVerificationCode)

export default emailRouter;
import express from "express";
import * as userCont from "../controller/User.controller.js";
import * as userMiddle from "../middleware/userMiddle.js";

const userRouter = express.Router();

// Route for creating a new user
userRouter.route("/createUser").post(userCont.createUser);

// Route for sending OTP email
userRouter.route("/sendEmail").post(userCont.sendEmail);

// Route for verifying the email with OTP
userRouter.route("/verifyEmail").post(userCont.verifyEmail);

// // Route for updating user name
userRouter.route("/update").put(userMiddle.decodeUserJWT, userCont.updateUser);

// Route for forgetting password (send OTP)
userRouter.route("/forgetPassword").post(userCont.forgetPassword);

// You can add more routes as needed

export { userRouter };

import express from "express";
import { registerUser } from "../controllers/userControl.js";
import { loginUser } from "../controllers/userControl.js";

const userRouter = express.Router();

userRouter.post("/",registerUser)

userRouter.post("/login",loginUser)

export default userRouter
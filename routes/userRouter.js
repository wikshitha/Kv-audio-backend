import express from "express";
import { blockOrUnblockUser, getAllUsers, getUser, loginWithGoogle, registerUser } from "../controllers/userControl.js";
import { loginUser } from "../controllers/userControl.js";

const userRouter = express.Router();

userRouter.post("/",registerUser)

userRouter.post("/login",loginUser)

userRouter.get("/all",getAllUsers)

userRouter.put("/block/:email",blockOrUnblockUser)

userRouter.post("/google",loginWithGoogle)

userRouter.get("/",getUser)

export default userRouter
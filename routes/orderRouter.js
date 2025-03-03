import express from "express";
import { createOrder } from "../controllers/orderControl.js";

const orderRouter = express.Router();

orderRouter.post("/",createOrder)

export default orderRouter
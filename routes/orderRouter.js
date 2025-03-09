import express from "express";
import { createOrder, getQuote } from "../controllers/orderControl.js";


const orderRouter = express.Router();

orderRouter.post("/",createOrder)
orderRouter.post("/quote",getQuote)

export default orderRouter
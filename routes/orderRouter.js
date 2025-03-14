import express from "express";
import { approveOrRejectOrder, createOrder, getOrders, getQuote } from "../controllers/orderControl.js";


const orderRouter = express.Router();

orderRouter.post("/",createOrder)
orderRouter.post("/quote",getQuote)
orderRouter.get("/",getOrders)
orderRouter.put("/status/:id",approveOrRejectOrder)

export default orderRouter
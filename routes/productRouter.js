import express from "express";
import { addProduct, deleteProduct } from "../controllers/productControl.js";

const productRouter = express.Router();

productRouter.post("/",addProduct)

productRouter.delete("/",deleteProduct)

export default productRouter
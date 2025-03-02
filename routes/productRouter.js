import express from "express";
import { addProduct,getProduct,deleteProduct, updateProduct, getProductByKey } from "../controllers/productControl.js";

const productRouter = express.Router();

productRouter.post("/",addProduct)
productRouter.get("/",getProduct)
productRouter.put("/:key",updateProduct)
productRouter.delete("/:key",deleteProduct)
productRouter.get("/:key",getProductByKey)  

export default productRouter
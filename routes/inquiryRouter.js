import express from "express";
import { addInquiry, deleteInquiry, getInquiries, updateInquiry } from "../controllers/inquiryControl.js";

const inquiryRouter = express.Router();

inquiryRouter.post("/",addInquiry);
inquiryRouter.get("/",getInquiries)
inquiryRouter.delete("/:id",deleteInquiry)
inquiryRouter.put("/:id",updateInquiry)

export default inquiryRouter
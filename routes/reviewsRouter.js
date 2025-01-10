import express from "express";
import { addReview } from "../controllers/reviewsControl.js";
import { getReviws } from "../controllers/reviewsControl.js";
import { deleteReview } from "../controllers/reviewsControl.js";
import { approveReview } from "../controllers/reviewsControl.js";

const reviewsRouter = express.Router();
reviewsRouter.post("/",addReview)
reviewsRouter.get("/",getReviws)
reviewsRouter.delete("/:email",deleteReview)
reviewsRouter.put("/approve/:email",approveReview)

export default reviewsRouter
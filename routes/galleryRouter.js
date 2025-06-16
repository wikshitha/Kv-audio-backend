import express from "express";
import { addGallery, deleteGallery, getGallery } from "../controllers/galleryControl.js";

const galleryRouter = express.Router();

galleryRouter.post("/",addGallery)
galleryRouter.get("/",getGallery)
galleryRouter.delete("/:key",deleteGallery)
 

export default galleryRouter
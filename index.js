import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import reviewsRouter from "./routes/reviewsRouter.js";
import inquiryRouter from "./routes/inquiryRouter.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use((req,res,next)=>{
    let token = req.header
    ("Authorization");

    if(token !=null){
        token = token.replace("Bearer ","");

        jwt.verify(token,process.env.JWT_SECRET,
            (err,decoded)=>{
                if(!err){
                    req.user = decoded;
            }
        }
        )
    }
    next();
})


let mongoUrl = process.env.MONGO_URL

mongoose.connect(mongoUrl)

let connection = mongoose.connection
connection.once("open",()=>{
    console.log("Mongodb connection succes");
    
})

app.use("/api/users",userRouter)
app.use("/api/products",productRouter)
app.use("/api/reviews",reviewsRouter)
app.use("/api/inquiries",inquiryRouter)

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
    
})

// "email": "kumaradoe@example.com", -customer
// "password": "securePassword123",

// "email": "kumaradoe1@example.com", -admin
//     "password": "123",
import express from "express"
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import jwt from "jsonwebtoken"

const app = express();

app.use(bodyParser.json());
app.use((req,res,next)=>{
    let token = req.header
    ("Authorization");

    if(token !=null){
        token = token.replace("Bearer ","");

        jwt.verify(token,"kv-secret-89",
            (err,decoded)=>{
                if(!err){
                    req.user = decoded;
            }
        }
        )
    }
    next();
})


let mongoUrl ="mongodb+srv://admin:1234@cluster0.hhhjs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(mongoUrl)

let connection = mongoose.connection
connection.once("open",()=>{
    console.log("Mongodb connection succes");
    
})

app.use("/api/users",userRouter)
app.use("/api/products",productRouter)

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
    
})

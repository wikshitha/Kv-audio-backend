import User from "../models/user.js";
import bcrypt from "bcrypt";

export function registerUser(req,res) {

    const data = req.body;

    data.password = bcrypt.hashSync(data.password,10)

    const newUser = new User(req.body)

    newUser.save().then(()=>{
        res.json({message: "User Registered Successfully"})
    }).catch((error)=>{
        res.status(500).json({message:"User Registration Failed"})
    })
}

export function loginUser(req,res) {
    const data = req.body;

    User.findOne({
        email : data.email
    }).then((user)=>{
        if(user == null) {
            res.status(404).json({message:"User Not Found"})
        }else {
            const isPasswordCorrect = bcrypt.compareSync(data.password,user.password);
            if(isPasswordCorrect) {
                res.json({message:"User Logged In Successfully"})
            }else {
                res.status(401).json({message:"Incorrect Password"})
        }
    }})
}
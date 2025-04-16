import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
import nodemailer from "nodemailer";
import OTP from "../models/otp.js";

dotenv.config();

const transport = nodemailer.createTransport({
    service : "gmail",
    host : "smtp.gmail.com",
    port : 587,
    secure : false,
    auth : {
        user : "uminduwikshitha@gmail.com",
        pass : "evmhxfanmirommxl"
    }
})


export function registerUser(req,res) {

    const data = req.body;

    data.password = bcrypt.hashSync(data.password,10)

    const newUser = new User(data);
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
            if(user.isBloked){
                res.status(403).json({error: "Your account is blocked please contact the admin"});
                return;
              }

            const isPasswordCorrect = bcrypt.compareSync(data.password,user.password);
            if(isPasswordCorrect) {
                const token = jwt.sign({
                    firstname : user.firstName,
                    lastname : user.lastName,
                    email : user.email,
                    role : user.role,
                    profilePic : user.profilePic,
                    phone : user.phone,
                    emailVerified : user.emailVerified
                },process.env.JWT_SECRET);

                res.json({message:"User Logged In Successfully",token: token,user: user})
            }else {
                res.status(401).json({message:"Incorrect Password"})
        }
    }})
}
export function isItAdmin(req) {
    let isAdmin = false

   
  if(req.user != null){
    if(req.user.role == "Admin"){
      isAdmin = true;
    }
  }
  return isAdmin;
 }

export function isItCustomer(req) {
    let isCustomer = false

    if(req.user != null){
        if(req.user.role == "Customer"){
          isCustomer = true;
        }
      }
    
      return isCustomer;      
    }

export async function getAllUsers(req,res) {
    if(isItAdmin(req)) {
        try{
            const users = await User.find();
            res.json(users)
        }catch(error) {
            res.status(500).json({message:"User Get Failed"})
        }
        }else {
            res.status(403).json({message:"You are not an Admin,Only the Admin can get all users"})
    }
}    

export async function blockOrUnblockUser(req,res) {
    const email = req.params.email;

    if(isItAdmin(req)) {
        try{
            const user = await User.findOne({email:email});

            if(user == null) {
                res.status(404).json({message:"User Not Found"})
                return;
            }

            const isBloked = !user.isBloked;

                await User.updateOne(
                    {
                        email : email
                    },
                    {
                        isBloked : isBloked
                    }
                )
                res.json({message:"User Blocked/Unblocked Successfully"})
            
        }
        catch(error) {
            res.status(500).json({message:"User Get Failed"})
        }
        }else {
            res.status(403).json({message:"You are not an Admin,Only the Admin can block or unblock a user"})
    }

}
export function getUser(req,res){
    if(req.user != null){
      res.json(req.user);
    }else{
      res.status(403).json({error: "Unauthorized"});
    }
}

export async function loginWithGoogle(req,res) {
    const accessToken = req.body.accessToken;
    console.log(accessToken)

    try {
    const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo",{
        headers : {
            Authorization : `Bearer ${accessToken}`
        }
    })

    console.log(response.data)
    const user = await User.findOne({
        email : response.data.email
    });

    if(user != null) {
        const token = jwt.sign({
            firstname : user.firstName,
            lastname : user.lastName,
            email : user.email,
            role : user.role,
            profilePic : user.profilePic,
            phone : user.phone,
            emailVerified : true
        },process.env.JWT_SECRET);

        res.json({message:"User Logged In Successfully",token: token,user: user})
    } else {
        const newUser = new User({
            email : response.data.email,
            password : "123",
            firstName : response.data.given_name,
            lastName : response.data.family_name,
            profilePic : response.data.picture,
            address : "Not Given",
            phone : "Not Given",
            emailVerified : true
        })
        const savedUser = await newUser.save();

        const token = jwt.sign({
            firstname : savedUser.firstName,
            lastname : savedUser.lastName,
            email : savedUser.email,
            role : savedUser.role,
            profilePic : savedUser.profilePic,
            phone : savedUser.phone
        },process.env.JWT_SECRET);

        res.json({message:"User Logged In Successfully",token: token,user: savedUser})
    }
} catch (error) {
    console.log(error)
    res.status(500).json({message:"Invalid Access Token"})
    return;
}
}
export async function sendOTP(req,res) {
    if(req.user == null) {
        res.status(401).json({message:"Please login and try again"})
        return
    }

    const otp = Math.floor(1000 + Math.random() * 9000)

    const newOTP = new OTP({
        email : req.user.email,
        otp : otp
    })

    await newOTP.save();

   const message = {
    from : "uminduwikshitha@gmail.com",
    to : req.user.email,
    subject : "Validating OTP",
    text : "Your OTP Code is " + otp
   }

   transport.sendMail(message,(error,info)=>{
    if(error) {
        console.log(error)
        res.status(500).json({message:"OTP Sending Failed"})
        return;
    }else {
        console.log(info)
    res.json({message:"OTP Sent Successfully"})
    }
   })

}

export async function verifyOTP(req,res) {
    if(req.user == null) {
        res.status(401).json({message:"Please login and try again"})
        return
    }

    const code = req.body.code;

    const otp = await OTP.findOne({
        email : req.user.email,
        otp : code
    })

    if(otp == null) {
        res.status(404).json({message:"Invalid OTP"})
        return;
    }else {
        await OTP.deleteOne({
            email : req.user.email,
            otp : code
        })

        await User.updateOne({
            email : req.user.email
        },{
            emailVerified : true
        })

        res.status(200).json({message:"OTP Verified Successfully"})
    }

}

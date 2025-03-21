import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

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
            if(user.isBlocked){
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
                    phone : user.phone
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

            const isBlocked = !user.isBlocked;

                await User.updateOne(
                    {
                        email : email
                    },
                    {
                        isBlocked : isBlocked
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
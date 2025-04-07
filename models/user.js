import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    isBloked : {
        type : Boolean,
        required : true,
        default : false
    },
    role : {
        type : String,
        required : true,
        default : "Customer"
    },
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true
    },
    profilePic : {
        type : String,
        required : true,
        default : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    },
    emailVerified : {
        type : Boolean,
        required : true,
        default : false
    }
})

const User = mongoose.model("User", userSchema);

export default User;

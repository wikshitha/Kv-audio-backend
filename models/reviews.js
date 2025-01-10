import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    name : {
        type : String,
        required : true
    },
    rating : {
        type : Number,
        required : true
    },
    coment : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        required : true,
        default : Date.now()
    },
    isApproved : {
        type : Boolean,
        required : true,
        default : false
    },
    profilePic : {
        type : String,
        required : true,
        default : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    }
})

const Review = mongoose.model("review",reviewSchema);

export default Review
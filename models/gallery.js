import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
    key : {
        type : String,
        required : true,
        unique : true
    },
    image : {
        type : String,
        required : true,
        default : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    },
    description : {
        type : String,
        required : true
    },
})

const Gallery = mongoose.model("gallery",gallerySchema);

export default Gallery
import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
    key : {
        type : String,
        required : true,
        unique : true
    },
    images : {
        type : [String],
        required : true,
        default : ["https://images.unsplash.com/photo-1523275335684-37898b6caf38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"]
    },
    description : {
        type : String,
        required : true
    },
})

const Gallery = mongoose.model("gallery",gallerySchema);

export default Gallery
import Product from "../models/product.js";

export function addProduct(req,res) {
    console.log(req.user)

    if(req.user == null) {
        res.status(401).json({message:"Please login and try again"})
        return
    }
    if(req.user.role != "Admin") {
        res.status(403).json({message:"Only Admins can add products"})
        return
    }
    const data = req.body;

    const newProduct = new Product(data);

    newProduct.save().then(()=>{
        res.json({message:"Product Added Successfully"})
    }).catch((error)=>{
        res.status(500).json({message:"Product Addition Failed"})
    })
}

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

export function deleteProduct(req,res) {
    console.log(req.user)

    if(req.user == null) {
        res.status(401).json({message:"Please login and try again"})
        return
    }
    if(req.user.role != "Admin") {
        res.status(403).json({message:"Only Admins can delete products"})
        return
    }
    const productId = req.body.id;
    console.log(productId)
    if(!productId) {
        res.status(400).json({message:"Product Id is required"})
        return
    }
 
    Product.findByIdAndDelete(productId).then((deletedProduct)=>{
        if(!deletedProduct) {
           return res.status(404).json({message:"Product Not Found"})
        }
        res.json({message:"Product Deleted Successfully"})
    }).catch((error)=>{
        console.log(error)
        res.status(500).json({message:"Product Deletion Failed"})
    })
 }
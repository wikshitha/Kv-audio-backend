import Product from "../models/product.js";
import { isItAdmin } from "./userControl.js";

export function addProduct(req, res) {
    console.log(req.user)

    if (req.user == null) {
        res.status(401).json({ message: "Please login and try again" })
        return
    }
    if (req.user.role != "Admin") {
        res.status(403).json({ message: "Only Admins can add products" })
        return
    }
    const data = req.body;

    const newProduct = new Product(data);

    newProduct.save().then(() => {
        res.json({ message: "Product Added Successfully" })
    }).catch((error) => {
        res.status(500).json({ message: "Product Addition Failed" })
    })
}

export async function getProduct(req, res) {
    if (req.user == null) {
        res.status(401).json({ message: "Please login and try again" })
        return
    }
    try {
        if (isItAdmin(req)) {
            const products = await Product.find();
            res.json(products)
            return;
        } else {
            const products = await Product.find
                ({ availability: true });
            res.json(products)
            return
        }
    } catch (error) {
        res.status(500).json({ message: "Product Get Failed" })
    }

}
export async function updateProduct(req, res) {
    try {
        if (req.user == null) {
            res.status(401).json({ message: "Please login and try again" })
            return
        }
        if (isItAdmin(req)) {
            const key = req.params.key;

            const data = req.body;

            await Product.updateOne({ key: key }, data)

            res.json({ message: "Product Updated Successfully" })
        } else {
            res.status(403).json({ message: "Only Admins can update products" })
            return
        }
    } catch (error) {
        res.status(500).json({ message: "Product Update Failed" })
    }
}

export async function deleteProduct(req, res) {

    if (req.user == null) {
        res.status(401).json({ message: "Please login and try again" })
        return
    }
    try {
        if (isItAdmin(req)) {
            const key = req.params.key;

            await Product.deleteOne({ key: key })

            res.json({ message: "Product Deleted Successfully" })
            return
        } else {
            res.status(403).json({ message: "Only Admins can delete products" })
            return
        }
    } catch (error) {
        res.status(500).json({ message: "Product Delete Failed" })
    }
}


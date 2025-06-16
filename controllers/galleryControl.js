import Gallery from "../models/gallery.js";
import { isItAdmin } from "./userControl.js";

export function addGallery(req, res) {
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

    const newGallery = new Gallery(data);

    newGallery.save().then(() => {
        res.json({ message: "Gallery Added Successfully" })
    }).catch((error) => {
        res.status(500).json({ message:error })
    })
}

export async function getGallery(req, res) {
   
    try {
            const galleries = await Gallery.find();
            res.json(galleries)
            return;
        
    } catch (error) {
        res.status(500).json({ message: "Gallery Get Failed" })
    }

}
export async function deleteGallery(req, res) {
    try {
        if (isItAdmin(req)) {
            const key = req.params.key;

            await Gallery.deleteOne({ key: key })

            res.json({ message: "Gallery Deleted Successfully" })
            return
        } else {
            res.status(403).json({ message: "Only Admins can delete Galleries" })
            return
        }
    } catch (error) {
        res.status(500).json({ message: "Gallery Delete Failed" })
    }
}

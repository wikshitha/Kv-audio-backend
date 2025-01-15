import { isItCustomer } from "./userControl.js";
import Inquiry from "../models/inquiry.js";
import { isItAdmin } from "./userControl.js";

export async function addInquiry(req,res) {
    try {
        if(isItCustomer(req)) {
            const data = req.body;
            data.email = req.user.email
            data.phone = req.user.phone

            let id = 0;

            const inquiries = await Inquiry.find().sort({id:-1}).limit(1);

            if(inquiries.length == 0) {
                id = 1;
            } else {
                id = inquiries[0].id + 1;
            }

            data.id = id;

            const newInquiry = new Inquiry(data);
            const response = await newInquiry.save();

            res.json({ message: "Inquiry Added Successfully" ,id: response.id})

        }
    }catch (error) {
        res.status(500).json({ message: "Inquiry Addition Failed" })
    }
}

export async function getInquiries(req,res) {
    try {
        if(isItCustomer(req)) {
            const inquiries = await Inquiry.find({email: req.user.email});
            res.json(inquiries)
        }else if(isItAdmin(req)) {
            const inquiries = await Inquiry.find();
            res.json(inquiries)
        }

    }catch (error) {
        res.status(500).json({ message: "You are not authorized" })
    }
}

export async function deleteInquiry(req,res) {
    try {
        if(isItAdmin(req)) {
            const id = req.params.id;
            await Inquiry.deleteOne({id:id});
            res.json({ message: "Inquiry Deleted Successfully" })
            return   
        }else if(isItCustomer(req)) {
            const id = req.params.id;

            const inquiries = await Inquiry.findOne({id:id});
            if(inquiries == null) {
                res.status(404).json({ message: "Inquiry not found" })
                return
            }else {
                if(inquiries.email == req.user.email) {
                    await Inquiry.deleteOne({id:id});
                    res.json({ message: "Inquiry Deleted Successfully" })
                    return
                }else {
                    res.status(403).json({ message: "You are not authorized" })
                }
            }
        }else {
            res.status(403).json({ message: "You are not authorized" })
        }
    }catch(error) {
        res.status(500).json({ message: "Inquiry Deletion Failed" })
    }
}

export async function updateInquiry(req,res) {
    try {

        if(isItAdmin(req)) {
            const id = req.params.id;
            const data = req.body;

            await Inquiry.updateOne({id:id},data);

            res.json({ message: "Inquiry Updated Successfully" })
        }else if(isItCustomer(req)) {
            const id = req.params.id;
            const data = req.body;

            const inquiries = await Inquiry.findOne({id:id});
            if(inquiries == null) {
                res.status(404).json({ message: "Inquiry not found" })
                return
            }else {
                if(inquiries.email == req.user.email) {



                    await Inquiry.updateOne({id:id},{message : data.message});
                    res.json({ message: "Inquiry Updated Successfully" })
                    return
                }else {
                    res.status(403).json({ message: "You are not authorized" })
                    return
                }
            }
        }else {
            res.status(403).json({ message: "You are not authorized" })
        }
        
    }catch(error) {
        res.status(500).json({ message: "Inquiry Update Failed" })
    }
}
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


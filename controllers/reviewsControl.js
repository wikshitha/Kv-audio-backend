
import Review from "../models/reviews.js";

export function addReview(req, res) {
    console.log(req.user)
    if (req.user == null) {
        res.status(401).json({ message: "Please login and try again" })
        return
    }
    const data = req.body;

    data.name = req.user.firstname + " " + req.user.lastname
    data.profilePic = req.user.profilePic
    data.email = req.user.email

    const newReview = new Review(data);

    newReview.save().then(() => {
        res.json({ message: "Review Added Successfully" })
    }).catch((erorr) => {
        res.status(500).json({ message: "Review Addition Failed" })
    })
}

export function getReviws(req, res) {

    const User = req.user

    if (User == null || User.role != "Admin") {
        Review.find({ isApproved: true }).then((reviews) => {
            res.json(reviews)
        })
        return
    }
    if (User.role == "Admin") {
        Review.find().then((reviews) => {
            res.json(reviews)
        })
    }
}

export function deleteReview(req, res) {
    const email = req.params.email

    if (req.user == null) {
        res.status(401).json({ message: "Please login and try again" })
        return
    }

    if (req.user.role == "Admin") {
        Review.deleteOne({ email: email }).then(() => {
            res.json({ message: "Review deleted susses" })
        }).catch(() => {
            ({ error: "Review deletion faild" })
        })
        return
    }

    if(req.user.role == "Customer") {
        if(req.user.email == email) {
            Review.deleteOne({ email: email }).then(() => {
                res.json({ message: "Review deleted susses" })
            }).catch(() => {
                ({ error: "Review deletion faild" })
            })
        } else{
            res.status(403).json({message:"You are not authorized"})

        }
    }
}
export function approveReview(req, res) {
    const email = req.params.email

    if (req.user == null) {
        res.status(401).json({ message: "Please login and try again" })
        return
    }

    if (req.user.role == "Admin") {
        Review. updateOne({email:email},{isApproved:true}).then(()=>{
            res.json({message:"Review approved susses"})
        }).catch(()=>{
            res.status(500).json({message:"Review approval failed"})
        })
    }
    else {
        res.status(403).json({message:"You are not an Admin,Only the Admin can approve a review"})
    }
}
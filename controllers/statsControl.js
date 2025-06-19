import Gallery from "../models/gallery.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import User from "../models/user.js";
import { isItAdmin } from "./userControl.js";

export async function statsCount(req,res) {
   if (isItAdmin(req)) {
    try {
        const [totalOrders, totalUsers, totalItems, totalGalleries] = await Promise.all([
            Order.countDocuments(), // Count all orders
            User.countDocuments(),  // Count all users
            Product.countDocuments(),  // Count all items
            Gallery.countDocuments() // Count all gallery items

          ]);

        //   console.log(totalItems,totalOrders,totalUsers);

        res.json({
            totalOrders,
            totalUsers,
            totalItems,
            totalGalleries
        })
         
    } catch (error) {
        console.log("Error in statsCount:", error);
        throw error;
    }
   }else {
        res.status(403).json({message:"You are not an Admin,Only the Admin can get stats"});
   }
}

export async function recentActivities(req,res) {
    if(isItAdmin(req)) {
        try {
            // Fetch recent orders, users, and items
            const recentOrders = await Order.find()
              .sort({ createdAt: -1 })
              .limit(2)
              .select("email createdAt");
            const recentUsers = await User.find()
              .sort({ createdAt: -1 })
              .limit(2)
              .select("firstName createdAt");
            const recentItems = await Product.find()
              .sort({ updatedAt: -1 })
              .limit(2)
              .select("name updatedAt");
        
            // Combine into a unified activity feed
            const activities = [];
        
            recentOrders.forEach((order) =>
              activities.push({
                message: `New order placed by ${order.email}`,
                timestamp: order.createdAt,
              })
            );
        
            recentUsers.forEach((user) =>
              activities.push({
                message: `User ${user.firstName || "Unknown"} registered`,
                timestamp: user.createdAt,
              })
            );
        
            recentItems.forEach((product) =>
              activities.push({
                message: `Item ${product.name} stock updated`,
                timestamp: product.updatedAt,
              })
            );
        
            // Sort by timestamp (descending)
            activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
            res.json(activities);
          } catch (error) {
            console.error("Error fetching recent activities:", error);
            res.status(500).json({ message: "Error fetching recent activities." });
          }
    }else {
        res.status(403).json({message:"You are not an Admin,Only the Admin can get recent activities"});
    }
}
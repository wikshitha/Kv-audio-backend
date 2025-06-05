import Order from "../models/order.js";
import Product from "../models/product.js";
import User from "../models/user.js";
import { isItAdmin } from "./userControl.js";

export async function statsCount(req,res) {
   if (isItAdmin(req)) {
    try {
        const [totalOrders, totalUsers, totalItems] = await Promise.all([
            Order.countDocuments(), // Count all orders
            User.countDocuments(),  // Count all users
            Product.countDocuments(),  // Count all items
          ]);

        //   console.log(totalItems,totalOrders,totalUsers);

        res.json({
            totalOrders,
            totalUsers,
            totalItems
        })
         
    } catch (error) {
        console.log("Error in statsCount:", error);
        throw error;
    }
   }
}
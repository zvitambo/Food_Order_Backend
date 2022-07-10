import { MONGO_URI } from "../config";
import mongoose from "mongoose";



export default async() => {
    try {
       await mongoose
        .connect(MONGO_URI)
          
        console.log("Connected to Mongo DB")
    } catch (ex) {
        console.log(ex)
    }
} 





import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

export function dbConnection(){
    const params = {
        useNewUrlParser : true,
        useUnifiedTopology : true,
    }
     
    try {
         mongoose.connect(process.env.MONGODB_URI,params);
       // mongoose.connect("mongodb+srv://thrust-hopevet_29:sUndar14@cluster.xb77okh.mongodb.net/",params);
    } catch (error) {
        console.log("Error connecting DB----", error)
    }
}